'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Focus Cards — Aceternity UI (reference: https://ui.aceternity.com/components/focus-cards)
 * Verbatim demo structure. Content = card items with title + image src.
 */
interface CardItem {
  title: string;
  src: string;
  subtitle?: string;
}

const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: CardItem;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'rounded-lg relative bg-[#0a0a0a] overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out',
        hovered !== null && hovered !== index && 'blur-sm scale-[0.98]'
      )}
    >
      <img src={card.src} alt={card.title} className="object-cover absolute inset-0 w-full h-full" />
      <div
        className={cn(
          'absolute inset-0 bg-black/60 flex flex-col items-start justify-end py-8 px-6 transition-opacity duration-300',
          hovered === index ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div
          className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#f5f5f0] to-[#c8ff00]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {card.title}
        </div>
        {card.subtitle && <p className="text-xs text-[#999990] mt-2">{card.subtitle}</p>}
      </div>
    </div>
  )
);
Card.displayName = 'FocusCard';

export default function FocusCards({ cards }: { cards: CardItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto w-full">
      {cards.map((card, index) => (
        <Card key={card.title} card={card} index={index} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  );
}
