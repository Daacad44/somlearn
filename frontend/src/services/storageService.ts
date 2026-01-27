import type { Presentation, AnalyticsData } from '../types/index';

const STORAGE_KEY = 'somlearn_presentations';
const ANALYTICS_KEY = 'somlearn_analytics';

export const storageService = {
    // Save or Update a presentation
    savePresentation: (presentation: Presentation): void => {
        const presentations = storageService.getAllPresentations();
        const index = presentations.findIndex(p => p.id === presentation.id);

        if (index > -1) {
            presentations[index] = { ...presentation, updatedAt: new Date().toISOString() };
        } else {
            presentations.push(presentation);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(presentations));
        storageService.updateAnalytics();
    },

    // Get all presentations
    getAllPresentations: (): Presentation[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Get a specific presentation by ID
    getPresentationById: (id: string): Presentation | undefined => {
        const presentations = storageService.getAllPresentations();
        return presentations.find(p => p.id === id);
    },

    // Delete a presentation
    deletePresentation: (id: string): void => {
        const presentations = storageService.getAllPresentations();
        const filtered = presentations.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    // Analytics Logic
    getAnalytics: (): AnalyticsData => {
        const presentations = storageService.getAllPresentations();
        const storedAnalytics = localStorage.getItem(ANALYTICS_KEY);
        const stats = storedAnalytics ? JSON.parse(storedAnalytics) : { totalExports: 0 };

        const totalSlides = presentations.reduce((acc, p) => acc + p.slides.length, 0);

        return {
            totalPresentations: presentations.length,
            totalSlides,
            totalExports: stats.totalExports || 0,
            mostActiveTopic: presentations.length > 0 ? presentations[0].topic : 'None yet'
        };
    },

    incrementExportCount: (): void => {
        const storedAnalytics = localStorage.getItem(ANALYTICS_KEY);
        const stats = storedAnalytics ? JSON.parse(storedAnalytics) : { totalExports: 0 };
        stats.totalExports += 1;
        localStorage.setItem(ANALYTICS_KEY, JSON.stringify(stats));
    },

    updateAnalytics: (): void => {
        // This can be expanded for more complex tracking
    }
};
