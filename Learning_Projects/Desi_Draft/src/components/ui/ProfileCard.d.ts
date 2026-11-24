import type { CSSProperties, ReactElement, ReactNode } from 'react';

export type ProfileCardProps = {
  name?: string;
  role?: string;
  /** Optional one-line introduction; never generated copy. */
  intro?: string;
  handle?: string;
  status?: string;
  image?: string;
  initials?: string;
  index?: number;
  accent?: string;
  accentInk?: string;
  surface?: string;
  theme?: 'light' | 'dark';
  radius?: number;
  enableTilt?: boolean;
  tiltStrength?: number;
  parallax?: number;
  holo?: number;
  glare?: number;
  enableMobileTilt?: boolean;
  contactHref?: string;
  onContact?: (() => void) | null;
  contactLabel?: string;
  contactAriaLabel?: string;
  sticker?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ProfileCard(props: ProfileCardProps): ReactElement;
export default ProfileCard;
