"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Avatar = {
  id: string;
  imageUrl: string;
  title?: string;
};

export default function AllAvatars() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 9;

  const fetchAvatars = async () => {
    setLoading(true);

    // const { data, error } = await supabase
    //   .from("avatars") // Change to your table name
    //   .select("*")

    // if (error) {
    //   console.error("Error fetching avatars:", error );
    //   setLoading(false);
    //   return;
    // }

    // if (data.length < pageSize) setHasMore(false);
    // setAvatars((prev) => [...prev, ...data]);
    // setPage((prev) => prev + 1);
    // setLoading(false);
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <main className="flex min-h-[calc(100vh-170px)] flex-col items-center justify-start">
      <div className="w-full">
        <div className="py-8 w-full">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-pink-500 text-transparent bg-clip-text">
              All AI Avatars ✨
            </h1>
            <p className="text-lg bg-gradient-to-r from-white to-pink-500 text-transparent bg-clip-text">
              Browse through all the magical transformations! See how love
              stories have been turned into art 💕
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {avatars.length > 0 ? (
              avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className="aspect-square relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <img
                    src={avatar.imageUrl}
                    alt={avatar.title || "AI Generated Avatar"}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))
            ) : (
              !loading && (
                <p className="text-muted-foreground text-center col-span-full">
                  No avatars generated yet.
                </p>
              )
            )}

            {loading &&
              [...Array(3)].map((_, i) => (
                <div></div>
                // <Skeleton
                //   key={`skeleton-${i}`}
                //   className="aspect-square rounded-lg"
                // />
              ))}
          </div>

          {hasMore && avatars.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={fetchAvatars}
                disabled={loading}
                className="w-max px-24 py-6 font-bold text-base bg-gradient-to-r from-rose-900 to-pink-500 text-white hover:opacity-90"
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
