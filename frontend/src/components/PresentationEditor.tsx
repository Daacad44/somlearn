import { useState, useRef, useEffect, useCallback } from 'react';
import type { Presentation, Slide } from '../types/index';
import { ChevronLeft, ChevronRight, Download, FileDown, Image as ImageIcon, Check, Save, Trash2, Search, X, Loader2 } from 'lucide-react';
import pptxgen from "pptxgenjs";
import { exportToPDF } from '../services/pdfService';
import { storageService } from '../services/storageService';
import { searchImages } from '../services/imageService';
import type { ImageResult } from '../services/imageService';

interface Props {
    data: Presentation;
    onBack: () => void;
}

export default function PresentationEditor({ data, onBack }: Props) {
    const [slides, setSlides] = useState<Slide[]>(data.slides);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isSearchingImage, setIsSearchingImage] = useState(false);
    const [searchQuery, setSearchQuery] = useState(data.topic);
    const [searchResults, setSearchResults] = useState<ImageResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const currentSlide = slides[currentSlideIndex];

    const handleSave = useCallback(() => {
        setSaveStatus('saving');
        storageService.savePresentation({
            ...data,
            slides,
            updatedAt: new Date().toISOString()
        });
        setTimeout(() => setSaveStatus('saved'), 500);
        setTimeout(() => setSaveStatus('idle'), 3000);
    }, [data, slides]);

    // Auto-save logic
    useEffect(() => {
        if (saveStatus === 'idle') {
            const timer = setTimeout(() => {
                handleSave();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [slides, saveStatus, handleSave]);

    const updateSlide = (index: number, updates: Partial<Slide>) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], ...updates };
        setSlides(newSlides);
    };

    const getBase64FromUrl = async (url: string): Promise<string> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => resolve(reader.result as string);
            });
        } catch (e) {
            console.error("Base64 Conversion Failed:", e);
            throw e;
        }
    }

    const handleExportPPT = async () => {
        const pres = new pptxgen();
        pres.layout = 'LAYOUT_16x9';

        for (const slideData of slides) {
            const slide = pres.addSlide();
            slide.background = { color: "0F172A" }; // Premium Navy

            // Top bar accent
            slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: "F59E0B" } });

            // Title & Content with professional grid
            slide.addText(slideData.title, {
                x: '5%', y: '10%', w: '90%', h: 1,
                fontSize: 32, bold: true, color: "FFFFFF", fontFace: "Helvetica"
            });

            const bullets = slideData.content.map(txt => ({
                text: txt,
                options: { fontSize: 16, color: "cbd5e1", bullet: true, breakLine: true }
            }));

            slide.addText(bullets, {
                x: '5%', y: '25%', w: '50%', h: 4,
                fontSize: 16, color: "cbd5e1", valign: 'top'
            });

            if (slideData.image_url) {
                try {
                    const base64Img = await getBase64FromUrl(slideData.image_url);
                    slide.addImage({ data: base64Img, x: '58%', y: '25%', w: '37%', h: 3.5 });
                } catch {
                    slide.addShape(pres.ShapeType.rect, { x: '58%', y: '25%', w: '37%', h: 3.5, fill: { color: "1e293b" } });
                }
            }

            slide.addText("SOMLEARN AI ARCHITECT", { x: '5%', y: '92%', w: '30%', h: 0.3, fontSize: 10, color: "475569" });
            slide.addText(`${slides.indexOf(slideData) + 1}`, { x: '92%', y: '92%', h: 0.3, fontSize: 10, color: "F59E0B", align: 'right' });
        }

        pres.writeFile({ fileName: `${data.topic}_ConsultantDeck.pptx` });
    };

    const handleExportPDF = async () => {
        if (!printRef.current) return;
        setIsExporting(true);
        try {
            const slideElements = Array.from(printRef.current.children) as HTMLElement[];
            await exportToPDF(data, slideElements);
        } finally {
            setIsExporting(false);
        }
    };

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const results = await searchImages(searchQuery, 12);
            setSearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectImage = (img: ImageResult) => {
        updateSlide(currentSlideIndex, { image_url: img.url });
        setIsSearchingImage(false);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-900 border-t-4 border-amber-500">

            {/* PDF Generation Shadow Root */}
            <div className="fixed top-0 left-0 w-[1920px] h-0 overflow-hidden opacity-0 pointer-events-none" ref={printRef}>
                {slides.map((slide, idx) => (
                    <SlideRenderer key={`pdf-${idx}`} slide={slide} index={idx} isPrint={true} data-slide-index={idx} />
                ))}
            </div>

            {/* Modern Workspace Header */}
            <div className="absolute top-0 left-0 right-0 h-14 bg-white/70 backdrop-blur-xl border-b flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={18} /></button>
                    <div className="h-4 w-[1px] bg-slate-200"></div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Project:</span>
                        <span className="text-sm font-bold text-slate-900 truncate max-w-[300px]">{data.topic}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border rounded-full">
                        {saveStatus === 'saving' ? (
                            <span className="flex items-center gap-2 text-[10px] font-bold text-amber-600 animate-pulse uppercase tracking-wider">
                                <Save size={10} /> Saving changes...
                            </span>
                        ) : saveStatus === 'saved' ? (
                            <span className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-wider">
                                <Check size={10} /> Saved to Local Sync
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Editor Active</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleExportPPT} className="flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-wider bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-all">
                        <Download size={14} /> PPTX
                    </button>
                    <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center gap-2 px-4 py-1.5 text-xs font-black uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-all shadow-lg shadow-slate-900/10">
                        <FileDown size={14} /> {isExporting ? 'Capturing...' : 'PDF'}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 pt-14 w-full">
                {/* Modern Navigator */}
                <div className="w-16 hover:w-64 bg-white border-r flex flex-col shrink-0 z-40 transition-all duration-300 group/nav overflow-hidden shadow-2xl shadow-slate-200/50">
                    <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                        {slides.map((slide, idx) => (
                            <div
                                key={slide.id}
                                onClick={() => setCurrentSlideIndex(idx)}
                                className={`relative cursor-pointer transition-all duration-300 ${currentSlideIndex === idx ? 'scale-100' : 'scale-95 opacity-50 hover:opacity-100'}`}
                            >
                                <div className={`aspect-video rounded-lg border-2 overflow-hidden transition-all ${currentSlideIndex === idx ? 'border-amber-500 shadow-xl' : 'border-slate-100 hover:border-slate-300'}`}>
                                    <div className="h-full w-full bg-[#0F172A] p-2 flex flex-col justify-between">
                                        <div className="h-1 w-full bg-amber-500/50 rounded-full"></div>
                                        <div className="space-y-1">
                                            <div className="h-[2px] w-2/3 bg-white/20 rounded-full"></div>
                                            <div className="h-[2px] w-1/2 bg-white/10 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-navy-900/40 text-white transition-opacity font-bold text-[10px]">
                                        Slide {idx + 1}
                                    </div>
                                </div>
                                <div className="absolute top-1/2 -left-3 -translate-y-1/2 p-2 bg-white hidden group-hover/nav:block border border-slate-100 rounded-full shadow-lg z-50">
                                    <span className="text-[10px] font-black text-slate-800">{idx + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Professional Canvas */}
                <div className="flex-1 bg-[#F1F5F9] relative overflow-hidden flex flex-col items-center justify-center p-12">
                    <div className="w-full max-w-6xl aspect-video shadow-[0_40px_100px_-20px_rgba(15,23,42,0.3)] rounded-2xl overflow-hidden ring-1 ring-black/5 animate-in zoom-in-95 duration-700">
                        <SlideRenderer
                            slide={currentSlide}
                            index={currentSlideIndex}
                            isPrint={false}
                            onUpdate={(updates) => updateSlide(currentSlideIndex, updates)}
                            onSearchImage={() => setIsSearchingImage(true)}
                        />
                    </div>

                    {/* Quick Navigation Controls */}
                    <div className="mt-8 flex items-center gap-6 px-8 py-3 bg-white/80 backdrop-blur rounded-full shadow-xl border border-white">
                        <button onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))} disabled={currentSlideIndex === 0} className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30 transition-all hover:scale-110 active:scale-90"><ChevronLeft size={20} /></button>
                        <div className="flex flex-col items-center min-w-[100px]">
                            <span className="text-xs font-black uppercase tracking-tighter text-slate-400">Structure Insight</span>
                            <span className="text-sm font-black text-slate-900">{currentSlideIndex + 1} / {slides.length}</span>
                        </div>
                        <button onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))} disabled={currentSlideIndex === slides.length - 1} className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30 transition-all hover:scale-110 active:scale-90"><ChevronRight size={20} /></button>
                    </div>
                </div>
            </div>

            {/* Media Picker Modal */}
            {isSearchingImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/20">
                        <div className="p-8 border-b flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-slate-900">Visual Assets</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Source: Unsplash & Pexels Professional Library</p>
                            </div>
                            <button onClick={() => setIsSearchingImage(false)} className="p-3 hover:bg-slate-100 rounded-full transition-all hover:rotate-90"><X size={20} /></button>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSearch} className="relative mb-10 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={24} />
                                <input
                                    autoFocus
                                    type="text"
                                    className="w-full text-xl pl-16 pr-6 py-6 bg-slate-100 border-none rounded-2xl focus:ring-4 focus:ring-amber-500/10 transition-all font-bold placeholder:text-slate-300"
                                    placeholder="Search professional imagery..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-amber-500 transition-all"
                                >
                                    Search
                                </button>
                            </form>

                            {isSearching ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="text-amber-500 animate-spin" size={48} />
                                    <p className="font-black text-slate-400 uppercase text-xs tracking-[0.2em]">Curating Visuals...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {searchResults.length > 0 ? searchResults.map((img: ImageResult, i: number) => (
                                        <div
                                            key={i}
                                            onClick={() => selectImage(img)}
                                            className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-slate-100 hover:ring-4 ring-amber-500/30 transition-all shadow-md hover:shadow-xl"
                                        >
                                            <img src={img.thumbnail} alt={img.photographer} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                                <p className="text-[8px] font-black text-white uppercase tracking-widest truncate">By {img.photographer}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-20 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Search className="text-slate-300" size={32} />
                                            </div>
                                            <p className="text-slate-400 font-bold">Search for topics like "{data.topic}"</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SlideRenderer({ slide, index, isPrint, onUpdate, onSearchImage, ...props }: {
    slide: Slide;
    index: number;
    isPrint: boolean;
    onUpdate?: (updates: Partial<Slide>) => void;
    onSearchImage?: () => void;
    [key: string]: unknown;
}) {
    return (
        <div className="w-full h-full bg-[#0F172A] text-white relative flex flex-col overflow-hidden" {...props}>
            {/* Background Decorative Accents */}
            <div className="absolute top-0 right-0 w-[45%] h-full bg-gradient-to-l from-slate-800/20 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] z-20"></div>

            <div className="flex-1 p-16 lg:p-24 relative z-10 flex flex-col justify-center">
                {/* Header Section */}
                <div className="mb-10 lg:mb-16">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="text-6xl lg:text-7xl select-none filter drop-shadow-lg">
                            {onUpdate && !isPrint ? (
                                <input
                                    value={slide.icon || '📌'}
                                    onChange={(e) => onUpdate({ icon: e.target.value })}
                                    className="bg-transparent w-20 outline-none text-center cursor-edit"
                                    title="Click to edit emoji"
                                />
                            ) : (
                                <span>{slide.icon || '📌'}</span>
                            )}
                        </div>
                        <div className="h-14 w-1.5 bg-amber-500 rounded-full"></div>
                    </div>

                    {onUpdate && !isPrint ? (
                        <textarea
                            value={slide.title}
                            onChange={(e) => onUpdate({ title: e.target.value })}
                            className="bg-transparent text-5xl lg:text-6xl font-black text-white w-full outline-none border-b-2 border-transparent focus:border-amber-500 transition-all px-0 resize-none leading-tight"
                            rows={1}
                        />
                    ) : (
                        <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">{slide.title}</h2>
                    )}
                </div>

                {/* Content Grid - FIXED OVERLAP HERE */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    {/* Left Column: Bullets */}
                    <div className="lg:col-span-7 space-y-6 lg:space-y-10">
                        {slide.content.map((point, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mt-3.5 shrink-0 group-hover:scale-150 transition-transform"></div>
                                {onUpdate && !isPrint ? (
                                    <textarea
                                        value={point}
                                        onChange={(e) => {
                                            const newContent = [...slide.content];
                                            newContent[i] = e.target.value;
                                            onUpdate({ content: newContent });
                                        }}
                                        className="bg-slate-800/20 hover:bg-slate-800/40 p-4 rounded-xl text-lg lg:text-xl font-medium text-slate-300 w-full outline-none resize-none border-l-4 border-transparent focus:border-amber-500 transition-all leading-relaxed"
                                        rows={2}
                                    />
                                ) : (
                                    <p className="text-lg lg:text-xl font-medium text-slate-300 leading-relaxed">{point}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Media */}
                    <div className="lg:col-span-5 aspect-video lg:aspect-[4/3] relative bg-slate-900/50 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center p-1 group/img shadow-3xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none z-10"></div>

                        {slide.image_url ? (
                            <>
                                <img src={slide.image_url} alt="Slide Visual" className="w-full h-full object-cover rounded-2xl group-hover/img:scale-105 transition-transform duration-1000" />
                                {onUpdate && !isPrint && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                                        <button
                                            onClick={() => onUpdate({ image_url: undefined })}
                                            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-xl"
                                            title="Remove Image"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <button
                                            onClick={onSearchImage}
                                            className="p-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all shadow-xl"
                                            title="Change Image"
                                        >
                                            <ImageIcon size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                                    <ImageIcon size={32} className="text-slate-600" />
                                </div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">Add Professional Visualization</p>
                                {onUpdate && !isPrint && (
                                    <button
                                        onClick={onSearchImage}
                                        className="mt-4 px-6 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg text-xs font-black transition-all"
                                    >
                                        SELECT MEDIA
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Accent */}
            <div className="px-16 lg:px-24 py-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-t border-white/5 bg-slate-950/40 relative z-20">
                <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded bg-amber-500 flex items-center justify-center text-[8px] text-navy-950 font-black">S</div>
                    <span className="opacity-60">Somlearn Learning Deck // {slide.title}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-slate-800 tracking-[1em]">|</span>
                    <span className="text-amber-500">MODULE {index + 1}</span>
                </div>
            </div>
        </div>
    );
}

// No ToolbarButton needed for now

