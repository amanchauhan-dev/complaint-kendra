import { Button } from "@/components/ui/button";
import { ProgressBarLink } from "@/contexts/progress-bar-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: '404 - Not Found'
}

export default function page() {
    return (
        <div className="text-center p-10">
            <h1 className="text-4xl font-bold">Page Not Found</h1>
            <p className="text-gray-600 mt-2">This page doesn&apos;t exist.</p>
            <ProgressBarLink href={'/'}>
                <Button variant={'link'}>
                    Home
                </Button>
            </ProgressBarLink>
        </div>
    );
}
