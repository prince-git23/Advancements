import { useEffect, useRef } from 'react';
import { gsap } from '../lib/smooth';
import { usePrefersReducedMotion } from '../lib/hooks';
import { media } from '../data/media';
import { team } from '../data/team';
import { ProfileCard } from './ui/ProfileCard';
import { openContact } from './ContactDialog';
import { Chapter } from './ui/Chapter';
import { Sticker } from './art/Stickers';

const COUNT_WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

/**
 * Normal-height, content-driven team section: one ProfileCard per active member
 * (the studio is three people) on a 3/2/1 column grid. The count and the roles
 * come from `data/team`, so nothing has to be rewritten when a member changes.
 */
export function Team() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const count = COUNT_WORD[team.length] ?? String(team.length);
  const roles = team.map((member) => member.role);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || reduced) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>('[data-team-card]'));
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        y: 26,
        autoAlpha: 0,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.07,
        scrollTrigger: { trigger: grid, start: 'top 88%', once: true },
      });
    }, grid);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="team"
      data-theme="motion"
      className="relative isolate scroll-mt-[72px] bg-ink dd-pad pb-[9vh] pt-[10vh] text-cream md:pb-[12vh] md:pt-[14vh]"
    >
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="team-heading mx-auto max-w-[1100px] text-center">
          <Chapter no="05" name="the people" tone="cream" align="center" className="mb-5" />
          <h2 className="display text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.02]">
            {count} people, <span className="serif-i">one studio.</span>
          </h2>
          <p className="mt-5 text-[12px] uppercase tracking-[0.18em] text-cream/70">
            {roles.join(' · ')}
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-[6vh] grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-[8vh] md:gap-6 lg:grid-cols-3"
        >
          {team.map((member, index) => {
            const lastAlone = team.length % 2 === 1 && index === team.length - 1;
            return (
              <div
                key={member.id}
                data-team-card
                className={`h-full ${
                  lastAlone
                    ? 'sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.625rem)] lg:col-span-1 lg:mx-0 lg:w-full'
                    : ''
                }`}
              >
                <ProfileCard
                  index={index}
                  name={member.name}
                  role={member.role}
                  status={member.status}
                  image={member.photo ?? media.teamPhotos[member.id] ?? media.teamPhotos[member.name] ?? ''}
                  intro={member.intro}
                  accent={member.band}
                  accentInk={member.bandInk}
                  surface={member.card}
                  theme="light"
                  radius={22}
                  enableTilt
                  tiltStrength={5}
                  parallax={3}
                  holo={0.35}
                  glare={0.25}
                  enableMobileTilt={false}
                  onContact={() =>
                    openContact({
                      title: `hello ${member.name}`,
                      subject: `hello ${member.name} — desi draft`,
                    })
                  }
                  contactLabel="say hi"
                  contactAriaLabel={`Contact desi draft about ${member.name}`}
                  sticker={
                    <Sticker
                      kind={member.sticker}
                      size={56}
                      rotate={member.stickerSide === 'left' ? -8 : 8}
                    />
                  }
                />
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.18em] text-cream/70">
          {team.every((member) => member.photo)
            ? 'the people behind the work'
            : 'portraits in progress · roles shown as credited'}
        </p>
      </div>
    </section>
  );
}
