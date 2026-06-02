/**
 * ShadowChat Ultimate — Voice Deck
 * Live voice commands via Web Speech API.
 * Real-time audio wave visualization via Web Audio API AnalyserNode.
 * Commands: navigate, trade, send, ask HOPE AI, play blackjack, change outfit, etc.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocation } from "wouter";

/* ─── Voice Commands ─────────────────────────────────────────────────── */
interface VoiceCommand {
  pattern: RegExp;
  label: string;
  action: (match: RegExpMatchArray, navigate: (path: string) => void) => string;
}

const COMMANDS: VoiceCommand[] = [
  { pattern: /go to (dashboard|home|mission control)/i,   label: "→ Dashboard",    action: (_, nav) => { nav("/"); return "Navigating to Mission Control"; } },
  { pattern: /go to (feed|social|posts)/i,               label: "→ Feed",          action: (_, nav) => { nav("/feed"); return "Opening Social Feed"; } },
  { pattern: /go to (wallet|finance|money)/i,            label: "→ Wallet",        action: (_, nav) => { nav("/wallet"); return "Opening Wallet"; } },
  { pattern: /go to (exchange|dex|trading|trade)/i,      label: "→ Exchange",      action: (_, nav) => { nav("/exchange"); return "Opening Exchange"; } },
  { pattern: /go to (ai|hope|chat|assistant)/i,          label: "→ HOPE AI",       action: (_, nav) => { nav("/ai-core"); return "Opening HOPE AI Core"; } },
  { pattern: /go to (nft|gallery|collectibles)/i,        label: "→ NFT Gallery",   action: (_, nav) => { nav("/nft"); return "Opening NFT Gallery"; } },
  { pattern: /go to (governance|dao|vote)/i,             label: "→ Governance",    action: (_, nav) => { nav("/governance"); return "Opening Governance"; } },
  { pattern: /go to (analytics|stats|data)/i,            label: "→ Analytics",     action: (_, nav) => { nav("/analytics"); return "Opening Analytics Hub"; } },
  { pattern: /go to (messages|messaging|chat)/i,         label: "→ Messages",      action: (_, nav) => { nav("/messages"); return "Opening Messages"; } },
  { pattern: /go to (marketplace|shop|store)/i,          label: "→ Marketplace",   action: (_, nav) => { nav("/marketplace"); return "Opening Marketplace"; } },
  { pattern: /go to (profile|my profile)/i,              label: "→ Profile",       action: (_, nav) => { nav("/profile"); return "Opening Profile"; } },
  { pattern: /go to (security|security center)/i,        label: "→ Security",      action: (_, nav) => { nav("/security"); return "Opening Security Center"; } },
  { pattern: /go to (blackjack|casino|cards|dealer)/i,   label: "→ Blackjack",     action: (_, nav) => { nav("/blackjack"); return "Dealing cards! Opening Blackjack"; } },
  { pattern: /go to (dating|match|swipe)/i,              label: "→ Dating",        action: (_, nav) => { nav("/dating"); return "Opening Dating"; } },
  { pattern: /go to (leaderboard|rankings|top)/i,        label: "→ Leaderboard",   action: (_, nav) => { nav("/leaderboard"); return "Opening Leaderboard"; } },
  { pattern: /go to (settings|preferences)/i,            label: "→ Settings",      action: (_, nav) => { nav("/settings"); return "Opening Settings"; } },
  { pattern: /activate unhinged mode/i,                  label: "⚡ Unhinged Mode", action: (_, nav) => { nav("/ai-core?mode=unhinged"); return "UNHINGED MODE ACTIVATED. HOPE AI is unleashed."; } },
  { pattern: /activate (oracle|analyst|guardian|creator|sage|chaos|zen) mode/i, label: "🧠 AI Mode", action: (m, nav) => { nav(`/ai-core?mode=${m[1].toLowerCase()}`); return `${m[1].toUpperCase()} mode activated`; } },
  { pattern: /change (outfit|persona|look|style|costume) to (.+)/i, label: "👗 Change Outfit", action: (m) => `Changing to ${m[2]} outfit. Looking fresh!` },
  { pattern: /show (outfits|costumes|personas|looks)/i,  label: "👗 Show Outfits",  action: (_, nav) => { nav("/ai-core?tab=outfits"); return "Opening outfit selector"; } },
  { pattern: /buy (\d+\.?\d*) (btc|eth|sol|skycoin|doge|trump)/i, label: "💰 Buy",  action: (m) => `Buy order: ${m[1]} ${m[2].toUpperCase()} — confirm in Exchange` },
  { pattern: /sell (\d+\.?\d*) (btc|eth|sol|skycoin|doge|trump)/i, label: "💰 Sell", action: (m) => `Sell order: ${m[1]} ${m[2].toUpperCase()} — confirm in Exchange` },
  { pattern: /show (balance|portfolio|holdings)/i,       label: "💎 Balance",       action: (_, nav) => { nav("/wallet"); return "Opening wallet balance"; } },
  { pattern: /vote (yes|no) on proposal/i,               label: "🗳️ Vote",           action: (m) => `Vote ${m[1].toUpperCase()} recorded — confirm in Governance` },
  { pattern: /help|what can (i|you) (do|say)/i,          label: "❓ Help",           action: () => "Try: 'go to exchange', 'activate unhinged mode', 'buy 0.1 BTC', 'change outfit to cyberpunk'" },
];

/* ─── Audio Wave Canvas ──────────────────────────────────────────────── */
const BAR_COUNT = 32;

function AudioWave({ listening, analyserRef }: { listening: boolean; analyserRef: React.RefObject<AnalyserNode | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dataRef = useRef(new Uint8Array(BAR_COUNT));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const barW = W / BAR_COUNT - 1.5;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      if (analyserRef.current && listening) {
        analyserRef.current.getByteFrequencyData(dataRef.current);
      } else {
        // Idle gentle sine wave when not listening
        const now = Date.now() / 1000;
        for (let i = 0; i < BAR_COUNT; i++) {
          dataRef.current[i] = Math.floor(
            18 + 10 * Math.sin(now * 1.8 + i * 0.4) + 6 * Math.sin(now * 3.2 + i * 0.9)
          );
        }
      }

      for (let i = 0; i < BAR_COUNT; i++) {
        const raw = dataRef.current[i] / 255;
        const barH = listening
          ? Math.max(3, raw * H * 0.92)
          : Math.max(3, raw * H * 0.35);

        const x = i * (barW + 1.5);
        const y = (H - barH) / 2;

        // Gradient per bar: cyan → purple based on amplitude
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        if (listening) {
          const intensity = raw;
          const r = Math.floor(0   + intensity * 155);
          const g = Math.floor(229 - intensity * 80);
          const b = Math.floor(255 - intensity * 100);
          grad.addColorStop(0,   `rgba(${r},${g},${b},0.95)`);
          grad.addColorStop(0.5, `rgba(${r},${g},${b},0.7)`);
          grad.addColorStop(1,   `rgba(${r},${g},${b},0.95)`);
        } else {
          grad.addColorStop(0,   "rgba(255,255,255,0.12)");
          grad.addColorStop(0.5, "rgba(255,255,255,0.06)");
          grad.addColorStop(1,   "rgba(255,255,255,0.12)");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, barW / 2);
        ctx.fill();
      }
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [listening, analyserRef]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={56}
      className="w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

/* ─── Floating Mic Button Wave Ring ─────────────────────────────────── */
function MicRipple() {
  return (
    <>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border border-cyan-400/60"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 2.2 + i * 0.4, opacity: 0 }}
          transition={{ duration: 1.6, delay: i * 0.45, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */
interface TranscriptLine { text: string; response: string; ts: number; }

export default function VoiceDeck() {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [history, setHistory] = useState<TranscriptLine[]>([]);
  const [supported, setSupported] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  /* ── Init speech recognition ── */
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return; }
    synthRef.current = window.speechSynthesis;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e: any) => {
      const results = Array.from(e.results as SpeechRecognitionResultList);
      const latest = results[results.length - 1];
      const text = latest[0].transcript;
      setTranscript(text);
      if (latest.isFinal) {
        processCommand(text.trim());
        setTranscript("");
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => { /* restart handled in toggleListening */ };
    recognitionRef.current = rec;
  }, []);

  /* ── Cleanup audio context on unmount ── */
  useEffect(() => () => {
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
  }, []);

  /* ── TTS ── */
  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.1; utt.pitch = 1.0; utt.volume = 0.85;
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Alex"));
    if (preferred) utt.voice = preferred;
    synthRef.current.speak(utt);
  }, []);

  /* ── Command processor ── */
  const processCommand = useCallback((text: string) => {
    for (const cmd of COMMANDS) {
      const match = text.match(cmd.pattern);
      if (match) {
        const response = cmd.action(match, navigate);
        setHistory(h => [{ text, response, ts: Date.now() }, ...h].slice(0, 20));
        speak(response);
        toast.success(`🎙️ ${response}`, { duration: 3000 });
        return;
      }
    }
    const fallback = `I heard "${text}" — try saying "help" for commands`;
    setHistory(h => [{ text, response: fallback, ts: Date.now() }, ...h].slice(0, 20));
    speak("Command not recognized. Say help for a list of commands.");
  }, [navigate, speak]);

  /* ── Start / stop mic + audio analyser ── */
  const startAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = BAR_COUNT * 2;
      analyser.smoothingTimeConstant = 0.78;
      analyserRef.current = analyser;
      const source = ctx.createMediaStreamSource(stream);
      micSourceRef.current = source;
      source.connect(analyser);
    } catch {
      // getUserMedia denied — wave will fall back to idle animation
    }
  };

  const stopAudioAnalyser = () => {
    micSourceRef.current?.disconnect();
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    analyserRef.current = null;
    micStreamRef.current = null;
    micSourceRef.current = null;
  };

  const toggleListening = async () => {
    if (!supported) { toast.error("Voice recognition not supported in this browser"); return; }
    if (listening) {
      recognitionRef.current?.stop();
      stopAudioAnalyser();
      setListening(false);
      toast.info("Voice Deck paused");
    } else {
      await startAudioAnalyser();
      recognitionRef.current?.start();
      setListening(true);
      setOpen(true);
      toast.success("🎙️ Voice Deck active — speak a command");
      speak("Voice Deck activated. Ready for commands.");
    }
  };

  return (
    <>
      {/* ── Floating trigger button ── */}
      <motion.button
        onClick={toggleListening}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all relative",
          listening
            ? "bg-cyan-500 shadow-cyan-500/50"
            : "bg-[#0d0d22] border border-white/[0.12] shadow-black/60"
        )}
      >
        {/* Ripple rings when listening */}
        {listening && <MicRipple />}
        <Mic className={cn("w-5 h-5 relative z-10", listening ? "text-white" : "text-white/50")} />
        {listening && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#050510] animate-pulse z-20" />
        )}
      </motion.button>

      {/* ── Panel toggle button (open/close panel without toggling mic) ── */}
      <motion.button
        onClick={() => setOpen(p => !p)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-20 z-50 w-8 h-8 rounded-full bg-[#0d0d22] border border-white/[0.1] flex items-center justify-center text-white/30 hover:text-white/60 transition-colors shadow-lg"
      >
        {open ? <X className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </motion.button>

      {/* ── Voice Deck panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl"
            style={{ background: "rgba(8,8,24,0.97)", backdropFilter: "blur(28px)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full transition-colors", listening ? "bg-cyan-400 animate-pulse" : "bg-white/20")} />
                <span className="text-[13px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                  Voice Deck
                </span>
                {listening && (
                  <span className="text-[9px] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setExpanded(p => !p)} className="p-1 rounded text-white/30 hover:text-white/60 transition-colors">
                  {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setOpen(false)} className="p-1 rounded text-white/30 hover:text-white/60 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Audio Wave Visualizer ── */}
            <div className={cn(
              "px-4 py-3 border-b border-white/[0.06] transition-all",
              listening
                ? "bg-gradient-to-b from-cyan-950/30 to-transparent"
                : "bg-transparent"
            )}>
              <AudioWave listening={listening} analyserRef={analyserRef} />
              {/* Glow underline when active */}
              {listening && (
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  className="h-px mt-1 rounded-full"
                  style={{ background: "linear-gradient(90deg, transparent, #00e5ff, #9b59ff, transparent)" }}
                />
              )}
            </div>

            {/* Live transcript */}
            <div className="px-4 py-2.5 border-b border-white/[0.06] min-h-[40px] flex items-center">
              {transcript ? (
                <motion.p
                  key={transcript}
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[12px] text-cyan-300 font-mono italic"
                >
                  "{transcript}"
                </motion.p>
              ) : (
                <p className="text-[11px] text-white/25 font-mono">
                  {listening ? "Listening… speak a command" : "Click mic to activate voice commands"}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="px-4 py-3 flex items-center gap-2">
              <button
                onClick={toggleListening}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-semibold transition-all",
                  listening
                    ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                    : "bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/25"
                )}
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {listening
                  ? <><MicOff className="w-4 h-4" /> Stop Listening</>
                  : <><Mic className="w-4 h-4" /> Start Listening</>}
              </button>
              <button
                onClick={() => speak("Voice Deck is active and ready for your commands.")}
                className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/40 hover:text-white/70 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Command history */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/[0.06] max-h-44 overflow-y-auto overflow-hidden"
                >
                  {history.length === 0 ? (
                    <div className="px-4 py-5 text-center text-[11px] text-white/25 font-mono">No commands yet</div>
                  ) : (
                    history.map(h => (
                      <motion.div
                        key={h.ts}
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                        className="px-4 py-2.5 border-b border-white/[0.04] last:border-0"
                      >
                        <div className="text-[10px] text-white/35 font-mono mb-0.5">"{h.text}"</div>
                        <div className="text-[11px] text-cyan-300">{h.response}</div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick commands */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="text-[9px] font-mono text-white/25 mb-2 tracking-wider uppercase">Quick Commands</div>
              <div className="flex flex-wrap gap-1.5">
                {["go to exchange", "activate unhinged mode", "go to blackjack", "show outfits", "go to wallet"].map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => processCommand(cmd)}
                    className="text-[9px] font-mono px-2 py-1 rounded-lg border border-white/[0.08] text-white/40 hover:text-cyan-400 hover:border-cyan-500/25 transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
