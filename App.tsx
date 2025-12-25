import React, { useState } from "react";
import { AppState, MeetingResult } from "./types";
import { processMeeting } from "./services/ai";

const CloudUploadIcon = () => (
  <svg className="w-12 h-12 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
);

export default function App() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleUpload(file: File) {
    if (!file.type.startsWith("video/")) {
      setError("Invalid format. Enterprise analysis requires video files (MP4, MOV, WEBM).");
      setState("error");
      return;
    }
    setFileName(file.name);
    setState("processing");
    try {
      const data = await processMeeting(file);
      setResult(data);
      setState("success");
    } catch (e: any) {
      setError(e.message || "An error occurred during high-fidelity analysis.");
      setState("error");
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col items-center bg-[#050810] text-gray-200">
      <header className="w-full max-w-7xl mb-12 flex justify-between items-end border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-3xl shadow-2xl shadow-indigo-500/20 text-white">M</div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">MeetingMind <span className="text-indigo-500 font-light">PRO</span></h1>
            <p className="text-[11px] text-gray-500 uppercase tracking-[0.3em] font-bold mt-1">Enterprise-Grade Intelligence</p>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Encryption Active</span>
          </div>
          <span className="text-[9px] text-gray-600 font-medium">GEMINI-3-PRO-SYNTHESIS • V2.5</span>
        </div>
      </header>

      <main className="w-full max-w-7xl">
        {state === "idle" && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 max-w-4xl mx-auto pt-10">
            <div className="text-center mb-16">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6 border border-indigo-500/20">Decision Intelligence Engine</span>
              <h2 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter text-white leading-[0.95]">
                Full depth analysis, <span className="text-indigo-500">zero detail loss.</span>
              </h2>
              <p className="text-gray-400 text-2xl max-w-3xl mx-auto font-light leading-snug">
                Engineered for 30–120 minute recordings. Our multi-stage digestion protocol extracts every nuance, owner, and deadline with professional precision.
              </p>
            </div>
            
            <label className="glass glow-border block w-full aspect-[21/7] rounded-[40px] flex flex-col items-center justify-center cursor-pointer transition-all border-dashed border-2 border-indigo-500/20 group hover:bg-indigo-500/[0.02]">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
              <div className="p-8 bg-indigo-500/10 rounded-3xl group-hover:scale-105 transition-transform duration-500 group-hover:bg-indigo-500/20 shadow-xl">
                <CloudUploadIcon />
              </div>
              <span className="text-3xl font-bold mt-8 text-white tracking-tight">Deploy Meeting Recording</span>
              <span className="text-gray-500 mt-4 text-xs font-bold tracking-[0.2em] uppercase">MP4 • MOV • WEBM • UP TO 120 MINS</span>
            </label>
          </div>
        )}

        {state === "processing" && (
          <div className="flex flex-col items-center justify-center py-40 space-y-12 animate-in fade-in duration-700">
            <div className="relative">
              <div className="w-40 h-40 border-[2px] border-indigo-500/5 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-indigo-500/5 rounded-full animate-pulse border border-indigo-500/10 shadow-2xl"></div>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-white tracking-tight">Stage 2: Aggregation & Synthesis</h3>
              <p className="text-gray-400 text-lg max-w-lg mx-auto font-light leading-relaxed">
                Processing <span className="text-indigo-400 font-mono italic underline decoration-indigo-500/30">{fileName}</span>. Hierarchical digestion is reconstructing context for decision-ready notes...
              </p>
            </div>
          </div>
        )}

        {state === "success" && result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Left Content - Primary Deep Notes */}
            <section className="lg:col-span-8 space-y-10">
              <div className="glass p-12 rounded-[48px] shadow-2xl border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400">Deep Executive Summary</h3>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">COMPLETENESS: 100%</span>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-2xl leading-[1.6] text-gray-100 font-light whitespace-pre-wrap">{result.summary}</p>
                </div>
              </div>

              <div className="glass p-12 rounded-[48px] shadow-2xl border-white/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400">Action Matrix & Deliverables</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.action_items.map((item, i) => (
                    <div key={i} className="flex flex-col p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/40 transition-all duration-500 group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity"><CheckIcon /></div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 inline-block">Item {i+1}</div>
                      <p className="text-white font-bold text-xl mb-8 flex-grow leading-tight tracking-tight">{item.task}</p>
                      <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-6">
                        <div>
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Lead Owner</p>
                          <p className="text-indigo-300 text-[15px] font-bold tracking-tight">{item.owner}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1.5">Deadline</p>
                          <p className="text-gray-300 text-[15px] font-bold tracking-tight">{item.deadline}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Right Sidebar - Strategic & Comms */}
            <aside className="lg:col-span-4 space-y-10">
              <div className="glass p-10 rounded-[40px] border-l-8 border-l-indigo-600 shadow-2xl bg-gradient-to-br from-indigo-500/[0.03] to-transparent">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-8 border-b border-white/10 pb-4">Strategic Decisions</h3>
                <ul className="space-y-6">
                  {result.decisions.map((decision, i) => (
                    <li key={i} className="text-gray-200 text-lg leading-snug flex gap-4 group">
                      <span className="text-indigo-500 font-black mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity">{String(i+1).padStart(2, '0')}</span>
                      <span className="font-medium tracking-tight group-hover:text-white transition-colors">{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="glass p-10 rounded-[40px] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px]"></div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> WhatsApp Follow-up
                    </h3>
                    <button 
                      onClick={() => copyToClipboard(result.whatsapp_followup)}
                      className="flex items-center gap-2 text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full hover:bg-emerald-500/20 active:scale-90 transition-all border border-emerald-500/20"
                    >
                      <CopyIcon /> COPY
                    </button>
                  </div>
                  <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-mono text-sm text-gray-400 leading-relaxed italic border-l-4 border-l-emerald-500/30">
                    {result.whatsapp_followup}
                  </div>
                </div>

                <div className="glass p-10 rounded-[40px] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px]"></div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Email Intelligence
                    </h3>
                    <button 
                      onClick={() => copyToClipboard(result.email_followup)}
                      className="flex items-center gap-2 text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full hover:bg-indigo-500/20 active:scale-90 transition-all border border-indigo-500/20"
                    >
                      <CopyIcon /> COPY
                    </button>
                  </div>
                  <div className="p-6 bg-black/50 rounded-2xl border border-white/5 font-mono text-sm text-gray-400 leading-relaxed italic border-l-4 border-l-indigo-500/30">
                    {result.email_followup}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setState("idle")}
                className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-[28px] hover:bg-indigo-50 transition-all shadow-2xl active:scale-[0.98] border-b-4 border-gray-300"
              >
                Ingest New Recording
              </button>
            </aside>
          </div>
        )}

        {state === "error" && (
          <div className="glass border-red-500/30 p-20 rounded-[60px] text-center max-w-3xl mx-auto shadow-2xl bg-gradient-to-b from-red-500/[0.02] to-transparent">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-500/20">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-4xl font-black text-white mb-6 tracking-tight">System Exception Detected</h3>
            <p className="text-gray-400 mb-12 text-xl leading-relaxed font-light">{error}</p>
            <button 
              onClick={() => setState("idle")}
              className="px-16 py-5 bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-red-500/20"
            >Re-deploy Engine</button>
          </div>
        )}
      </main>

      <footer className="mt-32 py-12 w-full max-w-7xl border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-600 font-bold uppercase tracking-[0.3em] text-[10px]">
        <div className="flex items-center gap-4">
          <span>&copy; 2025 MeetingMind Intelligence</span>
          <span className="text-gray-800">•</span>
          <span>Security Protocol v4.1</span>
        </div>
        <div className="flex gap-12 text-gray-700">
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">GDPR Compliant</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">Neural Processing</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">SLA 99.9%</span>
        </div>
      </footer>
    </div>
  );
}
