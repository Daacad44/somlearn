export interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    thumbnail: string;
    primaryColor: string;
    accentColor: string;
    slideLayouts: {
        titleSlide: string;
        contentSlide: string;
        imageSlide: string;
    };
}

export const templates: Template[] = [
    {
        id: 'professional-navy',
        name: 'Professional Navy',
        description: 'Classic navy and amber theme for corporate presentations',
        category: 'Business',
        thumbnail: '🏢',
        primaryColor: '#0F172A',
        accentColor: '#F59E0B',
        slideLayouts: {
            titleSlide: 'centered',
            contentSlide: 'bullets-left',
            imageSlide: 'image-right'
        }
    },
    {
        id: 'modern-gradient',
        name: 'Modern Gradient',
        description: 'Vibrant gradient design for creative presentations',
        category: 'Creative',
        thumbnail: '🎨',
        primaryColor: '#6366F1',
        accentColor: '#EC4899',
        slideLayouts: {
            titleSlide: 'centered',
            contentSlide: 'bullets-center',
            imageSlide: 'image-background'
        }
    },
    {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        description: 'Simple and elegant design with maximum clarity',
        category: 'Minimal',
        thumbnail: '✨',
        primaryColor: '#FFFFFF',
        accentColor: '#000000',
        slideLayouts: {
            titleSlide: 'left-aligned',
            contentSlide: 'bullets-left',
            imageSlide: 'image-full'
        }
    },
    {
        id: 'tech-blue',
        name: 'Tech Blue',
        description: 'Modern tech-focused design with blue tones',
        category: 'Technology',
        thumbnail: '💻',
        primaryColor: '#0EA5E9',
        accentColor: '#10B981',
        slideLayouts: {
            titleSlide: 'centered',
            contentSlide: 'bullets-left',
            imageSlide: 'image-right'
        }
    },
    {
        id: 'education-green',
        name: 'Education Green',
        description: 'Fresh and engaging design for educational content',
        category: 'Education',
        thumbnail: '📚',
        primaryColor: '#059669',
        accentColor: '#FBBF24',
        slideLayouts: {
            titleSlide: 'centered',
            contentSlide: 'bullets-left',
            imageSlide: 'image-right'
        }
    },
    {
        id: 'startup-purple',
        name: 'Startup Purple',
        description: 'Bold and innovative design for startup pitches',
        category: 'Startup',
        thumbnail: '🚀',
        primaryColor: '#7C3AED',
        accentColor: '#F59E0B',
        slideLayouts: {
            titleSlide: 'centered',
            contentSlide: 'bullets-center',
            imageSlide: 'image-background'
        }
    },
    {
        id: 'finance-gold',
        name: 'Finance Gold',
        description: 'Sophisticated design for financial presentations',
        category: 'Finance',
        thumbnail: '💰',
        primaryColor: '#1E293B',
        accentColor: '#D97706',
        slideLayouts: {
            titleSlide: 'centered',
            contentSlide: 'bullets-left',
            imageSlide: 'image-right'
        }
    },
    {
        id: 'health-teal',
        name: 'Health & Wellness',
        description: 'Calming design for healthcare presentations',
        category: 'Healthcare',
        thumbnail: '🏥',
        primaryColor: '#0D9488',
        accentColor: '#06B6D4',
        slideLayouts: {
            titleSlide: 'centered',
            contentSlide: 'bullets-left',
            imageSlide: 'image-right'
        }
    }
];

export const getTemplateById = (id: string): Template | undefined => {
    return templates.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: string): Template[] => {
    return templates.filter(t => t.category === category);
};

export const getAllCategories = (): string[] => {
    return Array.from(new Set(templates.map(t => t.category)));
};
