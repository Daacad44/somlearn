import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Brain, PenTool, Layout, CheckCircle2 } from 'lucide-react';

const steps = [
    { icon: Brain, label: 'Strategic Topic Analysis' },
    { icon: PenTool, label: 'Elite Narrative Synthesis' },
    { icon: Layout, label: 'High-Fidelity Slide Engineering' },
    { icon: Sparkles, label: 'Applying Professional Polish' }
];

export default function GenerationOverlay({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= steps.length - 1) {
                    clearInterval(timer);
                    setTimeout(onComplete, 1000);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A] text-white overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] animate-pulse"></div>

            <div className="w-full max-w-xl p-6 md:p-12 relative z-10">
                <div className="mb-8 md:mb-16 text-center">
                    <div className="relative w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 md:mb-8 flex items-center justify-center">
                        <div className="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-4 border-r-2 border-slate-500 rounded-full animate-spin-reverse opacity-30"></div>
                        <Sparkles className="text-amber-500 animate-pulse w-8 h-8 md:w-10 md:h-10" size={40} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">Orchestrating Intelligence</h2>
                    <p className="text-slate-500 font-medium uppercase tracking-[0.3em] text-[8px] md:text-[10px]">Somlearn Architect // v2.1 Alpha</p>
                </div>

                <div className="space-y-4">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = idx === currentStep;
                        const isCompleted = idx < currentStep;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`flex items-center gap-6 p-5 rounded-[24px] border transition-all duration-700 ${isActive || isCompleted
                                    ? 'border-amber-500/30 bg-white/5 shadow-2xl shadow-amber-500/5'
                                    : 'border-transparent opacity-10'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-green-500/20 text-green-500' :
                                    isActive ? 'bg-amber-500/20 text-amber-500 scale-110 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-500'
                                    }`}>
                                    {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-xs font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                        Step 0{idx + 1}
                                    </span>
                                    <span className={`text-base font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {isActive && (
                                    <div className="ml-auto w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
