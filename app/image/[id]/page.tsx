"use client";

import { createClient } from "@/utils/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface GeneratedImage {
  u_id: string;
  image_url: string;
  created_at: string;
}

export default function ImagePage() {
  const params = useParams();
  const router = useRouter();
  const [image, setImage] = useState<GeneratedImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("generated_images")
          .select("*")
          .eq("u_id", params.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Image not found");

        setImage(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load image 😭😭"
        );
        console.error("Error fetching image:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchImage();
  }, [params.id]);

  const handleDownload = async () => {
    if (!image?.image_url) return;

    try {
      const response = await fetch(image.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `val-ai-avatar-${image.u_id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-170px)] items-center justify-center">
        <div className="animate-pulse text-lg text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-170px)] items-center justify-center">
        <div className="text-lg text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-170px)] flex-col items-center justify-start py-8">
      <div className="max-w-4xl w-full px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-pink-500 text-transparent bg-clip-text">
            Your AI Avatar ✨
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's your magical transformation! Download and share your avatar
            with the world 💕
          </p>
        </div>

        <div className="relative group">
          <div className="overflow-hidden rounded-2xl border-2 border-primary/20 backdrop-blur-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image?.image_url}
              alt="Generated AI Avatar"
              className="w-full h-auto"
            />
          </div>

          <Button
            onClick={handleDownload}
            className="absolute bottom-4 right-4 shadow-lg opacity-90 hover:opacity-100"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </main>
  );
}
