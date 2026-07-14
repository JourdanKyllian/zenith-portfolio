"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RotateCcw, Aperture } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [time, setTime] = useState("00:00:00");

  useEffect(() => {
    console.error("Erreur attrapée par le layout :", error);
    const start = Date.now();
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      const h = String(Math.floor(s / 3600)).padStart(2, "0");
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const sec = String(s % 60).padStart(2, "0");
      setTime(`${h}:${m}:${sec}`);
    }, 1000);
    return () => clearInterval(id);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-z-bg flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 hero-bg" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Incrustation REC */}
      <div className="absolute top-24 left-8 md:top-28 md:left-12 flex items-center gap-2 font-sub text-[11px] uppercase tracking-[0.25em] text-z-muted">
        <span className="w-2 h-2 rounded-full bg-red-500 rec-pulse" />
        REC <span className="ml-1 tabular-nums text-z-text/70">{time}</span>
      </div>

      <div className="relative z-20 flex flex-col items-center">
        {/* Viseur autofocus */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-8">
          <span className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-z-blue bracket-hunt" />
          <span
            className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-z-blue bracket-hunt"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-z-blue bracket-hunt"
            style={{ animationDelay: "0.3s" }}
          />
          <span
            className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-z-blue bracket-hunt"
            style={{ animationDelay: "0.45s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Aperture className="w-10 h-10 text-z-blue af-hunt" />
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 text-amber-400/90">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-sub text-[11px] font-semibold uppercase tracking-[0.3em]">
            Mise au point impossible
          </span>
        </div>

        <h2 className="font-display font-bold text-3xl sm:text-5xl uppercase tracking-wide text-z-text af-hunt">
          Erreur de mise au point
        </h2>
        <p className="mt-4 max-w-md font-body text-sm text-z-muted">
          La caméra n&apos;arrive pas à stabiliser l&apos;image. Un problème
          technique interrompt momentanément la diffusion.
        </p>

        {error?.digest && (
          <p className="mt-3 font-sub text-[10px] uppercase tracking-[0.2em] text-z-muted/50">
            Code erreur — {error.digest}
          </p>
        )}

        <button
          onClick={() => reset()}
          className="btn-blue mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-bold tracking-widest transition-transform hover:scale-105 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Relancer la prise
        </button>
      </div>
    </div>
  );
}