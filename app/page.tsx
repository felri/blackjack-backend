"use client";
import React, { useState, useEffect } from "react";

type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

type GameStatus =
  | "ongoing"
  | "playerBust"
  | "dealerBust"
  | "playerWin"
  | "dealerWin"
  | "draw";

interface Card {
  suit: Suit;
  rank: Rank;
}

const getStatusText = (status: GameStatus) => {
  switch (status) {
    case "ongoing":
      return "Ongoing";
    case "playerBust":
      return "Player Bust";
    case "dealerBust":
      return "Dealer Bust";
    case "playerWin":
      return "Player Win";
    case "dealerWin":
      return "Dealer Win";
    case "draw":
      return "Draw";
    default:
      return "";
  }
};

function getCardValue(card: Card): number {
  if (["J", "Q", "K"].includes(card.rank)) {
    return 10;
  } else if (card.rank === "A") {
    return 11;
  } else {
    return parseInt(card.rank, 10);
  }
}

function getHandValue(cards: Card[]): number {
  let value = 0;
  let aces = 0;

  cards.forEach((card) => {
    value += getCardValue(card);
    if (card.rank === "A") aces++;
  });

  while (value > 21 && aces) {
    value -= 10;
    aces--;
  }

  return value;
}

function Blackjack() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameStatus, setGameStatus] = useState<string | "">("");

  async function fetchDeck() {
    const response = await fetch("/api/deck");
    const data = await response.json();
    setDeck(data.data);
  }

  useEffect(() => {
    fetchDeck();
  }, []);

  useEffect(() => {
    if (gameStatus !== "Ongoing") {
      fetchDeck();
    }
  }, [gameStatus]);

  function dealInitialCards() {
    if (deck.length >= 4) {
      const newDeck = [...deck];
      setPlayerHand([newDeck.pop()!, newDeck.pop()!]);
      setDealerHand([newDeck.pop()!, newDeck.pop()!]);
      setDeck(newDeck);
      setGameStatus(getStatusText("ongoing"));
    }
  }

  function playerHit() {
    if (gameStatus === "Ongoing" && deck.length) {
      const newDeck = [...deck];
      const newCard = newDeck.pop();
      const newPlayerHand = [...playerHand, newCard!];

      if (getHandValue(newPlayerHand) > 21) {
        setGameStatus(getStatusText("playerBust"));
      }

      setDeck(newDeck);
      setPlayerHand(newPlayerHand);
    }
  }

  function playerStay() {
    const newDealerHand = [...dealerHand];
    while (getHandValue(newDealerHand) < 17 && deck.length) {
      const newDeck = [...deck];
      const newCard = newDeck.pop();
      newDealerHand.push(newCard!);
      setDeck(newDeck);
    }

    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(newDealerHand);

    if (dealerValue > 21) {
      setGameStatus(getStatusText("dealerBust"));
    } else if (dealerValue > playerValue) {
      setGameStatus(getStatusText("dealerWin"));
    } else if (playerValue > dealerValue) {
      setGameStatus(getStatusText("playerWin"));
    } else {
      setGameStatus(getStatusText("draw"));
    }

    setDealerHand(newDealerHand);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-gray-800">
      <div className="min-h-screen bg-white p-8 rounded shadow-lg max-w-lg w-full ">
        <button
          onClick={dealInitialCards}
          className="bg-blue-500  px-6 py-2 rounded font-bold mb-4 text-white w-full"
        >
          Deal Cards
        </button>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">
            Player Hand ({getHandValue(playerHand)})
          </h2>
          <div className="flex space-x-2">
            {playerHand.map((card) => (
              <div
                key={`${card.suit}-${card.rank}`}
                className="p-2 bg-gray-300 rounded border"
              >
                {`${card.rank} of ${card.suit}`}
              </div>
            ))}
          </div>
        </div>

        {gameStatus === "Ongoing" && (
          <div className="mb-4 text-white font-bold">
            <button
              onClick={playerHit}
              className="bg-green-500  px-6 py-2 rounded mb-2 w-full"
            >
              Hit
            </button>
            <button
              onClick={playerStay}
              className="bg-red-500  px-6 py-2 rounded w-full"
            >
              Stay
            </button>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">
            Dealer Hand ({getHandValue(dealerHand)})
          </h2>
          <div className="flex space-x-2">
            {dealerHand.map((card, index) => (
              <div
                key={`${card.suit}-${card.rank}`}
                className="p-2 bg-gray-300 rounded border"
              >
                {index === 0 && gameStatus === "Ongoing"
                  ? "Hidden"
                  : `${card.rank} of ${card.suit}`}
              </div>
            ))}
          </div>
        </div>

        {gameStatus !== "Ongoing" && (
          <div className="text-xl font-semibold">Result: {gameStatus}</div>
        )}
      </div>
    </div>
  );
}

export default Blackjack;
