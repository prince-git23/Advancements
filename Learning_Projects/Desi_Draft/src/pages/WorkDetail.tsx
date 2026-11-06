import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProject, projects } from '../data/work';
import { PlaceholderMedia } from '../components/Placeholder';
import { Sticker } from '../components/art/Stickers';
import { WobblyUnderline } from '../components/art/Doodles';
import { SZ } from '../components/art/sizes';
import { Footer } from '../components/Footer';

export function WorkDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    document.title = project ? `${project.title} — desi draft` : 'work — desi draft';
  }, [project]);

  if (!project) {
    return (
      <main className="grid min-h-[100svh] place-items-center bg-cream px-6 text-center">
        <div>
          <h1 className="display mb-4 text-[clamp(2rem,5vw,4rem)]">nothing here (yet)</h1>
          <Link to="/work" className="text-[14px] underline underline-offset-4">
            back to all work
          </Link>
        </div>
      </main>
    );
  }

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <main className="bg-cream px-3 pb-6 pt-[88px]">
        <div className="mx-auto w-full max-w-[1500px]">
          <div className="relative overflow-hidden rounded-[24px]">
            <PlaceholderMedia
              seed={index}
              compact
              className="aspect-[16/9] w-full md:aspect-[21/9]"
              active
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-6 md:p-10">
              <h1 className="display text-[clamp(2.2rem,6vw,5rem)] text-cream">{project.title}</h1>
              <p className="mt-2 max-w-[560px] text-[15px] text-cream/85">{project.subtitle}</p>
            </div>
            <span className="absolute -bottom-2 right-6 md:right-12">
              <Sticker kind={project.sticker} size={SZ.workDetail} rotate={-10} />
            </span>
          </div>

          <div className="mx-auto mt-10 max-w-[1000px] px-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-ink px-4 py-2 text-[12px] lowercase text-cream">
                {project.client}
              </span>
              <span className="rounded-full border border-ink/20 px-4 py-2 text-[12px] lowercase text-ink/70">
                {project.type}
              </span>
              <Link to="/work" className="ml-auto text-[12px] text-ink/60 hover:text-ink">
                ← all work
              </Link>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <p className="display text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.05] md:col-span-3">
                {project.subtitle}.
              </p>
              <p className="text-[16px] leading-[1.55] text-ink/75">{project.blurb}</p>
              <p className="text-[16px] leading-[1.55] text-ink/75">
                We started with the audience, not the brand: three weeks of comment-section research, a
                content system the in-house team could run, and a shoot plan built around formats rather
                than ads.
              </p>
              <p className="text-[16px] leading-[1.55] text-ink/75">
                Then we made it. Strategy, casting, production, edit and distribution under one roof — so
                the first post landed while the campaign was still warm.
              </p>
            </div>

            <div className="mt-14 grid gap-6 border-y border-ink/10 py-10 sm:grid-cols-3">
              {project.stats.map((s) => (
                <div key={s.label}>
                  <p className="display text-[clamp(2.2rem,4vw,3.6rem)] leading-none">{s.value}</p>
                  <p className="mt-2 text-[13px] lowercase text-ink/55">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((n) => (
                <PlaceholderMedia
                  key={n}
                  seed={index + n + 2}
                  label={`${project.title} — frame ${n + 1}`}
                  className="aspect-[4/5] w-full rounded-[18px]"
                  active={false}
                />
              ))}
            </div>

            <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-end">
              <div>
                <p className="text-[12px] lowercase text-ink/45">next project</p>
                <Link to={`/work/${next.slug}`} className="relative mt-1 inline-block">
                  <span className="display text-[clamp(1.6rem,3vw,2.4rem)]">{next.title}</span>
                  <WobblyUnderline className="absolute -bottom-1 left-0 h-[8px] w-full text-ink/40" strokeWidth={2} />
                </Link>
              </div>
              <Link
                to="/work"
                className="rounded-full border border-ink/20 px-5 py-2.5 text-[12px] transition-colors hover:border-ink/60"
              >
                all our work →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
