import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { enquiryHref, hasEmail, site, socialLinks } from '../data/site';
import { sendEnquiry } from '../lib/enquiry';
import { Modal } from './Modal';

const EVENT = 'dd:contact';

type Detail = { title?: string; subject?: string };

/**
 * Opens the on-site contact dialog. Every enquiry CTA reaches the studio
 * through this panel, whether or not a public inbox exists.
 */
export function openContact(detail: Detail = {}) {
  window.dispatchEvent(new CustomEvent<Detail>(EVENT, { detail }));
}

/**
 * One CTA, one honest destination.
 *
 * - verified inbox  → mailto link (desktop + mobile both hand off to the mail app)
 * - no inbox        → button that opens the contact panel
 *
 * The rendered element carries the caller's classes, so the existing buttons
 * keep their exact styling and only their tag changes.
 */
export function EnquiryButton({
  subject,
  className,
  children,
  title,
}: {
  subject: string;
  className?: string;
  children: ReactNode;
  title?: string;
}) {
  const href = enquiryHref(subject);
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => openContact({ title, subject })} className={className}>
      {children}
    </button>
  );
}

/** Matches the server's allow-list; anything else is stored as "something else". */
const PROJECTS = [
  'content production',
  'creative strategy',
  'digital experiences',
  'visual communication',
  'creative spaces',
  'something else',
];

const field =
  'w-full rounded-[10px] border border-ink/20 bg-white/55 px-3 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-ink';

const label = 'mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-ink/60';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactDialog() {
  const [state, setState] = useState<{ open: boolean; title: string; subject: string }>({
    open: false,
    title: 'start a project',
    subject: 'Project enquiry',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<Detail>).detail ?? {};
      setState({
        open: true,
        title: detail.title ?? 'start a project',
        subject: detail.subject ?? 'Project enquiry',
      });
      setStatus('idle');
      setError('');
      setFields({});
    };
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, []);

  const close = () => setState((s) => ({ ...s, open: false }));
  const mailto = enquiryHref(state.subject);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus('sending');
    setError('');
    setFields({});

    const result = await sendEnquiry({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      project: String(data.get('project') ?? ''),
      timeline: String(data.get('timeline') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
      source: state.subject,
    });

    if (result.ok) {
      form.reset();
      setStatus('sent');
    } else {
      setStatus('error');
      setError(result.error);
      setFields(result.fields ?? {});
    }
  };

  return (
    <Modal open={state.open} onClose={close} title={state.title}>
      {status === 'sent' ? (
        <div aria-live="polite">
          <p className="text-[15px] leading-[1.5] text-ink/80">
            Got it. The message is with the studio and we will reply to the address you left.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={close}
              className="display flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[15px] text-cream transition-transform duration-300 hover:-translate-y-[2px]"
            >
              close
            </button>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="text-[13px] text-ink/60 underline underline-offset-4 transition-colors hover:text-ink"
            >
              send another message
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-4 text-[14px] leading-[1.45] text-ink/70">
            Tell us what you are making, who it is for, and when it has to be live.
          </p>

          <form onSubmit={onSubmit} noValidate>
            <div className="space-y-3">
              <div>
                <label className={label} htmlFor="dd-name">
                  name
                </label>
                <input
                  id="dd-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={120}
                  placeholder="your name"
                  className={field}
                  aria-invalid={Boolean(fields.name)}
                  aria-describedby={fields.name ? 'dd-name-error' : undefined}
                />
                {fields.name && (
                  <p id="dd-name-error" className="mt-1 text-[11.5px] text-[#9B2155]">
                    {fields.name}
                  </p>
                )}
              </div>

              <div>
                <label className={label} htmlFor="dd-email">
                  email
                </label>
                <input
                  id="dd-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  maxLength={200}
                  placeholder="you@studio.com"
                  className={field}
                  aria-invalid={Boolean(fields.email)}
                  aria-describedby={fields.email ? 'dd-email-error' : undefined}
                />
                {fields.email && (
                  <p id="dd-email-error" className="mt-1 text-[11.5px] text-[#9B2155]">
                    {fields.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label} htmlFor="dd-project">
                    project
                  </label>
                  <select id="dd-project" name="project" defaultValue="something else" className={field}>
                    {PROJECTS.map((project) => (
                      <option key={project} value={project}>
                        {project}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={label} htmlFor="dd-timeline">
                    timeline
                  </label>
                  <input
                    id="dd-timeline"
                    name="timeline"
                    type="text"
                    maxLength={80}
                    placeholder="optional"
                    className={field}
                  />
                </div>
              </div>

              <div>
                <label className={label} htmlFor="dd-message">
                  the brief
                </label>
                <textarea
                  id="dd-message"
                  name="message"
                  required
                  rows={4}
                  maxLength={4000}
                  placeholder="what you are making, and what it has to do"
                  className={`${field} resize-none`}
                  aria-invalid={Boolean(fields.message)}
                  aria-describedby={fields.message ? 'dd-message-error' : undefined}
                />
                {fields.message && (
                  <p id="dd-message-error" className="mt-1 text-[11.5px] text-[#9B2155]">
                    {fields.message}
                  </p>
                )}
              </div>

              {/* Honeypot — hidden from people and assistive tech, filled by bots. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="dd-website">website</label>
                <input id="dd-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
            </div>

            {status === 'error' && error && (
              <p role="alert" className="mt-3 text-[12px] leading-[1.4] text-[#9B2155]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="display mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[15px] text-cream transition-transform duration-300 hover:-translate-y-[2px] disabled:translate-y-0 disabled:opacity-70"
            >
              {status === 'sending' ? 'sending…' : 'send it'}
              {status !== 'sending' && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <div className="mt-4 border-t border-ink/12 pt-3">
            {hasEmail && mailto && (
              <p className="text-[12px] leading-[1.4] text-ink/60">
                Prefer email?{' '}
                <a href={mailto} className="underline underline-offset-4 transition-colors hover:text-ink">
                  {site.email}
                </a>
              </p>
            )}
            {socialLinks.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {socialLinks.map(([network, url]) => (
                  <li key={network}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[12px] lowercase underline underline-offset-4 text-ink/60 transition-colors hover:text-ink"
                    >
                      {network}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {!hasEmail && socialLinks.length === 0 && (
              <p className="text-[12px] leading-[1.4] text-ink/55">
                This form is the studio&apos;s inbox. Case studies are the best way to see how we work:{' '}
                <Link to="/work" onClick={close} className="underline underline-offset-4 hover:text-ink">
                  read the case studies
                </Link>
                .
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
