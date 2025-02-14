"use client";

import { FileInput } from "@/components/ui/file-input";
import { ImageDisplay } from "@/components/ui/image-display";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getRandomQuote } from "@/constants/quotes";
import { toast } from "sonner";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB in bytes

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuote, setLoadingQuote] = useState("");
  const router = useRouter();

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

  const updateLoadingQuote = () => {
    setLoadingQuote(getRandomQuote());
  };

  const compressImage = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > 1024) {
            height = Math.round((height * 1024) / width);
            width = 1024;
          }
        } else {
          if (height > 1024) {
            width = Math.round((width * 1024) / height);
            height = 1024;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          0.8 // compression quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Failed to load image"));
      };
    });
  };

  const handleAction = async () => {
    if (images.length === 0) return;

    setIsLoading(true);
    updateLoadingQuote();
    const quoteInterval = setInterval(updateLoadingQuote, 3000);

    try {
      // Get the first image
      const imageUrl = images[0];

      // Convert base64 to blob
      const response = await fetch(imageUrl);
      let blob = await response.blob();

      // Check original file size
      if (blob.size > MAX_FILE_SIZE) {
        console.log(`Original size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`);
        // Compress the image
        blob = await compressImage(blob);
        console.log(
          `Compressed size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`
        );

        // Check if still too large after compression
        if (blob.size > MAX_FILE_SIZE) {
          throw new Error(
            "Image is too large. Please use a smaller image (max 4MB)."
          );
        }
      }

      // Create FormData
      const formData = new FormData();
      formData.append("image", blob, "image.jpg");

      // Call the API
      const result = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();

      if (!data.success || !data.variations) {
        throw new Error(data.error);
      }

      const supabase = createClient();
      const u_id = uuidv4();

      // Store the reference in the database
      const { data: imageData, error: insertError } = await supabase
        .from("generated_images")
        .insert([
          {
            image_url: data.variations[0],
            created_at: new Date().toISOString(),
            u_id: u_id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Redirect to the image page
      router.push(`/image/${u_id}`);
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process image"
      );
    } finally {
      clearInterval(quoteInterval);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-170px)] flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        {isLoading ? (
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-lg animate-pulse bg-gradient-to-r from-white to-pink-500 text-transparent bg-clip-text">
              {loadingQuote}
            </p>
          </div>
        ) : (
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
                    {images.length} image{images.length !== 1 ? "s" : ""}{" "}
                    selected
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
        )}
      </div>
    </main>
  );
}
