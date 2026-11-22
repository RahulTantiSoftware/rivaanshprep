import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import PremiumPdfViewer from '../components/PremiumPdfViewer';
import SmartNotesComingSoonModal from '../components/SmartNotesComingSoonModal';
import {
  Book,
  ChevronDown,
  ChevronUp,
  Calculator,
  FlaskConical,
  Globe,
  BookOpen,
  Feather,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Clock,
  Layers,
  Bookmark,
  Languages,
  CheckCircle2,
  FileText,
  Zap,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

const SUBJECTS = [
  {
    id: 'math',
    title: 'Mathematics',
    subtitle: 'Standard & Basic (Code 041)',
    chaptersCount: 17,
    description: 'Real Numbers, Polynomials, Trigonometry, Triangles, plus Proofs, Modelling & Complete Solutions.',
    badge: '14 Chapters + Solutions',
    tags: ['Real Numbers', 'Trigonometry', 'Quadratics', 'Full Solutions'],
    accentBorder: 'hover:border-sky-500/70',
    iconBg: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
    badgeStyle: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    icon: Calculator,
  },
  {
    id: 'science',
    title: 'Science',
    subtitle: 'Physics, Chemistry & Biology (Code 086)',
    chaptersCount: 16,
    description: 'Chemical Reactions, Acids & Bases, Life Processes, Electricity, Magnetic Effects & Environment.',
    badge: '16 Chapters • 4 Units',
    tags: ['Chemical Reactions', 'Life Processes', 'Electricity', 'Optics'],
    accentBorder: 'hover:border-emerald-500/70',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    badgeStyle: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    icon: FlaskConical,
  },
  {
    id: 'social-science',
    title: 'Social Science',
    subtitle: 'History, Geography, Civics & Economics (Code 087)',
    chaptersCount: 25,
    description: 'India & Contemporary World, Contemporary India, Democratic Politics & Economic Development.',
    badge: '25 Chapters • 4 Units',
    tags: ['History', 'Geography', 'Civics', 'Economics'],
    accentBorder: 'hover:border-amber-500/70',
    iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    badgeStyle: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    icon: Globe,
  },
  {
    id: 'english',
    title: 'English',
    subtitle: 'First Flight & Footprints without Feet (Code 184)',
    chaptersCount: 21,
    description: 'First Flight prose & poetry, Footprints without Feet supplementary, & board analysis sets.',
    badge: '21 Chapters • 2 Books',
    tags: ['First Flight', 'Footprints', 'Poetry Analysis', 'Grammar'],
    accentBorder: 'hover:border-violet-500/70',
    iconBg: 'bg-violet-500/15 text-violet-400 border border-violet-500/30',
    badgeStyle: 'bg-violet-500/15 text-violet-300 border border-violet-500/30',
    icon: BookOpen,
  },
  {
    id: 'hindi',
    title: 'Hindi',
    subtitle: 'Kshitij & Kritika (Course A / B - Code 002)',
    chaptersCount: 22,
    description: 'Kshitij kavya & gadya khand, Kritika supplementary stories, vyakaran & exam summaries.',
    badge: '22 Chapters • 2 Books',
    tags: ['क्षितिज भाग 2', 'कृतिका भाग 2', 'काव्य & गद्य', 'व्याकरण'],
    accentBorder: 'hover:border-rose-500/70',
    iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    badgeStyle: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    icon: Feather,
  },
];

export default function NcertBookView() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(null); // null = show subject cards first
  const [chapters, setChapters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({ 1: true });
  
  // PDF Viewer Modal (Free & Secure)
  const [activePdf, setActivePdf] = useState(null);

  // Smart Notes Coming Soon Modal
  const [comingSoonChapter, setComingSoonChapter] = useState(null);

  const fetchChapters = async (subId) => {
    setLoadingChapters(true);
    setSelectedCategory('all');
    try {
      const response = await axiosClient.get(`/content/toc?subject=${subId}&medium=english`);
      setChapters(response.data.chapters || []);
      setCategories(response.data.categories || []);
      setExpandedChapters({ 1: true });
    } catch (err) {
      console.error('Failed to load chapters for subject ' + subId, err);
    } finally {
      setLoadingChapters(false);
    }
  };

  const handleSelectSubject = (subId) => {
    setSelectedSubject(subId);
    fetchChapters(subId);
  };

  const toggleChapter = (id) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openPdf = (ch) => {
    setActivePdf({
      title: `${ch.number}: ${ch.title}`,
      fileName: ch.fileName,
      hindiFileName: ch.hindiFileName,
      hindiTitle: ch.hindiTitle,
      subjectId: selectedSubject,
    });
  };

  const openComingSoon = (ch) => {
    setComingSoonChapter(ch);
  };

  const currentSubjectObj = SUBJECTS.find((s) => s.id === selectedSubject);

  // Filter chapters based on active category tab
  const displayedChapters = selectedCategory === 'all'
    ? chapters
    : chapters.filter((ch) => ch.category === selectedCategory);

  // Group chapters by category for structured section views
  const groupedCategories = (categories.length > 0 ? categories : [{ id: 'all', name: 'Chapters', count: chapters.length }])
    .filter((cat) => selectedCategory === 'all' || cat.id === selectedCategory)
    .map((cat) => ({
      ...cat,
      items: chapters.filter((ch) => cat.id === 'all' || ch.category === cat.id),
    }))
    .filter((group) => group.items.length > 0);

  // ===================== VIEW 1: SUBJECT CARDS (HIGH CONVERTING & SELLABLE) =====================
  if (!selectedSubject) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 pb-32 md:pb-16 pt-4 sm:pt-6 px-3 sm:px-6 max-w-5xl mx-auto w-full">
        
        {/* High-Converting Sellable Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-sky-950/40 border border-slate-800/90 p-4 sm:p-6 mb-6 shadow-xl">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> CBSE Class 10th (2025–26)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                ⭐ 100% Free Complete NCERT
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Master Class 10th with{' '}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Official NCERT Textbooks
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              High-speed in-browser DRM reader with instant dual-medium switch (
              <span className="text-sky-300 font-semibold">English</span> +{' '}
              <span className="text-amber-300 font-semibold">हिन्दी माध्यम</span>), complete chapter solutions, and chapter-wise smart revision notes.
            </p>

            {/* 4 Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 mt-1">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <Zap className="w-4 h-4 text-sky-400 shrink-0" />
                <div className="text-[11px] leading-tight text-slate-300 font-medium">Fast Canvas Reader</div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <Languages className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-[11px] leading-tight text-slate-300 font-medium">Dual-Medium 1-Tap</div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-[11px] leading-tight text-slate-300 font-medium">Zero Heavy Downloads</div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="text-[11px] leading-tight text-slate-300 font-medium">All 5 Core Subjects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between gap-3 mb-4 px-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Select Your Subject
            </h2>
            <p className="text-xs text-slate-400">
              Pick a subject to explore all chapters, textbook PDFs, and study notes
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
            5 Subjects
          </span>
        </div>

        {/* Subjects Grid - Full width on mobile for generous text wrapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SUBJECTS.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.id}
                onClick={() => handleSelectSubject(sub.id)}
                className={`group bg-slate-900/90 hover:bg-slate-850/95 border border-slate-800/90 hover:border-sky-500/60 rounded-2xl p-4 transition-all duration-150 cursor-pointer shadow-lg active:scale-[0.99] flex flex-col justify-between ${sub.accentBorder}`}
              >
                <div>
                  {/* Top row: Subject Icon + Title + Badge */}
                  <div className="flex items-start gap-3 mb-2.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md ${sub.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-sky-400 transition">
                          {sub.title}
                        </h3>
                        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${sub.badgeStyle}`}>
                          {sub.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-normal mt-0.5 break-words">
                        {sub.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Clean Description (Natural wrapping) */}
                  <p className="text-xs text-slate-300/90 leading-relaxed mb-3 break-words">
                    {sub.description}
                  </p>

                  {/* Feature Tags (Sellable Highlights) */}
                  {sub.tags && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      {sub.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-950/70 border border-slate-800/80 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Action link with button feel */}
                <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-400">
                      Free Access
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 group-hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-bold transition">
                    <span>Explore Chapters</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===================== VIEW 2: CHAPTER CARDS UI (DYNAMIC SUBJECT WITH SUB-CATEGORIES) =====================
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 pb-32 md:pb-16 pt-4 sm:pt-6 px-3 sm:px-6 max-w-4xl mx-auto w-full">
      
      {/* Top Header Row with Back Button & Quick Switcher */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800/70">
        <button
          onClick={() => setSelectedSubject(null)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 hover:text-sky-300 text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span>All Subjects</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-white hidden sm:inline">
            {currentSubjectObj?.title}
          </span>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 whitespace-nowrap shrink-0">
            {displayedChapters.length} {selectedCategory === 'all' ? 'Chapters' : 'Filtered'}
          </span>
        </div>
      </div>

      {/* Quick Subject Switcher Pill Bar (1-Tap Switch) */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar -mx-1 px-1">
          {SUBJECTS.map((s) => {
            const isCurrent = s.id === selectedSubject;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectSubject(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm ${
                  isCurrent
                    ? 'bg-sky-600 text-white shadow-sky-600/30 ring-1 ring-sky-400 font-bold'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Category Filter Bar (Pills with Live Counts) */}
      {categories.length > 0 && !loadingChapters && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-1 ring-indigo-400 font-bold'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>All Sections</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                selectedCategory === 'all' ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {chapters.length}
              </span>
            </button>

            {categories.map((cat) => {
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm ${
                    isCatActive
                      ? 'bg-indigo-600 text-white shadow-indigo-600/30 ring-1 ring-indigo-400 font-bold'
                      : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 shrink-0" />
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isCatActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading state for subject chapters */}
      {loadingChapters ? (
        <div className="py-20 flex flex-col items-center justify-center text-white">
          <div className="w-9 h-9 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-medium">
            Loading Chapters...
          </p>
        </div>
      ) : (
        /* Categorized Chapter Cards Groups */
        <div className="space-y-6">
          {groupedCategories.map((group) => (
            <div key={group.id} className="space-y-3">
              {/* Category Group Header Banner */}
              <div className="flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-sm">
                <div className="min-w-0 flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-sky-400 ring-2 ring-sky-400/30" />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight break-words">
                      {group.name}
                    </h4>
                    {group.bookTitle && (
                      <p className="text-[11px] text-slate-400 truncate">
                        {group.bookTitle}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 whitespace-nowrap shrink-0">
                  {group.items.length} {group.items.length === 1 ? 'Item' : 'Chapters'}
                </span>
              </div>

              {/* Chapter Cards in this category */}
              <div className="space-y-3">
                {group.items.map((ch) => {
                  const isOpen = expandedChapters[ch.id];
                  return (
                    <div
                      key={ch.id}
                      className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl shadow-lg transition-all duration-150 overflow-hidden"
                    >
                      {/* Card Header (Full-width natural text wrapping) */}
                      <div
                        onClick={() => toggleChapter(ch.id)}
                        className="p-3.5 sm:p-4 cursor-pointer select-none hover:bg-slate-850/60 transition"
                      >
                        {/* Top Row: Chapter Number + Badges + Title + Accordion Toggle */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Chapter Number Badge */}
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 font-mono font-extrabold text-xs shrink-0 mt-0.5 shadow-sm">
                              {ch.id < 10 ? `0${ch.id}` : ch.id}
                            </div>

                            <div className="min-w-0 flex-1">
                              {/* Chapter Tags / Badges */}
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[10px] font-mono font-bold tracking-wider text-sky-400 uppercase leading-none">
                                  {ch.number}
                                </span>
                                {ch.categoryName && (
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50 leading-none">
                                    {ch.categoryName}
                                  </span>
                                )}
                                {ch.hindiTitle && (
                                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 leading-none">
                                    हिन्दी उपलब्ध
                                  </span>
                                )}
                              </div>

                              {/* Chapter Title (Generously wrapped, never squished!) */}
                              <h3 className="text-sm sm:text-base font-bold text-white break-words leading-snug">
                                {ch.title}
                              </h3>

                              {/* Hindi Subtitle if available */}
                              {ch.hindiTitle && (
                                <p className="text-xs text-slate-400 font-medium mt-0.5 break-words">
                                  {ch.hindiTitle}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Desktop Inline Actions (Visible on sm: screens) */}
                          <div className="hidden sm:flex items-center gap-2 shrink-0">
                            {/* Button 1: Free NCERT Book PDF */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openPdf(ch);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/25 transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                              title="Read Official NCERT PDF"
                            >
                              <Book className="w-3.5 h-3.5 shrink-0" />
                              <span>Book PDF</span>
                              <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-black/30 text-emerald-300 uppercase">
                                Free
                              </span>
                            </button>

                            {/* Button 2: Smart Notes (Coming Soon) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openComingSoon(ch);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/70 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                              title="Smart Notes in Preparation"
                            >
                              <Clock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                              <span>Smart Notes</span>
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 uppercase">
                                Soon
                              </span>
                            </button>

                            {/* Desktop Chevron */}
                            <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>

                          {/* Mobile Accordion Chevron */}
                          <div className="sm:hidden w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>

                        {/* Mobile Action Buttons (Dedicated 2-Column Action Bar) */}
                        <div className="sm:hidden grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/70">
                          {/* Button 1: Free NCERT Book PDF (Primary CTA) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPdf(ch);
                            }}
                            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/25 active:scale-95 transition cursor-pointer"
                          >
                            <Book className="w-3.5 h-3.5 text-white shrink-0" />
                            <span>Read PDF</span>
                            <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-black/30 text-emerald-300 uppercase">
                              Free
                            </span>
                          </button>

                          {/* Button 2: Smart Notes (Secondary CTA) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openComingSoon(ch);
                            }}
                            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/70 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>Smart Notes</span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 uppercase">
                              Soon
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Sub-topics (Accordion Body) - Clean, Interactive Study Concept Cards */}
                      {isOpen && ch.topics && ch.topics.length > 0 && (
                        <div className="px-3.5 sm:px-4 pb-3.5 pt-2 border-t border-slate-800/80 bg-slate-950/40">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                              Chapter Outline ({ch.topics.length} Sections)
                            </span>
                            <span className="text-[10px] text-sky-400/90 font-medium">
                              Tap to study in PDF
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {ch.topics.map((t, idx) => (
                              <div
                                key={t.number || idx}
                                onClick={() => openPdf(ch)}
                                className="group/item flex items-start gap-2.5 py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/50 hover:border-sky-500/40 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
                              >
                                <span className="font-mono text-[11px] font-bold text-sky-400 min-w-[2.75rem] shrink-0 pt-0.5">
                                  {t.number}
                                </span>
                                <span className="text-slate-200 text-xs font-medium leading-relaxed break-words flex-1 group-hover/item:text-white transition">
                                  {t.title}
                                </span>
                                <div className="text-slate-500 group-hover/item:text-sky-400 transition shrink-0 pt-0.5">
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== PREMIUM PROTECTED CANVAS PDF VIEWER ===================== */}
      {activePdf && (
        <PremiumPdfViewer
          title={activePdf.title}
          fileName={activePdf.fileName}
          hindiFileName={activePdf.hindiFileName}
          hindiTitle={activePdf.hindiTitle}
          subjectId={activePdf.subjectId}
          onClose={() => setActivePdf(null)}
          user={user}
        />
      )}

      {/* ===================== SMART NOTES COMING SOON MODAL ===================== */}
      {comingSoonChapter && (
        <SmartNotesComingSoonModal
          chapter={comingSoonChapter}
          onClose={() => setComingSoonChapter(null)}
          onOpenPdf={() => openPdf(comingSoonChapter)}
        />
      )}
    </div>
  );
}
