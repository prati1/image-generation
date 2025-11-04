import { NextResponse } from "next/server";
import { memory } from "../../storage/data";

export async function GET(req: Request) {
    return NextResponse.json({memory});
}