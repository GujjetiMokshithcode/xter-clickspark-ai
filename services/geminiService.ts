import { GoogleGenAI, Modality } from "@google/genai";
import type { ReferenceImage } from '../types';

interface GenerateThumbnailProps {
  title: string;
  style: string;
  optimizeCtr: boolean;
  referenceImage: ReferenceImage | null;
  userApiKey: string | null;
}

/**
 * Generates or edits a YouTube thumbnail using the Gemini API.
 * @param props - The properties for thumbnail generation.
 * @returns A promise that resolves to a base64 data URL of the generated image.
 */
export const generateThumbnail = async ({
  title,
  style,
  optimizeCtr,
  referenceImage,
  userApiKey
}: GenerateThumbnailProps): Promise<string> => {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API key is not configured. Please add your own key to continue.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  let finalPrompt = `Create a YouTube thumbnail for a video titled "${title}".`;
  if (style !== 'Default') {
    finalPrompt += ` The visual style should be: ${style}.`;
  }

  if (optimizeCtr) {
    try {
      const enhancementPrompt = `You are an expert in YouTube content strategy. Your task is to take a video title and generate a visually descriptive, high-impact prompt for an AI image generator to create a thumbnail that maximizes click-through rate (CTR). The prompt should be concise, under 150 words, and specify key elements, vibrant colors, composition, and overall mood. Make it compelling and clickable.

Video Title: "${title}"
Style: "${style}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: enhancementPrompt,
      });
      finalPrompt = response.text;
    } catch (error) {
      console.warn("Error enhancing prompt, falling back to basic prompt.", error);
      // Fallback to the original prompt if enhancement fails
    }
  }
  
  if (referenceImage) {
    // Edit the provided reference image
    try {
      const editPrompt = `Your task is to edit the provided reference image to create an eye-catching 16:9 YouTube thumbnail based on the following instructions: "${finalPrompt}".

Key instructions:
- **Foundation:** Use the provided image as the primary foundation. The final output should feel like an evolution of this image, not something entirely new.
- **Significant Changes:** You are empowered to make significant alterations. This includes modifying or completely changing characters, adding or removing objects, altering the background, and adjusting the overall style, mood, and color palette to perfectly match the prompt's requirements.
- **Text Integration:** If the prompt suggests text (like a video title or key concepts), integrate it into the image in a bold, readable, and stylistically appropriate font.
- **Goal:** The final image must be a high-quality, compelling thumbnail that masterfully blends the essence of the original image with the specific creative direction of the prompt.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: referenceImage.data,
                mimeType: referenceImage.mimeType,
              },
            },
            { text: editPrompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          return `data:${mimeType};base64,${base64ImageBytes}`;
        }
      }
      throw new Error("The model did not return an image from the edit operation.");
    } catch (error) {
      console.error("Error editing image with Gemini:", error);
      throw new Error("Failed to generate thumbnail from reference image.");
    }
  } else {
    // Generate a new image from scratch
    try {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      } else {
        throw new Error("The model did not return any images.");
      }
    } catch (error) {
      console.error("Error generating image with Gemini:", error);
      throw new Error("Failed to generate thumbnail from prompt.");
    }
  }
};