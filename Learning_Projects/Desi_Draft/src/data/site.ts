import type { StickerKey } from '../types';

export type ServiceCard = {
  id: string;
  title: string;
  bg: string;
  text: string;
  items: string[];
  sticker: StickerKey;
  rotate: number;
  offsetY: number;
};

export const services: ServiceCard[] = [
  {
    id: 'brand',
    title: 'brand',
    bg: '#2E7D5B',
    text: '#EEEAE3',
    items: [
      'Brand Strategy',
      '360° Creative',
      'Art Direction',
      'Copywriting',
      'Editing',
      'Motion Graphics',
      'DTP',
    ],
    sticker: 'camera',
    rotate: -5,
    offsetY: 0,
  },
  {
    id: 'social',
    title: 'social',
    bg: '#8499F8',
    text: '#0A0A0A',
    items: [
      'Social Media Strategy',
      'Social Media Creative',
      'Reels / TikTok Shoots',
      'Influencer Campaigns',
      'Scheduling Support',
      'Community Management',
      'Social Listening',
    ],
    sticker: 'phone',
    rotate: -2,
    offsetY: 24,
  },
  {
    id: 'activations',
    title: 'activations',
    bg: '#E8603C',
    text: '#0A0A0A',
    items: ['Activation Strategy', 'Event Planning', 'Art Direction', 'Production'],
    sticker: 'smiley',
    rotate: 3,
    offsetY: -14,
  },
  {
    id: 'video',
    title: 'video production',
    bg: '#9B2155',
    text: '#EEEAE3',
    items: ['Campaign video', 'Branded content', 'Social content', 'Marketing materials'],
    sticker: 'wrist',
    rotate: -4,
    offsetY: 30,
  },
  {
    id: 'partners',
    title: 'with partners',
    bg: '#E8B4F5',
    text: '#0A0A0A',
    items: ['PR / Journalism', '3D / VFX', 'Food styling', 'Photography'],
    sticker: 'heart',
    rotate: 6,
    offsetY: 10,
  },
];

export const site = {
  email: 'hello@desidraft.com',
  whatsapp: 'https://wa.me/910000000000',
  whatsappDisplay: '+91 00000 00000',
  address: ['2nd floor, 14 lane 3', 'Koregaon Park, Pune 411001'],
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
  tiktok: 'https://tiktok.com',
  maps: 'https://maps.google.com',
};
