export interface Image {
    output: [{
        id: string,
        type: 'reasoning'
    },
    {
        id: string,
        quality: string,
        output_format: string,
        result: string,
        type: "image_generation_call"
    }, {
        id: string,
        type: "message"

    }]
}

export type GeneratedImages = {
    prompt: string;
    images: string[];
}