"use client";

import { FileInput } from "@/components/ui/file-input";
import { ImageDisplay } from "@/components/ui/image-display";
import { useState } from "react";

export default function Home() {
  const [images, setImages] = useState<string[]>([]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAction = async () => {
    if (images.length === 0) return;

    try {
      // Get the first image
      const imageUrl = images[0];

      // Convert base64 to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create FormData
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");

      // Call the API
      const result = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // Handle the cartoon variations
      console.log("Cartoon variations:", data.variations);
      // TODO: Update UI with the cartoon images
      
    } catch (error) {
      console.error("Error processing image:", error);
      // TODO: Show error message to user
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-170px)] flex-col items-center justify-center ">
      <div className=" max-w-2xl w-full">
        {/* Main Content */}
        <div className="py-8 w-full">
          <div className="w-full gap-2">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-pink-500 text-transparent bg-clip-text">
                Generate AI Avatar ✨
              </h1>
              <p className="text-lg bg-gradient-to-r from-white to-pink-500 text-transparent bg-clip-text">
                Turn you and your special someone into adorable anime
                characters! Upload your photos and watch your love story
                transform into art 💕
              </p>
            </div>
            <FileInput
              onFileSelect={handleFileSelect}
              isExpanded={images.length > 0}
              onAction={handleAction}
            />

            <ImageDisplay images={images} onRemoveImage={removeImage} />

            {images.length > 0 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {images.length} image{images.length !== 1 ? "s" : ""} selected
                </span>
                <button
                  onClick={() => setImages([])}
                  className="text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
