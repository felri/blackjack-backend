import { NextResponse } from 'next/server'

type Card = {
  suit: string;
  rank: string;
};

const suits: string[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks: string[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

export async function GET(request: Request) {
  const deck: Card[] = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  // Shuffle the deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return NextResponse.json({ data: deck })
};
