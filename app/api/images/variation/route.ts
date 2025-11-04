import { NextResponse } from "next/server";
import OpenAI from "openai";
import { memory } from "../../storage/data";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const n = Number(formData.get("n") || 1);

        if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    
        // changing to Images API as it allows multiple image generation
        const response = await openai.images.createVariation({
            model: "dall-e-2",
            response_format: "b64_json",
            n: n,
            image: file
        });

        console.log(response.data);
    
        if (response.data) {
            const imageData = response.data.map(img => img.b64_json!);
            memory.generated.unshift({prompt: "Variation Created", images: imageData});
            return NextResponse.json({images: imageData});
        }
    
        return NextResponse.json({error: "No images generated!"});
    } catch (err) {
        console.log("Error: ", err);
        return NextResponse.json({error: "Error generating images"}, {status: 500});
    }

}