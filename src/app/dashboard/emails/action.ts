'use server'
import { FetchMultipleRespone } from '@/lib/server-types';
import { simpleParser } from 'mailparser';
import { emailClient } from './_components/config';
import { Email } from './types';

export const FetchAllEmails = async ({ page = 1, limit = 10 }: { page?: number; limit?: number }): Promise<FetchMultipleRespone<Email[]>> => {
    try {
        await emailClient.connect();
        const lock = await emailClient.getMailboxLock('INBOX');

        try {
            const totalMessages = typeof emailClient.mailbox === 'object' && emailClient.mailbox !== null && 'exists' in emailClient.mailbox
                ? emailClient.mailbox.exists
                : 0;
            const totalPages = Math.ceil(totalMessages / limit);
            const start = totalMessages - ((page - 1) * limit);
            const end = start - limit + 1;

            const messages = [];
            const range = `${Math.max(end, 1)}:${start}`;

            for await (const message of emailClient.fetch(range, {
                uid: true,
                envelope: true,
                source: true,
            })) {
                if (!message.source) {
                    continue; // skip messages without source
                }
                const parsed = await simpleParser(message.source);
                messages.push({
                    uid: message.uid,
                    from: parsed.from?.text,
                    subject: parsed.subject,
                    date: parsed.date,
                    text: parsed.text,
                    html: parsed.html,
                });
            }

            return {
                success: true,
                data: messages.reverse() as Email[],
                pagination: {
                    currentPage: page,
                    pageSize: limit,
                    total: totalMessages,
                    totalPages
                },
            }
        } finally {
            lock.release();
            await emailClient.logout();
        }
    } catch (error) {
        return { success: false, error: error };
    }
}
