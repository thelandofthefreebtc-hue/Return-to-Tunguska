/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RefreshCw, AudioLines, Sparkles, Moon, Share2, Check } from "lucide-react";
import { generateTunguskaTrack } from "./services/musicService";

export default function App() {
  const [status, setStatus] = useState<"idle" | "generating" | "ready" | "error">("idle");
  const [progressMsg, setProgressMsg] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerate = async () => {
    // Check for selected API key for Lyria model
    if (typeof window !== "undefined" && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
        // The skill says to proceed immediately as hasSelectedApiKey might not update instantly
      }
    }

    setStatus("generating");
    setProgressMsg("INITIALIZING SPECTRAL FLUX...");
    try {
      const result = await generateTunguskaTrack((msg) => setProgressMsg(msg.toUpperCase()));
      setAudioUrl(result.audioUrl);
      setLyrics(result.lyrics);
      setStatus("ready");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setProgressMsg(err.message || "SYSTEM FAILURE: HIVE CONNECTION LOST");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Tunguska Reimagined",
      text: "Check out this atmospheric music track generated with Tunguska x Shade engine.",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.warn("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard failed:", err);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#E0E0E0] font-sans flex flex-col p-6 md:p-10 relative">
      <div className="tech-atmosphere" />
      
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 relative">
          <div className="space-y-1">
            <p className="text-[10px] tracking-[0.4em] uppercase text-amber-500/80 font-semibold">Synthesis Engine v4.2</p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-white">
              Tunguska <span className="text-amber-500 font-serif italic text-4xl md:text-6xl align-top md:align-baseline ml-2">Shade</span>
            </h1>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-2">
            <button 
              onClick={handleShare}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-[10px] uppercase tracking-widest font-bold text-white/40 hover:text-amber-500"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3 h-3" />
                    <span>Link Copied</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="share"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share Sequence</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="text-left md:text-right">
              <div className="text-3xl font-mono tracking-tighter tabular-nums text-white/90">04:12.88</div>
              <div className="text-[10px] uppercase tracking-widest opacity-40">
                {status === "generating" ? "Buffering Spectral Flux..." : "System Standby"}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Primary Visualizer Area */}
          <section className="md:col-span-8 relative border border-white/10 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-black p-8 overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
            {/* Visualizer bars */}
            <div className="flex items-end gap-1.5 w-full max-w-2xl h-48 px-4 opacity-80">
              {[20, 45, 70, 90, 80, 95, 60, 35, 15, 25, 55, 85, 75, 40].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: "10%" }}
                  animate={{ 
                    height: isPlaying ? [`${h}%`, `${Math.min(100, h * 1.2)}%`, `${h * 0.8}%`] : `${h}%` 
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5 + (i * 0.1), 
                    ease: "easeInOut" 
                  }}
                  className={`flex-1 rounded-full ${
                    i > 3 && i < 7 ? "bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]" : "bg-indigo-500/40"
                  }`}
                />
              ))}
            </div>

            <div className="absolute bottom-8 left-8 flex items-center gap-4">
              <button 
                onClick={status === "ready" ? togglePlayback : handleGenerate}
                disabled={status === "generating"}
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
                  status === "generating" ? "border-white/10 opacity-50" : "border-amber-500 hover:bg-amber-500/10 cursor-pointer"
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-amber-500 fill-amber-500" />
                ) : (
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-amber-500 border-b-[8px] border-b-transparent ml-1" />
                )}
              </button>
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-white">
                  {status === "ready" ? "Preview Stream" : status === "generating" ? "Generating..." : "Engine Offline"}
                </div>
                <div className="text-sm text-white/40">
                  {status === "ready" ? "Layer: Atmospheric Synth Pad (Parsons Pattern)" : "Select generate to start sequence"}
                </div>
              </div>
            </div>

            <div className="absolute top-8 right-8 text-[10px] font-mono text-indigo-400 opacity-60 text-right">
              MATRIX_ALIGN: 0.8842<br />SPECTRAL_DENSITY: {status === "ready" ? "OPTIMAL" : "LOW"}
            </div>
            
            {status === "error" && (
              <div className="absolute inset-0 bg-red-950/20 backdrop-blur-sm flex items-center justify-center p-8 text-center">
                <div className="space-y-4">
                  <div className="text-red-500 font-mono text-sm uppercase tracking-widest">{progressMsg}</div>
                  <button onClick={handleGenerate} className="text-xs underline text-white/60 hover:text-white uppercase tracking-widest">Retry Connection</button>
                </div>
              </div>
            )}
          </section>

          {/* Controls Sidebar */}
          <aside className="md:col-span-4 flex flex-col justify-between gap-12">
            <section className="space-y-10">
              <div className="space-y-6">
                <label className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 block font-bold">Structure (Alan Parsons)</label>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/60">
                      <span>Instrumental Layering</span>
                      <span className="font-mono text-indigo-400">82%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} className="h-full bg-indigo-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/60">
                      <span>Progression Complexity</span>
                      <span className="font-mono text-indigo-400">64%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "64%" }} className="h-full bg-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] uppercase tracking-[0.2em] text-amber-500 block font-bold">Vocal Texture (Shade)</label>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/60">
                      <span>Harmonic Warmth</span>
                      <span className="font-mono text-amber-500">95%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "95%" }} className="h-full bg-amber-500 glow-amber" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/60">
                      <span>Soulful Inflection</span>
                      <span className="font-mono text-amber-500">71%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "71%" }} className="h-full bg-amber-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lyrics Scroll Area */}
              <div className="pt-4">
                <div className="text-[10px] uppercase tracking-widest text-white/20 mb-3 font-bold">Lyric Output</div>
                <div className="h-32 lyric-scroll overflow-hidden relative">
                  <motion.div 
                    animate={{ y: isPlaying ? -80 : 0 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="text-sm font-serif italic text-white/70 leading-relaxed"
                  >
                    {lyrics || "Sequence initialized. Waiting for stellar coordinates... The silence speaks in waves of amber light, reaching from the depth of the forest."}
                  </motion.div>
                </div>
              </div>
            </section>

            <button 
              onClick={handleGenerate}
              disabled={status === "generating"}
              className="w-full bg-white text-black py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-amber-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-white"
            >
              {status === "generating" ? progressMsg : "Regenerate Composition"}
            </button>
          </aside>
        </main>

        <footer className="mt-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 border-t border-white/5 pt-8">
          <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Tempo: <span className="text-white">112 BPM</span></div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Key: <span className="text-white">B Minor</span></div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Quality: <span className="text-white">Lossless (24-bit)</span></div>
          </div>
          <div className="flex-1 flex flex-wrap gap-2 justify-center">
            {["Ambient", "Cinematic", "Smooth Vocal"].map((tag) => (
              <span key={tag} className={`px-3 py-1 border rounded-full text-[9px] uppercase tracking-tighter ${
                tag === "Smooth Vocal" ? "border-amber-500/30 text-amber-500/80" : "border-white/10 text-white/40"
              }`}>
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-6 opacity-40">
            <div className="w-3 h-3 bg-white/20 rounded-sm" />
            <div className="w-3 h-3 bg-white/40 rounded-sm" />
            <div className="w-3 h-3 bg-white/60 rounded-sm" />
          </div>
        </footer>
      </div>

      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)}
          hidden
        />
      )}
    </div>
  );
}
