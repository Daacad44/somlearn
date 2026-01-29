import React, { useState, useEffect } from 'react';
import { Layout, Play, FileText, Image as ImageIcon, BarChart, Trash2, ExternalLink, Plus, Clock, Search, Menu, X, Settings, Key, Sparkles } from 'lucide-react';
import PresentationEditor from './PresentationEditor';
import GenerationOverlay from './GenerationOverlay';
import TemplatesPage from './TemplatesPage';
import { storageService } from '../services/storageService';
import type { Presentation, AnalyticsData } from '../types/index';
import type { Template } from '../data/templates';

type View = 'dashboard' | 'my-presentations' | 'analytics' | 'templates' | 'settings';

export default function Dashboard() {
    const [view, setView] = useState<View>('dashboard');
    const [topic, setTopic] = useState('');
    const [slideCount, setSlideCount] = useState(10);
    const [style, setStyle] = useState('Professional');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState<Presentation | null>(null);
    const [myPresentations, setMyPresentations] = useState<Presentation[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userApiKey, setUserApiKey] = useState(localStorage.getItem('somlearn_gemini_key') || '');

    // Load initial data
    useEffect(() => {
        setMyPresentations(storageService.getAllPresentations());
        setAnalytics(storageService.getAnalytics());
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);
    };

    const handleGenerationComplete = async () => {
        try {
            const { generatePresentationContent, enhanceSlidesWithImages } = await import('../services/aiService');
            const { searchImages } = await import('../services/imageService');

            const aiResponse = await generatePresentationContent({
                topic,
                slideCount,
                style,
                template: selectedTemplate?.id
            });

            const enhancedSlides = await enhanceSlidesWithImages(aiResponse.slides, searchImages);

            const newPresentation: Presentation = {
                id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
                topic: aiResponse.topic,
                slides: enhancedSlides,
                style,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                templateId: selectedTemplate?.id
            };

            // PERSISTENCE: Save to "Database"
            storageService.savePresentation(newPresentation);

            // Update local state
            setMyPresentations(storageService.getAllPresentations());
            setAnalytics(storageService.getAnalytics());
            setGeneratedData(newPresentation);
        } catch (error: unknown) {
            console.error('Generation Failed:', error);
            const err = error as { message?: string };
            const errorMsg = err.message || "Unknown error";
            alert(`AI Architect encountered an issue: ${errorMsg}\n\nPlease verify your API key and try again.`);
        } finally {
            setIsGenerating(false);
        }
    };

    const deletePresentation = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this presentation?')) {
            storageService.deletePresentation(id);
            setMyPresentations(storageService.getAllPresentations());
            setAnalytics(storageService.getAnalytics());
        }
    };

    const openPresentation = (pres: Presentation) => {
        setGeneratedData(pres);
    };

    if (generatedData) {
        return <PresentationEditor data={generatedData} onBack={() => setGeneratedData(null)} />;
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {isGenerating && <GenerationOverlay onComplete={handleGenerationComplete} />}

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-72 bg-[#0F172A] text-white flex flex-col shrink-0 transition-transform duration-300 lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                relative overflow-hidden shadow-2xl
            `}>
                <div className="p-8 relative z-10 flex items-center justify-between">
                    <h1 className="text-2xl font-black flex items-center gap-3 tracking-tighter">
                        <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="text-navy-950 text-xl font-black">S</span>
                        </div>
                        Somlearn
                    </h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 relative z-10">
                    <NavItem
                        icon={<Play size={18} />}
                        label="New Deck"
                        active={view === 'dashboard'}
                        onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={<FileText size={18} />}
                        label="My Library"
                        active={view === 'my-presentations'}
                        onClick={() => { setView('my-presentations'); setIsSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={<ImageIcon size={18} />}
                        label="Templates"
                        active={view === 'templates'}
                        onClick={() => { setView('templates'); setIsSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={<BarChart size={18} />}
                        label="Analytics"
                        active={view === 'analytics'}
                        onClick={() => { setView('analytics'); setIsSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={<Settings size={18} />}
                        label="Settings"
                        active={view === 'settings'}
                        onClick={() => { setView('settings'); setIsSidebarOpen(false); }}
                    />
                </nav>

                <div className="p-6 mt-auto border-t border-white/5 bg-navy-950/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-sm">JD</div>
                        <div>
                            <p className="text-xs font-bold text-white">John Doe</p>
                            <p className="text-[10px] text-slate-500 font-medium">Enterprise Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto flex flex-col relative">
                <header className="h-16 flex items-center justify-between px-6 lg:px-10 bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xs lg:text-sm font-bold uppercase tracking-widest text-slate-400">
                            {view === 'dashboard' ? 'Creation Lab' :
                                view === 'my-presentations' ? 'Presentation Library' :
                                    view === 'analytics' ? 'Performance Insights' : 'Template Gallery'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-all">Support</button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-6xl mx-auto w-full">
                    {view === 'dashboard' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="mb-8 lg:mb-12">
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Transform ideas into slides.</h2>
                                <p className="text-slate-500 text-base lg:text-lg">Input a topic and let our AI consultant handle the narrative.</p>
                            </div>

                            <div className="bg-white rounded-[24px] lg:rounded-[32px] shadow-2xl shadow-slate-200/50 p-6 lg:p-10 border border-slate-100">
                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 block mb-4">Core Topic</label>
                                        <input
                                            type="text"
                                            className="w-full text-lg lg:text-2xl p-4 lg:p-6 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-amber-500/10 outline-none placeholder:text-slate-300 font-bold text-slate-900"
                                            placeholder="The impact of zero-knowledge proofs on privacy..."
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Presentation Depth</label>
                                            <div className="flex gap-2">
                                                {[5, 10, 15].map(cnt => (
                                                    <button
                                                        key={cnt}
                                                        onClick={() => setSlideCount(cnt)}
                                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${slideCount === cnt ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                    >
                                                        {cnt} Slides
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tone & Style</label>
                                            <div className="flex gap-2">
                                                {['Professional', 'Futuristic', 'Executive'].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setStyle(s)}
                                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${style === s ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={!topic || isGenerating}
                                        onClick={handleGenerate}
                                        className="w-full h-20 bg-slate-900 text-white rounded-3xl text-xl font-black shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <Play fill="white" size={24} className="group-hover:scale-110 transition-transform" />
                                        Launch AI Architect
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'my-presentations' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-3xl font-black tracking-tight">Your Presentations</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="text" placeholder="Search decks..." className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm" />
                                </div>
                            </div>

                            {myPresentations.length === 0 ? (
                                <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Plus className="text-slate-400" size={32} />
                                    </div>
                                    <p className="text-slate-500 font-bold">No presentations yet.</p>
                                    <button onClick={() => setView('dashboard')} className="mt-4 text-amber-600 font-bold text-sm hover:underline">Start Creating</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {myPresentations.map((pres: Presentation) => (
                                        <div
                                            key={pres.id}
                                            onClick={() => openPresentation(pres)}
                                            className="group bg-white rounded-[24px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-sm"
                                        >
                                            <div className="h-44 bg-slate-900 relative p-6 flex flex-col justify-end">
                                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={(e) => deletePresentation(pres.id, e)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
                                                <h4 className="text-white font-black text-xl leading-tight line-clamp-2">{pres.topic}</h4>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-4 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(pres.createdAt).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1"><Layout size={12} /> {pres.slides.length} Slides</span>
                                                </div>
                                                <button className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-black uppercase hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                                    Edit Presentation <ExternalLink size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'analytics' && analytics && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500 space-y-10">
                            <h3 className="text-3xl font-black tracking-tight">System Performance</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <StatCard label="Total Decks" value={analytics.totalPresentations} sub="Generated by AI" />
                                <StatCard label="Slides Authored" value={analytics.totalSlides} sub="Professional insights" />
                                <StatCard label="Total Exports" value={analytics.totalExports} sub="PDF & PPTX" />
                            </div>

                            <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
                                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <Clock size={20} className="text-amber-500" />
                                    Usage Trends
                                </h4>
                                <div className="h-48 flex items-end gap-2 px-4">
                                    {[20, 45, 30, 60, 45, 80, 50, 90, 40].map((h, i) => (
                                        <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group transition-all hover:bg-amber-500">
                                            <div className="absolute bottom-0 w-full bg-slate-200 rounded-t-lg transition-all group-hover:bg-amber-600" style={{ height: `${h}%` }}></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-4 text-[10px] font-black uppercase text-slate-400">
                                    <span>Jan 18</span>
                                    <span>Jan 26</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'templates' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500">
                            <TemplatesPage onSelectTemplate={(t) => { setSelectedTemplate(t); setView('dashboard'); }} onBack={() => setView('dashboard')} />
                        </div>
                    )}

                    {view === 'settings' && (
                        <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
                            <div className="mb-10">
                                <h3 className="text-3xl font-black tracking-tight mb-2">Architect Settings</h3>
                                <p className="text-slate-500">Configure your professional workspace and AI credentials.</p>
                            </div>

                            <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-slate-100 shadow-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Key size={16} className="text-amber-500" />
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Google Gemini API Key</label>
                                        </div>
                                        <input
                                            type="password"
                                            className="w-full text-lg p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-amber-500/10 outline-none placeholder:text-slate-300 font-mono"
                                            placeholder="Paste your AIzaSy... key here"
                                            value={userApiKey}
                                            onChange={(e) => setUserApiKey(e.target.value)}
                                        />
                                        <p className="mt-4 text-[11px] text-slate-400 leading-relaxed">
                                            This key is stored <span className="text-navy-950 font-bold">locally in your browser</span> and is never sent to our servers. Missing an environment key? Paste your own to unlock the AI Architect.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            localStorage.setItem('somlearn_gemini_key', userApiKey);
                                            alert('Configuration Synchronized! Your API key has been securely saved.');
                                        }}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                                    >
                                        Save Configuration
                                    </button>
                                </div>
                            </div>

                            <div className="mt-12 p-8 rounded-[32px] bg-amber-50 border border-amber-100">
                                <h4 className="text-sm font-black uppercase tracking-widest text-amber-900 mb-4 flex items-center gap-2">
                                    <Sparkles size={16} /> Beta Notice
                                </h4>
                                <p className="text-xs text-amber-800/70 font-medium leading-loose">
                                    You are using Somlearn v2.1 Alpha. All generations are currently optimized for Gemini 2.5 Flash. Professional templates and custom styles are automatically applied based on your selections.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main >
        </div >
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group ${active
                ? 'bg-amber-500 text-navy-950 font-black shadow-xl'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}>
            <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
            <span className="text-sm tracking-tight">{label}</span>
        </button>
    );
}

function StatCard({ label, value, sub }: { label: string, value: string | number, sub: string }) {
    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
            <h4 className="text-4xl font-black text-slate-900 mb-1">{value}</h4>
            <p className="text-xs text-slate-500 font-medium">{sub}</p>
        </div>
    );
}
