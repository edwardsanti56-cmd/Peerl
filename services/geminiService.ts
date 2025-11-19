
import { GoogleGenAI } from "@google/genai";
import { SearchResult, NoteContent } from '../types';

// Initialize the client
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const CACHE_PREFIX = 'pearl_notes_cache_v1_';

export const generateSyllabusNotes = async (
  topic: string, 
  subject: string, 
  classLevel: string
): Promise<NoteContent> => {
  
  // 1. Check Cache
  const cacheKey = `${CACHE_PREFIX}${subject}_${classLevel}_${topic}`.replace(/[\s\W]+/g, '_').toLowerCase();
  
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (parsed && parsed.htmlContent) {
        console.log(`Serving notes from cache for: ${topic}`);
        return parsed as NoteContent;
      }
    }
  } catch (e) {
    console.warn("Failed to read from cache", e);
  }

  if (!apiKey) {
    return {
      htmlContent: "<p class='text-red-500'>API Key is missing. Please configure the API_KEY.</p>",
      topicName: topic,
      subjectName: subject,
      classLevel: classLevel,
      sources: []
    };
  }

  try {
    // Optimized prompt for speed and structure
    const textPrompt = `
      You are a senior teacher for the Uganda NCDC Competency-Based Curriculum.
      Generate concise yet detailed study notes for:
      **Subject:** ${subject}
      **Class:** ${classLevel}
      **Topic:** ${topic}

      **OUTPUT RULES:**
      1. Return ONLY raw HTML body content. No <html>, <head>, or markdown backticks.
      2. Use these Tailwind classes:
         - Headers: <h2 class="text-2xl font-bold text-uganda-dark mt-8 mb-4 border-b border-gray-200 pb-2">
         - Subheaders: <h3 class="text-xl font-semibold text-uganda-green mt-6 mb-3">
         - Paragraphs: <p class="mb-4 leading-relaxed text-gray-800">
         - Lists: <ul class="list-disc pl-5 mb-4 space-y-2 text-gray-800">
         - Key Points Box: <div class="bg-green-50 border-l-4 border-uganda-green p-4 my-6 rounded-r">
         - Activity/Example Box: <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-5 my-6">

      **CONTENT STRUCTURE:**
      1. **Introduction**: Brief definition/overview.
      2. **Key Subtopics**: Break the main topic into 3-5 distinct subtopics with detailed explanations.
      3. **Local Relevance**: Cite examples relevant to Uganda/East Africa (e.g., Lake Victoria, Mt. Rwenzori, local crops, common names).
      4. **Competency Activity**: A short "Activity of Integration" or practical task.
      5. **Summary**: Bullet points of what to remember.

      Make it educational, structured, and easy to read on mobile.
    `;

    // Request both Text and Image in parallel
    const textRequest = ai.models.generateContent({
      model: "gemini-2.5-flash", // Fast model
      contents: textPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        tools: [{ googleSearch: {} }],
      },
    });

    // Image generation request using Imagen
    const imageRequest = ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Educational illustration or diagram of ${topic} related to ${subject}. Scientific, clear, high quality, white background preferred.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

    // Execute in parallel, but don't let image failure stop text
    const [textResponseResult, imageResponseResult] = await Promise.allSettled([textRequest, imageRequest]);

    // Process Text Response
    let htmlContent = "";
    const sources: SearchResult[] = [];

    if (textResponseResult.status === 'fulfilled') {
      const response = textResponseResult.value;
      htmlContent = response.text || "";
      htmlContent = htmlContent.replace(/```html/g, '').replace(/```/g, '');

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({
              title: chunk.web.title || "External Resource",
              url: chunk.web.uri,
              source: new URL(chunk.web.uri).hostname,
              snippet: "Reference link found via Google Search."
            });
          }
        });
      }
    } else {
       // Fallback if text generation fails entirely
       console.error("Text generation failed", textResponseResult.reason);
       htmlContent = `<div class="p-4 bg-red-50 text-red-700">Error generating notes. Please try again.</div>`;
    }

    // Process Image Response
    let generatedImage: string | undefined = undefined;
    if (imageResponseResult.status === 'fulfilled' && imageResponseResult.value.generatedImages?.length > 0) {
        const imgBytes = imageResponseResult.value.generatedImages[0].image.imageBytes;
        generatedImage = `data:image/jpeg;base64,${imgBytes}`;
    } else if (imageResponseResult.status === 'rejected') {
        console.warn("Image generation failed:", imageResponseResult.reason);
    }

    // Deduplicate sources
    const uniqueSources = Array.from(new Map(sources.map(item => [item.url, item])).values());

    const result: NoteContent = {
      htmlContent,
      topicName: topic,
      subjectName: subject,
      classLevel,
      sources: uniqueSources,
      generatedImage
    };

    // 2. Save to Cache (only if text generation was successful)
    if (textResponseResult.status === 'fulfilled') {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch (e) {
        console.warn("Failed to save to cache (likely quota exceeded)", e);
      }
    }

    return result;

  } catch (error) {
    console.error("Generation error:", error);
    return {
      htmlContent: `<div class="p-6 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <h3 class="font-bold text-lg mb-2">Connection Error</h3>
        <p>We couldn't generate notes for this topic right now. Please check your internet connection and try again.</p>
      </div>`,
      topicName: topic,
      subjectName: subject,
      classLevel: classLevel,
      sources: []
    };
  }
};

// Retaining search interface compatibility
export const searchNCDCResources = async (query: string, classLevel?: string, subject?: string): Promise<SearchResult[]> => {
   return [];
};
