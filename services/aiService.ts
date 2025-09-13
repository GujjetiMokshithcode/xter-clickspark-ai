import Groq from 'groq-sdk';
import type { ReferenceImage, ModelOption } from '../types';

// Available Hugging Face models for image generation
export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'black-forest-labs/FLUX.1-dev',
    name: 'FLUX.1-dev',
    description: 'High-quality image generation with excellent prompt following',
    supportsImageGeneration: true,
    supportsImageEditing: false,
  },
  {
    id: 'stabilityai/stable-diffusion-xl-base-1.0',
    name: 'Stable Diffusion XL',
    description: 'Popular and reliable image generation model',
    supportsImageGeneration: true,
    supportsImageEditing: false,
  },
  {
    id: 'playgroundai/playground-v2.5',
    name: 'Playground v2.5',
    description: 'Fast and creative image generation',
    supportsImageGeneration: true,
    supportsImageEditing: false,
  },
  {
    id: 'runwayml/stable-diffusion-v1-5',
    name: 'Stable Diffusion v1.5',
    description: 'Classic and fast model, good for simple prompts',
    supportsImageGeneration: true,
    supportsImageEditing: false,
  },
];

// Groq models for text processing
export const PROMPT_ENHANCEMENT_MODEL = 'llama-3.3-70b-versatile';
export const VISION_ANALYSIS_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

interface GenerateThumbnailProps {
  title: string;
  style: string;
  optimizeCtr: boolean;
  referenceImage: ReferenceImage | null;
  userApiKey: string | null;
  selectedModel: string;
}

/**
 * Generates a YouTube thumbnail using Groq for text processing and Hugging Face for image generation.
 */
export const generateThumbnail = async ({
  title,
  style,
  optimizeCtr,
  referenceImage,
  userApiKey,
  selectedModel
}: GenerateThumbnailProps): Promise<string> => {
  const groqApiKey = userApiKey || process.env.GROQ_API_KEY;
  const hfToken = process.env.HUGGINGFACE_API_TOKEN;

  if (!groqApiKey) {
    throw new Error("Groq API key is not configured. Please add your own key to continue.");
  }

  if (!hfToken) {
    throw new Error("Hugging Face API token is not configured. Please check your environment variables.");
  }

  const groq = new Groq({ apiKey: groqApiKey });

  let finalPrompt = `Create a YouTube thumbnail for a video titled "${title}".`;
  if (style !== 'Default') {
    finalPrompt += ` The visual style should be: ${style}.`;
  }

  // Enhance prompt using Groq if requested
  if (optimizeCtr) {
    try {
      const enhancementPrompt = `You are an expert in YouTube content strategy and visual design. Your task is to take a video title and generate a highly detailed, visually descriptive prompt for an AI image generator to create a thumbnail that maximizes click-through rate (CTR).

The prompt should be:
- Concise but detailed (under 200 words)
- Specify key visual elements, vibrant colors, composition, and mood
- Include specific details about text placement, character expressions, lighting
- Focus on elements that make thumbnails clickable: contrast, emotion, curiosity
- Avoid mentioning "YouTube thumbnail" in the final prompt

Video Title: "${title}"
Style: "${style}"

Generate only the image generation prompt, nothing else:`;
      
      const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: enhancementPrompt }],
        model: PROMPT_ENHANCEMENT_MODEL,
        temperature: 0.7,
        max_tokens: 300,
      });

      if (response.choices[0]?.message?.content) {
        finalPrompt = response.choices[0].message.content.trim();
      }
    } catch (error) {
      console.warn("Error enhancing prompt with Groq, falling back to basic prompt:", error);
    }
  }

  // Add 16:9 aspect ratio and thumbnail-specific instructions
  finalPrompt += " Create this as a 16:9 aspect ratio image, high quality, vibrant colors, professional thumbnail style.";

  if (referenceImage) {
    // Analyze reference image with Groq Vision first
    try {
      const analysisPrompt = `Analyze this image and describe its key visual elements, style, colors, composition, and mood. Then suggest how to adapt it into a compelling YouTube thumbnail for the topic: "${title}". Be specific about visual elements to keep, modify, or enhance.`;
      
      const visionResponse = await groq.chat.completions.create({
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: analysisPrompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${referenceImage.mimeType};base64,${referenceImage.data}`
              }
            }
          ]
        }],
        model: VISION_ANALYSIS_MODEL,
        temperature: 0.3,
        max_tokens: 500,
      });

      if (visionResponse.choices[0]?.message?.content) {
        const analysis = visionResponse.choices[0].message.content;
        finalPrompt = `Based on this reference image analysis: ${analysis}\n\nCreate a YouTube thumbnail that incorporates these visual elements while focusing on: ${finalPrompt}`;
      }
    } catch (error) {
      console.warn("Error analyzing reference image with Groq Vision:", error);
    }
  }

  // Generate image using Hugging Face
  try {
    const hfApiUrl = `https://api-inference.huggingface.co/models/${selectedModel}`;
    
    const response = await fetch(hfApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: finalPrompt,
        parameters: {
          width: 1024,
          height: 576, // 16:9 aspect ratio
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 503) {
        throw new Error(`Model ${selectedModel} is currently loading. Please try again in a few moments.`);
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
      } else {
        throw new Error(`Hugging Face API error (${response.status}): ${errorText}`);
      }
    }

    const imageBlob = await response.blob();
    
    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = () => reject(new Error('Failed to convert image to base64'));
      reader.readAsDataURL(imageBlob);
    });

  } catch (error) {
    console.error("Error generating image with Hugging Face:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('loading')) {
      throw new Error(`Model ${selectedModel} is starting up. This can take 1-2 minutes for the first request. Please try again shortly.`);
    } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      throw new Error("Too many requests. Please wait a moment before trying again.");
    } else {
      throw new Error(`Failed to generate thumbnail: ${errorMessage}`);
    }
  }
};

/**
 * Analyze a generated thumbnail using Groq Vision to provide feedback and suggestions
 */
export const analyzeThumbnail = async (imageDataUrl: string, originalPrompt: string, groqApiKey?: string): Promise<string> => {
  const apiKey = groqApiKey || process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error("Groq API key is required for thumbnail analysis");
  }

  const groq = new Groq({ apiKey });

  try {
    const analysisPrompt = `Analyze this YouTube thumbnail image and provide constructive feedback. Consider:

1. Visual Appeal: Colors, composition, clarity
2. Click-worthiness: Does it grab attention? Create curiosity?
3. Text Readability: If there's text, is it clear and impactful?
4. Emotional Impact: Does it convey the right mood/emotion?
5. Thumbnail Best Practices: Contrast, faces, action, etc.

Original prompt was: "${originalPrompt}"

Provide specific, actionable feedback in 2-3 sentences:`;

    const response = await groq.chat.completions.create({
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: analysisPrompt },
          {
            type: 'image_url',
            image_url: { url: imageDataUrl }
          }
        ]
      }],
      model: VISION_ANALYSIS_MODEL,
      temperature: 0.3,
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content || "Unable to analyze thumbnail.";
  } catch (error) {
    console.error("Error analyzing thumbnail:", error);
    return "Analysis unavailable at the moment.";
  }
};