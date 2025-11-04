import { NextResponse } from "next/server";
import OpenAI from "openai";
import { memory } from "../storage/data";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const {prompt, n = 1 } = await req.json();
    
        // changing to Images API as it allows multiple image generation
        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: prompt,
            response_format: "b64_json",
            n: n
        });
    
        if (response.data) {
            const imageData = response.data.map(img => img.b64_json!);
            memory.generated.unshift({prompt, images: imageData});
            return NextResponse.json({images: imageData});
        }
    
        return NextResponse.json({error: "No images generated!"});
    } catch (err) {
        console.log("Error: ", err);
        return NextResponse.json({error: "Error generating images"}, {status: 500});
    }

}