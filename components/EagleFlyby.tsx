"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin, useGSAP);

const ORBIT_DURATION = 9; // secondes par tour complet, vol lent

type Point = { x: number; y: number };

export default function EagleFlyby() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const eagleRef = useRef<SVGSVGElement>(null);
  const wingLeftRef = useRef<SVGGElement>(null);
  const wingRightRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const scene = sceneRef.current;
      const eagle = eagleRef.current;
      if (!scene || !eagle) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return; // reste caché, aucune animation
      }

      const buildOrbitPoints = (): Point[] => {
        const rect = scene.getBoundingClientRect();
        const center = { x: rect.width / 2, y: rect.height / 2 };
        const radiusX = Math.min(rect.width * 0.85, window.innerWidth * 0.38);
        const radiusY = Math.min(rect.height * 1.15, window.innerHeight * 0.24, radiusX * 0.55);
        const samples = 48;
        const pts: Point[] = [];
        for (let i = 0; i <= samples; i++) {
          const angle = -Math.PI / 2 + (i / samples) * Math.PI * 2;
          pts.push({
            x: center.x + Math.cos(angle) * radiusX,
            y: center.y + Math.sin(angle) * radiusY,
          });
        }
        return pts; // premier et dernier point identiques -> boucle sans à-coup
      };

      gsap.set(eagle, { xPercent: -50, yPercent: -50, autoAlpha: 1 });

      const flutter = gsap.to([wingLeftRef.current, wingRightRef.current], {
        rotate: (i) => (i === 0 ? 6 : -6),
        transformOrigin: "50% 50%",
        duration: 0.9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      let orbitTween: gsap.core.Tween;

      const startOrbit = () => {
        const points = buildOrbitPoints();
        gsap.set(eagle, { x: points[0].x, y: points[0].y });
        orbitTween = gsap.to(eagle, {
          motionPath: { path: points, curviness: 1, autoRotate: 90 },
          duration: ORBIT_DURATION,
          ease: "none",
          repeat: -1,
        });
      };
      startOrbit();

      // Ne tourne que quand le hero est effectivement visible à l'écran
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            orbitTween.play();
            flutter.play();
          } else {
            orbitTween.pause();
            flutter.pause();
          }
        },
        { threshold: 0.1 }
      );
      io.observe(scene);

      let resizeT: ReturnType<typeof setTimeout>;
      const onResize = () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => {
          orbitTween.kill();
          startOrbit();
        }, 200);
      };
      window.addEventListener("resize", onResize);

      return () => {
        io.disconnect();
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeT);
        orbitTween.kill();
        flutter.kill();
      };
    },
    { scope: sceneRef }
  );

  return (
    <div
      ref={sceneRef}
      className="pointer-events-none absolute inset-0 select-none"
      style={{ "--eagle-size": "clamp(34px, 8vw, 72px)" } as React.CSSProperties}
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
        <g fill="var(--color-z-border)" stroke="var(--color-z-blue)" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M96,104 L84,138 L110,126 L136,138 L124,104 Z" />
            <ellipse cx="110" cy="78" rx="16" ry="30" />
            <g ref={wingLeftRef} style={{ transformOrigin: "96px 70px", transformBox: "view-box" }}>
                <path d="M96,55 C60,45 25,45 12,55 L20,62 L10,70 L22,75 L14,84 L26,88 L96,100 Z" />
            </g>
            <g ref={wingRightRef} style={{ transformOrigin: "124px 70px", transformBox: "view-box" }}>
                <path d="M124,55 C160,45 195,45 208,55 L200,62 L210,70 L198,75 L206,84 L194,88 L124,100 Z" />
            </g>
        </g>
        <g fill="var(--color-z-text)">
            <circle cx="110" cy="38" r="13" />
            <polygon points="103,48 110,60 117,48" />
        </g>
      </svg>
    </div>
  );
}