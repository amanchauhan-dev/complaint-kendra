import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { LoginTokenPayloadType } from "./lib/server-utils";
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {   // dashboard: auth not citizen
        try {
            const token = request.cookies.get('auth_token')?.value || ''
            const payload = (await jwtVerify(token, secret)).payload as LoginTokenPayloadType;
            if (payload.role != "citizen") {
                return NextResponse.next()
            } else {
                return NextResponse.redirect(new URL('/404', request.url))
            }
        } catch (error: any) {
            return NextResponse.redirect(new URL('/?error=' + error.message, request.url))
        }
    } else if (request.nextUrl.pathname.startsWith('/api/seed')) {  // seed route:ony superadmin
        try {
            const token = request.cookies.get('auth_token')?.value || ''
            const payload = (await jwtVerify(token, secret)).payload as LoginTokenPayloadType;
            if (payload.role === "superadmin") {
                return NextResponse.next()
            } else {
                return NextResponse.redirect(new URL('/404', request.url))
            }
        } catch (error: any) {
            return NextResponse.json({ success: false, error })
        }
    }
    else if (request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/api/public') && !request.nextUrl.pathname.startsWith('/api/auth')) {  // api validation: auth
        try {
            const authHeader = request.headers.get('authorization') || ''
            const token = authHeader.replace(/^Bearer\s+/i, '')
            await jwtVerify(token, secret)
            return NextResponse.next()
        } catch (error) {
            return NextResponse.json({ succee: false, error: "Unauthorized", details: error }, { status: 401 })
        }
    }
}

