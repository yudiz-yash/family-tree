import { 
  Gamepad2, 
  Dices, 
  Coins, 
  Users, 
  Trophy, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  Gift,
  Bell,
  Lock,
  MessageCircle,
  Award
} from 'lucide-react';
import { GameCategory, Feature, Testimonial } from './types';

// Extended GameCategory to include rules
export interface GameCategoryWithRules extends GameCategory {
  rules: string[];
}

export const GAMES_DATA: GameCategoryWithRules[] = [
  {
    id: 'teen-patti',
    title: 'Teen Patti',
    icon: Gamepad2,
    description: "The classic Indian card game. Play with virtual chips!",
    image: "https://images.unsplash.com/photo-1511193311914-0346f1971801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rules: [
      "The objective is to have the best 3-card hand.",
      "Ranking from highest to lowest: Trail (Set), Pure Sequence, Sequence, Color, Pair, High Card.",
      "Players bet chips based on the strength of their hand.",
      "The game continues until one player remains or a showdown is requested."
    ],
    variants: [
      { name: 'Teenpatti Classic', description: 'The traditional 3-card game.' },
      { name: 'AK47', description: 'Aces, Kings, 4s, and 7s are jokers.' },
      { name: 'Muflis Twist', description: 'Low cards win, high cards lose.' },
      { name: 'Hukum Royal', description: 'One card is the designated joker.' },
      { name: 'Blind Hukum', description: 'Play blind with a joker advantage.' },
      { name: 'High Stakes', description: 'For the bold players (Virtual Chips).' },
      { name: 'Dealer’s Choice', description: 'New Variant - Dealer calls the shots.' },
    ]
  },
  {
    id: 'poker',
    title: 'Poker',
    icon: Trophy,
    description: "Strategy, skill, and thrill combined in a social setting.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rules: [
      "Each player is dealt 2 private cards (Hole Cards).",
      "5 Community cards are dealt in stages: Flop (3), Turn (1), River (1).",
      "Players aim to make the best 5-card hand using any combination of their hole cards and community cards.",
      "Betting rounds occur between each deal. You can Fold, Check, Call, or Raise."
    ],
    variants: [
      { name: 'Texas Hold’em', description: 'The most popular poker variant globally.' },
      { name: 'Omaha', description: 'Four hole cards for more action.' },
    ]
  },
  {
    id: 'rummy',
    title: 'Rummy',
    icon: Users,
    description: "Test your memory and skill in this card-melding game.",
    image: "https://images.unsplash.com/photo-1628151016000-88d4924c803f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rules: [
      "Played with 13 cards per player.",
      "Objective is to arrange all cards into valid Sets and Sequences.",
      "A valid declaration requires at least two sequences, one of which must be pure (without a joker).",
      "Discard high-value cards early to minimize points if you lose."
    ],
    variants: [
      { name: 'Point Rummy', description: 'Fast-paced rummy for quick fun.' },
    ]
  },
  {
    id: 'callbreak',
    title: 'Callbreak',
    icon: Dices,
    description: "Strategic trick-taking card game played with a standard deck.",
    image: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rules: [
      "Played by 4 players with a standard 52-card deck.",
      "Spades are always the trump suit.",
      "After cards are dealt, each player must bid (call) the number of tricks they expect to win (1-8).",
      "You must follow the suit led if possible; otherwise, play a trump or any other card."
    ],
    variants: [
      { name: 'Classic Callbreak', description: 'The standard 4-player game.' },
      { name: 'Callbreak', description: 'Modern interface variant.' },
    ]
  },
  {
    id: 'ludo',
    title: 'Ludo',
    icon: Dices,
    description: "Roll the dice and race to the finish with friends.",
    image: "https://images.unsplash.com/photo-1611116278855-5c24e9ad2c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rules: [
      "Each player has 4 tokens. You need a 6 to move a token out of the base.",
      "Tokens move clockwise around the board based on the dice roll.",
      "If you land on an opponent's token, it gets sent back to their base (Kill).",
      "The first player to move all 4 tokens into the home triangle wins."
    ],
    variants: [
      { name: 'Classic Ludo', description: 'Traditional rules.' },
      { name: 'Ludo Rush', description: 'Fast-paced, time-limited mode.' },
    ]
  }
];

export const FEATURES: Feature[] = [
  {
    title: 'Private Tables',
    description: 'Create exclusive rooms to play with friends and family.',
    icon: Lock
  },
  {
    title: 'Daily Coin Bonanza',
    description: 'Get free virtual chips daily to keep the fun going.',
    icon: Coins
  },
  {
    title: 'Refer & Earn',
    description: 'Invite friends and earn huge chip bonuses for every signup.',
    icon: Users
  },
  {
    title: 'Bonus System',
    description: 'Daily login rewards, scratch cards, and tournament prizes.',
    icon: Gift
  },
  {
    title: 'Social Chat',
    description: 'Chat with players in real-time while you play.',
    icon: MessageCircle
  }
];

export const WHY_CHOOSE_US: Feature[] = [
  {
    title: 'Fast Gameplay',
    description: 'instant matching, and smooth animations.',
    icon: Zap
  },
  {
    title: 'Fair Play',
    description: 'RNG ensures every deal and roll is random.',
    icon: Award
  },
  {
    title: '24/7 Support',
    description: 'Dedicated team available round the clock to assist you.',
    icon: Users
  },
  {
    title: 'Multi-Game Exp',
    description: 'Switch between Rummy, Poker, and Ludo instantly.',
    icon: Smartphone
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rahul S.",
    role: "Pro Poker Player",
    content: "The interface is incredibly smooth. I love the AK47 Teen Patti variant!",
    avatar: "https://picsum.photos/100/100?random=10"
  },
  {
    name: "Priya M.",
    role: "Casual Gamer",
    content: "Ludo Rush is my go-to for quick breaks. The community is so friendly.",
    avatar: "https://picsum.photos/100/100?random=11"
  },
  {
    name: "Amit K.",
    role: "Rummy Enthusiast",
    content: "The best social gaming app! I love playing with my college friends on private tables.",
    avatar: "https://picsum.photos/100/100?random=12"
  }
];