import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { LoginTokenPayloadType } from "./lib/server-utils";
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
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
    }
}

