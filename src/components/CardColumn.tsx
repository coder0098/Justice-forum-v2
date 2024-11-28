"use client";

import React, { useState } from 'react';

type Card = {
  title: string;
};

export default function CardColumn() {
  const [cards, setCards] = useState<Card[]>([]);

  const addCard = () => {
    const newCard: Card = { title: `Card ${cards.length + 1}` };
    setCards((prev) => [...prev, newCard]);
  };

  return (
    <aside className="w-80 bg-gray-200 p-4">
      <h3 className="text-lg font-bold mb-4">Cards</h3>
      <div>
        {cards.map((card, idx) => (
          <div key={idx} className="p-4 bg-white shadow rounded mb-4">
            {card.title}
          </div>
        ))}
      </div>
      <button
        onClick={addCard}
        className="mt-4 w-full py-2 bg-blue-500 text-white rounded"
      >
        Add Card
      </button>
    </aside>
  );
}
