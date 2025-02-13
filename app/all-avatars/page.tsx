"use client";

export default function AllAvatars() {
  return (
    <main className="flex min-h-[calc(100vh-170px)] flex-col items-center justify-start">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="py-8 w-full">
          <div className="w-full gap-2">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-pink-500 text-transparent bg-clip-text">
                All AI Avatars ✨
              </h1>
              <p className="text-lg bg-gradient-to-r from-white to-pink-500 text-transparent bg-clip-text">
                Browse through all the magical transformations! See how love
                stories have been turned into art 💕
              </p>
            </div>

            {/* TODO: Add avatar grid here */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <p className="text-muted-foreground text-center col-span-full">
                No avatars generated yet. Head back to create your first one!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
