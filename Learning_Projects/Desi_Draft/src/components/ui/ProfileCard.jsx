import { useEffect, useMemo, useRef, useState } from 'react';
import './ProfileCard.css';

const IDLE = { rx: 0, ry: 0, px: 0, py: 0, gx: 50, gy: 50 };

/**
 * Portrait profile card with a cursor-following glare, foil sheen, parallax and
 * a small tilt. Pointer work is written straight to CSS custom properties from
 * one rAF loop that only exists while the card is moving, so hovering a card
 * never re-renders React and an idle card costs nothing.
 */
export function ProfileCard({
  name = '',
  role = '',
  intro = '',
  handle = '',
  status = '',
  image = '',
  initials = '',
  index = 0,
  accent = '#4B63E8',
  accentInk = '#EEEAE3',
  surface = '#F3EEE6',
  theme = 'light',
  radius = 22,
  enableTilt = true,
  tiltStrength = 5,
  parallax = 3,
  holo = 0.35,
  glare = 0.25,
  enableMobileTilt = false,
  contactHref = '',
  onContact = null,
  contactLabel = 'say hi',
  contactAriaLabel = '',
  sticker = null,
  className = '',
}) {
  const cardRef = useRef(null);
  const tiltRef = useRef(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  const monogram = useMemo(() => {
    if (initials) return initials.slice(0, 2).toUpperCase();
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length > 1) {
      return parts.map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    }
    // One-word credits: first + last letter reads as a monogram instead of a
    // lone bar ("I"), and still comes only from the real credit.
    const word = parts[0] ?? '';
    return (word.length > 1 ? word[0] + word[word.length - 1] : word).toUpperCase() || '?';
  }, [initials, name]);

  useEffect(() => {
    const card = cardRef.current;
    const tilt = tiltRef.current;
    if (!card || !tilt) return;

    const current = { ...IDLE };
    const target = { ...IDLE };
    let raf = 0;
    let bound = false;

    const apply = () => {
      card.style.setProperty('--pc-rx', `${current.rx.toFixed(2)}deg`);
      card.style.setProperty('--pc-ry', `${current.ry.toFixed(2)}deg`);
      card.style.setProperty('--pc-px', `${current.px.toFixed(2)}px`);
      card.style.setProperty('--pc-py', `${current.py.toFixed(2)}px`);
      card.style.setProperty('--pc-gx', `${current.gx.toFixed(1)}%`);
      card.style.setProperty('--pc-gy', `${current.gy.toFixed(1)}%`);
    };

    // One loop per card, and only while it is easing towards the pointer.
    const tick = () => {
      raf = 0;
      let moving = false;
      for (const key of Object.keys(current)) {
        const delta = target[key] - current[key];
        if (Math.abs(delta) > 0.02) {
          current[key] += delta * 0.18;
          moving = true;
        } else {
          current[key] = target[key];
        }
      }
      apply();
      if (moving) raf = requestAnimationFrame(tick);
    };

    const reset = () => {
      Object.assign(target, IDLE);
      Object.assign(current, IDLE);
      tilt.dataset.active = 'false';
      apply();
    };

    const move = (event) => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const ny = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

      target.gx = nx * 100;
      target.gy = ny * 100;
      target.ry = (nx - 0.5) * 2 * tiltStrength;
      target.rx = (0.5 - ny) * 2 * tiltStrength;
      target.px = (0.5 - nx) * 2 * parallax;
      target.py = (0.5 - ny) * 2 * parallax;

      if (!raf) raf = requestAnimationFrame(tick);
    };

    const enter = () => {
      tilt.dataset.active = 'true';
    };

    const leave = () => {
      Object.assign(target, IDLE);
      tilt.dataset.active = 'false';
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const unbind = () => {
      if (!bound) return;
      card.removeEventListener('pointerenter', enter);
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', leave);
      bound = false;
    };

    const sync = () => {
      const wants =
        enableTilt &&
        !reduce.matches &&
        (fine.matches || (enableMobileTilt && coarse.matches));

      if (wants && !bound) {
        card.addEventListener('pointerenter', enter);
        card.addEventListener('pointermove', move, { passive: true });
        card.addEventListener('pointerleave', leave);
        bound = true;
      } else if (!wants) {
        unbind();
        reset();
      }
    };

    sync();
    reduce.addEventListener('change', sync);
    fine.addEventListener('change', sync);
    coarse.addEventListener('change', sync);

    // A layout change mid-hover would leave the card skewed; settle it.
    const observer = new ResizeObserver(() => reset());
    observer.observe(card);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      unbind();
      reduce.removeEventListener('change', sync);
      fine.removeEventListener('change', sync);
      coarse.removeEventListener('change', sync);
      observer.disconnect();
    };
  }, [enableTilt, tiltStrength, parallax, enableMobileTilt]);

  const showImage = Boolean(image) && !imageFailed;
  const number = String(index + 1).padStart(2, '0');

  return (
    <article
      ref={cardRef}
      className={`pc ${className}`}
      data-theme={theme}
      /* No portrait yet: the poster is flattened so six empty 4:5 panels do not
         dominate the section. It gets its full height back with a real photo. */
      data-portrait={showImage ? 'true' : 'false'}
      style={{
        '--pc-radius': `${radius}px`,
        '--pc-accent': accent,
        '--pc-accent-ink': accentInk,
        '--pc-surface': surface,
        '--pc-holo': holo,
        '--pc-glare': glare,
      }}
    >
      <div ref={tiltRef} className="pc-tilt" data-active="false">
        <div className="pc-shell">
          <div className="pc-media">
            {showImage ? (
              <img
                className="pc-portrait"
                src={image}
                alt={`${name} — ${role}`}
                loading="lazy"
                decoding="async"
                width="640"
                height="800"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="pc-fallback" aria-hidden="true">
                <span className="pc-monogram">{monogram}</span>
              </div>
            )}

            <span className="pc-glare" aria-hidden="true" />
            <span className="pc-foil" aria-hidden="true" />
            {sticker && <span className="pc-sticker">{sticker}</span>}
          </div>

          <div className="pc-body">
            {status && <span className="pc-status">{status}</span>}
            <h3 className="pc-name">{name}</h3>
            <p className="pc-role">{role}</p>
            {intro && <p className="pc-intro">{intro}</p>}
            {handle && <p className="pc-handle">@{handle.replace(/^@/, '')}</p>}

            <div className="pc-foot">
              <span className="pc-mark">desi draft / no. {number}</span>
              {contactHref ? (
                <a
                  className="pc-contact"
                  href={contactHref}
                  aria-label={contactAriaLabel || `${contactLabel} — ${name}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                  <span>{contactLabel}</span>
                </a>
              ) : onContact ? (
                <button
                  type="button"
                  className="pc-contact"
                  onClick={onContact}
                  aria-label={contactAriaLabel || `${contactLabel} — ${name}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                  <span>{contactLabel}</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ProfileCard;
