
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeNote = async (title: string, content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an academic assistant. Summarize the following university note titled "${title}". 
      Provide a concise abstract (3-4 sentences) and a list of 5 key concepts mentioned.
      Return the result in plain text format.`,
      config: {
        systemInstruction: "You are a world-class academic tutor. Be professional, concise, and educational.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    return "Unable to generate AI summary at this time.";
  }
};

export const chatWithBuddy = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are 'Nexus Study Buddy', a friendly and highly intelligent academic mentor. You help students understand complex concepts, solve problems step-by-step, and provide motivation. Keep answers structured with bullet points where helpful.",
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to my brain right now. Please try again!";
  }
};

export const generateMasterStudyGuide = async (notes: any[]) => {
  const context = notes.map(n => `${n.title} (${n.module})`).join(", ");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this library of notes: ${context}, generate a 1-week intensive Study Guide. 
      Include a daily schedule, prioritized topics based on typical difficulty, and 3 mock exam questions.`,
      config: {
        systemInstruction: "You are an expert academic strategist. Create high-efficiency study plans.",
        temperature: 0.6,
      },
    });
    return response.text;
  } catch (error) {
    return "Failed to generate study guide.";
  }
};

export const getCareerAdvice = async (subjects: { name: string, mark: number }[], aps: number) => {
  const subText = subjects.map(s => `${s.name}: ${s.mark}%`).join(", ");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Grade 12 student with APS: ${aps}. Subjects: ${subText}. 
      Recommend 5 university degrees they are likely to qualify for and excel in. 
      Mention specific requirements they meet or miss (e.g., Math requirements for Engineering).`,
      config: {
        systemInstruction: "You are a professional University Career Counselor. You have deep knowledge of global university entrance requirements, especially South African APS systems.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    return "Error generating career advice.";
  }
};
