import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject, portfolio } from '../data/portfolio';
import { CaseStudy } from '../components/portfolio/CaseStudy';
import { setCanonical } from '../lib/meta';
import { Footer } from '../components/Footer';

/** Writes (or creates) a meta tag so the head follows the route. */
function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

export function WorkDetail() {
  const { slug = '' } = useParams();
  const project = getProject(slug);
  // Old URLs (e.g. /work/floral-meets-graffiti) move to the canonical slug.
  const legacy = portfolio.find((p) => p.legacySlugs?.includes(slug));

  useEffect(() => {
    if (!project) return;
    const title = project.seo?.title ?? `${project.title} — desi draft`;
    const description = project.seo?.description ?? project.standfirst;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:url', window.location.href);
    setCanonical(`/work/${project.slug}`);
  }, [project]);

  if (legacy) return <Navigate to={`/work/${legacy.slug}`} replace />;

  if (!project) {
    return (
      <>
        <main className="grid min-h-[100svh] place-items-center bg-cream px-6 text-center">
          <div>
            <h1 className="display mb-4 text-[clamp(2rem,5vw,4rem)]">nothing here (yet)</h1>
            <Link to="/work" className="text-[14px] underline underline-offset-4">
              back to all work
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="pb-4">
        <CaseStudy project={project} />
      </main>
      <Footer />
    </>
  );
}
