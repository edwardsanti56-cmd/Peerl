
import { GoogleGenAI, Chat, Type, Modality } from "@google/genai";
import { SearchResult, NoteContent, QuizQuestion } from '../types';

// Helper to get client with latest key to avoid initialization race conditions
const getClient = () => {
    const apiKey = process.env.API_KEY || '';
    return new GoogleGenAI({ apiKey });
}

const CACHE_PREFIX = 'pearl_notes_cache_v2_';

export const createChatSession = (): Chat => {
  const ai = getClient();
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are a friendly and helpful AI tutor for Ugandan students. You specialize in the NCDC Competency-Based Curriculum for secondary schools (S1-S4). Help students understand complex topics in subjects like Biology, Math, Physics, History, etc.\n\n**FORMATTING RULES:**\n- Use **bold** for key terms and concepts.\n- Use bullet points ( - or * ) for lists, steps, or examples.\n- Use ### for headers to organize your response.\n- Keep paragraphs short and readable.\n- Be encouraging and use local examples where possible.",
    }
  });
};

export const generateSyllabusNotes = async (
  topic: string, 
  subject: string, 
  classLevel: string,
  detailLevel: 'concise' | 'detailed' = 'detailed'
): Promise<NoteContent> => {
  
  // 1. Check Cache (Key now includes detail level)
  const cacheKey = `${CACHE_PREFIX}${subject}_${classLevel}_${topic}_${detailLevel}`.replace(/[\s\W]+/g, '_').toLowerCase();
  
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

  const ai = getClient(); // Initialize client here

  try {
    // Optimized prompt for speed and structure
    const textPrompt = `
      You are a senior teacher for the Uganda NCDC Competency-Based Curriculum.
      Generate ${detailLevel} study notes for:
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
      3. **IMPORTANT**: Insert the text "[[IMAGE_PLACEHOLDER]]" exactly once in the HTML content. Place it where a diagram or visual illustration would be most educational (e.g., immediately following a description of structures, inside a key subtopic, or after the Introduction). Ensure it is placed BETWEEN paragraphs, not inside them.

      **CONTENT STRUCTURE (${detailLevel === 'concise' ? 'Short Revision Mode' : 'Full Study Mode'}):**
      1. **Introduction**: Brief definition/overview.
      2. **Key Subtopics**: Break the main topic into ${detailLevel === 'concise' ? '2-3 key points' : '3-5 detailed sections'}.
      3. **Local Relevance**: Cite examples relevant to Uganda/East Africa (e.g., Lake Victoria, Mt. Rwenzori, local crops, common names).
      4. **Competency Activity**: A short "Activity of Integration" or practical task.
      5. **Summary**: Bullet points of what to remember.

      Make it educational, structured, and easy to read on mobile.
    `;

    // Request both Text and Image in parallel
    // REMOVED thinkingConfig to ensure compatibility with tools and avoid errors
    const textRequest = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: textPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const imageRequest = ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Educational illustration or diagram of ${topic} related to ${subject}. Scientific, clear, high quality, white background preferred.`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });

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
       console.error("Text generation failed", textResponseResult.reason);
       htmlContent = `<div class="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <p class="font-bold">Error generating notes.</p>
          <p class="text-sm mt-1">Please check your internet connection and try again.</p>
       </div>`;
    }

    // Process Image Response
    let generatedImage: string | undefined = undefined;
    if (imageResponseResult.status === 'fulfilled' && imageResponseResult.value.generatedImages?.length > 0) {
        const imgBytes = imageResponseResult.value.generatedImages[0].image.imageBytes;
        generatedImage = `data:image/jpeg;base64,${imgBytes}`;
    } else if (imageResponseResult.status === 'rejected') {
        console.warn("Image generation failed:", imageResponseResult.reason);
    }

    // Inject Image into HTML
    if (generatedImage) {
      const imgHtml = `
          <figure class="my-8 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white max-w-3xl mx-auto">
             <img src="${generatedImage}" alt="AI Illustration: ${topic}" class="w-full h-auto object-cover" />
             <figcaption class="p-3 text-center text-sm text-gray-500 bg-gray-50 border-t border-gray-100">
               AI Generated Diagram: ${topic}
             </figcaption>
          </figure>
      `;
      
      if (htmlContent.includes('[[IMAGE_PLACEHOLDER]]')) {
        htmlContent = htmlContent.replace('[[IMAGE_PLACEHOLDER]]', imgHtml);
      } else {
        // Fallback: insert after first paragraph or at top
         htmlContent = imgHtml + htmlContent;
      }
    } else {
       // Remove placeholder if no image
       htmlContent = htmlContent.replace('[[IMAGE_PLACEHOLDER]]', '');
    }

    const resultData: NoteContent = {
      htmlContent,
      topicName: topic,
      subjectName: subject,
      classLevel: classLevel,
      sources: sources,
      generatedImage
    };

    // Save to Cache if successful
    if (textResponseResult.status === 'fulfilled') {
        try {
            localStorage.setItem(cacheKey, JSON.stringify(resultData));
        } catch (e) { console.warn("Cache full", e); }
    }

    return resultData;
  } catch (error) {
    console.error("Error generating notes:", error);
    return {
      htmlContent: "<p class='text-red-500'>Failed to generate notes. Please try again.</p>",
      topicName: topic,
      subjectName: subject,
      classLevel: classLevel,
      sources: []
    };
  }
};

export const generateQuiz = async (topic: string, subject: string, classLevel: string): Promise<QuizQuestion[]> => {
  const ai = getClient();
  const prompt = `Generate 5 multiple-choice questions for ${classLevel} ${subject} students about "${topic}".
  For each question, provide 4 options, the correct answer index (0-3), and a brief explanation of why it is correct.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
            propertyOrdering: ['question', 'options', 'correctAnswerIndex', 'explanation']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Quiz generation failed", e);
    return [];
  }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: text.substring(0, 4000) }] // Limit text for TTS safety
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }
          }
        }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (e) {
    console.error("TTS failed", e);
    return undefined;
  }
}

export const searchNCDCResources = async (query: string, classLevel?: string, subject?: string): Promise<SearchResult[]> => {
  const ai = getClient();
  const prompt = `Search for educational resources related to: ${query} ${classLevel || ''} ${subject || ''} in the context of Uganda NCDC curriculum.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return chunks.map((chunk: any) => {
        if (!chunk.web?.uri) return null;
        return {
            title: chunk.web?.title || "Resource",
            url: chunk.web?.uri,
            source: new URL(chunk.web?.uri).hostname,
            snippet: "Relevant resource found via Google Search."
        };
    }).filter((r: any) => r !== null);
  } catch (e) {
    console.error("Search failed", e);
    return [];
  }
}
