import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import axiosClient from '../api/axiosClient';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  X,
  Shield,
  ShieldCheck,
  RotateCw,
  LayoutGrid,
  Sun,
  Moon,
  FileText,
  Lock,
  Languages
} from 'lucide-react';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PremiumPdfViewer({
  title,
  fileName,
  hindiFileName,
  hindiTitle,
  subjectId,
  onClose,
  user
}) {
  const [viewerMedium, setViewerMedium] = useState('english'); // 'english' or 'hindi'
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('1');

  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);
  const containerRef = useRef(null);

  // Automatic mapping fallback for NCERT files if hindiFileName is not explicitly passed
  const getHindiFile = (file) => {
    if (!file) return null;
    if (file.startsWith('Chapter_01_')) return 'jhmh101.pdf';
    if (file.startsWith('Chapter_02_')) return 'jhmh102.pdf';
    if (file.startsWith('Chapter_03_')) return 'jhmh103.pdf';
    if (file.startsWith('Chapter_04_')) return 'jhmh104.pdf';
    if (file.startsWith('Chapter_05_')) return 'jhmh105.pdf';
    if (file.startsWith('Chapter_06_')) return 'jhmh106.pdf';
    if (file.startsWith('Chapter_07_')) return 'jhmh107.pdf';
    if (file.startsWith('Chapter_08_')) return 'jhmh108.pdf';
    if (file.startsWith('Chapter_09_')) return 'jhmh109.pdf';
    if (file.startsWith('Chapter_10_')) return 'jhmh110.pdf';
    if (file.startsWith('Chapter_11_')) return 'jhmh111.pdf';
    if (file.startsWith('Chapter_12_')) return 'jhmh112.pdf';
    if (file.startsWith('Chapter_13_')) return 'jhmh113.pdf';
    if (file.startsWith('Chapter_14_')) return 'jhmh114.pdf';
    if (file.startsWith('Appendix_01_')) return 'jhmh1a1.pdf';
    if (file.startsWith('Appendix_02_')) return 'jhmh1a2.pdf';
    if (file === 'Answers.pdf') return 'jhmh1an.pdf';
    if (file.startsWith('jesc')) return file.replace('jesc', 'jhsc');
    if (file.startsWith('jess')) return file.replace('jess', 'jhss');
    if (file.startsWith('jemh')) return file.replace('jemh', 'jhmh');
    return null;
  };

  const getEnglishFile = (file) => {
    if (!file) return null;
    if (file === 'jhmh101.pdf') return 'Chapter_01_Real_Numbers.pdf';
    if (file === 'jhmh102.pdf') return 'Chapter_02_Polynomials.pdf';
    if (file === 'jhmh103.pdf') return 'Chapter_03_Pair_of_Linear_Equations_in_Two_Variables.pdf';
    if (file === 'jhmh104.pdf') return 'Chapter_04_Quadratic_Equations.pdf';
    if (file === 'jhmh105.pdf') return 'Chapter_05_Arithmetic_Progressions.pdf';
    if (file === 'jhmh106.pdf') return 'Chapter_06_Triangles.pdf';
    if (file === 'jhmh107.pdf') return 'Chapter_07_Coordinate_Geometry.pdf';
    if (file === 'jhmh108.pdf') return 'Chapter_08_Introduction_to_Trigonometry.pdf';
    if (file === 'jhmh109.pdf') return 'Chapter_09_Some_Applications_of_Trigonometry.pdf';
    if (file === 'jhmh110.pdf') return 'Chapter_10_Circles.pdf';
    if (file === 'jhmh111.pdf') return 'Chapter_11_Areas_Related_to_Circles.pdf';
    if (file === 'jhmh112.pdf') return 'Chapter_12_Surface_Areas_and_Volumes.pdf';
    if (file === 'jhmh113.pdf') return 'Chapter_13_Statistics.pdf';
    if (file === 'jhmh114.pdf') return 'Chapter_14_Probability.pdf';
    if (file === 'jhmh1a1.pdf') return 'Appendix_01_Proofs_in_Mathematics.pdf';
    if (file === 'jhmh1a2.pdf') return 'Appendix_02_Mathematical_Modelling.pdf';
    if (file === 'jhmh1an.pdf') return 'Answers.pdf';
    if (file.startsWith('jhsc')) return file.replace('jhsc', 'jesc');
    if (file.startsWith('jhss')) return file.replace('jhss', 'jess');
    if (file.startsWith('jhmh')) return file.replace('jhmh', 'jemh');
    return null;
  };

  const resolvedHindiFile = hindiFileName || getHindiFile(fileName);
  const resolvedEnglishFile = fileName?.startsWith('jh') ? (getEnglishFile(fileName) || fileName) : fileName;
  const hasDualMedium = Boolean(resolvedHindiFile && resolvedEnglishFile);

  const activeFileName = (viewerMedium === 'hindi' && resolvedHindiFile) ? resolvedHindiFile : resolvedEnglishFile;
  const activeDisplayTitle = (viewerMedium === 'hindi' && hindiTitle)
    ? hindiTitle
    : (viewerMedium === 'hindi' ? `${title} (हिंदी माध्यम)` : title);

  // In-Memory Secure PDF Fetch (No direct URL / No browser download capability)
  useEffect(() => {
    let isCancelled = false;
    let loadingTask = null;
    setLoading(true);
    setError(null);

    // Security warning in DevTools
    console.warn(
      '%c🛡️ RivaanshPrep Security System Active: Direct PDF download and source asset extraction are strictly restricted.',
      'color: #38bdf8; font-weight: bold; font-size: 13px; background: #0f172a; padding: 4px 8px; border-radius: 4px;'
    );

    const loadPdfSecurely = async () => {
      try {
        if (!activeFileName) {
          throw new Error('No target PDF stream specified');
        }

        // Fetch raw ArrayBuffer directly into RAM with our app's security header
        const response = await axiosClient.get(`/content/pdf/${activeFileName}`, {
          responseType: 'arraybuffer',
          headers: {
            'X-Rivaansh-Secure-Reader': 'authorized-view-only',
          },
        });

        if (isCancelled) return;

        const uint8Data = new Uint8Array(response.data);

        // Load document entirely in memory without ever creating a blob: URL in the DOM
        loadingTask = pdfjsLib.getDocument({
          data: uint8Data,
        });

        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
          setCurrentPage(1);
          setPageInputValue('1');
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error loading protected PDF stream:', err);
          setError('Protected PDF content could not be loaded. Please ensure you are connected to the network.');
          setLoading(false);
        }
      }
    };

    loadPdfSecurely();

    return () => {
      isCancelled = true;
      if (loadingTask) {
        loadingTask.destroy();
      }
    };
  }, [activeFileName]);

  // Adjust default scale on mobile vs desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScale(0.85);
      } else if (window.innerWidth < 1024) {
        setScale(1.1);
      } else {
        setScale(1.25);
      }
    };
    handleResize();
  }, []);

  // Render Current Page to Protected Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isMounted = true;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await pdfDoc.getPage(currentPage);
        if (!isMounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale, rotation });
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const renderContext = {
          canvasContext: context,
          viewport,
          transform: pixelRatio !== 1 ? [pixelRatio, 0, 0, pixelRatio, 0, 0] : null,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Page render error:', err);
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, currentPage, scale, rotation]);

  // Comprehensive Anti-Download & Anti-Inspect Protection Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // 1. Block Save Webpage / Save File (Ctrl+S / Cmd+S)
      if (isCtrlOrCmd && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // 2. Block Print to PDF (Ctrl+P / Cmd+P)
      if (isCtrlOrCmd && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // 3. Block View Page Source (Ctrl+U / Cmd+U)
      if (isCtrlOrCmd && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // 4. Block DevTools Inspect Shortcut (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
      if (
        e.key === 'F12' ||
        (isCtrlOrCmd && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Navigation shortcuts
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [currentPage, numPages]);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const p = currentPage - 1;
      setCurrentPage(p);
      setPageInputValue(p.toString());
      scrollToTop();
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      const p = currentPage + 1;
      setCurrentPage(p);
      setPageInputValue(p.toString());
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageInputChange = (e) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(pageInputValue, 10);
    if (!isNaN(p) && p >= 1 && p <= numPages) {
      setCurrentPage(p);
      scrollToTop();
    } else {
      setPageInputValue(currentPage.toString());
    }
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-1 sm:p-4 animate-fade-in select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <div
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[92vh]'
        }`}
      >
        {/* ===================== TOP PREMIUM TOOLBAR ===================== */}
        <div className="px-3 sm:px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white gap-2 shrink-0">
          
          {/* Left: Title & File Badge */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img
              src="/logo.png"
              alt="RivaanshPrep"
              className="w-8 h-8 rounded-full object-cover shrink-0 shadow-md shadow-sky-500/30 ring-1 ring-sky-400/40"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                  NCERT Official Textbook
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 uppercase">
                  Protected View
                </span>
                {hasDualMedium && (
                  <span className={`inline-flex px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase ${
                    viewerMedium === 'hindi'
                      ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                      : 'bg-sky-500/20 border border-sky-500/30 text-sky-300'
                  }`}>
                    {viewerMedium === 'hindi' ? 'हिंदी माध्यम' : 'English Medium'}
                  </span>
                )}
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700/50">
                  <Lock className="w-2.5 h-2.5 text-amber-400" /> Read-Only
                </span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-white truncate leading-tight">
                {activeDisplayTitle}
              </h3>
            </div>
          </div>

          {/* Center: Language Switcher (English / Hindi in PDF View) */}
          {hasDualMedium && (
            <div className="flex items-center p-0.5 bg-slate-900 border border-slate-700/80 rounded-xl shrink-0 shadow-inner">
              <button
                onClick={() => setViewerMedium('english')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewerMedium === 'english'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to English Medium Textbook"
              >
                <Languages className="w-3 h-3 hidden sm:inline" />
                <span>English</span>
              </button>
              <button
                onClick={() => setViewerMedium('hindi')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  viewerMedium === 'hindi'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="हिंदी माध्यम पुस्तक पर स्विच करें"
              >
                <span>हिंदी</span>
              </button>
            </div>
          )}

          {/* Center: Navigation Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-2 py-1">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1 text-xs">
              <input
                type="text"
                value={pageInputValue}
                onChange={handlePageInputChange}
                onBlur={handlePageInputSubmit}
                className="w-10 text-center py-0.5 rounded bg-slate-950 border border-slate-700 text-sky-400 font-mono font-bold focus:outline-none focus:border-sky-500"
              />
              <span className="text-slate-400 font-mono">/ {numPages || '...'}</span>
            </form>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
              title="Next Page (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Thumbnails Toggle */}
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                showThumbnails ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Page Thumbnails"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* Night Mode Filter */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isNightMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isNightMode ? 'Normal White Paper' : 'Night Mode / Invert Filter'}
            >
              {isNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Zoom Controls (Desktop) */}
            <div className="hidden sm:flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={zoomOut}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono font-semibold text-slate-300 px-1.5">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Protected Shield Indicator (Strictly replacing the old download button) */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold select-none cursor-default"
              title="Content Protected by RivaanshPrep Security System. Direct downloading and saving are disabled."
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span className="text-[11px] font-mono">Protected</span>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===================== VIEWER BODY ===================== */}
        <div className="flex-1 flex overflow-hidden relative bg-slate-950">
          
          {/* Thumbnails Sidebar Drawer */}
          {showThumbnails && numPages > 0 && (
            <div className="w-44 sm:w-56 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 animate-fade-in z-20">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Pages ({numPages})
                </span>
                <button
                  onClick={() => setShowThumbnails(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {Array.from({ length: numPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => {
                      setCurrentPage(pNum);
                      setPageInputValue(pNum.toString());
                      scrollToTop();
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                      currentPage === pNum
                        ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Page {pNum}</span>
                    {currentPage === pNum && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Canvas Scroll Area */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto flex flex-col items-center justify-start p-3 sm:p-6 bg-slate-950"
          >
            {loading && (
              <div className="my-auto flex flex-col items-center justify-center p-8 text-center">
                <div className="w-10 h-10 border-3 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-3" />
                <p className="text-xs font-medium text-slate-300">Loading Protected NCERT Chapter...</p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">In-Memory Secure Canvas Pipeline</p>
              </div>
            )}

            {error && (
              <div className="my-auto max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <FileText className="w-8 h-8 text-rose-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Preview Protected</h4>
                <p className="text-xs text-slate-400">{error}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct download restricted by security policy</span>
                </div>
              </div>
            )}

            {/* True Canvas Document Display with Transparent Anti-Inspect Protective Shield */}
            <div
              className={`relative transition-all duration-200 shadow-2xl rounded-lg overflow-hidden my-auto border border-slate-800/80 ${
                isNightMode ? 'filter invert hue-rotate-180 contrast-90 brightness-95' : ''
              } ${loading ? 'hidden' : 'block'}`}
            >
              {/* Actual HTML5 Canvas */}
              <canvas
                ref={canvasRef}
                onDragStart={(e) => e.preventDefault()}
                className="block max-w-full pointer-events-none select-none"
              />

              {/* Anti-Inspect Transparent Protective Shield Layer */}
              <div
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                onDragStart={(e) => e.preventDefault()}
                className="absolute inset-0 z-10 pointer-events-auto bg-transparent cursor-default"
                title="Protected Educational Content — RivaanshPrep"
              />

              {/* Anti-Extraction Security Watermark */}
              <div className="absolute inset-0 z-20 pointer-events-none select-none flex items-center justify-center overflow-hidden opacity-[0.035] rotate-[-25deg] text-xs font-mono font-bold tracking-widest text-slate-900 whitespace-nowrap">
                RIVAANSHPREP PROTECTED CONTENT • OFFICIAL CLASS 10TH NCERT • DO NOT COPY OR DISTRIBUTE
              </div>
            </div>
          </div>
        </div>

        {/* ===================== FLOATING MOBILE BOTTOM TOOLBAR ===================== */}
        <div className="md:hidden px-4 py-2.5 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="py-1 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="py-1 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 text-xs font-semibold flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold text-sky-400">
              {currentPage} / {numPages || '...'}
            </span>
            <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-2.5 h-2.5" /> Secure
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 text-xs"
            >
              -
            </button>
            <button
              onClick={zoomIn}
              className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 text-xs"
            >
              +
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
