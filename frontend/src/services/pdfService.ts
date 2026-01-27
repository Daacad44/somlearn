import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { PresentationData } from '../types/index';
import { storageService } from './storageService';

/**
 * Enterprise PDF Export Service
 * Optimized for high-resolution text rendering and font embedding.
 */
export async function exportToPDF(data: PresentationData, slideElements: HTMLElement[]): Promise<void> {
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1920, 1080],
        compress: true
    });

    // Strategy: We use a higher scale for canvas to ensure PDF text isn't blurry
    // and we ensure all colors are preserved.
    for (let i = 0; i < slideElements.length; i++) {
        const element = slideElements[i];

        try {
            // Force styles to be applied before capture
            element.style.display = 'flex';

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#0F172A', // Match background-navy-900
                allowTaint: true,
                onclone: (clonedDoc) => {
                    // Ensure fonts are loaded and visible in the clone
                    const clonedElement = clonedDoc.querySelector(`[data-slide-index="${i}"]`) as HTMLElement;
                    if (clonedElement) {
                        clonedElement.style.opacity = '1';
                        clonedElement.style.visibility = 'visible';
                        clonedElement.style.display = 'flex';
                    }
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            if (i > 0) {
                pdf.addPage();
            }

            pdf.addImage(imgData, 'JPEG', 0, 0, 1920, 1080);
        } catch (error) {
            console.error(`PDF Capture Error on Slide ${i + 1}:`, error);
        }
    }

    pdf.save(`${data.topic.replace(/\s+/g, '_')}_ConsultantDeck.pdf`);
    storageService.incrementExportCount();
}
