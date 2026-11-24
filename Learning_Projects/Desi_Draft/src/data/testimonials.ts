/**
 * Testimonials — nine records, published.
 *
 * Provenance: the nine names and portraits were supplied with the project. The
 * quotation on each record was written by the studio and approved for
 * publication in review on 2026-11-23. No role, company or project is claimed,
 * because none was supplied and none may be invented for a named person.
 *
 * Before launch, each of the nine should still confirm their own line and their
 * portrait use. If one withdraws, set `approved: false` (or `consent.portrait:
 * false`) and the section drops that card on the next build; nothing else needs
 * to change.
 */

export type TestimonialRecord = {
  id: string;
  name: string;
  /** Verified job title, or null when the reviewer has not been named by role. */
  role: string | null;
  /** Verified company, only where the reviewer allows it to be named. */
  company: string | null;
  review: string;
  avatar: string;
  /** The piece of work the review is about, when it is relevant. */
  project: { label: string; href: string } | null;
  approved: boolean;
  consent: { portrait: boolean; company: boolean };
};

const portrait = (file: string) => `/images/testimonials/${file}-512.jpg`;

export const testimonials: TestimonialRecord[] = [
  {
    id: 'abhishek-rahangdale',
    name: 'Abhishek Rahangdale',
    role: null,
    company: null,
    review:
      'They asked what the feed was actually for before talking about formats. That question changed the whole plan.',
    avatar: portrait('Abhishek_Rahangdale'),
    project: null,
    approved: true,
    consent: { portrait: true, company: false },
  },
  {
    id: 'asmita-paunikar',
    name: 'Asmita Paunikar',
    role: null,
    company: null,
    review:
      'Clear about what would land and honest about what would not. That is rare in a studio that also has to shoot it.',
    avatar: portrait('Asmita_Paunikar'),
    project: null,
    approved: true,
    consent: { portrait: true, company: false },
  },
  {
    id: 'nishtha-rawat',
    name: 'Nishtha Rawat',
    role: null,
    company: null,
    review:
      'The first cut arrived with the reasoning attached, so reviewing it was a conversation instead of a guess.',
    avatar: portrait('Nishtha_Rawat'),
    project: null,
    approved: true,
    consent: { portrait: true, company: false },
  },
  {
    id: 'paritosh-upadhyay',
    name: 'Paritosh Upadhyay',
    role: null,
    company: null,
    review:
      'One team from the first call to the export. Nothing got lost between the script and the edit.',
    avatar: portrait('Paritosh_Upadhyay'),
    project: null,
    approved: true,
    consent: { portrait: true, company: false },
  },
  {
    id: 'sanskar-kokne',
    name: 'Sanskar Kokne',
    role: null,
    company: null,
    review:
      'They treat a caption with the same care as a frame. It shows in how a month reads together.',
    avatar: portrait('Sanskar_Kokne'),
    project: null,
    approved: true,
    consent: { portrait: true, company: false },
  },
  {
    id: 'sanskruti-dubey',
    name: 'Sanskruti Dubey',
    role: null,
    company: null,
    review:
      'The handover was organised enough that we could keep posting without going back to ask how.',
    avatar: portrait('Sanskruti_Dubey'),
    project: null,
    approved: true,
    consent: { portrait: true, company: false },
  },
  {
    id: 'shifa-joe',
    name: 'Shifa Joe',
    role: null,
    company: null,
    review:
      'They understood the brand faster than I could explain it, and stopped me from over-explaining it.',
    avatar: portrait('Shifa_Joe'),
    project: null,
    approved: true,
    consent: { portrait: true, company: false },
  },
  {
    id: 'siddhant-parshivnikar',
    name: 'Siddhant Parshivnikar',
    role: null,
    company: null,
    review:
      'Fewer rounds than I expected, and each one carried a clear question instead of a list of notes.',
    avatar: portrait('Siddhant_Parshivnikar'),
    project: null,
    approved: true,
    consent: { portrait: true, company: false },
  },
  {
    id: 'vidhi-saratkar',
    name: 'Vidhi Saratkar',
    role: null,
    company: null,
    review:
      'The work looked like us, not like a template with our colours dropped into it.',
    avatar: portrait('Vidhi_Saratkar'),
    project: null,
    approved: true,
    consent: { portrait: true, company: false },
  },
];

/** Only these may ever reach the public page. */
export const publishedTestimonials = testimonials.filter(
  (t) => t.approved && t.review && t.consent.portrait
);
