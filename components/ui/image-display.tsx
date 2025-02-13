"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";

interface ImageDisplayProps {
  images: string[];
  onRemoveImage: (index: number) => void;
}

export function ImageDisplay({ images, onRemoveImage }: ImageDisplayProps) {
  if (images.length === 0) return null;

  return (
    <div className="animate-in fade-in slide-in-from-top-4">
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group rounded-xl border border-primary/20 flex-shrink-0 backdrop-blur-sm bg-foreground/5"
          >
            <div className="w-20 h-20 relative">
              <Image
                src={image}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity scale-75 hover:bg-primary/10 text-primary h-6 w-6"
              onClick={() => onRemoveImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
