'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Reply } from "lucide-react";

interface EmailViewerProps {
    email: {
        from: string;
        subject: string;
        date: string | Date;
        text?: string;
        html?: string;
    } | null;
}

export default function EmailViewer({ email }: EmailViewerProps) {
    if (!email) {
        return (
            <Card className="w-full p-4 text-center">
                <p className="text-muted-foreground">Select an email to view its content.</p>
            </Card>
        );
    }

    const formattedDate = new Date(email.date).toLocaleString();

    return (
        <Card className="w-full h-full grow flex rounded-none border-0 flex-col">
            <CardHeader>
                <CardTitle className="text-xl">{email.subject || "No Subject"}</CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1">
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-2 flex-wrap gap-2">
                    <span>From:
                        <Badge variant="outline">{email.from}</Badge>
                        <Badge variant="outline" className="ml-2 p-1 cursor-pointer" title="Reply"><Reply /></Badge>
                    </span>
                    <span>Date: {formattedDate}</span>
                </div>
                <ScrollArea className="h-full pr-2">
                    {email.html ? (
                        <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: email.html }}
                        />
                    ) : (
                        <pre className="whitespace-pre-wrap text-sm">{email.text || "No content available."}</pre>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
