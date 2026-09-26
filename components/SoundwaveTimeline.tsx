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

/**
 * Matrice d'échantillonnage de la forme de l'onde extraite de la maquette (SVG).
 * Construit un tableau de vecteurs [t, dx] où 't' représente la position normalisée (0-1) 
 * et 'dx' l'amplitude horizontale de la courbe par rapport au centre du conteneur.
 */
const WAVE_TILE: [number, number][] = [
  [0.0,0.5], [0.0105,1.0], [0.0211,-1.24], [0.0316,-4.32], [0.0421,-2.69], [0.0526,2.28],
  [0.0632,5.94], [0.0737,5.83], [0.0842,0.96], [0.0947,-4.08], [0.1053,-2.95], [0.1158,3.47],
  [0.1263,5.82], [0.1368,-1.08], [0.1474,-4.5], [0.1579,0.81], [0.1684,5.94], [0.1789,8.93],
  [0.1895,6.71], [0.2,-9.18], [0.2105,-19.47], [0.2211,4.0], [0.2316,12.39], [0.2421,-2.51],
  [0.2526,-26.05], [0.2632,-7.23], [0.2737,23.31], [0.2842,-15.47], [0.2947,-10.18], [0.3053,6.56],
  [0.3158,10.83], [0.3263,-11.49], [0.3368,13.45], [0.3474,3.12], [0.3579,-14.88], [0.3684,5.69],
  [0.3789,20.23], [0.3895,-5.61], [0.4,-18.36], [0.4105,3.93], [0.4211,19.56], [0.4316,7.81],
  [0.4421,11.47], [0.4526,-6.12], [0.4632,-19.64], [0.4737,-1.18], [0.4842,20.2], [0.4947,6.86],
  [0.5053,-17.31], [0.5158,-15.51], [0.5263,-3.84], [0.5368,-9.81], [0.5474,-8.73], [0.5579,11.38],
  [0.5684,25.75], [0.5789,15.91], [0.5895,-13.19], [0.6,-21.57], [0.6105,-1.18], [0.6211,21.02],
  [0.6316,12.46], [0.6421,-9.81], [0.6526,-20.43], [0.6632,-6.17], [0.6737,2.13], [0.6842,-2.09],
  [0.6947,-17.66], [0.7053,-6.92], [0.7158,26.75], [0.7263,-10.74], [0.7368,-24.72], [0.7474,-16.65],
  [0.7579,10.62], [0.7684,19.52], [0.7789,-15.87], [0.7895,-17.84], [0.8,9.36], [0.8105,16.95],
  [0.8211,10.28], [0.8316,10.4], [0.8421,-4.37], [0.8526,-10.72], [0.8632,-8.96], [0.8737,-0.95],
  [0.8842,8.1], [0.8947,9.72], [0.9053,4.37], [0.9158,-3.68], [0.9263,-6.98], [0.9368,-3.99],
  [0.9474,4.16], [0.9579,8.49], [0.9684,9.15], [0.9789,7.79], [0.9895,4.83], [1.0,1.18],
];

const VIEW_WIDTH = 120;
const POINT_STEP = 5; 
const TILE_HEIGHT = 2000; 
const WOBBLE_WAVELENGTH = 42; 
const WOBBLE_FREQ = (2 * Math.PI) / WOBBLE_WAVELENGTH;
const WOBBLE_BASE = 2; 
const WOBBLE_MAX_EXTRA = 20; 
const IDLE_DRIFT_SPEED = 0.007; 
const SCROLL_DRIFT_COUPLING = 0.18; 
const IDLE_SPEED = 0.00026; 
const ENERGY_DECAY = 0.94; 
const MAX_ENERGY = 1; 

/**
 * Composant interactif générant une frise chronologique asymétrique.
 * Intègre une animation procédurale de tracé SVG (Soundwave) réagissant 
 * physiquement à la vélocité de défilement (scroll) de l'utilisateur.
 *
 * @param {SoundwaveTimelineProps} props - Liste ordonnée des événements du parcours.
 */
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

    /**
     * Adaptation dynamique du conteneur SVG en fonction de l'expansion du DOM textuel.
     */
    const resizeObserver = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      heightRef.current = h;
      svg.setAttribute('viewBox', `0 0 ${VIEW_WIDTH} ${h}`);
      if (prefersReducedMotion) {
        drawWave(path, h, 0, 0, 0, 1);
      }
    });
    resizeObserver.observe(container);

    if (prefersReducedMotion) {
      return () => resizeObserver.disconnect();
    }

    let isVisible = false;
    
    /**
     * Optimisation logicielle (IntersectionObserver) : 
     * Désactive le calcul procédural de l'animation lorsque la frise est hors champ.
     */
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
    let driftOffset = 0;

    /**
     * Boucle d'animation principale (requestAnimationFrame).
     * Échantillonne la vélocité de défilement pour induire une perturbation sinusoïdale 
     * sur la fréquence de l'onde visuelle.
     */
    const tick = (timestamp: number) => {
      const dt = lastTimestamp ? timestamp - lastTimestamp : 16;
      lastTimestamp = timestamp;

      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      const rawVelocity = Math.abs(scrollDelta) / Math.max(dt, 1);

      energy = Math.min(
        MAX_ENERGY,
        Math.max(rawVelocity * 0.12, energy * ENERGY_DECAY)
      );

      time += dt * IDLE_SPEED;
      driftOffset += dt * IDLE_DRIFT_SPEED + scrollDelta * SCROLL_DRIFT_COUPLING;

      const wobbleAmplitude = WOBBLE_BASE + energy * WOBBLE_MAX_EXTRA;
      const freqBoost = 1 + energy * 0.9;

      drawWave(path, heightRef.current, time, driftOffset, wobbleAmplitude, freqBoost);

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
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-full w-28 -translate-x-1/2 sm:w-32"
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
          const contentOnLeft = index % 2 === 0;
          return (
            <li
              key={item.year + item.title}
              className="grid grid-cols-2 items-start gap-6 sm:gap-20 lg:gap-24"
            >
              {contentOnLeft ? (
                <>
                  <div className="flex flex-col items-end gap-4">
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
                  <div className="flex flex-col items-start gap-4">
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

/**
 * Rendu modulaire du badge iconographique connectif.
 */
function IconBadge({ icon, side }: { icon: ReactNode; side: 'left' | 'right' }) {
  const connector = (
    <span className="hidden h-px w-6 border-t border-dashed border-z-blue/40 sm:block sm:w-10" />
  );
  return (
    <div className="flex items-center gap-3">
      {side === 'left' ? (
        <>{icon}{connector}</>
      ) : (
        <>{connector}{icon}</>
      )}
    </div>
  );
}

/**
 * Bloc de contenu décrivant l'événement chronologique.
 */
function TimelineCard({ item, align }: { item: TimelineItem; align: 'left' | 'right' }) {
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

/**
 * Titrage temporel stylisé de l'étape.
 */
function YearLabel({ year, align }: { year: string; align: 'left' | 'right' }) {
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

/**
 * Interpolation sinusoïdale de la forme réelle sur l'axe Y.
 * Lisse les transitions entre les points d'échantillonnage de la matrice originelle.
 *
 * @param {number} y - Coordonnée verticale courante.
 * @returns {number} Décalage horizontal (X) interpolé.
 */
function getBaseOffset(y: number): number {
  const t = (((y % TILE_HEIGHT) + TILE_HEIGHT) % TILE_HEIGHT) / TILE_HEIGHT;
  const scaled = t * (WAVE_TILE.length - 1);
  const i0 = Math.floor(scaled);
  const i1 = Math.min(i0 + 1, WAVE_TILE.length - 1);
  const frac = scaled - i0;
  const eased = (1 - Math.cos(frac * Math.PI)) / 2;
  return WAVE_TILE[i0][1] + (WAVE_TILE[i1][1] - WAVE_TILE[i0][1]) * eased;
}

/**
 * Moteur de calcul vectoriel du tracé procédural.
 * Combine la forme originelle interpolée avec une perturbation sinusoïdale dynamique.
 */
function drawWave(
  path: SVGPathElement,
  height: number,
  time: number,
  driftOffset: number,
  wobbleAmplitude: number,
  freqBoost: number
) {
  if (height <= 0) return;

  const steps = Math.max(6, Math.round(height / POINT_STEP));
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i <= steps; i++) {
    const y = (height * i) / steps;
    const base = getBaseOffset(y + driftOffset);
    const wobble = Math.sin(y * WOBBLE_FREQ * freqBoost + time) * wobbleAmplitude;
    const x = VIEW_WIDTH / 2 + base + wobble;
    points.push({ x, y });
  }

  path.setAttribute('d', toSmoothPath(points));
}

/**
 * Générateur de courbe de Bézier quadratique lissée à partir d'un réseau de coordonnées cartésiennes.
 *
 * @param {Array<{x: number, y: number}>} points - Matrice de coordonnées vectorielles.
 * @returns {string} Chaîne de caractères interprétable par l'attribut 'd' d'un <path> SVG.
 */
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
