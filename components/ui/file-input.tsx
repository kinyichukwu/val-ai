"use client";

import { cn } from "@/lib/utils";
import { FileIcon, Wand2 } from "lucide-react";
import { Button } from "./button";

interface FileInputProps {
  onFileSelect: (files: FileList | null) => void;
  isExpanded: boolean;
  onAction?: () => void;
}

export function FileInput({
  onFileSelect,
  isExpanded,
  onAction,
}: FileInputProps) {
  return (
    <div className="space-y-2 mb-3">
      <div
        className={cn(
          "w-full transition-all duration-300 rounded-lg",
          "backdrop-blur-md bg-foreground/5 border border-primary/20",
          "shadow-[inset_0_0_20px_rgba(236,72,153,0.03)]",
          "hover:border-primary/30 hover:bg-foreground/10",
          "group"
        )}
      >
        <div className="flex items-center w-full">
          <label
            className={cn(
              "flex flex-1 items-center gap-3 p-3 rounded-lg cursor-pointer",
              "transition-colors",
              "w-full h-full"
            )}
          >
            <FileIcon className="h-4 w-4 text-primary/70 group-hover:text-primary/90" />
            <span className="text-muted-foreground text-sm group-hover:text-foreground">
              Upload Image
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files)}
              accept="image/*"
              multiple
            />
          </label>
          {isExpanded && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-primary hover:text-primary hover:bg-primary/10 h-8 w-8"
              onClick={onAction}
            >
              <Wand2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {!isExpanded && (
        <p className="text-xs text-muted-foreground text-center">
          Upload an image to get started
        </p>
      )}
    </div>
  );
}
