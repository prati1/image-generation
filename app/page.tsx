"use client"
import { useEffect, useState } from "react";
import { GeneratedImages } from "./types/images";
import ImageGallery from "./components/ImageGallery";

export default function Home() {

  const [input, setInput] = useState<string>("");
  const [noOfImages, setNoOfImages ] = useState(1);
  // const [images, setImages] = useState<GeneratedImages[]>([]);
  const [images, setImages] = useState<GeneratedImages>();

  const [allImages, setAllImages] = useState<GeneratedImages[]>([]);

  const getImages = async () => {
    try {
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

    } catch (e) {
      console.log("error: ", e);

    }
  }

  useEffect(() => {
    const getAllGeneratedImages = async () => {
      try {
        const allImages = await fetch("/api/images/memory");
        const data = await allImages.json();

        console.log(data.memory.generated);
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
            <button className="border-2 bg-blue-600 hover:bg-blue-700 rounded-2xl p-2 font-bold shadow-xl" onClick={getImages}>Submit</button>
          </div>

          <span className="text-black font-bold">Image generated with description</span>
          <div>
            <span className="text-black">
              {images && images.prompt}
            </span>
          </div>

        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images && images.images.map((image, j) => {
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
      </main>
      {allImages && allImages.length > 0 && 
      <div className="flex flex-col gap-2 flex-wrap shadow-2xl bg-zinc-50 mt-10 p-10">
        <ImageGallery generatedImageSet={allImages} />
      </div>}
      
    </div>
  );
}
