import { ImapFlow } from 'imapflow';

export const emailClient = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
    },
});