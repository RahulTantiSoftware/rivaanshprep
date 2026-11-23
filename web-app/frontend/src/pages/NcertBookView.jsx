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

  // ===================== VIEW 1: SUBJECT CARDS =====================
  if (!selectedSubject) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 pb-28 md:pb-16 pt-4 sm:pt-6 px-3 sm:px-6 max-w-5xl mx-auto w-full">
        
        {/* Hero Value Banner */}
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

        {/* Subjects Grid */}
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

                  {/* Clean Description */}
                  <p className="text-xs text-slate-300/90 leading-relaxed mb-3 break-words">
                    {sub.description}
                  </p>

                  {/* Feature Tags */}
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

  // ===================== VIEW 2: STREAMLINED COMPACT CHAPTER LIST (NO SUBJECT FILTER) =====================
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 pb-28 md:pb-16 pt-3 sm:pt-5 px-2.5 sm:px-6 max-w-3xl mx-auto w-full">
      
      {/* Sleek, Focused Subject Header (No subject switcher clutter) */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setSelectedSubject(null)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sky-400 hover:text-sky-300 text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Subjects</span>
          </button>

          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
              {currentSubjectObj?.title}
            </h2>
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {currentSubjectObj?.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 whitespace-nowrap">
            {chapters.length} Chapters
          </span>
        </div>
      </div>

      {/* Loading state for subject chapters */}
      {loadingChapters ? (
        <div className="py-20 flex flex-col items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-medium">
            Loading Chapters...
          </p>
        </div>
      ) : (
        /* Categorized Chapter Cards Groups - Compact & Space-Efficient */
        <div className="space-y-4">
          {groupedCategories.map((group) => (
            <div key={group.id} className="space-y-1.5">
              
              {/* Category Group Sub-header (only show if multiple categories exist) */}
              {categories.length > 1 && (
                <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  <span className="text-xs font-bold text-slate-300 tracking-tight">
                    {group.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {group.items.length} {group.items.length === 1 ? 'item' : 'chapters'}
                  </span>
                </div>
              )}

              {/* Space-Efficient Chapter Rows */}
              <div className="space-y-1.5">
                {group.items.map((ch) => {
                  const isOpen = expandedChapters[ch.id];
                  return (
                    <div
                      key={ch.id}
                      className="bg-slate-900/85 border border-slate-800/80 hover:border-slate-700/80 rounded-xl shadow-sm transition-all duration-150 overflow-hidden"
                    >
                      {/* Compact Chapter Header Row (Single-line elegance, ~52px height) */}
                      <div
                        onClick={() => toggleChapter(ch.id)}
                        className="py-2.5 px-3 sm:px-3.5 flex items-center justify-between gap-2.5 cursor-pointer select-none hover:bg-slate-850/60 transition"
                      >
                        {/* Left: Number + Title + Subtitle */}
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {/* Compact Number Pill */}
                          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-mono font-bold text-xs shrink-0">
                            {ch.id < 10 ? `0${ch.id}` : ch.id}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-xs sm:text-sm font-semibold text-white leading-snug truncate">
                              {ch.title}
                            </h3>
                            {ch.hindiTitle ? (
                              <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                <span className="text-amber-400/80 text-[10px] mr-1">हिन्दी:</span>
                                {ch.hindiTitle}
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                                {ch.topics?.length ? `${ch.topics.length} Sections` : 'Complete Chapter'}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right: Direct Action Button + Chevron Toggle */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Read PDF Button - Compact, high-contrast, instant click */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPdf(ch);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
                            title="Read Chapter PDF"
                          >
                            <Book className="w-3.5 h-3.5 shrink-0" />
                            <span>PDF</span>
                          </button>

                          {/* Accordion Chevron */}
                          <div className="w-7 h-7 rounded-lg bg-slate-800/60 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition shrink-0">
                            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>

                      {/* Sub-topics (Accordion Body) - Space-efficient & Interactive */}
                      {isOpen && ch.topics && ch.topics.length > 0 && (
                        <div className="px-3 pb-2.5 pt-1 border-t border-slate-800/60 bg-slate-950/40">
                          <div className="flex items-center justify-between py-1 mb-1 border-b border-slate-800/40">
                            <span className="text-[10px] font-mono text-slate-400">
                              {ch.topics.length} Sub-sections (Tap to study)
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openComingSoon(ch);
                              }}
                              className="text-[10px] font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 transition cursor-pointer"
                            >
                              <Clock className="w-2.5 h-2.5" />
                              <span>Smart Notes (Soon)</span>
                            </button>
                          </div>

                          <div className="space-y-1 pt-0.5">
                            {ch.topics.map((t, idx) => (
                              <div
                                key={t.number || idx}
                                onClick={() => openPdf(ch)}
                                className="group/item flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-slate-900/50 hover:bg-slate-850 border border-slate-800/40 hover:border-sky-500/40 transition cursor-pointer active:scale-[0.99]"
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <span className="font-mono text-[10px] font-bold text-sky-400 w-8 shrink-0">
                                    {t.number}
                                  </span>
                                  <span className="text-slate-300 text-xs font-normal truncate group-hover/item:text-white transition">
                                    {t.title}
                                  </span>
                                </div>
                                <ArrowRight className="w-3 h-3 text-slate-500 group-hover/item:text-sky-400 transition shrink-0" />
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
