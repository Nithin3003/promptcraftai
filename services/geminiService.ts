import { GoogleGenAI, Content, Modality } from "@google/genai";

// FIX: Initialize the GoogleGenAI client according to guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getChatResponse = async (
    history: { role: 'user' | 'model'; content: string }[],
    prompt: string, // This is redundant as it is the last message in history, but we keep it to match the call signature.
    useLowLatency: boolean
): Promise<string> => {
    try {
        // FIX: Use recommended models based on latency requirement.
        const modelName = useLowLatency ? 'gemini-2.5-flash' : 'gemini-2.5-pro';

        const contents: Content[] = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));
        
        // FIX: Use ai.models.generateContent for chat functionality.
        const response = await ai.models.generateContent({
            model: modelName,
            contents: contents, 
        });

        // FIX: Use response.text to directly access the text response.
        return response.text;
    } catch (error) {
        console.error('Error getting chat response:', error);
        throw new Error('Failed to get response from Gemini.');
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        // FIX: Use the recommended high-quality image generation model 'imagen-4.0-generate-001'.
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        // FIX: Correctly access the generated image data and format as a data URL.
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        return imageUrl;

    } catch (error) {
        console.error('Error generating image:', error);
        throw new Error('Failed to generate image.');
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        // FIX: Use the recommended text-to-speech model and configuration.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        // FIX: Correctly access the base64 encoded audio data from the response.
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received.");
        }
        return base64Audio;
    } catch (error) {
        console.error('Error generating speech:', error);
        throw new Error('Failed to generate speech.');
    }
};

export const humanizeText = async (text: string, tone: string): Promise<string> => {
    try {
        const prompt = `Your task is a masterful restructuring of the following text. Your goal is to make it completely indistinguishable from sophisticated, high-quality human writing.

        **Core Directives:**
        1.  **Adopt a ${tone} tone.**
        2.  **Vary Sentence Cadence:** Aggressively restructure sentences. Combine short, punchy sentences with longer, more complex ones to create a natural, un-robotic rhythm. Break up monotonous patterns.
        3.  **Eliminate AI Verbal Tics:** Purge the text of common AI phrases (e.g., 'delve into,' 'in conclusion,' 'furthermore,' 'it's important to note,' 'the landscape of'). Replace them with more original and precise language.
        4.  **Introduce Human Idiosyncrasy:** Avoid overly perfect, logical phrasing. Introduce the subtle transitions and slightly imperfect flow that characterize authentic human thought.
        
        **Process:**
        1.  Rewrite the text following all directives.
        2.  **Perform a critical self-analysis.** Ask: "Does this sound even slightly like an AI? Is the phrasing too perfect or predictable?"
        3.  If any artificiality remains, perform another revision.
        4.  Provide ONLY the final, humanized text as the output. Do not include preambles or explanations.

        **Original Text:**
        """
        ${text}
        """`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
             config: {
                systemInstruction: `You are an elite literary editor specializing in transforming AI text into authentic, human-authored prose.`,
            }
        });
        return response.text;
    } catch (error) {
        console.error('Error humanizing text:', error);
        throw new Error('Failed to humanize text.');
    }
};