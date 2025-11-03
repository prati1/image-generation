import { GeneratedImages } from "../types/images";

const ImageGallery = ({generatedImageSet} : {generatedImageSet: GeneratedImages[]}) => {
    return (
    <div className="flex-col flex-wrap">
        {generatedImageSet && generatedImageSet.map((imageDet, i) => (
        <div className="pb-10" key={i}>
            <h3 className="font-medium mb-2 text-black">Prompt {i + 1}: {imageDet.prompt}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imageDet.images.map((image, j) => {
                    return (
                        <div key={j} className="relative">
                        <img 
                            src={`data:image/png;base64,${image}`}
                            alt={`generated-${i}-${j}`}
                            className="object-cover shrink-0 max-h-[200px]"
                        />
                        </div>
                    );
                    })}
            </div>
        </div>
        ))}
    </div>
    )

}

export default ImageGallery;
