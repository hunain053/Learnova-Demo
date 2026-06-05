"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Clock3, Sparkles, Users } from "lucide-react";

const ICONS = {
  clock: Clock3,
  sparkles: Sparkles,
  "badge-check": BadgeCheck,
  users: Users,
};

export default function AnimatedStatCard({
  iconKey,
  value,
  suffix = "",
  label,
  description,
  accentClass = "from-blue-500 to-violet-600",
  iconTone = "text-blue-600",
}) {
  const cardRef = useRef(null);
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const Icon = ICONS[iconKey] || Clock3;

  useEffect(() => {
    const node = cardRef.current;

    if (!node || hasAnimated) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setHasAnimated(true);

        const duration = 1200;
        const startTime = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(value * easedProgress));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(value);
          }
        };

        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.45 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasAnimated, value]);

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800/70 dark:bg-slate-950/50"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accentClass} opacity-90`}
      />

      <div className="absolute inset-0 bg-linear-to-br from-white/70 via-transparent to-slate-100/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5 dark:to-white/0" />

      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              Learnova impact
            </p>
            <h3 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
              {count}
              {suffix}
            </h3>
          </div>

          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200/70 bg-slate-50/90 shadow-sm ${iconTone} dark:border-slate-800 dark:bg-slate-900/80`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div>
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
