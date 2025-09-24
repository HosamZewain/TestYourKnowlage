import { GoogleGenAI, Type } from "@google/genai";
import { Question, Language } from '../types';
import { TOTAL_QUESTIONS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateQuizQuestions(subCategories: string[], difficulty: string, language: Language): Promise<Question[]> {
  const quizSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: {
          type: Type.STRING,
          description: language === 'ar' ? "نص سؤال الاختبار." : "The quiz question text."
        },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: language === 'ar' ? "مصفوفة من 4 إجابات محتملة." : "An array of 4 possible answers."
        },
        correctAnswer: {
          type: Type.STRING,
          description: language === 'ar' ? "الإجابة الصحيحة، والتي يجب أن تكون أحد الخيارات المتوفرة." : "The correct answer, which must be one of the provided options."
        }
      },
      required: ["question", "options", "correctAnswer"]
    }
  };

  try {
    const topics = subCategories.join(', ');
    const prompt = `Generate ${TOTAL_QUESTIONS} unique and challenging multiple-choice questions in ${language === 'ar' ? 'Arabic' : 'English'}. The questions should cover the following topics: "${topics}". The majority of the questions MUST be related to the MENA (Middle East and North Africa) region. The difficulty level should be "${difficulty}". Each question must have exactly 4 options. Ensure the correct answer is one of the provided options. The entire JSON output, including keys and values, must be in ${language === 'ar' ? 'Arabic' : 'English'}.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText) as Question[];

    // Basic validation
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      throw new Error("API returned an invalid or empty question list.");
    }
    
    // Sanitize data: sometimes the model includes the array wrapper in the string
    return parsedData.map(q => ({
      ...q,
      // Decode potential HTML entities
      question: decodeHTMLEntities(q.question),
      options: q.options.map(opt => decodeHTMLEntities(opt)),
      correctAnswer: decodeHTMLEntities(q.correctAnswer),
    }));

  } catch (error) {
    console.error("Error generating quiz questions:", error);
    if (language === 'ar') {
        throw new Error("فشل إنشاء الاختبار. يرجى تجربة فئة مختلفة أو المحاولة مرة أخرى لاحقًا.");
    }
    throw new Error("Failed to generate the quiz. Please try a different category or try again later.");
  }
}

// Utility to decode HTML entities that might be returned by the model
function decodeHTMLEntities(text: string): string {
    if (typeof window === 'undefined') {
        // Basic fallback for non-browser environments
        return text.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    }
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
}
