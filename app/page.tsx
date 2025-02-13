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

  const handleAction = () => {
    // TODO: Implement future action
    console.log("Action button clicked");
  };

  return (
    <main className="flex min-h-[calc(100vh-170px)] flex-col items-center justify-center ">
      <div className=" max-w-2xl w-full">
        {/* Main Content */}
        <div className="py-8 w-full">
          <div className="w-full gap-2">
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
