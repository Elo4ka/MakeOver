import React, { useState } from 'react';
import { shopItems } from '../data/educationalData';
import { ShopItem } from '../types';

interface ShopProps {
  userPoints: number;
  onBuy: (item: ShopItem) => void;
}

const Shop: React.FC<ShopProps> = ({ userPoints, onBuy }) => {
  const [message, setMessage] = useState<string | null>(null);

  const handleBuy = (item: ShopItem) => {
    if (userPoints >= item.price) {
      onBuy(item);
      setMessage(`Поздравляем! Вы купили: ${item.icon} ${item.name}`);
      setTimeout(() => setMessage(null), 2000);
    } else {
      setMessage('Недостаточно очков!');
      setTimeout(() => setMessage(null), 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-yellow-100">
      <h1 className="text-5xl font-extrabold mb-8" style={{ fontFamily: 'Luckiest Guy, Rubik Mono One, Press Start 2P, Fredoka One, Montserrat, Comic Sans MS, Arial, sans-serif', color: '#222', textShadow: '0 4px 32px #38bdf8, 0 0 16px #38bdf8' }}>
        🛒 Магазин
      </h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {shopItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center w-72 border-4 border-yellow-300 relative" style={{ boxShadow: '0 0 24px 4px #38bdf8aa, 0 2px 16px #6366f155' }}>
            <span className="text-7xl mb-4" style={{ filter: 'drop-shadow(0 2px 8px #ffe066)' }}>{item.icon}</span>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Luckiest Guy, Rubik Mono One, Fredoka One, Montserrat, Comic Sans MS, Arial, sans-serif', color: '#facc15', textShadow: '0 2px 8px #38bdf8' }}>{item.name}</h2>
            <p className="text-gray-700 mb-4 text-center" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>{item.description}</p>
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-blue-700 mr-2">{item.price}</span>
              <span className="text-yellow-500 text-2xl">⭐</span>
            </div>
            <button
              className={`px-6 py-2 rounded-full font-bold text-lg transition-all duration-200 ${userPoints >= item.price ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              onClick={() => handleBuy(item)}
              disabled={userPoints < item.price}
            >
              Купить
            </button>
          </div>
        ))}
      </div>
      {message && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-200 border-2 border-yellow-400 rounded-xl px-8 py-4 text-xl font-bold shadow-lg z-50 animate-bounce" style={{ fontFamily: 'Luckiest Guy, Rubik Mono One, Fredoka One, Montserrat, Comic Sans MS, Arial, sans-serif', color: '#222' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Shop; 