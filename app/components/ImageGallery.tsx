import { GeneratedImages } from "../types/images";

const ImageGallery = ({generatedImageSet, favourites, handleAddFavorite} : {
    generatedImageSet: GeneratedImages[], 
    favourites: string[], 
    handleAddFavorite: (img: string, isFav: boolean) => void;
}) => {
    return (
    <div className="flex-col flex-wrap">
        {generatedImageSet && generatedImageSet.map((imageDet, i) => (
        <div className="pb-10" key={i}>
            <h3 className="font-medium mb-2 text-black">Prompt {i + 1}: {imageDet.prompt}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {imageDet && imageDet.images && imageDet.images.map((image, j) => {
                    const isFavourite = favourites.includes(image);
                    return (
                        <div key={j} className="relative">
                            <img 
                                src={`data:image/png;base64,${image}`}
                                className="object-cover shrink-0 max-h-[200px]"
                            />
                            <button
                                onClick={() => handleAddFavorite(image, isFavourite)}
                                className="absolute top-2 right-2 text-lg"
                            >
                                {/* @ToDo: Replace with lucide icon */}
                                {isFavourite ? "❤️" : "🤍"}
                            </button>
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
