import { NextRequest, NextResponse } from "next/server";
import { UploadProfile } from "@/lib/cloudinary";


export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const newFile = formData.get("newFile") as File;
    const oldUrl = formData.get("oldFile") as string;

    if (!newFile) { return NextResponse.json({ error: "No file uploaded" }, { status: 400 }); }

    try {
        const { newUrl, error } = await UploadProfile(newFile, oldUrl);
        if (error && !newUrl) {
            throw new Error(error.message)
        }

        return NextResponse.json({ url: newUrl });
    } catch (error) {
        return NextResponse.json({ error: "Upload failed", details: error }, { status: 500 });
    }
}