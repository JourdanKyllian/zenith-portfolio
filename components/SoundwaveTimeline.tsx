'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export interface TimelineItem {
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: ReactNode;
}

interface SoundwaveTimelineProps {
  items: TimelineItem[];
}

/* --- Réglages de l'onde ----------------------------------------------- */
const VIEW_WIDTH = 120; // largeur du repère SVG (unités arbitraires)
const POINT_STEP = 5; // distance verticale entre deux points de contrôle (dense : garantit des courbes rondes, pas hachées)
const BASE_AMPLITUDE = 9; // amplitude au repos (respiration lente)
const MAX_EXTRA_AMPLITUDE = 26; // amplitude additionnelle max sous l'effet du scroll
const PRIMARY_WAVELENGTH = 140; // longueur d'un cycle complet, en px
const PRIMARY_FREQ = (2 * Math.PI) / PRIMARY_WAVELENGTH;
const IDLE_SPEED = 0.00026; // vitesse d'évolution de la phase au repos
const ENERGY_DECAY = 0.94; // taux de retour au calme par frame (0-1)
const MAX_ENERGY = 1; // plafond de l'énergie accumulée

export default function SoundwaveTimeline({ items }: SoundwaveTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const heightRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!container || !svg || !path) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // La hauteur réelle dépend du texte (donc du viewport) : on la mesure
    // plutôt que de la deviner, pour que l'onde colle toujours à la liste.
    const resizeObserver = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      heightRef.current = h;
      svg.setAttribute('viewBox', `0 0 ${VIEW_WIDTH} ${h}`);
      if (prefersReducedMotion) {
        drawWave(path, h, 0, BASE_AMPLITUDE, 1);
      }
    });
    resizeObserver.observe(container);

    if (prefersReducedMotion) {
      // Tracé statique et discret : aucune boucle rAF, aucun coût CPU.
      return () => resizeObserver.disconnect();
    }

    // L'onde ne tourne que lorsque la frise est effectivement à l'écran.
    let isVisible = false;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      },
      { rootMargin: '200px 0px' }
    );
    intersectionObserver.observe(container);

    let rafId: number | null = null;
    let lastTimestamp = 0;
    let lastScrollY = window.scrollY;
    let energy = 0;
    let time = 0;

    const tick = (timestamp: number) => {
      const dt = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      // Vitesse de scroll échantillonnée DANS la boucle rAF : aucun
      // "scroll" listener, donc aucun risque de jank lié aux events natifs.
      const scrollY = window.scrollY;
      const rawVelocity = Math.abs(scrollY - lastScrollY) / Math.max(dt, 1);
      lastScrollY = scrollY;

      // L'énergie grimpe vite avec la vitesse instantanée, puis retombe en
      // douceur (comme une corde qu'on relâche).
      energy = Math.min(
        MAX_ENERGY,
        Math.max(rawVelocity * 0.12, energy * ENERGY_DECAY)
      );

      time += dt * IDLE_SPEED;

      const amplitude = BASE_AMPLITUDE + energy * MAX_EXTRA_AMPLITUDE;
      const freqBoost = 1 + energy * 0.9;

      drawWave(path, heightRef.current, time, amplitude, freqBoost);

      rafId = requestAnimationFrame(tick);
    };

    function start() {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }
    function stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
        lastTimestamp = 0;
      }
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Onde décorative : purement visuelle, masquée aux lecteurs d'écran */}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-full w-24 -translate-x-1/2 sm:w-28"
        viewBox={`0 0 ${VIEW_WIDTH} 100`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-z-blue)" stopOpacity="0" />
            <stop offset="8%" stopColor="var(--color-z-blue)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-z-blue)" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          fill="none"
          stroke="url(#wave-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="drop-shadow-[0_0_12px_rgba(0,123,255,0.35)]"
        />
      </svg>

      <ol className="relative flex flex-col gap-16 sm:gap-24">
        {items.map((item, index) => {
          // Alternance stricte, fidèle à la maquette : icône + texte d'un
          // côté, date en grand de l'autre — et ça s'inverse à chaque étape.
          const contentOnLeft = index % 2 === 0;
          return (
            <li
              key={item.year + item.title}
              className="grid grid-cols-2 items-start gap-6 sm:gap-16 lg:gap-20"
            >
              {contentOnLeft ? (
                <>
                  <div className="flex flex-col items-end gap-3">
                    <IconBadge icon={item.icon} side="left" />
                    <TimelineCard item={item} align="right" />
                  </div>
                  <div className="flex justify-start pt-2">
                    <YearLabel year={item.year} align="left" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-end pt-2">
                    <YearLabel year={item.year} align="right" />
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <IconBadge icon={item.icon} side="right" />
                    <TimelineCard item={item} align="left" />
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function IconBadge({ icon, side }: { icon: ReactNode; side: 'left' | 'right' }) {
  const badge = (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-z-blue/30 bg-z-card text-z-blue shadow-[0_0_20px_rgba(0,123,255,0.25)]">
      {icon}
    </span>
  );
  // Petit connecteur en pointillés qui tend vers l'onde centrale, comme
  // sur la maquette — masqué sur mobile pour ne pas surcharger.
  const connector = (
    <span className="hidden h-px w-6 border-t border-dashed border-z-blue/40 sm:block sm:w-10" />
  );
  return (
    <div className="flex items-center gap-2">
      {side === 'left' ? (
        <>
          {badge}
          {connector}
        </>
      ) : (
        <>
          {connector}
          {badge}
        </>
      )}
    </div>
  );
}

function TimelineCard({
  item,
  align,
}: {
  item: TimelineItem;
  align: 'left' | 'right';
}) {
  return (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
      <h3 className="font-display text-base font-bold uppercase tracking-wide text-white sm:text-lg">
        {item.title}
      </h3>
      {item.subtitle && (
        <p className="mt-1 font-sub text-[11px] uppercase tracking-[0.15em] text-z-blue/80">
          {item.subtitle}
        </p>
      )}
      <p className="mt-3 font-body text-xs leading-relaxed text-z-muted sm:text-sm">
        {item.description}
      </p>
    </div>
  );
}

function YearLabel({
  year,
  align,
}: {
  year: string;
  align: 'left' | 'right';
}) {
  return (
    <span
      className={`font-display text-2xl font-bold uppercase leading-tight text-z-blue sm:text-4xl lg:text-5xl ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {year}
    </span>
  );
}

/* --- Génération de la vague ------------------------------------------- */

function drawWave(
  path: SVGPathElement,
  height: number,
  time: number,
  amplitude: number,
  freqBoost: number
) {
  if (height <= 0) return;

  const steps = Math.max(6, Math.round(height / POINT_STEP));
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const y = (height * i) / steps;
    const theta = y * PRIMARY_FREQ * freqBoost + time;

    // Une seule fréquence fondamentale + son 2e harmonique EXACT, verrouillé
    // en phase sur la même variable theta : ça donne une onde asymétrique
    // (pas un sinus parfaitement symétrique) mais parfaitement stable, sans
    // battement/interférence — contrairement à deux fréquences indépendantes
    // qui dérivent l'une par rapport à l'autre et produisent un tracé haché.
    const wave = Math.sin(theta) * 0.78 + Math.sin(theta * 2 + 0.6) * 0.22;

    // Enveloppe lente : certains bumps plus amples que d'autres le long de
    // la frise, pour casser la répétition régulière.
    const envelope = 0.65 + 0.35 * Math.sin(y * PRIMARY_FREQ * 0.22 + 0.5);

    const x = VIEW_WIDTH / 2 + wave * amplitude * envelope;
    points.push({ x, y });
  }

  path.setAttribute('d', toSmoothPath(points));
}

// Construit une courbe lissée (quadratique, via points milieux) à partir
// d'une liste de points — avec un échantillonnage aussi dense (POINT_STEP),
// le résultat est visuellement rond, jamais anguleux.
function toSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const mx = (points[i].x + points[i + 1].x) / 2;
    const my = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${mx.toFixed(
      2
    )} ${my.toFixed(2)}`;
  }
  const last = points[points.length - 1];
  d += ` T ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}
