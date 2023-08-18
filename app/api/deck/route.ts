import { NextResponse } from "next/server";

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

export const revalidate = 0;

export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  const deck: Card[] = [];
  const DECK_SIZE = suits.length * ranks.length; // Number of cards in one deck (should be 52)

  // Create 6 decks
  for (let d = 0; d < 6; d++) {
    for (let suit of suits) {
      for (let rank of ranks) {
        deck.push({ suit, rank });
      }
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  const oneDeck = deck.slice(0, DECK_SIZE);

  return NextResponse.json({ data: oneDeck });
}
