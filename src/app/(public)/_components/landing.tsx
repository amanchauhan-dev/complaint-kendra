'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { ProgressBarLink } from "@/contexts/progress-bar-provider";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
    const { user_id } = useAuth()

    return (
        <main className="min-h-screen w-full  flex flex-col items-center px-4 py-8 md:py-16">
            <section className="max-w-5xl w-full text-center space-y-6">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-6xl font-bold leading-tight"
                >
                    Complaint Kendra
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground"
                >
                    An initiative by the <strong>Government of Gujarat</strong> to empower citizens by simplifying the grievance redressal process.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    {user_id ? <ProgressBarLink href={'/file-complaint'}><Button size="lg">File a Complaint</Button></ProgressBarLink> :
                        <ProgressBarLink href={'/login'}><Button size="lg">File a Complaint</Button></ProgressBarLink>}
                </motion.div>
            </section>

            <section className="mt-16 flex flex-wrap gap-6 max-w-5xl w-full justify-center">
                <Card className="rounded-2xl shadow-md max-w-78">
                    <CardContent className="p-6 space-y-4">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                        <h3 className="text-xl font-semibold">Secure & Transparent</h3>
                        <p className="text-muted-foreground">
                            Every complaint is securely stored and tracked through an accountable system.
                        </p>
                        <Badge variant="outline">Verified by Govt. of Gujarat</Badge>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-md max-w-78">
                    <CardContent className="p-6 space-y-4">
                        <MapPin className="w-10 h-10 text-primary" />
                        <h3 className="text-xl font-semibold">District-level Access</h3>
                        <p className="text-muted-foreground">
                            Get your issues directly seen by relevant authorities based on your location.
                        </p>
                        <Badge variant="outline">Location Intelligent</Badge>
                    </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-md max-w-78">
                    <CardContent className="p-6 space-y-4">
                        <Mail className="w-10 h-10 text-primary" />
                        <h3 className="text-xl font-semibold">Email Notifications</h3>
                        <p className="text-muted-foreground">
                            Stay informed with timely email updates about your complaint status.
                        </p>
                        <Badge variant="outline">Auto Notifications</Badge>
                    </CardContent>
                </Card>
            </section>

            <section className="mt-24 max-w-4xl text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold"
                >
                    Empowering Citizens — One Complaint at a Time
                </motion.h2>
                <p className="mt-4 text-muted-foreground">
                    We believe in a transparent, responsive and inclusive administration. Complaint Kendra is your platform to make your voice heard.
                </p>
                <div className="mt-8">
                    {user_id ? <ProgressBarLink href={'/file-complaint'}>
                        <Button size="lg">Start Now</Button>
                    </ProgressBarLink> : <ProgressBarLink href={'/login'}>
                        <Button size="lg">Start Now</Button>
                    </ProgressBarLink>}
                </div>
            </section>
        </main>
    );
}