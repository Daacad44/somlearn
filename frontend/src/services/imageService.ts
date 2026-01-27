import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '';
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || '';

export interface ImageResult {
    url: string;
    thumbnail: string;
    photographer: string;
    source: string;
}

/**
 * Search for relevant images using Unsplash API
 */
export async function searchUnsplashImages(query: string, count: number = 1): Promise<ImageResult[]> {
    if (!UNSPLASH_ACCESS_KEY) {
        console.warn('Unsplash API key not configured, using placeholder images');
        return generatePlaceholderImages(query, count);
    }

    try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: query,
                per_page: count,
                orientation: 'landscape'
            },
            headers: {
                'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        });

        return response.data.results.map((photo: { urls: { regular: string; thumb: string }; user: { name: string } }) => ({
            url: photo.urls.regular,
            thumbnail: photo.urls.thumb,
            photographer: photo.user.name,
            source: 'Unsplash'
        }));
    } catch (error) {
        console.error('Unsplash API error:', error);
        return generatePlaceholderImages(query, count);
    }
}

/**
 * Search for relevant images using Pexels API
 */
export async function searchPexelsImages(query: string, count: number = 1): Promise<ImageResult[]> {
    if (!PEXELS_API_KEY) {
        console.warn('Pexels API key not configured, using placeholder images');
        return generatePlaceholderImages(query, count);
    }

    try {
        const response = await axios.get('https://api.pexels.com/v1/search', {
            params: {
                query: query,
                per_page: count,
                orientation: 'landscape'
            },
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });

        return response.data.photos.map((photo: { src: { large: string; medium: string }; photographer: string }) => ({
            url: photo.src.large,
            thumbnail: photo.src.medium,
            photographer: photo.photographer,
            source: 'Pexels'
        }));
    } catch (error) {
        console.error('Pexels API error:', error);
        return generatePlaceholderImages(query, count);
    }
}

/**
 * Smart image search - tries Unsplash first, falls back to Pexels
 */
export async function searchImages(query: string, count: number = 1): Promise<ImageResult[]> {
    // Try Unsplash first
    if (UNSPLASH_ACCESS_KEY) {
        const results = await searchUnsplashImages(query, count);
        if (results.length > 0 && !results[0].url.includes('placeholder')) {
            return results;
        }
    }

    // Fallback to Pexels
    if (PEXELS_API_KEY) {
        const results = await searchPexelsImages(query, count);
        if (results.length > 0 && !results[0].url.includes('placeholder')) {
            return results;
        }
    }

    // Final fallback to placeholder
    return generatePlaceholderImages(query, count);
}

/**
 * Generate placeholder images with relevant colors and text
 */
function generatePlaceholderImages(query: string, count: number): ImageResult[] {
    const colors = ['0F172A', 'F59E0B', '6366F1', '10B981', 'EC4899', '0EA5E9'];

    return Array.from({ length: count }, (_, i) => {
        const color = colors[i % colors.length];
        const encodedQuery = encodeURIComponent(query);

        return {
            url: `https://via.placeholder.com/1200x675/${color}/FFFFFF?text=${encodedQuery}`,
            thumbnail: `https://via.placeholder.com/400x225/${color}/FFFFFF?text=${encodedQuery}`,
            photographer: 'Placeholder',
            source: 'Generated'
        };
    });
}

/**
 * Get icon URL from a library (using emoji or icon services)
 */
export function getIconForTopic(topic: string): string {
    const iconMap: Record<string, string> = {
        'technology': '💻',
        'business': '💼',
        'finance': '💰',
        'health': '🏥',
        'education': '📚',
        'science': '🔬',
        'marketing': '📈',
        'design': '🎨',
        'ai': '🤖',
        'data': '📊',
        'default': '✨'
    };

    const lowerTopic = topic.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerTopic.includes(key)) {
            return icon;
        }
    }

    return iconMap.default;
}
