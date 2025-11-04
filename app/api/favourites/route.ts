import { NextResponse } from "next/server";
import { memory } from "../storage/data";

export async function GET() {
  return NextResponse.json({ favorites: memory.favourites });
}

export async function POST(req: Request) {
  const { image } = await req.json();
  if (!image) return NextResponse.json({ error: "Missing image" }, { status: 400 });

  if (!memory.favourites.includes(image)) {
    memory.favourites.push(image);
  }

  return NextResponse.json({ favorites: memory.favourites });
}

export async function DELETE(req: Request) {
  const { image } = await req.json();
  memory.favourites = memory.favourites.filter((f) => f !== image);
  return NextResponse.json({ favorites: memory.favourites });
}