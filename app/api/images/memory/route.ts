import { NextResponse } from "next/server";
import { memory } from "../route";

export async function GET(req: Request) {
    return NextResponse.json({memory});
}