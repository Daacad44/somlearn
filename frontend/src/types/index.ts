export interface Slide {
    id: string;
    title: string;
    content: string[];
    image_prompt?: string;
    image_url?: string;
    icon?: string;
}

export interface Presentation {
    id: string;
    topic: string;
    slides: Slide[];
    style: string;
    createdAt: string;
    updatedAt: string;
    templateId?: string;
    favorite?: boolean;
}

export interface PresentationData {
    topic: string;
    slides: Slide[];
}

export interface AnalyticsData {
    totalPresentations: number;
    totalSlides: number;
    totalExports: number;
    mostActiveTopic: string;
}
