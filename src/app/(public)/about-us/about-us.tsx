'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBarLink } from '@/contexts/progress-bar-provider';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2 },
    }),
};

export default function AboutUs() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-16">
            <motion.h1
                className="text-4xl font-bold text-center mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                About Complaint Kendra
            </motion.h1>

            <motion.p
                className="text-lg text-muted-foreground text-center mb-16 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                Complaint Kendra is a unified platform designed to empower citizens by simplifying the complaint registration process, enabling swift redressal, and bridging the gap between the public and government departments.
            </motion.p>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Our Mission',
                        desc: 'To provide a transparent and efficient grievance redressal system accessible to all.',
                    },
                    {
                        title: 'Our Vision',
                        desc: 'A future where every citizen’s voice is heard and acted upon in a timely manner.',
                    },
                    {
                        title: 'Our Impact',
                        desc: 'Over 10,000+ complaints resolved across multiple districts, improving lives daily.',
                    },
                ].map((item, i) => (
                    <motion.div
                        key={item.title}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        <Card className="rounded-2xl shadow-md">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="mt-20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <h2 className="text-2xl font-semibold mb-4">Built with Citizens in Mind</h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                    Complaint Kendra is developed by passionate individuals and supported by administrative bodies who believe in good governance and civic engagement.
                </p>

                <ProgressBarLink href={'/contact-us'}>
                    <Button>Contact Our Team</Button>
                </ProgressBarLink>
            </motion.div>
        </div>
    );
}
