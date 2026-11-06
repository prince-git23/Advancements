export type ClientTile = {
  name: string;
  color: string;
  text: 'cream' | 'ink';
  font?: 'display' | 'serif' | 'script';
};

/** Fictional client marks — replace with real SVG logos when cleared. */
export const clients: ClientTile[] = [
  { name: 'chai co.', color: '#9B2155', text: 'cream', font: 'display' },
  { name: 'mehendi mart', color: '#4B63E8', text: 'cream', font: 'display' },
  { name: 'biryani bros', color: '#E8603C', text: 'cream', font: 'display' },
  { name: 'desi denim', color: '#8499F8', text: 'ink', font: 'display' },
  { name: 'shaadi squad', color: '#2E7D5B', text: 'cream', font: 'display' },
  { name: 'cricket cafe', color: '#E4FBA8', text: 'ink', font: 'display' },
  { name: 'masala snacks', color: '#E8B4F5', text: 'ink', font: 'display' },
  { name: 'lassi lab', color: '#0A0A0A', text: 'cream', font: 'display' },
  { name: 'rangoli wear', color: '#E8603C', text: 'ink', font: 'display' },
  { name: 'kulfi kings', color: '#4B63E8', text: 'cream', font: 'display' },
];
