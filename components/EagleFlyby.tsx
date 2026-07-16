"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin, useGSAP);

/* --- Réglages : à ajuster à l'œil une fois en place --- */
const FLIGHT_DURATION = 7;    // secondes, vol lent et majestueux
const ORBIT_LOOPS = 1.35;     // nombre de tours avant de se poser
const ORBIT_PORTION = 0.62;   // part du temps passée à tourner (reste = approche + pose)
const LAND_SCALE = 0.42;      // taille une fois posé, relative au vol
const PERCH_LIFT = 0.24;      // remonte le point de pose au-dessus du "Z" (fraction de sa hauteur)

type Point = { x: number; y: number };

export default function EagleFlyby() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const eagleRef = useRef<SVGSVGElement>(null);
  const wingLeftRef = useRef<SVGGElement>(null);
  const wingRightRef = useRef<SVGGElement>(null);
  const hasPlayedRef = useRef(false);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      const target = scene?.querySelector<HTMLElement>("[data-eagle-target]");
      const eagle = eagleRef.current;
      if (!scene || !target || !eagle) return;

      const computeTarget = (): Point => {
        const sceneRect = scene.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        return {
          x: targetRect.left - sceneRect.left + targetRect.width / 2,
          y: targetRect.top - sceneRect.top - targetRect.height * PERCH_LIFT,
        };
      };

      const place = (p: Point, scale: number) => {
        gsap.set(eagle, { x: p.x, y: p.y, scale, xPercent: -50, yPercent: -50 });
      };

      // Respecte "prefers-reduced-motion" : pas de vol, l'aigle est déjà posé
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        place(computeTarget(), LAND_SCALE);
        gsap.set(eagle, { autoAlpha: 1 });
        return;
      }

      const flutter = gsap.to([wingLeftRef.current, wingRightRef.current], {
        rotate: (i) => (i === 0 ? 5 : -5),
        transformOrigin: "50% 50%",
        duration: 0.9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        paused: true,
      });

      const runFlight = () => {
        if (hasPlayedRef.current) return;
        hasPlayedRef.current = true;

        const sceneRect = scene.getBoundingClientRect();
        const center: Point = { x: sceneRect.width / 2, y: sceneRect.height / 2 };
        const radiusX = Math.min(sceneRect.width * 0.85, window.innerWidth * 0.38);
        const radiusY = Math.min(sceneRect.height * 1.1, window.innerHeight * 0.22, radiusX * 0.55);
        const landing = computeTarget();

        // Points de la spirale (orbite qui se resserre) + approche finale vers le "Z"
        const points: Point[] = [];
        const orbitSamples = 40;
        for (let i = 0; i <= orbitSamples; i++) {
          const p = i / orbitSamples;
          const angle = -Math.PI / 2 + p * ORBIT_LOOPS * Math.PI * 2;
          const shrink = 1 - p * p * 0.4;
          points.push({
            x: center.x + Math.cos(angle) * radiusX * shrink,
            y: center.y + Math.sin(angle) * radiusY * shrink,
          });
        }
        const lastOrbit = points[points.length - 1];
        const easeLand = gsap.parseEase("power2.out");
        for (let i = 1; i <= 16; i++) {
          const u = easeLand(i / 16);
          points.push({
            x: lastOrbit.x + (landing.x - lastOrbit.x) * u,
            y: lastOrbit.y + (landing.y - lastOrbit.y) * u,
          });
        }

        place(points[0], 1);
        gsap.set(eagle, { autoAlpha: 1 });
        flutter.play(0);

        const tl = gsap.timeline({
          onComplete: () => {
            flutter.kill();
            gsap.set([wingLeftRef.current, wingRightRef.current], { rotate: 0 });
          },
        });

        tl.to(eagle, {
          motionPath: { path: points, curviness: 1.15, autoRotate: 90 },
          duration: FLIGHT_DURATION,
          ease: "power1.inOut",
        }, 0);

        tl.to(eagle, {
          scale: LAND_SCALE,
          duration: FLIGHT_DURATION * (1 - ORBIT_PORTION),
          ease: "power2.out",
        }, FLIGHT_DURATION * ORBIT_PORTION);

        tl.to([wingLeftRef.current, wingRightRef.current], {
          rotate: (i) => (i === 0 ? -50 : 50),
          transformOrigin: "50% 50%",
          duration: FLIGHT_DURATION * (1 - ORBIT_PORTION) * 0.7,
          ease: "power2.out",
          onStart: () => flutter.pause(),
        }, FLIGHT_DURATION * ORBIT_PORTION + FLIGHT_DURATION * (1 - ORBIT_PORTION) * 0.3);
      };

      // Ne se joue qu'une fois, quand le bloc logo entre à l'écran
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            runFlight();
            io.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      io.observe(scene);

      // Recale l'aigle posé si la fenêtre est redimensionnée (rotation mobile, etc.)
      let resizeT: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => {
          if (hasPlayedRef.current) place(computeTarget(), LAND_SCALE);
        }, 150);
      };
      window.addEventListener("resize", onResize);

      return () => {
        io.disconnect();
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeT);
      };
    },
    { scope: sceneRef }
  );

  return (
    <div
      ref={sceneRef}
      className="pointer-events-none absolute inset-0 select-none"
      style={{ "--eagle-size": "clamp(34px, 9vw, 84px)" } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg
        ref={eagleRef}
        viewBox="0 0 220 160"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "var(--eagle-size)",
          height: "var(--eagle-size)",
          visibility: "hidden",
          filter: "drop-shadow(0 0 10px rgba(0,123,255,0.55))",
        }}
      >
        <g fill="var(--color-z-blue)">
          <path d="M96,104 L84,138 L110,126 L136,138 L124,104 Z" />
          <ellipse cx="110" cy="78" rx="16" ry="30" />
          <g ref={wingLeftRef} style={{ transformOrigin: "96px 70px", transformBox: "view-box" }}>
            <path d="M96,55 C60,45 25,45 12,55 L20,62 L10,70 L22,75 L14,84 L26,88 L96,100 Z" />
          </g>
          <g ref={wingRightRef} style={{ transformOrigin: "124px 70px", transformBox: "view-box" }}>
            <path d="M124,55 C160,45 195,45 208,55 L200,62 L210,70 L198,75 L206,84 L194,88 L124,100 Z" />
          </g>
          <circle cx="110" cy="38" r="13" />
          <polygon points="103,48 110,60 117,48" />
        </g>
      </svg>
    </div>
  );
}