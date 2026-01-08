import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";

// Declare globals loaded via CDN
declare const html2canvas: any;
declare const JSZip: any;
declare const saveAs: any;

// --- ICONS (Lucide Components) ---
const IconDownload = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const IconTerminal = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
);
const IconPlus = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconTrash = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"/></svg>
);
const IconCheck = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>
);
const IconChevronLeft = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6"/></svg>
);
const IconChevronRight = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
const IconSparkles = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const IconSmartphone = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);
const IconLayout = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
);

// --- CONSTANTS ---
const FORMATS = {
    carousel: { width: 1080, height: 1350, label: 'POST 4:5', aspectRatio: "4:5" },
    story: { width: 1080, height: 1920, label: 'STORY 9:16', aspectRatio: "9:16" }
};

const INITIAL_SLIDES = [
    {
        "type": "cover",
        "title": "NEURO.OS",
        "subtitle": "Medical + Dev Persona Architecture",
        "highlight": "Neuro-Business, IA & WebApps"
    },
    {
        "type": "content",
        "title": "VISUAL IDENTITY",
        "body": "Transitioning from Cyberpunk Gaming to Sterile Laboratory aesthetics.\n\n• Void Black (#030305)\n• Surgical Green (#00FF9D)\n• Med Blue (#3B82F6)",
        "highlight": "STERILE_UI"
    },
    {
        "type": "checklist",
        "title": "SYSTEM CHECK",
        "body": "• Remove Neon Purple (Gaming)\n• Remove Acid Yellow (Hazard)\n• Apply Clinical Cold Tones\n• Enforce Strict Data Layout"
    },
    {
        "type": "story-digest",
        "title": "DEV DIAGNOSIS",
        "subtitle": "Optimized for High-Authority Content",
        "body": "• Clean Code\n• Data Integrity\n• Precise Rendering",
        "highlight": "BIO.METRICS",
        "buttonText": "VIEW_LOGS"
    },
    {
        "type": "big-number",
        "title": "PRECISION",
        "number": "99.9%",
        "description": "Accuracy in data visualization and export quality."
    },
    {
        "type": "cta",
        "title": "READY?",
        "subtitle": "Initialize the neuro-imaging sequence.",
        "buttonText": "SCAN_NOW"
    }
];

// --- HELPERS ---
const normalizeType = (rawType: string) => {
    if (!rawType) return 'content';
    const t = rawType.toLowerCase().trim();
    if (['intro', 'header', 'title', 'cover', 'front'].includes(t)) return 'cover';
    if (['visual', 'focus', 'stat', 'number', 'big-number', 'data', 'metric'].includes(t)) return 'big-number';
    if (['steps', 'check', 'todo', 'checklist', 'list', 'process', 'bullet'].includes(t)) return 'checklist';
    if (['conclusion', 'end', 'out', 'social', 'cta', 'call-to-action', 'final'].includes(t)) return 'cta';
    if (['story', 'digest', 'vertical', 'news', 'update', 'story-digest', 'single'].includes(t)) return 'story-digest';
    return 'content';
};

const formatDisplayText = (text: string) => {
    if (!text) return "";
    return text
        .replace(/([^\n])\s+(\d+\.)\s/g, '$1\n$2 ') 
        .replace(/([^\n])\s+([•\-\*])\s/g, '$1\n$2 ')
        .replace(/(\.)\s+([A-Z])/g, '$1\n$2');
};

// --- SLIDE RENDERER ---
const SlideRenderer = ({ data, width, height }: { data: any, width: string, height: string }) => {
    const safeType = normalizeType(data.type);
    
    const containerStyle: React.CSSProperties = {
        width: width,
        height: height,
        background: '#030305',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    const BackgroundSystem = () => {
        return (
            <div className="absolute inset-0 pointer-events-none z-0 bg-[#030305]">
                {data.image && (
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={data.image} 
                            className="w-full h-full object-cover opacity-40 filter brightness-75 contrast-125 saturate-0" 
                            alt="Background"
                        />
                        <div className="absolute inset-0 bg-[#030305]/60"></div>
                    </div>
                )}
                <div className="absolute inset-0 bg-tech-grid bg-[length:50px_50px] opacity-20"></div>
                <div className="absolute -top-[10%] -right-[10%] w-[900px] h-[900px] bg-gradient-radial from-neonCyan/10 to-transparent opacity-100"></div>
                <div className="absolute -bottom-[10%] -left-[10%] w-[900px] h-[900px] bg-gradient-radial from-medBlue/10 to-transparent opacity-100"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_100%)] opacity-80"></div>
            </div>
        );
    };

    const HUD = () => (
        <div className="absolute inset-0 pointer-events-none z-10 p-12 flex flex-col justify-between">
            <div className="flex justify-between items-center opacity-60">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neonCyan"></div>
                    <span className="font-mono text-xs tracking-[0.3em] text-neonCyan">BIO.METRICS</span>
                </div>
                <div className="h-[1px] flex-grow bg-white/10 mx-6"></div>
            </div>
            <div className="absolute top-12 left-12 w-4 h-4 border-t border-l border-white/30"></div>
            <div className="absolute top-12 right-12 w-4 h-4 border-t border-r border-white/30"></div>
            <div className="absolute bottom-12 left-12 w-4 h-4 border-b border-l border-white/30"></div>
            <div className="absolute bottom-12 right-12 w-4 h-4 border-b border-r border-white/30"></div>
            <div className="flex justify-end items-end opacity-60">
                 <div className="flex flex-col items-end gap-1">
                     <div className="flex gap-1">
                         <div className="w-1 h-3 bg-medBlue"></div>
                         <div className="w-1 h-4 bg-medBlue/50"></div>
                         <div className="w-1 h-2 bg-medBlue/20"></div>
                     </div>
                     <span className="font-orbitron text-xs tracking-widest text-white">FREITAS.LAB</span>
                 </div>
            </div>
        </div>
    );

    const getListItems = () => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) return data.items;
        const text = data.body || "";
        return formatDisplayText(text).split('\n').filter(line => line.trim().length > 0);
    };

    const renderContent = () => {
        switch (safeType) {
            case 'cover':
                return (
                    <div className="relative z-20 flex flex-col items-center justify-center h-full px-20 text-center">
                        <div className="mb-12 px-6 py-2 border border-neonCyan/20 bg-neonCyan/5">
                            <span className="text-neonCyan font-mono tracking-[0.4em] text-sm uppercase">
                                {data.highlight || 'SYSTEM.READY'}
                            </span>
                        </div>
                        <h1 className="text-8xl font-black font-orbitron text-white leading-[0.9] mb-12 uppercase tracking-tighter mix-blend-normal">
                            {data.title}
                        </h1>
                        <div className="w-24 h-1 bg-medBlue mb-12"></div>
                        <p className="text-2xl text-gray-300 font-inter font-light max-w-4xl leading-relaxed render-text whitespace-pre-line">
                            {formatDisplayText(data.subtitle || data.body)}
                        </p>
                    </div>
                );

            case 'content':
                return (
                    <div className="relative z-20 flex flex-col justify-center h-full px-16">
                        <div className="border-l-4 border-neonCyan pl-10 mb-16">
                            <h2 className="text-6xl font-bold text-white font-orbitron leading-none uppercase tracking-tight">
                                {data.title}
                            </h2>
                        </div>
                        <div className="bg-[#111116] border border-white/10 p-12 relative group backdrop-blur-sm bg-opacity-80">
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neonCyan/50"></div>
                            <div className="absolute -left-1 top-10 w-1 h-12 bg-medBlue"></div>
                            <p className="text-[2.5rem] text-gray-100 font-inter leading-[1.4] font-light render-text text-left whitespace-pre-line">
                                {formatDisplayText(data.body || data.text)}
                            </p>
                        </div>
                        {data.highlight && (
                            <div className="mt-12 inline-flex items-center gap-4 bg-white/5 px-8 py-4 border-l-2 border-surgicalGreen self-start">
                                <span className="text-surgicalGreen font-mono text-xl tracking-widest uppercase font-bold">{data.highlight}</span>
                            </div>
                        )}
                    </div>
                );

            case 'story-digest':
                const listItems = getListItems();
                return (
                    <div className="relative z-20 flex flex-col h-full px-12 pt-28 pb-20">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neonCyan via-medBlue to-neonCyan opacity-50"></div>
                        <div className="mb-10 relative">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-neonCyan/10 border border-neonCyan/30 backdrop-blur-md px-4 py-1 text-sm font-mono tracking-widest text-neonCyan uppercase font-bold">
                                    {data.highlight || 'DIAGNOSIS'}
                                </span>
                                <div className="h-[1px] flex-grow bg-white/10"></div>
                            </div>
                            <h2 className="text-[4.5rem] font-black font-orbitron text-white leading-[0.9] uppercase tracking-tighter mb-8 break-words">
                                {data.title}
                            </h2>
                            {data.subtitle && (
                                <div className="border-l-4 border-medBlue pl-6 py-2">
                                    <p className="text-2xl text-gray-200 font-inter font-light leading-snug whitespace-pre-line">
                                        {formatDisplayText(data.subtitle)}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow flex flex-col gap-5 overflow-hidden justify-center pb-8">
                            {listItems.map((item: string, idx: number) => (
                                <div key={idx} className="relative group">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 group-hover:bg-neonCyan transition-colors"></div>
                                    <div className="bg-[#111] border border-white/10 p-6 pl-8 hover:bg-white/5 transition-colors">
                                        <p className="text-xl font-inter text-gray-100 font-normal leading-snug">
                                            {item.replace(/^[•\-\*]\s*/, '')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4">
                            <p className="font-orbitron font-bold text-lg text-white tracking-[0.3em] uppercase">
                                {data.buttonText || 'VIEW FULL REPORT'}
                            </p>
                            <div className="animate-bounce text-neonCyan">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 15l7-7 7 7"/></svg>
                            </div>
                        </div>
                    </div>
                );

            case 'big-number':
                const numContent = data.number || data.highlight || '';
                let fontSizeClass = 'text-[20rem]';
                if (numContent.length > 2) fontSizeClass = 'text-[14rem]';
                if (numContent.length > 4) fontSizeClass = 'text-[10rem]';

                return (
                    <div className="relative z-20 flex flex-col items-center justify-center h-full px-16 text-center">
                        <h2 className="text-3xl font-mono text-neonCyan mb-12 uppercase tracking-[0.3em] z-20">
                            {data.title}
                        </h2>
                        <div className="relative flex flex-col items-center justify-center mb-10 w-full">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full pointer-events-none"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-dashed border-white/10 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none"></div>
                            <span 
                                className={`relative font-black font-orbitron text-white z-10 block ${fontSizeClass}`} 
                                style={{ 
                                    lineHeight: '1.1',
                                    textShadow: '0 0 80px rgba(6, 182, 212, 0.2)',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {numContent}
                            </span>
                        </div>
                        <p className="text-3xl text-gray-300 font-inter font-light max-w-3xl leading-relaxed z-20 whitespace-pre-line">
                            {formatDisplayText(data.description || data.body)}
                        </p>
                    </div>
                );

            case 'checklist':
                const items = getListItems();
                return (
                    <div className="relative z-20 flex flex-col justify-center h-full px-16 pt-20">
                        <h2 className="text-6xl font-orbitron text-white mb-20 font-bold uppercase tracking-wider flex items-center gap-6">
                            <div className="w-16 h-2 bg-medBlue"></div>
                            {data.title || 'Checklist'}
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {items.map((item: string, idx: number) => {
                                const numMatch = item.match(/^(\d+)[\.\)\-]\s*(.*)/);
                                const isNumbered = !!numMatch;
                                const number = isNumbered ? numMatch![1] : null;
                                const text = isNumbered ? numMatch![2] : item.replace(/^[•\-\*]\s*/, '');
                                return (
                                    <div key={idx} className="flex items-start gap-6 p-6 bg-white/5 border border-white/5 hover:border-neonCyan/30 transition-colors backdrop-blur-sm group">
                                        <div className="flex-shrink-0 mt-1">
                                            {isNumbered ? (
                                                <div className="w-12 h-12 bg-neonCyan/0 border-2 border-neonCyan/40 group-hover:border-neonCyan group-hover:bg-neonCyan group-hover:text-black text-neonCyan flex items-center justify-center font-mono font-bold text-xl transition-all">
                                                    {String(number).padStart(2, '0')}
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-neonCyan/10 border border-neonCyan flex items-center justify-center">
                                                    <IconCheck className="text-neonCyan w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-3xl font-inter text-gray-100 font-light leading-snug pt-1">{text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'cta':
                return (
                    <div className="relative z-20 flex flex-col items-center justify-center h-full px-16 text-center">
                        <div className="relative mb-24 group">
                            <div className="absolute -inset-4 border border-white/10"></div>
                            <div className="absolute -inset-4 border-t border-l border-neonCyan w-16 h-16"></div>
                            <div className="absolute -inset-4 border-b border-r border-medBlue w-16 h-16 bottom-0 right-0 top-auto left-auto"></div>
                            <div className="relative w-[450px] h-[450px] overflow-hidden bg-black filter grayscale hover:grayscale-0 transition-all duration-700">
                                {data.image && (
                                    <img 
                                        src={data.image} 
                                        className="w-full h-full object-cover" 
                                        style={{ objectPosition: 'center 20%' }}
                                        alt="CTA" 
                                    />
                                )}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>
                            </div>
                        </div>
                        <h2 className="text-7xl font-orbitron text-white mb-8 font-black uppercase tracking-tight">
                            {data.title}
                        </h2>
                        <p className="text-3xl text-gray-400 font-inter mb-20 max-w-2xl leading-relaxed font-light whitespace-pre-line">
                            {formatDisplayText(data.subtitle || data.body)}
                        </p>
                        <div className="relative">
                            <div className="bg-white text-black px-24 py-8 font-black text-4xl font-orbitron tracking-[0.2em] uppercase clip-path-polygon cursor-pointer hover:bg-neonCyan transition-colors">
                                {data.buttonText || data.highlight || 'SCAN_NOW'}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={containerStyle}>
            <BackgroundSystem />
            <HUD />
            {renderContent()}
        </div>
    );
};

// --- SCALED PREVIEW ---
const ScaledPreview = ({ slide, format }: { slide: any, format: 'carousel' | 'story' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.25);
    const targetWidth = FORMATS[format].width;
    const targetHeight = FORMATS[format].height;

    useLayoutEffect(() => {
        const updateScale = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                const scaleX = (width * 0.9) / targetWidth;
                const scaleY = (height * 0.9) / targetHeight;
                setScale(Math.min(scaleX, scaleY));
            }
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [targetWidth, targetHeight]);

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden relative bg-[#010101] tech-grid-bg">
            <div style={{ width: `${targetWidth}px`, height: `${targetHeight}px`, transform: `scale(${scale})`, transformOrigin: 'center center', boxShadow: '0 0 100px rgba(0,0,0,1)', border: '1px solid #333' }}>
                <SlideRenderer data={slide} width={`${targetWidth}px`} height={`${targetHeight}px`} />
            </div>
        </div>
    );
};

// --- EDITOR FORM ---
const EditorForm = ({ slide, onChange, onGenerateTexture, isGenerating }: any) => {
    const safeType = normalizeType(slide.type);

    const handleChange = (field: string, value: string) => {
        onChange({ ...slide, [field]: value });
    };

    const InputField = ({ label, field, value, placeholder }: any) => (
        <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{label}</label>
            <input 
                type="text" 
                value={value || ''} 
                onChange={(e) => handleChange(field, e.target.value)} 
                className="w-full bg-[#111] border border-white/10 rounded-none p-3 text-white focus:border-neonCyan transition-colors font-inter text-sm" 
                placeholder={placeholder || "..."} 
            />
        </div>
    );

    const TextAreaField = ({ label, field, value, placeholder, rows = 4 }: any) => (
        <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{label}</label>
            <textarea 
                rows={rows} 
                value={value || ''} 
                onChange={(e) => handleChange(field, e.target.value)} 
                className="w-full bg-[#111] border border-white/10 rounded-none p-3 text-white focus:border-neonCyan transition-colors font-inter text-sm leading-relaxed" 
                placeholder={placeholder || "..."} 
            />
        </div>
    );

    return (
        <div className="flex flex-col gap-6 p-1">
            <div className="space-y-2">
                <label className="text-[10px] text-neonCyan font-mono tracking-widest uppercase">
                    Slide Type
                </label>
                <select 
                    value={safeType} 
                    onChange={(e) => handleChange('type', e.target.value)} 
                    className="w-full bg-[#111] border border-white/10 rounded-none p-3 text-white focus:border-neonCyan transition-colors font-mono text-sm"
                >
                    <option value="cover">COVER (INTRO)</option>
                    <option value="content">CONTENT (TEXT)</option>
                    <option value="story-digest">STORY DIGEST (EXCLUSIVE)</option>
                    <option value="big-number">BIG NUMBER (STAT)</option>
                    <option value="checklist">CHECKLIST (LIST)</option>
                    <option value="cta">CTA (OUTRO)</option>
                </select>
            </div>
            
            <InputField label="Title" field="title" value={slide.title} placeholder="Main Headline" />

            {safeType === 'cover' && (
                <>
                    <TextAreaField label="Subtitle" field="subtitle" value={slide.subtitle} placeholder="Introductory text or subtitle..." />
                    <InputField label="Highlight / Tag" field="highlight" value={slide.highlight} placeholder="e.g. 2024 EDITION" />
                </>
            )}

            {safeType === 'content' && (
                <>
                    <TextAreaField label="Body Text" field="body" value={slide.body} placeholder="Main content paragraph..." />
                    <InputField label="Highlight Box" field="highlight" value={slide.highlight} placeholder="Key takeaway..." />
                </>
            )}

            {safeType === 'story-digest' && (
                <>
                    <TextAreaField label="Intro / Subtitle" field="subtitle" value={slide.subtitle} placeholder="Context about the topic..." />
                    <TextAreaField label="Key Points" field="body" value={slide.body} placeholder="• Point 1&#10;• Point 2&#10;• Point 3" />
                    <InputField label="Top Tag" field="highlight" value={slide.highlight} placeholder="e.g. NEW FEATURE" />
                    <InputField label="Bottom CTA" field="buttonText" value={slide.buttonText} placeholder="VIEW FULL REPORT" />
                </>
            )}
            
            {safeType === 'big-number' && (
                <>
                    <InputField label="Number / Stat" field="number" value={slide.number} placeholder="99%" />
                    <TextAreaField label="Description" field="description" value={slide.description} placeholder="Explanation of the statistic..." />
                </>
            )}

            {safeType === 'checklist' && (
                <TextAreaField label="List Items" field="body" value={slide.body} placeholder="1. Step one&#10;2. Step two" />
            )}

            {safeType === 'cta' && (
                <>
                    <TextAreaField label="Subtitle" field="subtitle" value={slide.subtitle} placeholder="Closing statement..." />
                    <InputField label="Button Text" field="buttonText" value={slide.buttonText} placeholder="CLICK LINK" />
                </>
            )}

            <div className="space-y-2 pt-4 border-t border-white/5">
                <label className="text-[10px] text-medBlue font-mono tracking-widest uppercase flex items-center gap-2">
                    <IconSparkles size={12} /> Background Image
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={slide.image || ''} 
                        onChange={(e) => handleChange('image', e.target.value)} 
                        className="flex-grow bg-[#111] border border-white/10 rounded-none p-3 text-white focus:border-neonCyan transition-colors font-inter text-xs" 
                        placeholder="Image URL..." 
                    />
                    <button
                        onClick={onGenerateTexture}
                        disabled={isGenerating}
                        className={`px-4 py-2 bg-medBlue/20 border border-medBlue/50 text-medBlue hover:bg-medBlue/30 transition-all ${isGenerating ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {isGenerating ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <IconSparkles size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- APP ---
const App = () => {
    const [slides, setSlides] = useState(INITIAL_SLIDES);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [format, setFormat] = useState<'carousel' | 'story'>('carousel');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // API setup
    const ai = useRef(new GoogleGenAI({ apiKey: process.env.API_KEY })).current;

    const currentSlide = slides[currentSlideIndex];

    const updateSlide = (newSlide: any) => {
        const newSlides = [...slides];
        newSlides[currentSlideIndex] = newSlide;
        setSlides(newSlides);
    };

    const addSlide = () => {
        const newSlide = { type: 'content', title: 'NEW SLIDE', body: 'New content here...' };
        setSlides([...slides, newSlide]);
        setCurrentSlideIndex(slides.length);
    };

    const removeSlide = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        if (slides.length <= 1) return;
        const newSlides = slides.filter((_, i) => i !== index);
        setSlides(newSlides);
        if (currentSlideIndex >= newSlides.length) {
            setCurrentSlideIndex(newSlides.length - 1);
        }
    };

    const generateTexture = async () => {
        if (!process.env.API_KEY) {
            alert("API Key missing");
            return;
        }
        setIsGenerating(true);
        try {
            // Using gemini-2.5-flash-image as per instructions for image tasks
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [{ text: "Abstract medical technology background texture, minimalist, dark mode, void black and neon cyan, high contrast, 4k resolution, sterile, mri scan aesthetic, geometric lines." }]
                },
                config: {
                    imageConfig: {
                         aspectRatio: format === 'story' ? '9:16' : '4:5'
                    }
                }
            });

            // Iterate parts to find the image part
            let imageUrl = null;
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64EncodeString = part.inlineData.data;
                        imageUrl = `data:image/png;base64,${base64EncodeString}`;
                        break;
                    }
                }
            }

            if (imageUrl) {
                updateSlide({ ...currentSlide, image: imageUrl });
            } else {
                console.warn("No image data found in response");
            }
        } catch (error) {
            console.error("Texture generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const exportSlides = async () => {
        const zip = new JSZip();
        const exportContainer = document.getElementById('export-container');
        if (!exportContainer) return;

        exportContainer.style.display = 'block'; // Make visible for capture

        // Create a root for the export renderer
        const exportRoot = createRoot(exportContainer);
        
        // We need to render each slide synchronously for capture, but React is async.
        // Strategy: Render all at once in a grid off-screen.
        const ExportGrid = () => (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)' }}>
                {slides.map((s, i) => (
                    <div key={i} id={`slide-export-${i}`} style={{ width: FORMATS[format].width, height: FORMATS[format].height }}>
                         <SlideRenderer data={s} width={`${FORMATS[format].width}px`} height={`${FORMATS[format].height}px`} />
                    </div>
                ))}
            </div>
        );
        
        exportRoot.render(<ExportGrid />);

        // Wait for render and images
        await new Promise(r => setTimeout(r, 2000));

        for (let i = 0; i < slides.length; i++) {
            const el = document.getElementById(`slide-export-${i}`);
            if (el) {
                const canvas = await html2canvas(el, {
                    scale: 2, // 2x scale for high quality
                    useCORS: true,
                    backgroundColor: '#030305',
                    logging: false
                });
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                zip.file(`neuro_os_slide_${i + 1}.png`, blob);
            }
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "neuro_os_export.zip");
        
        // Cleanup (unmount logic if needed, or just hide)
        exportContainer.style.display = 'none';
        exportRoot.unmount();
    };

    return (
        <div className="flex h-screen w-screen bg-void text-white overflow-hidden font-inter">
            {/* LEFT: SLIDE LIST */}
            <div className="w-64 border-r border-white/5 flex flex-col bg-panel">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <span className="font-orbitron font-bold tracking-widest text-neonCyan">NEURO.OS</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400">V4.2</span>
                </div>
                <div className="flex-grow overflow-y-auto p-2 space-y-2">
                    {slides.map((s, i) => (
                        <div 
                            key={i} 
                            onClick={() => setCurrentSlideIndex(i)}
                            className={`group relative p-3 border cursor-pointer transition-all hover:bg-white/5 ${i === currentSlideIndex ? 'border-neonCyan bg-white/5' : 'border-white/5'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-mono text-gray-500">SLIDE {String(i + 1).padStart(2, '0')}</span>
                                {slides.length > 1 && (
                                    <button 
                                        onClick={(e) => removeSlide(e, i)}
                                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity"
                                    >
                                        <IconTrash size={12} />
                                    </button>
                                )}
                            </div>
                            <div className="font-bold text-xs text-white truncate font-orbitron">{s.title || 'Untitled'}</div>
                            <div className="text-[10px] text-gray-500 truncate">{s.type.toUpperCase()}</div>
                        </div>
                    ))}
                    <button 
                        onClick={addSlide}
                        className="w-full py-3 border border-dashed border-white/20 text-gray-500 hover:text-neonCyan hover:border-neonCyan transition-all flex items-center justify-center gap-2 text-xs tracking-widest"
                    >
                        <IconPlus size={14} /> ADD SYSTEM NODE
                    </button>
                </div>
                <div className="p-4 border-t border-white/5 bg-[#050505]">
                    <div className="flex gap-1 bg-[#111] p-1 border border-white/10">
                        <button 
                            onClick={() => setFormat('carousel')}
                            className={`flex-1 py-1 text-[10px] font-mono text-center transition-colors ${format === 'carousel' ? 'bg-medBlue text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            4:5
                        </button>
                        <button 
                            onClick={() => setFormat('story')}
                            className={`flex-1 py-1 text-[10px] font-mono text-center transition-colors ${format === 'story' ? 'bg-medBlue text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                            9:16
                        </button>
                    </div>
                </div>
            </div>

            {/* MIDDLE: PREVIEW */}
            <div className="flex-grow flex flex-col relative bg-[#010101]">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-black/50 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full">
                    <button disabled={currentSlideIndex === 0} onClick={() => setCurrentSlideIndex(c => c - 1)} className="text-white hover:text-neonCyan disabled:opacity-30 transition-colors"><IconChevronLeft /></button>
                    <span className="font-mono text-xs text-neonCyan tracking-[0.2em]">{currentSlideIndex + 1} / {slides.length}</span>
                    <button disabled={currentSlideIndex === slides.length - 1} onClick={() => setCurrentSlideIndex(c => c + 1)} className="text-white hover:text-neonCyan disabled:opacity-30 transition-colors"><IconChevronRight /></button>
                </div>

                <div className="flex-grow overflow-hidden p-8">
                    <ScaledPreview slide={currentSlide} format={format} />
                </div>

                <div className="h-16 border-t border-white/5 bg-panel flex items-center justify-between px-6">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
                        <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                        {isGenerating ? 'NEURAL ENGINE BUSY...' : 'SYSTEM READY'}
                    </div>
                    <button 
                        onClick={exportSlides}
                        className="bg-neonCyan text-black font-bold font-orbitron text-sm px-6 py-2 hover:bg-white transition-colors flex items-center gap-2"
                    >
                        <IconDownload size={16} /> EXPORT SEQUENCE
                    </button>
                </div>
            </div>

            {/* RIGHT: EDITOR */}
            <div className="w-80 border-l border-white/5 bg-panel flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h3 className="font-orbitron font-bold text-sm text-white flex items-center gap-2">
                        <IconTerminal size={16} className="text-medBlue" />
                        NODE EDITOR
                    </h3>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <EditorForm 
                        slide={currentSlide} 
                        onChange={updateSlide} 
                        onGenerateTexture={generateTexture}
                        isGenerating={isGenerating}
                    />
                </div>
            </div>

            {/* HIDDEN EXPORT CONTAINER */}
            <div id="export-container" style={{ position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -1 }}></div>
        </div>
    );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);