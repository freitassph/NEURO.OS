import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";

// Declare globals loaded via CDN
declare const html2canvas: any;
declare const JSZip: any;
declare const saveAs: any;

// --- ICONS (Lucide Components) ---
const IconDownload = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
const IconTerminal = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
);
const IconPlus = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconTrash = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"/></svg>
);
const IconCheck = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>
);
const IconChevronLeft = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const IconChevronRight = ({ size = 24 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const IconX = ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconZip = ({ size = 20 }) => (
     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const IconSmartphone = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
);
const IconLayout = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
);
const IconSparkles = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const IconCopy = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const IconRefresh = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
);

// --- CONSTANTS ---
const CTA_IMAGE_1 = "https://i.ibb.co/J9yfXbN/IMG-5157.jpg";
const CTA_IMAGE_2 = "https://i.ibb.co/yBSbM35F/Gemini-Generated-Image-jxdl30jxdl30jxdl.png";

const FORMATS = {
    carousel: { width: 1080, height: 1350, label: 'POST 4:5' },
    story: { width: 1080, height: 1920, label: 'STORY 9:16' }
};

// --- SELF HEALING ENGINE ---
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

/**
 * Advanced JSON Interpreter
 */
const smartProcessSlide = (raw: any) => {
    let data = {
        title: raw.title || raw.header || raw.headline || raw.topic || 'Untitled',
        type: raw.type, 
        image: raw.image || raw.bg || raw.background || raw.img,
        highlight: raw.highlight || raw.tag || raw.label || raw.category,
        subtitle: raw.subtitle || raw.intro || raw.caption || raw.sub,
        description: raw.description || raw.desc,
        buttonText: raw.buttonText || raw.cta || raw.action,
        body: "",
        items: [] as string[],
        number: ""
    };

    let rawBody = raw.body || raw.content || raw.text || raw.message || raw.list || raw.items || [];
    
    const splitInlineLists = (text: string) => {
        if (!text) return "";
        return text
            .replace(/([^\n])\s+(\d+\.)\s/g, '$1\n$2 ') 
            .replace(/([^\n])\s+([•\-\*])\s/g, '$1\n$2 ');
    };

    if (Array.isArray(rawBody)) {
        data.items = rawBody;
        data.body = rawBody.join('\n');
    } else if (typeof rawBody === 'string') {
        const formattedBody = splitInlineLists(rawBody);
        data.body = formattedBody;
        const isListLike = /(?:^|\n)(?:\d+\.|[•\-\*])\s/.test(formattedBody);
        if (isListLike) {
            data.items = formattedBody.split('\n').filter(l => l.trim().length > 0);
        }
    } else {
        data.body = "";
    }

    if (raw.number || raw.stat || raw.value || raw.metric) {
        data.number = raw.number || raw.stat || raw.value || raw.metric;
        if (!data.type) data.type = 'big-number'; 
    }

    if (!data.type || data.type === 'slide') {
        if (data.items && data.items.length > 1) {
            data.type = 'checklist';
        } else if (data.number) {
            data.type = 'big-number';
        } else if (data.title && data.subtitle && (!data.body || data.body.length < 50)) {
            data.type = 'cover';
        } else {
            data.type = 'content';
        }
    }
    
    data.type = normalizeType(data.type);
    return data;
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

// --- SLIDE RENDERER ---
const SlideRenderer = ({ data, width, height }: { data: any, width: string, height: string }) => {
    const safeType = normalizeType(data.type);
    
    const containerStyle: React.CSSProperties = {
        width: width || '1080px',
        height: height || '1350px',
        background: '#030305',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    };

    // NEW: Auto-formatting for aesthetics
    const formatDisplayText = (text: string) => {
        if (!text) return "";
        return text
            .replace(/([^\n])\s+(\d+\.)\s/g, '$1\n$2 ') 
            .replace(/([^\n])\s+([•\-\*])\s/g, '$1\n$2 ')
            // Magic Rule: Split sentences (dot followed by space and Capital letter)
            .replace(/(\.)\s+([A-Z])/g, '$1\n$2');
    };

    const BackgroundSystem = () => {
        let bgImage = data.image;
        // Force CTA background default if not set
        if (!bgImage && safeType === 'cta') {
            bgImage = CTA_IMAGE_1;
        }
        
        return (
            <div className="absolute inset-0 pointer-events-none z-0 bg-[#030305]">
                {bgImage && (
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={bgImage} 
                            className="w-full h-full object-cover opacity-40 filter brightness-75 contrast-125 saturate-0 hover:saturate-50 transition-all duration-700" 
                            alt="Background"
                        />
                        <div className="absolute inset-0 bg-[#030305]/60"></div>
                    </div>
                )}
                {/* Fixed: Added specific size to tech-grid for visibility */}
                <div className="absolute inset-0 bg-tech-grid bg-[length:50px_50px] opacity-20"></div>
                <div className="absolute -top-[10%] -right-[10%] w-[900px] h-[900px] bg-gradient-radial from-neonCyan/10 to-transparent opacity-100"></div>
                {/* UPDATED: Purple to Med Blue for Sterile effect */}
                <div className="absolute -bottom-[10%] -left-[10%] w-[900px] h-[900px] bg-gradient-radial from-medBlue/10 to-transparent opacity-100"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_100%)] opacity-80"></div>
            </div>
        );
    };

    const HUD = () => (
        <div className="absolute inset-0 pointer-events-none z-10 p-20 flex flex-col justify-between">
            <div className="flex justify-between items-center opacity-60">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neonCyan"></div>
                    {/* UPDATED TEXT */}
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
                         {/* UPDATED COLORS: Purple -> MedBlue */}
                         <div className="w-1 h-3 bg-medBlue"></div>
                         <div className="w-1 h-4 bg-medBlue/50"></div>
                         <div className="w-1 h-2 bg-medBlue/20"></div>
                     </div>
                     {/* UPDATED TEXT */}
                     <span className="font-orbitron text-xs tracking-widest text-white">FREITAS.LAB</span>
                 </div>
            </div>
        </div>
    );

    const getListItems = () => {
        if (data.items && Array.isArray(data.items) && data.items.length > 0) return data.items;
        const text = data.body || "";
        // Apply formatting before splitting so paragraphs become lists if desired
        return formatDisplayText(text).split('\n').filter(line => line.trim().length > 0);
    };

    const renderContent = () => {
        switch (safeType) {
            case 'cover':
                return (
                    <div className="relative z-20 flex flex-col items-center justify-center h-full px-20 text-center">
                        <div className="mb-12 px-6 py-2 border border-neonCyan/20 bg-neonCyan/5 rounded-none">
                            <span className="text-neonCyan font-mono tracking-[0.4em] text-sm uppercase">
                                {data.highlight || 'SYSTEM.READY'}
                            </span>
                        </div>
                        <h1 className="text-9xl font-black font-orbitron text-white leading-[0.9] mb-12 uppercase tracking-tighter mix-blend-normal">
                            {data.title}
                        </h1>
                        {/* UPDATED: Purple -> MedBlue */}
                        <div className="w-24 h-1 bg-medBlue mb-12"></div>
                        <p className="text-3xl text-gray-300 font-inter font-light max-w-4xl leading-relaxed render-text whitespace-pre-line">
                            {formatDisplayText(data.subtitle || data.body)}
                        </p>
                    </div>
                );

            case 'content':
                return (
                    <div className="relative z-20 flex flex-col justify-center h-full px-24">
                        <div className="border-l-4 border-neonCyan pl-10 mb-16">
                            <h2 className="text-7xl font-bold text-white font-orbitron leading-none uppercase tracking-tight">
                                {data.title}
                            </h2>
                        </div>
                        <div className="bg-[#111116] border border-white/10 p-14 relative group backdrop-blur-sm bg-opacity-80">
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neonCyan/50"></div>
                            {/* UPDATED: Purple -> MedBlue */}
                            <div className="absolute -left-1 top-10 w-1 h-12 bg-medBlue"></div>
                            <p className="text-[3rem] text-gray-100 font-inter leading-[1.4] font-light render-text text-left whitespace-pre-line">
                                {formatDisplayText(data.body || data.text)}
                            </p>
                        </div>
                        {data.highlight && (
                            /* UPDATED: Yellow -> SurgicalGreen */
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
                        {/* UPDATED: Purple -> MedBlue */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neonCyan via-medBlue to-neonCyan opacity-50"></div>
                        <div className="mb-10 relative">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-neonCyan/10 border border-neonCyan/30 backdrop-blur-md px-4 py-1 text-sm font-mono tracking-widest text-neonCyan uppercase font-bold">
                                    {data.highlight || 'DIAGNOSIS'}
                                </span>
                                <div className="h-[1px] flex-grow bg-white/10"></div>
                                <span className="text-sm font-mono text-gray-500 tracking-wider">
                                    LOG.01
                                </span>
                            </div>
                            <h2 className="text-[5.5rem] font-black font-orbitron text-white leading-[0.9] uppercase tracking-tighter mb-8 break-words">
                                {data.title}
                            </h2>
                            {data.subtitle && (
                                /* UPDATED: Purple -> MedBlue */
                                <div className="border-l-4 border-medBlue pl-6 py-2">
                                    <p className="text-3xl text-gray-200 font-inter font-light leading-snug whitespace-pre-line">
                                        {formatDisplayText(data.subtitle)}
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow flex flex-col gap-5 overflow-hidden justify-center pb-8">
                            {listItems.map((item: string, idx: number) => (
                                <div key={idx} className="relative group transform hover:translate-x-2 transition-transform duration-300">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20 group-hover:bg-neonCyan transition-colors"></div>
                                    <div className="bg-[#111] border border-white/10 p-6 pl-8 hover:bg-white/5 transition-colors shadow-lg">
                                        <p className="text-2xl font-inter text-gray-100 font-normal leading-snug">
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
                            <div className="animate-bounce text-neonCyan filter drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 15l7-7 7 7"/></svg>
                            </div>
                        </div>
                    </div>
                );

            case 'big-number':
                const numContent = data.number || data.highlight || '';
                let fontSizeClass = 'text-[22rem]';
                if (numContent.length > 2) fontSizeClass = 'text-[16rem]';
                if (numContent.length > 4) fontSizeClass = 'text-[11rem]';
                if (numContent.length > 7) fontSizeClass = 'text-[8rem]';

                return (
                    <div className="relative z-20 flex flex-col items-center justify-center h-full px-16 text-center">
                        <h2 className="text-4xl font-mono text-neonCyan mb-12 uppercase tracking-[0.3em] z-20">
                            {data.title}
                        </h2>
                        <div className="relative flex flex-col items-center justify-center mb-10 w-full">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] border border-white/5 rounded-full pointer-events-none"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border border-dashed border-white/10 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none"></div>
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
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-neonCyan to-transparent opacity-50 mb-12"></div>
                        <p className="text-4xl text-gray-300 font-inter font-light max-w-3xl leading-relaxed z-20 whitespace-pre-line">
                            {formatDisplayText(data.description || data.body)}
                        </p>
                    </div>
                );

            case 'checklist':
                const items = getListItems();
                return (
                    <div className="relative z-20 flex flex-col justify-center h-full px-20 pt-20">
                        <h2 className="text-6xl font-orbitron text-white mb-24 font-bold uppercase tracking-wider flex items-center gap-6">
                            {/* UPDATED: Purple -> MedBlue */}
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
                                    <div key={idx} className="flex items-start gap-8 p-8 bg-white/5 border border-white/5 hover:border-neonCyan/30 transition-colors backdrop-blur-sm group">
                                        <div className="flex-shrink-0 mt-1">
                                            {isNumbered ? (
                                                <div className="w-14 h-14 bg-neonCyan/0 border-2 border-neonCyan/40 group-hover:border-neonCyan group-hover:bg-neonCyan group-hover:text-black text-neonCyan flex items-center justify-center font-mono font-bold text-2xl transition-all">
                                                    {String(number).padStart(2, '0')}
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-neonCyan/10 border border-neonCyan flex items-center justify-center">
                                                    <IconCheck className="text-neonCyan w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-4xl font-inter text-gray-100 font-light leading-snug pt-2">{text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'cta':
                const ctaImg = data.image || CTA_IMAGE_1;
                // Use 'center 20%' for both default variants to avoid cropping the head in the square
                let objectPos = 'center center';
                if (ctaImg === CTA_IMAGE_1 || ctaImg === CTA_IMAGE_2) {
                    objectPos = 'center 20%';
                }
                const imgStyle = { objectPosition: objectPos };

                return (
                    <div className="relative z-20 flex flex-col items-center justify-center h-full px-16 text-center">
                        <div className="relative mb-24 group">
                            <div className="absolute -inset-4 border border-white/10"></div>
                            <div className="absolute -inset-4 border-t border-l border-neonCyan w-16 h-16"></div>
                            {/* UPDATED: Purple -> MedBlue */}
                            <div className="absolute -inset-4 border-b border-r border-medBlue w-16 h-16 bottom-0 right-0 top-auto left-auto"></div>
                            <div className="relative w-[450px] h-[450px] overflow-hidden bg-black filter grayscale hover:grayscale-0 transition-all duration-700">
                                <img 
                                    src={ctaImg} 
                                    className="w-full h-full object-cover" 
                                    style={imgStyle}
                                    alt="CTA" 
                                    crossOrigin="anonymous" 
                                />
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
                                {data.buttonText || data.highlight || 'SALVAR'}
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

const EditorForm = ({ slide, onChange, onGenerateAI, isGenerating }: any) => {
    const safeType = normalizeType(slide.type);

    const handleChange = (field: string, value: string) => {
        onChange({ ...slide, [field]: value });
    };

    const toggleCtaImage = () => {
        const next = slide.image === CTA_IMAGE_2 ? CTA_IMAGE_1 : CTA_IMAGE_2;
        handleChange('image', next);
    };

    const InputField = ({ label, value, field, placeholder }: any) => (
        <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{label}</label>
            <input type="text" value={value || ''} onChange={(e) => handleChange(field, e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-none p-3 text-white focus:border-neonCyan transition-colors font-inter" placeholder={placeholder || "..."} />
        </div>
    );

    const TextAreaField = ({ label, value, field, placeholder, rows = 6 }: any) => (
        <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{label}</label>
            <textarea rows={rows} value={value || ''} onChange={(e) => handleChange(field, e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-none p-3 text-white focus:border-neonCyan transition-colors font-inter leading-relaxed" placeholder={placeholder || "..."} />
        </div>
    );

    return (
        <div className="flex flex-col gap-6 p-1">
            <div className="space-y-2">
                <label className="text-[10px] text-neonCyan font-mono tracking-widest uppercase">
                    Slide Type {safeType === 'cta' && '(LOCKED)'}
                </label>
                <select value={safeType} onChange={(e) => handleChange('type', e.target.value)} disabled={safeType === 'cta'} className={`w-full bg-[#111] border border-white/10 rounded-none p-3 text-white focus:border-neonCyan transition-colors font-mono text-sm ${safeType === 'cta' ? 'opacity-50 cursor-not-allowed text-gray-500' : ''}`}>
                    <option value="cover">COVER (INTRO)</option>
                    <option value="content">CONTENT (TEXT)</option>
                    <option value="story-digest">STORY DIGEST (EXCLUSIVE)</option>
                    <option value="big-number">BIG NUMBER (STAT)</option>
                    <option value="checklist">CHECKLIST (LIST)</option>
                    <option value="cta">CTA (OUTRO - LOCKED)</option>
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
                    <TextAreaField label="Key Points (One per line)" field="body" value={slide.body} placeholder="• Point 1&#10;• Point 2&#10;• Point 3" />
                    <InputField label="Top Tag / Category" field="highlight" value={slide.highlight} placeholder="e.g. NEW FEATURE" />
                    <InputField label="Bottom CTA" field="buttonText" value={slide.buttonText}