import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import sharp from "sharp";

// Initialize OpenAI with shorter timeouts
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
  maxRetries: 5,
});

// Generate cartoon version using DALL-E 3
async function generateCartoonVersion(imageBuffer: Buffer) {
  try {
    const base64Image = imageBuffer.toString("base64");

    // First, analyze the image with a shorter timeout
    const analysisPromise = openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe the people in this image, and what they are doing. Focusing on their key features, expressions, skin color of each person (important), hair style, clothing, and positioning. Keep it concise.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    // Add shorter timeout to analysis
    const analysisResponse = await Promise.race([
      analysisPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Analysis timeout")), 8000)
      ),
    ]);

    if (!analysisResponse) {
      throw new Error("Failed to analyze image");
    }

    const imageDescription = analysisResponse.choices[0].message.content;

    // Generate cartoon version with shorter timeout
    const generatePromise = openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a high-quality, animated version of this scene: ${imageDescription}. 
               Make it warm and appealing, with the same expressions and emotions as the original photo. 
               Use a modern animation style. 
               Maintain the key characteristics and likeness of each person while making them look like lovable animated characters.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });

    // Add shorter timeout to generation
    const response = await Promise.race([
      generatePromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Generation timeout")), 8000)
      ),
    ]);

    if (!response) {
      throw new Error("Failed to generate image");
    }

    return [response.data[0].url];
  } catch (error) {
    console.error("Error generating cartoon version:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Please upload an image" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please upload a valid image file (JPEG, PNG, or WebP)",
        },
        { status: 400 }
      );
    }

    // Convert File to Buffer with more aggressive compression
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // More aggressive image optimization
    const optimizedBuffer = await sharp(buffer)
      .resize(800, 800, { fit: "inside" }) // Smaller size
      .jpeg({ quality: 60 }) // Lower quality
      .toBuffer();

    // Generate cartoon version with timeout
    const imageUrls = await generateCartoonVersion(optimizedBuffer);

    return NextResponse.json({
      success: true,
      variations: imageUrls,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("timeout")) {
      return NextResponse.json(
        {
          success: false,
          error: "The request took too long to process. Please try again.",
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process the image. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Use edge runtime
export const runtime = 'edge';

// Configure shorter timeouts
export const maxDuration = 10;
export const preferredRegion = "iad1";
