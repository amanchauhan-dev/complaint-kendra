'use client';

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.15 },
    }),
};

const faqs = [
    {
        question: "How can I file a complaint?",
        answer: "Go to the 'Register Complaint' section, fill in the required details, and submit your complaint. Make sure to include any relevant attachments or documents.",
    },
    {
        question: "How do I track my complaint?",
        answer: "After logging in, go to 'My Complaints'. You’ll see the list of complaints you've registered along with their current status.",
    },
    {
        question: "Can I edit my complaint after submitting?",
        answer: "Currently, editing is not allowed once a complaint is submitted. However, you can add comments or additional attachments if required.",
    },
    {
        question: "What documents can I upload?",
        answer: "You can upload images, PDFs, and relevant supporting documents like IDs or photographs of the issue.",
    },
    {
        question: "How long does it take for a complaint to be addressed?",
        answer: "Resolution times vary based on the department. Most complaints are addressed within 7–14 working days.",
    },
];

export function Help() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <motion.h1
                className="text-4xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Help & Support
            </motion.h1>

            <motion.p
                className="text-muted-foreground text-center mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Need help? Find answers to your most common questions or reach out to our support team.
            </motion.p>

            <motion.div
                className="space-y-12"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.15 } },
                }}
            >
                <motion.section variants={fadeInUp} custom={1}>
                    <h2 className="text-2xl font-semibold mb-2">📌 Getting Started</h2>
                    <p className="text-muted-foreground">
                        To start using Complaint Kendra, create an account using your Aadhaar and email. Once registered, you can begin filing complaints directly.
                    </p>
                </motion.section>

                <motion.section variants={fadeInUp} custom={2}>
                    <h2 className="text-2xl font-semibold mb-2">📝 How to File a Complaint</h2>
                    <p className="text-muted-foreground">
                        Navigate to the {'"'}Register Complaint{'"'} section, enter the issue details, select the category, upload evidence, and submit.
                    </p>
                </motion.section>

                <motion.section variants={fadeInUp} custom={3}>
                    <h2 className="text-2xl font-semibold mb-2">📊 Tracking Complaint Status</h2>
                    <p className="text-muted-foreground">
                        Go to the dashboard and check the current status of your complaint. You will receive notifications for any updates or responses.
                    </p>
                </motion.section>

                <motion.section variants={fadeInUp} custom={4}>
                    <h2 className="text-2xl font-semibold mb-2">📞 Contact & Support</h2>
                    <p className="text-muted-foreground">
                        Need direct assistance? Email us at <a href="mailto:support@complaintkendra.gov.in" className="underline">support@complaintkendra.gov.in</a> or call <span className="font-medium">1800-123-4567</span> (Mon–Fri, 10AM–6PM).
                    </p>
                </motion.section>

                <motion.section variants={fadeInUp} custom={5}>
                    <h2 className="text-2xl font-semibold mb-4">❓ Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full border rounded-xl p-2 bg-muted/50">
                        {faqs.map((faq, i) => (
                            <AccordionItem value={`faq-${i}`} key={i}>
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.section>
            </motion.div>
        </div>
    );
}
