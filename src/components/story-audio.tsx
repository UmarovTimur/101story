"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2, Pause, Play } from "lucide-react";
import type { PlayerLabels } from "@/lib/i18n";
import { formatTime } from "@/lib/format";
import { getProgress, markDone, savePosition } from "@/lib/progress";
import { useScrollHide } from "@/hooks/use-scroll-hide";
import { cn } from "@/lib/utils";

// Аудио истории: один <audio> на страницу и два вида управления —
// полная панель под заголовком и мини-панель, прилипающая к низу экрана
// (на мобайле мини-панель видна всегда, на десктопе — когда панель уехала вверх).

const RATES = [0.75, 1, 1.25, 1.5];
const SAVE_EVERY_SEC = 5;
/** сдвиг пальца (px), после которого жест считается перемоткой, а не тапом */
const SCRUB_SLOP = 8;

interface StoryAudioState {
  playing: boolean;
  current: number;
  duration: number;
  buffering: boolean;
  error: boolean;
  rate: number;
  docked: boolean;
  labels: PlayerLabels;
  toggle: () => void;
  skip: (delta: number) => void;
  seekTo: (t: number) => void;
  cycleRate: () => void;
  setDocked: (docked: boolean) => void;
}

const StoryAudioContext = React.createContext<StoryAudioState | null>(null);

function useStoryAudio() {
  const ctx = React.useContext(StoryAudioContext);
  if (!ctx) throw new Error("useStoryAudio must be used inside StoryAudioProvider");
  return ctx;
}

export function StoryAudioProvider({
  src,
  lang,
  storyId,
  title,
  artist,
  artwork,
  initialDuration,
  labels,
  children,
}: {
  src: string;
  lang: string;
  storyId: string;
  title: string;
  artist: string;
  artwork: string;
  /** длительность, посчитанная при сборке — чтобы показать время до загрузки */
  initialDuration: number | null;
  labels: PlayerLabels;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLAudioElement>(null);
  const pendingSeek = React.useRef<number | null>(null);
  const lastSaved = React.useRef(0);
  const [playing, setPlaying] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(initialDuration ?? 0);
  const [buffering, setBuffering] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [rate, setRate] = React.useState(1);
  const [docked, setDocked] = React.useState(false);

  const persist = React.useCallback(
    (t: number) => {
      lastSaved.current = t;
      savePosition(lang, storyId, t, initialDuration);
    },
    [lang, storyId, initialDuration]
  );

  // Восстанавливаем позицию и запоминаем историю как «где мы остановились».
  React.useEffect(() => {
    const saved = getProgress(lang).positions[storyId] ?? 0;
    const resumable = saved > 5 && (!initialDuration || saved < initialDuration - 5);
    if (resumable) {
      pendingSeek.current = saved;
      setCurrent(saved);
    }
    persist(resumable ? saved : 0);
  }, [lang, storyId, initialDuration, persist]);

  // Сохраняем позицию при уходе со страницы или переходе к другой истории.
  React.useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const save = () => {
      if (a.currentTime > 0 && !a.ended) persist(a.currentTime);
    };
    window.addEventListener("pagehide", save);
    return () => {
      window.removeEventListener("pagehide", save);
      save();
    };
  }, [persist]);

  const toggle = React.useCallback(() => {
    const a = ref.current;
    if (!a || error) return;
    if (a.paused) {
      if (a.readyState < 3) setBuffering(true);
      a.play().catch(() => setBuffering(false));
    } else {
      a.pause();
    }
  }, [error]);

  const seekTo = React.useCallback(
    (t: number) => {
      const a = ref.current;
      if (!a) return;
      const max = isFinite(a.duration) ? a.duration : duration;
      const next = Math.min(Math.max(t, 0), max || 0);
      if (a.readyState === 0) pendingSeek.current = next;
      else a.currentTime = next;
      setCurrent(next);
    },
    [duration]
  );

  const skip = React.useCallback(
    (delta: number) => {
      const a = ref.current;
      if (!a) return;
      const from = a.readyState === 0 ? (pendingSeek.current ?? 0) : a.currentTime;
      seekTo(from + delta);
    },
    [seekTo]
  );

  const cycleRate = React.useCallback(() => {
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    const a = ref.current;
    if (a) {
      a.playbackRate = next;
      a.defaultPlaybackRate = next;
    }
    setRate(next);
  }, [rate]);

  // Управление с экрана блокировки / наушников.
  React.useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    session.metadata = new MediaMetadata({ title, artist, artwork: [{ src: artwork }] });
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => void ref.current?.play()],
      ["pause", () => ref.current?.pause()],
      ["seekbackward", () => skip(-10)],
      ["seekforward", () => skip(10)],
      ["seekto", (d) => d.seekTime != null && seekTo(d.seekTime)],
    ];
    for (const [action, handler] of handlers) {
      try {
        session.setActionHandler(action, handler);
      } catch {
        // действие не поддерживается браузером
      }
    }
    return () => {
      for (const [action] of handlers) {
        try {
          session.setActionHandler(action, null);
        } catch {
          // действие не поддерживается браузером
        }
      }
    };
  }, [title, artist, artwork, skip, seekTo]);

  const value = React.useMemo<StoryAudioState>(
    () => ({
      playing,
      current,
      duration,
      buffering,
      error,
      rate,
      docked,
      labels,
      toggle,
      skip,
      seekTo,
      cycleRate,
      setDocked,
    }),
    [playing, current, duration, buffering, error, rate, docked, labels, toggle, skip, seekTo, cycleRate]
  );

  return (
    <StoryAudioContext.Provider value={value}>
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const a = e.currentTarget;
          if (isFinite(a.duration)) setDuration(a.duration);
          if (pendingSeek.current != null) {
            a.currentTime = pendingSeek.current;
            pendingSeek.current = null;
          }
          a.playbackRate = rate;
        }}
        onTimeUpdate={(e) => {
          if (pendingSeek.current != null) return;
          const t = e.currentTarget.currentTime;
          setCurrent(t);
          if (Math.abs(t - lastSaved.current) >= SAVE_EVERY_SEC) persist(t);
        }}
        onPlay={() => setPlaying(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onWaiting={() => setBuffering(true)}
        onPause={(e) => {
          setPlaying(false);
          setBuffering(false);
          if (!e.currentTarget.ended) persist(e.currentTarget.currentTime);
        }}
        onEnded={() => {
          setPlaying(false);
          markDone(lang, storyId);
          persist(0);
        }}
        onError={() => {
          setError(true);
          setBuffering(false);
        }}
      />
      {children}
    </StoryAudioContext.Provider>
  );
}

/** Полная панель: прогресс — её верхняя кромка, скруглены только нижние углы. */
export function AudioPanel() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { setDocked } = useStoryAudio();

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      setDocked(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [setDocked]);

  return (
    <div ref={ref} data-nosnippet className="hidden overflow-hidden rounded-b-lg border border-t-0 bg-card md:block">
      <Scrubber className="h-1.5" />
      <div className="flex items-center gap-3.5 px-[18px] py-3.5">
        <PlayButton className="size-12" />
        <SkipButton delta={-10} />
        <SkipButton delta={10} />
        <TimeReadout className="text-[13px]" />
        <RateButton className="ms-auto" />
      </div>
    </div>
  );
}

/**
 * Мини-панель внизу экрана. На мобайле — плавающая «пилюля» той же высоты
 * и формы, что и шапка (.floating-bar), прогресс — бледная заливка фона
 * цветом акцента. На md+ — карточка с превью и прогрессом сверху.
 */
export function AudioDock({ title, image }: { title: string; image: string }) {
  const { docked } = useStoryAudio();
  const hidden = useScrollHide();

  return (
    <div
      role="region"
      aria-label={title}
      data-nosnippet
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-dock px-[--bar-gap-x] pb-[max(var(--bar-gap),env(safe-area-inset-bottom))] transition-transform duration-200 animate-in fade-in slide-in-from-bottom-4 md:px-0 md:pb-3",
        hidden ? "translate-y-full" : "translate-y-0",
        !docked && "md:hidden"
      )}
    >
      <div className="floating-bar pointer-events-auto relative mx-auto max-w-[720px] overflow-hidden md:rounded-lg md:border md:border-input md:bg-card md:shadow-dock">
        <DockProgress />
        <Scrubber className="hidden h-[5px] md:block" />
        {/* Строка пропускает касания к DockProgress под ней — кроме кнопок. */}
        <div className="relative flex h-full items-center gap-1.5 pe-2 ps-5 max-md:pointer-events-none max-md:[&_button]:pointer-events-auto md:gap-3 md:px-3.5 md:py-[11px]">
          <div className="hidden w-[60px] flex-none rounded bg-plate p-[3px] md:block">
            <div className="relative aspect-video overflow-hidden rounded-[2px]">
              <Image src={image} alt={title} title={title} fill sizes="60px" className="plate-img object-cover" />
            </div>
          </div>
          <div className="me-1 flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="truncate text-[13.5px] leading-tight">{title}</span>
            <TimeReadout className="text-[11.5px] leading-tight" />
          </div>
          <SkipButton delta={-10} />
          <PlayButton className="size-10 md:size-11" />
          <SkipButton delta={10} />
        </div>
      </div>
    </div>
  );
}

/** Текст истории; первое слово набрано шрифтом заголовков. */
export function StoryText({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="story-text flex max-w-[62ch] flex-col gap-[22px]">
      {paragraphs.map((p, i) => (
        <p key={i}>{i === 0 ? <FirstWord text={p} /> : p}</p>
      ))}
    </div>
  );
}

function FirstWord({ text }: { text: string }) {
  const space = text.indexOf(" ");
  if (space < 0) return <>{text}</>;
  return (
    <>
      <span className="font-display tracking-[.04em]">{text.slice(0, space)}</span>
      {text.slice(space)}
    </>
  );
}

/**
 * Прогресс мобильной пилюли: заливка фона акцентом от начала до текущей
 * позиции. Перемотка — как у обычного ползунка: ведёте пальцем по панели
 * вбок, позиция следует за пальцем. Жест включается только после сдвига
 * по горизонтали, поэтому простой тап по названию ничего не перематывает,
 * а вертикальный свайп по-прежнему прокручивает страницу (touch-action: pan-y).
 */
function DockProgress() {
  const { current, duration, error, seekTo } = useStoryAudio();
  const [scrubbing, setScrubbing] = React.useState(false);
  const drag = React.useRef<{ id: number; x: number; y: number; active: boolean } | null>(null);
  const pct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  const seekAt = (el: HTMLElement, clientX: number) => {
    const r = el.getBoundingClientRect();
    let p = (clientX - r.left) / r.width;
    if (getComputedStyle(el).direction === "rtl") p = 1 - p;
    seekTo(Math.min(1, Math.max(0, p)) * duration);
  };

  const end = () => {
    drag.current = null;
    setScrubbing(false);
  };

  return (
    <div
      className="absolute inset-0 touch-pan-y select-none md:hidden"
      onPointerDown={(e) => {
        if (!duration || error) return;
        drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, active: false };
      }}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        if (!d.active) {
          const dx = Math.abs(e.clientX - d.x);
          const dy = Math.abs(e.clientY - d.y);
          if (dy > SCRUB_SLOP && dy > dx) return end();
          if (dx < SCRUB_SLOP) return;
          d.active = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setScrubbing(true);
        }
        seekAt(e.currentTarget, e.clientX);
      }}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 start-0 border-e-2 border-transparent",
          scrubbing
            ? "border-tint bg-tint/40 dark:bg-tint/45"
            : "bg-tint/25 transition-[width] duration-200 ease-linear dark:bg-tint/30"
        )}
        style={{ width: `${pct}%` }}
      />
      {/* Для клавиатуры и скринридеров: мышью/пальцем управляет жест выше. */}
      <SeekInput className="pointer-events-none absolute inset-0" />
    </div>
  );
}

function Scrubber({ className }: { className?: string }) {
  const { current, duration, buffering } = useStoryAudio();
  const pct = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <div
      className={cn(
        "relative bg-track transition-[height] has-[:focus-visible]:h-3",
        buffering && "loading-stripes",
        className
      )}
    >
      <span
        className="absolute inset-y-0 start-0 bg-accent transition-[width] duration-200 ease-linear"
        style={{ width: `${pct}%` }}
      />
      <SeekInput className="absolute inset-x-0 -top-2 h-[calc(100%+1rem)]" />
    </div>
  );
}

/** Невидимый ползунок перемотки поверх полосы прогресса. */
function SeekInput({ className }: { className?: string }) {
  const { current, duration, error, seekTo, labels } = useStoryAudio();

  return (
    <input
      type="range"
      min={0}
      max={duration}
      step={1}
      value={Math.min(current, duration)}
      disabled={!duration || error}
      onChange={(e) => seekTo(Number(e.currentTarget.value))}
      aria-label={labels.seek}
      aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
      className={cn("w-full cursor-pointer opacity-0 disabled:cursor-default", className)}
    />
  );
}

function PlayButton({ className }: { className?: string }) {
  const { playing, buffering, error, toggle, labels } = useStoryAudio();
  const Icon = buffering ? Loader2 : playing ? Pause : Play;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={error}
      aria-label={playing ? labels.pause : labels.play}
      aria-busy={buffering || undefined}
      className={cn(
        "grid flex-none place-items-center rounded-full transition-colors",
        buffering || error
          ? "bg-muted text-muted-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      <Icon
        aria-hidden
        className={cn("size-[18px]", buffering ? "animate-spin" : "fill-current", !playing && !buffering && "translate-x-px")}
      />
    </button>
  );
}

function SkipButton({ delta }: { delta: number }) {
  const { skip, buffering, error, duration, labels } = useStoryAudio();
  const disabled = buffering || error || !duration;

  return (
    <button
      type="button"
      onClick={() => skip(delta)}
      disabled={disabled}
      aria-label={delta < 0 ? labels.back10 : labels.forward10}
      className="grid size-10 flex-none place-items-center rounded-full border border-input tabular-nums text-[11.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:border-border disabled:text-muted-foreground/60 disabled:hover:bg-transparent"
    >
      <span className="text-optical">{delta < 0 ? `−${-delta}` : `+${delta}`}</span>
    </button>
  );
}

function TimeReadout({ className }: { className?: string }) {
  const { current, duration, buffering, error, labels } = useStoryAudio();

  return (
    <span
      aria-live="off"
      className={cn("text-optical flex-none whitespace-nowrap tabular-nums text-muted-foreground", className)}
    >
      {error ? (
        labels.error
      ) : buffering ? (
        <>
          {current > 0 ? formatTime(current) : "--:--"} / {labels.loading}
        </>
      ) : (
        <>
          <span className="text-foreground/80">{formatTime(current)}</span> / {formatTime(duration || null)}
        </>
      )}
    </span>
  );
}

function RateButton({ className }: { className?: string }) {
  const { rate, cycleRate, labels } = useStoryAudio();
  const text = `${(rate % 1 === 0 ? rate.toFixed(1) : String(rate)).replace(".", ",")}×`;

  return (
    <button
      type="button"
      onClick={cycleRate}
      aria-label={`${labels.speed}: ${text}`}
      className={cn(
        "grid h-[34px] flex-none place-items-center whitespace-nowrap rounded-md border border-input px-2.5 text-[13px] leading-none tabular-nums text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <span className="text-optical">{text}</span>
    </button>
  );
}
