import { LucideIcon } from 'lucide-react';

export interface GameVariant {
  name: string;
  description: string;
}

export interface GameCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  variants: GameVariant[];
  image: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}