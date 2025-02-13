"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface ImageUploadDisplayProps {
  onImagesChange: (images: string[]) => void;
}

export function ImageUploadDisplay({
  onImagesChange,
}: ImageUploadDisplayProps) {
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => {
            const newImages = [...prev, e.target!.result as string];
            onImagesChange(newImages);
            return newImages;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      onImagesChange(newImages);
      return newImages;
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
        />
      </div>

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <Image
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
