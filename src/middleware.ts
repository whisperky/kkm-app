import { NextResponse, userAgent, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const ua = userAgent(request);
  console.log(ua);
  // const device = (ua.device.type ?? "desktop").toLowerCase()
  // if (!device.includes("mobile")) {
  //   return NextResponse.redirect(new URL("/not-mobile", request.url));
  // }
  return NextResponse.next();

  // return NextResponse.redirect(new URL("/updating", request.url));
}

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico|not-mobile|updating))"],
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|not-mobile|updating).*)",
  ],
};
