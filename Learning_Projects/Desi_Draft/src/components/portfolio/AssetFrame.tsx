import { useEffect, useRef, useState } from 'react';
import type { MediaSlot } from '../../data/portfolio';

/**
 * Every frame on the site goes through here.
 *
 * With a real `src` it renders the image or a controllable video at the source
 * aspect ratio. Without one it renders a designed asset slot: the brand colour,
 * printer's crop marks, the source ratio and the exact frame still to be shot.
 * The slot is honest about being empty, and it is drawn as a plate rather than
 * a broken image.
 */

/** Videos only ever play one at a time, and never in a hidden tab. */
const playing = new Set<HTMLVideoElement>();

const ratioText = (ratio: string) => ratio.replace(/\s/g, '');

function Marks({ color }: { color: string }) {
  const base = 'pointer-events-none absolute h-[14px] w-[14px]';
  return (
    <>
      <span className={`${base} left-3 top-3 border-l border-t`} style={{ borderColor: `${color}66` }} />
      <span className={`${base} right-3 top-3 border-r border-t`} style={{ borderColor: `${color}66` }} />
      <span className={`${base} bottom-3 left-3 border-b border-l`} style={{ borderColor: `${color}66` }} />
      <span className={`${base} bottom-3 right-3 border-b border-r`} style={{ borderColor: `${color}66` }} />
    </>
  );
}

/**
 * Empty frame: a paper plate with the source ratio and the shot that is missing.
 * Deliberately not a photograph, gradient or illustration — an unfinished frame
 * should read as unfinished, not as artwork standing in for the work.
 */
export function AssetSlot({
  slot,
  className = '',
  ratio,
  bare = false,
}: {
  slot: MediaSlot;
  className?: string;
  ratio?: string;
  bare?: boolean;
}) {
  // The printed ratio is the source spec. A responsive plate (ratio="auto")
  // is composed by its class, so it prints no ratio rather than a wrong one.
  const spec = ratio === 'auto' ? null : ratio ?? slot.ratio;

  return (
    <div
      className={`relative isolate overflow-hidden bg-[#E9E4DA] ${className}`}
      style={{ aspectRatio: spec ?? undefined }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-10 h-[3px]"
        style={{ background: slot.color ?? '#8499F8' }}
      />
      <span aria-hidden="true" className="absolute inset-0 border border-ink/10" />

      <Marks color="#0A0A0A" />

      {!bare ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-7 text-center">
          {slot.caption && (
            <p className="display text-[clamp(0.95rem,1.4vw,1.2rem)] leading-[1.15] text-ink/70">
              {slot.caption}
            </p>
          )}
          <p className="max-w-[34ch] text-[11px] leading-[1.5] text-ink/60">{slot.slot}</p>
          {spec && (
            <span className="mt-1 text-[9px] uppercase tabular-nums tracking-[0.2em] text-ink/60">
              frame pending · {ratioText(spec)}
            </span>
          )}
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
          {slot.caption && (
            <p className="display text-[clamp(1rem,1.5vw,1.35rem)] leading-[1.1] text-ink/70">
              {slot.caption}
            </p>
          )}
          <p className="mt-1.5 max-w-[38ch] text-[9px] uppercase leading-[1.6] tracking-[0.14em] text-ink/60">
            {slot.slot}
            {spec ? ` · ${ratioText(spec)}` : ''} · frame pending
          </p>
        </div>
      )}
    </div>
  );
}

function VideoAsset({ slot, className = '' }: { slot: MediaSlot; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const onPlay = () => {
      playing.forEach((other) => {
        if (other !== video) other.pause();
      });
      playing.add(video);
      setPaused(false);
    };
    const onPause = () => {
      playing.delete(video);
      setPaused(true);
    };
    const onVis = () => {
      if (document.visibilityState === 'hidden') video.pause();
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      document.removeEventListener('visibilitychange', onVis);
      playing.delete(video);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden bg-ink ${className}`} style={{ aspectRatio: slot.ratio }}>
      <video
        ref={ref}
        src={slot.src}
        poster={slot.poster}
        muted={muted}
        loop
        playsInline
        preload="none"
        aria-label={slot.alt}
        className="h-full w-full object-contain"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget as HTMLVideoElement & {
            mozHasAudio?: boolean;
            webkitAudioDecodedByteCount?: number;
            audioTracks?: { length: number };
          };
          if (v.mozHasAudio || (v.webkitAudioDecodedByteCount ?? 0) > 0 || (v.audioTracks?.length ?? 0) > 0) {
            setHasAudio(true);
          }
        }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
        <button
          type="button"
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            if (v.paused) void v.play();
            else v.pause();
          }}
          aria-label={paused ? `Play ${slot.alt}` : `Pause ${slot.alt}`}
          className="grid h-9 w-9 place-items-center rounded-full bg-cream/90 text-ink"
        >
          {paused ? (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M3 1l8 5-8 5z" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="2" y="1" width="3" height="10" />
              <rect x="7" y="1" width="3" height="10" />
            </svg>
          )}
        </button>
        {hasAudio && (
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-pressed={!muted}
            aria-label={muted ? 'Turn sound on' : 'Mute sound'}
            className="grid h-9 w-9 place-items-center rounded-full border border-cream/50 text-cream"
          >
            {muted ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
                <path d="M17 9l4 6M21 9l-4 6" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4Z" fill="currentColor" stroke="none" />
                <path d="M16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14" />
              </svg>
            )}
          </button>
        )}
        <span className="ml-auto rounded-full bg-black/45 px-2 py-[3px] text-[10px] uppercase tracking-[0.14em] text-cream/80">
          {ratioText(slot.ratio)}
        </span>
      </div>
    </div>
  );
}

export function AssetFrame({
  slot,
  className = '',
  ratio,
  sizes,
  eager = false,
  bare = false,
}: {
  slot: MediaSlot;
  className?: string;
  /** 'auto' lets a class control the ratio; otherwise it comes from the source */
  ratio?: string;
  sizes?: string;
  eager?: boolean;
  /** hide the slot typography where the card supplies its own overlay */
  bare?: boolean;
}) {
  // A missing file degrades to the designed plate instead of a broken icon.
  const [failed, setFailed] = useState(false);

  if (slot.src && !failed) {
    const isVideo = /\.(mp4|webm|mov)$/i.test(slot.src);
    if (isVideo) return <VideoAsset slot={slot} className={className} />;
    return (
      <div
        className={`relative overflow-hidden bg-ink/5 ${className}`}
        style={{ aspectRatio: ratio === 'auto' ? undefined : ratio ?? slot.ratio }}
      >
        <img
          src={slot.src}
          srcSet={slot.srcSet}
          sizes={sizes ?? (slot.srcSet ? '(min-width: 1024px) 900px, 100vw' : undefined)}
          width={slot.width}
          height={slot.height}
          alt={slot.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
        />
        {/* Only a concept visual needs a standing label; the plans and sheets
            already carry their own titles inside the frame. */}
        {slot.tag && /concept/i.test(slot.tag) && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-cream/90 px-2.5 py-[3px] text-[9px] uppercase tracking-[0.16em] text-ink/65 backdrop-blur-sm">
            {slot.tag}
          </span>
        )}
        {/* Captions sit in pills rather than a full-width gradient band: a dark
            scrim over a pale sheet reads as a grey strip, and the caption has to
            stay legible on both a photograph and a paper-white board. */}
        {(slot.caption || slot.credit) && !bare && (
          <div className="pointer-events-none absolute inset-x-2 bottom-2 flex flex-wrap items-end justify-between gap-2">
            {slot.caption && (
              <p className="max-w-[72%] rounded-full bg-ink/[0.72] px-2.5 py-[5px] text-[10px] uppercase leading-none tracking-[0.12em] text-cream/90 backdrop-blur-sm">
                {slot.caption}
              </p>
            )}
            {slot.credit && (
              <p className="rounded-full bg-ink/45 px-2 py-[4px] text-[8.5px] uppercase leading-none tracking-[0.1em] text-cream/70">
                {slot.credit}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
  return <AssetSlot slot={slot} className={className} ratio={ratio} bare={bare} />;
}
