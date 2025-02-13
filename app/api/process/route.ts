import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import sharp from "sharp";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//cartoon version using DALL-E 3
async function generateCartoonVersion(imageBuffer: Buffer) {
  try {
    // Convert buffer to base64 for the prompt
    const base64Image = imageBuffer.toString("base64");

    // First, analyze the image to get details about the people
    const analysisResponse = await openai.chat.completions.create({
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
      max_tokens: 150,
    });

    const imageDescription = analysisResponse.choices[0].message.content;

    // Generate cartoon version using DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a high-quality, animated version of this scene: ${imageDescription}. 
               Make it warm and appealing, with the same expressions and emotions as the original photo. 
               Use a modern animation. 
               Maintain the key characteristics and likeness of each person while making them look like lovable animated characters.`,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid",
    });

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

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize image before processing
    const optimizedBuffer = await sharp(buffer)
      .resize(1024, 1024, { fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Generate cartoon version
    const imageUrls = await generateCartoonVersion(optimizedBuffer);

    return NextResponse.json({
      success: true,
      variations: imageUrls,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process the image. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Configure API route to handle larger payloads
export const config = {
  api: {
    bodyParser: false,
  },
};
