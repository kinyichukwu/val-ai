"use client";

import { FileInput } from "@/components/ui/file-input";
import { ImageDisplay } from "@/components/ui/image-display";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { getRandomQuote } from "@/constants/quotes";

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

      if (!data.success || !data.variations) {
        throw new Error(data.error);
      }

      // // Download the generated image and upload to Supabase Storage
      // const imageResponse = await fetch(data.variations[0]);
      // const imageBlob = await imageResponse.blob();

      const supabase = createClient();
      const u_id = uuidv4();

      // // Upload to Supabase Storage
      // const { data: uploadData, error: uploadError } = await supabase.storage
      //   .from("avatars")
      //   .upload(`${u_id}.png`, imageBlob, {
      //     contentType: "image/png",
      //     cacheControl: "3600",
      //     upsert: false,
      //   });

      // if (uploadError) throw uploadError;

      // // Get the public URL
      // const { data: publicUrlData } = supabase.storage
      //   .from("avatars")
      //   .getPublicUrl(`${u_id}.png`);

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
      // TODO: Show error message to user
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
