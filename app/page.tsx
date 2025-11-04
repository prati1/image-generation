"use client"
import { useEffect, useState } from "react";
import { GeneratedImages } from "./types/images";
import ImageGallery from "./components/ImageGallery";

export default function Home() {

  const [input, setInput] = useState<string>("");
  const [noOfImages, setNoOfImages ] = useState(1);
  const [images, setImages] = useState<GeneratedImages>();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [allImages, setAllImages] = useState<GeneratedImages[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const getImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/images", {
        method: "POST",
        body: JSON.stringify({
          prompt: input,
          n: noOfImages
        })
      });

      const imageData = await response.json();
      if (imageData) {
        // setImages((prev) => [{ prompt: input, images: imageData.images }, ...prev]);
        setImages({ prompt: input, images: imageData.images });
        setAllImages((prev) => [{ prompt: input, images: imageData.images }, ...prev]);
      }
      setInput("");
      setIsLoading(false);

    } catch (e) {
      setIsLoading(false);
      console.log("error: ", e);

    }
  }

  const handleAddFavorite = async (img: string, isFav: boolean) => {
    await fetch("/api/favourites", {
      method: isFav ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: img }),
    });
    if (!isFav) {
      setFavorites((prev) => [...prev, img]);
    } else {
      setFavorites((prev) => prev.filter((curImg) => curImg !== img));
    }
  };

  const editImage = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prompt", input);
      formData.append("n", noOfImages.toString());
  
      const res = await fetch("/api/images/edit", {
        method: "POST",
        body: formData
      });
  
      const data = await res.json();
  
       if (data) {
          setImages({ prompt: input, images: data.images });
          setAllImages((prev) => [{ prompt: input, images: data.images }, ...prev]);
        }
        setInput("");
        setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log('error editing: ', e);
    }
  }

  const createVariation = async () => {
    if (!file) return;
    try {
      setIsLoading(true);
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("n", noOfImages.toString());
  
      const res = await fetch("/api/images/variation", {
        method: "POST",
        body: formData
      });
  
      const data = await res.json();
  
       if (data) {
          setImages({ prompt: input, images: data.images });
          setAllImages((prev) => [{ prompt: input, images: data.images }, ...prev]);
        }
        setInput("");
        setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch("/api/favourites");
      const data = await res.json();
      setFavorites(data.favorites);
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    const getAllGeneratedImages = async () => {
      try {
        const allImages = await fetch("/api/images/memory");
        const data = await allImages.json();

        console.log('memory', data.memory);
        setAllImages(data.memory.generated);
      } catch (e) {
        console.log("error", e);
      }
    }  
    
    getAllGeneratedImages();
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex flex-row gap-5 items-center justify-between py-10 px-10 bg-white sm:items-start shadow-2xl">
        <div className="flex flex-col gap-2 items-start w-[50%]">
          <div className="flex flex-row flex-wrap gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <div className="rounded-xl border-2 p-2">
                  <input className="text-black min-w-[250px]" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="What do you want to generate today..." type="text" />
                </div>
                <input className="text-black w-20 rounded-xl border px-3 py-2 border-gray-300" 
                  type="number"
                  min={1}
                  value={noOfImages}
                  onChange={(e) => setNoOfImages(Number(e.target.value))}
                  />
              </div>
              <input type="file" className="border-2 rounded-2xl text-black p-2" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <div>
                <button className="border-2 bg-blue-600 hover:bg-blue-700 rounded-2xl p-2 font-bold shadow-xl" onClick={getImages}>Generate Image</button>
                <button className="border-2 bg-yellow-600 hover:bg-yellow-700 rounded-2xl p-2 font-bold shadow-xl" onClick={editImage}>Edit Image</button>
                <button className="border-2 bg-green-600 hover:bg-green-700 rounded-2xl p-2 font-bold shadow-xl" onClick={createVariation}>Create Variation</button>
              </div>
            </div>

          </div>

          <span className="text-black font-bold">Image generated with description</span>
          <div>
            <span className="text-black">
              {images && images.prompt}
            </span>
          </div>

        </div>
        
        {isLoading ? <span className="text-black text-lg">Please wait while we finish generating images.</span>
        : <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images && images.images && images.images.map((image, i) => {
                    const isFavourite = favorites.includes(image);
                    return (
                        <div key={i} className="relative">
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
        }

      </main>
      {allImages && allImages.length > 0 && 
      <div className="flex flex-col gap-2 flex-wrap shadow-2xl bg-zinc-50 mt-10 p-10">
        <ImageGallery generatedImageSet={allImages} favourites={favorites} handleAddFavorite={handleAddFavorite} />
      </div>}
      
    </div>
  );
}
