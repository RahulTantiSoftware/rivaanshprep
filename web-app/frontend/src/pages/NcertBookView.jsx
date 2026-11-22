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
  FileText
} from 'lucide-react';

const SUBJECTS = [
  {
    id: 'math',
    title: 'Mathematics',
    subtitle: 'Standard & Basic (Code 041)',
    chaptersCount: 17,
    description: 'Real Numbers, Polynomials, Trigonometry, Triangles, plus Proofs, Modelling & Complete Solutions.',
    badge: '14 Chapters + Solutions',
    active: true,
    accentBorder: 'hover:border-sky-500/70',
    iconBg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20',
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
    active: true,
    accentBorder: 'hover:border-emerald-500/70',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
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
    active: true,
    accentBorder: 'hover:border-amber-500/70',
    iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
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
    active: true,
    accentBorder: 'hover:border-violet-500/70',
    iconBg: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
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
    active: true,
    accentBorder: 'hover:border-rose-500/70',
    iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
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

  // ===================== VIEW 1: SUBJECT CARDS OF 10TH =====================
  if (!selectedSubject) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 pb-28 md:pb-16 pt-5 px-3 sm:px-6 max-w-4xl mx-auto w-full overflow-x-hidden">
        
        {/* Header Title with Official Logo */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-3.5 text-left">
            <img
              src="/logo.png"
              alt="RivaanshPrep"
              className="w-12 h-12 rounded-full object-cover shadow-lg shadow-sky-500/25 ring-2 ring-sky-500/40 shrink-0"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-mono font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> Class 10th Curriculum
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Choose Your Subject
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official NCERT textbooks and curriculum for Class 10th
              </p>
            </div>
          </div>
        </div>

        {/* Subjects Grid - Ultra Compact & Space-Efficient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUBJECTS.map((sub) => {
            const Icon = sub.icon;
            return (
              <div
                key={sub.id}
                onClick={() => handleSelectSubject(sub.id)}
                className={`group bg-slate-900/85 hover:bg-slate-850/95 border border-slate-800/90 hover:border-sky-500/60 rounded-xl p-3.5 transition-all duration-150 cursor-pointer shadow-md active:scale-[0.99] flex flex-col justify-between ${sub.accentBorder}`}
              >
                <div>
                  {/* Top row: Icon + Subject Title & Subtitle + Badge */}
                  <div className="flex items-start gap-2.5 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${sub.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-sky-400 transition truncate">
                          {sub.title}
                        </h3>
                        <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded-full whitespace-nowrap shrink-0 ${sub.badgeStyle}`}>
                          {sub.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {sub.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Compact Description (2 lines clamp) */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {sub.description}
                  </p>
                </div>

                {/* Bottom Bar: Action link */}
                <div className="pt-2 mt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-sky-400 group-hover:text-sky-300 transition">
                    View Chapters
                  </span>
                  <div className="w-5 h-5 rounded-md bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-3 h-3" />
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
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 pb-28 md:pb-16 pt-5 px-3 sm:px-6 max-w-3xl mx-auto">
      
      {/* Sleek Breadcrumb / Back Button */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3.5 pb-2 border-b border-slate-800/60">
        <button
          onClick={() => setSelectedSubject(null)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 hover:text-sky-300 text-xs font-semibold transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span>All 10th Subjects</span>
        </button>

        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 whitespace-nowrap shrink-0">
          {displayedChapters.length} {selectedCategory === 'all' ? 'Chapters' : 'Filtered'}
        </span>
      </div>

      {/* Sub-Category Filter Bar (Pills with Live Counts) */}
      {categories.length > 0 && !loadingChapters && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm ${
                selectedCategory === 'all'
                  ? 'bg-sky-600 text-white shadow-sky-600/30 ring-1 ring-sky-400'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
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
                      ? 'bg-sky-600 text-white shadow-sky-600/30 ring-1 ring-sky-400'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
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
          <div className="w-8 h-8 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-400 font-medium">
            Loading Chapters...
          </p>
        </div>
      ) : (
        /* Categorized Chapter Cards Groups */
        <div className="space-y-6">
          {groupedCategories.map((group) => (
            <div key={group.id} className="space-y-2.5">
              {/* Category Group Header Banner */}
              <div className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-sm">
                <div className="min-w-0 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0 bg-sky-400" />
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
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 whitespace-nowrap shrink-0">
                  {group.items.length} {group.items.length === 1 ? 'Item' : 'Chapters'}
                </span>
              </div>

              {/* Chapter Cards in this category */}
              <div className="space-y-2.5">
                {group.items.map((ch) => {
                  const isOpen = expandedChapters[ch.id];
                  return (
                    <div
                      key={ch.id}
                      className="bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/70 rounded-xl shadow-md transition-all duration-150 overflow-hidden"
                    >
                      {/* Card Header */}
                      <div
                        onClick={() => toggleChapter(ch.id)}
                        className="p-3 sm:py-3.5 sm:px-4 cursor-pointer select-none hover:bg-slate-850/60 transition"
                      >
                        {/* Desktop Header Row (Inline Buttons) */}
                        <div className="flex items-start sm:items-center justify-between gap-2.5">
                          <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0 pr-1">
                            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-mono font-bold text-xs shrink-0 mt-0.5 sm:mt-0">
                              {ch.id < 10 ? `0${ch.id}` : ch.id}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[10px] font-mono font-semibold tracking-wider text-sky-400/90 uppercase leading-none">
                                  {ch.number}
                                </span>
                                {ch.categoryName && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/50 leading-none">
                                    {ch.categoryName}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xs sm:text-sm font-semibold text-slate-100 break-words leading-snug">
                                {ch.title}
                              </h3>
                            </div>
                          </div>

                          {/* Desktop Action Buttons Row */}
                          <div className="hidden sm:flex items-center gap-2 shrink-0">
                            {/* Button 1: Free NCERT Book PDF (In-Memory Protected Canvas Viewer) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openPdf(ch);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-sky-400 border border-sky-500/30 hover:border-sky-500/60 text-[11px] font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
                              title="Preview Official NCERT PDF in Protected Canvas"
                            >
                              <Book className="w-3 h-3 shrink-0 text-sky-400" />
                              <span>Book PDF</span>
                              <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                                Free
                              </span>
                            </button>

                            {/* Button 2: Smart Notes (Coming Soon) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openComingSoon(ch);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-amber-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
                              title="Smart Notes in Preparation"
                            >
                              <Clock className="w-3 h-3 shrink-0 text-amber-400" />
                              <span>Smart Notes</span>
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 border border-amber-500/25 text-amber-300 uppercase">
                                Soon
                              </span>
                            </button>

                            {/* Chevron (Desktop) */}
                            <div className="w-6 h-6 rounded-md bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0">
                              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </div>
                          </div>

                          {/* Mobile Accordion Chevron (Top Right) */}
                          <div className="sm:hidden w-6 h-6 rounded-md bg-slate-800/80 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </div>
                        </div>

                        {/* Mobile Action Buttons (Dedicated 2-Column Grid) */}
                        <div className="sm:hidden grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/60">
                          {/* Button 1: Free NCERT Book PDF */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPdf(ch);
                            }}
                            className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 text-[11px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer whitespace-nowrap"
                          >
                            <Book className="w-3 h-3 text-sky-400 shrink-0" />
                            <span>Book PDF</span>
                            <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                              Free
                            </span>
                          </button>

                          {/* Button 2: Smart Notes (Coming Soon) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openComingSoon(ch);
                            }}
                            className="py-1.5 px-2 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer whitespace-nowrap"
                          >
                            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>Smart Notes</span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 border border-amber-500/25 text-amber-300 uppercase">
                              Soon
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Sub-topics (Accordion Body) - Clean, Compact & Perfectly Wrapped */}
                      {isOpen && ch.topics && ch.topics.length > 0 && (
                        <div className="px-3 sm:px-4 pb-3 pt-1 border-t border-slate-800/70 bg-slate-950/30">
                          <div className="space-y-1 pt-1.5">
                            {ch.topics.map((t, idx) => (
                              <div
                                key={t.number || idx}
                                className="flex items-start gap-2.5 py-1.5 px-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/40 transition"
                              >
                                <span className="font-mono text-[11px] font-semibold text-sky-400/90 w-11 shrink-0 pt-0.5">
                                  {t.number}
                                </span>
                                <span className="text-slate-300 text-xs font-normal leading-relaxed break-words flex-1">
                                  {t.title}
                                </span>
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
