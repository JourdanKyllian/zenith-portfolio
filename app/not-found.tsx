import Link from "next/link";
import { VideoOff, Radio, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-z-bg flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Voile de scanlines */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* Barre de balayage */}
      <div
        className="pointer-events-none absolute inset-x-0 h-24 z-10 scanline-sweep"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(0,123,255,0.08), transparent)" }}
      />

      {/* Halo d'ambiance */}
      <div className="absolute inset-0 hero-bg" />

      {/* Repères de viseur */}
      <div className="absolute inset-8 sm:inset-16 pointer-events-none">
        <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-z-blue/30" />
        <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-z-blue/30" />
        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-z-blue/30" />
        <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-z-blue/30" />
      </div>

      <div className="relative z-20 flex flex-col items-center">
        <div className="mb-6 flex items-center gap-2 text-z-muted crt-flicker">
          <Radio className="w-3.5 h-3.5" />
          <span className="font-sub text-[11px] font-semibold uppercase tracking-[0.35em]">
            Aucun signal détecté
          </span>
        </div>

        <h1
          data-text="404"
          className="glitch font-display font-black text-[7rem] sm:text-[11rem] leading-none tracking-tighter text-glow select-none"
        >
          404
        </h1>

        <h2 className="mt-4 font-display font-bold text-2xl sm:text-4xl uppercase tracking-wide text-z-text">
          Signal perdu
        </h2>
        <p className="mt-4 max-w-md font-body text-sm text-z-muted">
          La séquence demandée n&apos;a pas pu être retrouvée dans le montage.
          Elle a peut-être été coupée au dérushage — ou n&apos;a jamais existé.
        </p>

        <div className="mt-6 flex items-center gap-2 text-z-muted/70">
          <VideoOff className="w-4 h-4" />
          <span className="font-sub text-[11px] uppercase tracking-[0.2em]">Piste vidéo introuvable</span>
        </div>

        <Link
          href="/"
          className="btn-blue mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-bold tracking-widest transition-transform hover:scale-105"
        >
          <Home className="w-4 h-4" />
          Reprendre la diffusion
        </Link>
      </div>

      {/* Barres de mire en pied de page */}
      <div className="absolute bottom-0 inset-x-0 h-1.5 flex opacity-40 z-10">
        {["#3D3D55", "#007BFF", "#151522", "#0A0A12", "#007BFF", "#3D3D55"].map((c, i) => (
          <div key={i} className="flex-1" style={{ background: c }} />
        ))}
      </div>
    </main>
  );
}