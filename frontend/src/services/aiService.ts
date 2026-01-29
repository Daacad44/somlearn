import type { PresentationData, Slide } from '../types/index';

const getGeminiApiKey = () => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('somlearn_gemini_key') || '';
};

export interface GenerationOptions {
    topic: string;
    slideCount: number;
    style: string;
    template?: string;
}

/**
 * Enterprise AI Content Generation System
 * Uses a Strategic Consulting Framework for high-quality, non-repetitive slides.
 */
export async function generatePresentationContent(options: GenerationOptions): Promise<PresentationData> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('Google Gemini API Key is missing.');
    }

    const tryModels = [
        'gemini-2.0-flash-exp', // Most capable latest model
        'gemini-2.5-flash',     // User specified model
        'gemini-1.5-flash',
        'gemini-flash-latest'
    ];

    for (const model of tryModels) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
            const response = await fetch(`${endpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: createEnterprisePrompt(options) }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 3500,
                        topP: 0.95
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                return processAIData(data, options.topic);
            }

            const errorData = await response.json();
            // If it's not a 404, we stop and throw. If it is 404, we try the next model.
            if (response.status !== 404) {
                throw new Error(`AI Service Error (${response.status}): ${JSON.stringify(errorData.error?.message || errorData)}`);
            }

            console.warn(`Model ${model} not found, trying fallback...`);
        } catch (error: unknown) {
            const err = error as { message?: string; status?: number };
            // Check for 404 in the error message or status if fetch itself failed before response.json()
            if (err.message?.includes('404') || err.status === 404) {
                console.warn(`Model ${model} failed with 404, trying fallback...`);
                continue;
            }
            console.error('Critical AI Service Failure:', error);
            throw error;
        }
    }

    throw new Error('All available AI models returned a 404. Please verify your API key permissions in Google AI Studio.');
}

/**
 * Shared data processing logic
 */
interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
}

function processAIData(data: GeminiResponse, topic: string): PresentationData {
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let content: { slides?: Array<{ title?: string; content?: string[]; image_prompt?: string; icon?: string }> };

    try {
        content = JSON.parse(generatedText);
    } catch {
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('AI produced invalid content format. Please try a different topic.');
        }
        content = JSON.parse(jsonMatch[0]);
    }

    return {
        topic: topic,
        slides: (content.slides || []).map((slide: { title?: string; content?: string[]; image_prompt?: string; icon?: string }) => ({
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            title: slide.title || 'Untitled Slide',
            content: slide.content || [],
            image_prompt: slide.image_prompt || '',
            icon: slide.icon || '📌'
        }))
    };
}

function createEnterprisePrompt(options: GenerationOptions): string {
    const { topic, slideCount } = options;

    return `You are a beginner-friendly Educator and Presentation Architect. 
Your task is to draft a clean, high-quality presentation on: "${topic}".

MISSION: 
Explain this topic using EASY ENGLISH. This means using simple words, short sentences, and avoiding technical jargon unless you explain it simply.

NARRATIVE ARC (FOR ${slideCount} SLIDES):
1. THE HOOK: A simple, welcoming title slide.
2. WHAT IS IT?: A clear definition of the topic.
3. KEY PARTS: Break down the main parts or concepts (e.g., if it's hardware, look at CPU, RAM, etc.).
4. HOW IT WORKS: A simple explanation of the process.
5. WHY IT MATTERS: The benefit or importance of knowing this.
6. SUMMARY: A quick review of what was learned.

SLIDE RULES:
- EACH slide must cover a UNIQUE part of the topic.
- EACH bullet point must be written in EASY ENGLISH (Simple words, max 10-12 words).
- NO complex jargon. If you use a hard word, explain it.
- Use a friendly, helpful tone.

OUTPUT SCHEMA (JSON ONLY):
{
  "slides": [
    {
      "title": "Simple & Clear Heading",
      "content": [
        "First simple point about this part.",
        "Second easy-to-understand sentence.",
        "A final takeaway for a beginner."
      ],
      "image_prompt": "Clear, minimalist, professional 3D illustration of [specific hardware part] on a clean background",
      "icon": "relevant-emoji"
    }
  ]
}

GENERATE ${slideCount} SLIDES REGARDING "${topic}" IN EASY ENGLISH.`;
}

/**
 * Get appropriate icon for slide content
 */
export function getIconForSlide(title: string): string {
    const lowerTitle = title.toLowerCase();
    const iconMap: Record<string, string> = {
        'intro': '👋', 'overview': '🔍', 'analysis': '📊', 'data': '📈',
        'strategy': '🎯', 'solution': '💡', 'future': '🚀', 'challenge': '⚠️',
        'conclusion': '✅', 'impact': '🌟', 'roadmap': '📅', 'tech': '💻'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerTitle.includes(key)) return icon;
    }
    return '📌';
}

import type { ImageResult } from './imageService';

/**
 * Enhance slides with real images using professional search terms
 */
export async function enhanceSlidesWithImages(slides: Slide[], searchImages: (query: string) => Promise<ImageResult[]>): Promise<Slide[]> {
    return Promise.all(
        slides.map(async (slide) => {
            try {
                // Focus search on high-quality conceptual visuals
                const searchQueries = [
                    `${slide.image_prompt} corporate high quality`,
                    `${slide.title} professional concept`,
                    `minimalist business ${slide.title}`
                ];

                const images = await searchImages(searchQueries[0]);
                return {
                    ...slide,
                    image_url: images[0]?.url || undefined
                };
            } catch {
                return slide;
            }
        })
    );
}

export function generateMockPresentation(options: GenerationOptions): PresentationData {
    // Mock for offline development/error handling
    return {
        topic: options.topic,
        slides: Array.from({ length: options.slideCount }).map((_, i) => ({
            id: crypto.randomUUID(),
            title: `Enterprise Chapter ${i + 1}: Strategic Synthesis`,
            content: [
                "Comprehensive evaluation of market-leading dynamics.",
                "Optimization of operational frameworks for efficiency.",
                "Sustainable growth modeling based on 2030 projections."
            ],
            image_prompt: "High-end corporate visualization",
            icon: '💼'
        }))
    };
}
