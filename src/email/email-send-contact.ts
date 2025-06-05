'use client'
import emailjs from '@emailjs/browser'

export const emailSendContact = async ({ name, subject, message, email }: { subject: string, name: string, email: string, message: string }): Promise<{ success: boolean; message: string }> => {
    try {
        const res = await emailjs.send(
            process.env.NEXT_PUBLIC_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAIL_CONTACT_TEMPLATE_ID!,
            {
                subject: subject,
                name: name,
                email: email,
                message: message,
                to: process.env.NEXT_PUBLIC_EMAIL_USER,
                from: name,
                replyTo: process.env.NEXT_PUBLIC_EMAIL_USER,
            },
            process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY!
        )
        if (res.status === 200) {
            return { success: true, message: 'Email sent successfully' }
        } else {
            return { success: false, message: 'Failed to send email' }
        }
    } catch (error) {
        console.error('EmailJS error:', error)
        return { success: false, message: 'Something went wrong' }
    }
}
