import { deleteCategory, deleteComplaints, deleteLocations, deleteUsers, feedCategory, feedComplaints, feedLocations, feedUsers } from "@/data/seed";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // locations
        await deleteLocations()
        await feedLocations()
        // category
        await deleteCategory()
        await feedCategory()
        // users
        await deleteUsers()
        await feedUsers()

        // complaints
        await deleteComplaints();
        await feedComplaints()
        return NextResponse.json({
            success: true
        })
    } catch (err: any) {
        console.log('❌Error: ', err);
        return NextResponse.json({
            success: false
        })
    }

}