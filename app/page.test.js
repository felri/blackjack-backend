import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "./page";
import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        data: [
          { suit: "Hearts", rank: "K" },
          { suit: "Diamonds", rank: "Q" },
          { suit: "Clubs", rank: "J" },
          { suit: "Spades", rank: "A" },
          { suit: "Clubs", rank: "9" },
          { suit: "Hearts", rank: "10" },
          { suit: "Spades", rank: "J" },
          { suit: "Hearts", rank: "Q" },
          { suit: "Diamonds", rank: "K" },
          { suit: "Spades", rank: "A" },
          { suit: "Hearts", rank: "9" },
          { suit: "Spades", rank: "K" },
          { suit: "Clubs", rank: "8" },
        ],
      }),
  })
);

describe("<Page />", () => {
  beforeEach(() => {
    render(<Page />);
  });

  it("renders correctly", () => {
    expect(screen.getByText("Deal Cards")).toBeInTheDocument();
  });

  it("renders initial UI elements", () => {
    expect(screen.getByText("Player Hand (0)")).toBeInTheDocument();
    expect(screen.getByText("Dealer Hand (0)")).toBeInTheDocument();
  });

  it("deals initial cards on 'Deal Cards' click", async () => {
    fireEvent.click(screen.getByText("Deal Cards"));

    // Using findBy because card rendering will be asynchronous after the API call.
    const playerCard = await screen.findByText("K ♠");
    expect(playerCard).toBeInTheDocument();

    const dealerHiddenCard = screen.getByText("Hidden");
    expect(dealerHiddenCard).toBeInTheDocument();
  });

  it("updates player hand when 'Hit' is clicked", async () => {
    fireEvent.click(screen.getByText("Deal Cards"));

    const playerCard = await screen.findByText("K ♠");
    expect(playerCard).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hit"));

    const newPlayerCard = await screen.findByText("8 ♣");
    expect(newPlayerCard).toBeInTheDocument();
  });

  it("reveals dealer cards and sets game status when 'Stay' is clicked", async () => {
    fireEvent.click(screen.getByText("Deal Cards"));

    const playerCard = await screen.findByText("K ♠");
    expect(playerCard).toBeInTheDocument();

    fireEvent.click(screen.getByText("Stay"));

    const dealerCard = await screen.findByText("9 ♥");
    expect(dealerCard).toBeInTheDocument();

    // This expectation depends on the game outcome based on your mock. Adjust accordingly.
    const gameStatus = screen.getByText("Dealer Win");
    expect(gameStatus).toBeInTheDocument();
  });
});
