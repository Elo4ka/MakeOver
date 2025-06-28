import React, { useState } from 'react';
import { shopItems } from '../data/educationalData';
import { ShopItem } from '../types';

interface ShopProps {
  userPoints: number;
  userXP: number;
  onBuy: (item: ShopItem, useXP?: boolean) => void;
}

const Shop: React.FC<ShopProps> = ({ userPoints, userXP, onBuy }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [rerender, setRerender] = useState(false);

  const cardClass = "rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col items-center w-full max-w-xs relative mx-auto";

  const handleBuy = (item: ShopItem, useXP = false) => {
    if (item.id === 'surprise-case') {
      // Surprise case logic: randomly award a regular item the user doesn't own
      const regularItems = shopItems.filter(i => typeof i.price === 'number' && !i.xpPrice);
      // Get user's purchased item ids
      const purchasedIds = JSON.parse(localStorage.getItem('purchasedItems') || '[]');
      const notOwned = regularItems.filter(i => !purchasedIds.includes(i.id));
      if (notOwned.length === 0) {
        setMessage('Вы уже собрали все призы из обычных товаров!');
        setTimeout(() => setMessage(null), 2000);
        return;
      }
      const randomItem = notOwned[Math.floor(Math.random() * notOwned.length)];
      onBuy(randomItem, false); // Award as a regular item (not XP)
      // Save to localStorage for demo (replace with real user logic in prod)
      localStorage.setItem('purchasedItems', JSON.stringify([...purchasedIds, randomItem.id]));
      setMessage(`Сюрпрыз! Вы получили: ${randomItem.icon} ${randomItem.name}`);
      setTimeout(() => setMessage(null), 2500);
      setRerender(r => !r);
      return;
    }
    if (useXP) {
      if (typeof item.xpPrice === 'number' && userXP >= item.xpPrice) {
        onBuy(item, true);
        setMessage(`Поздравляем! Вы купили: ${item.icon} ${item.name} за XP!`);
        setTimeout(() => setMessage(null), 2000);
        setRerender(r => !r);
      } else {
        setMessage('Недостаточно XP!');
        setTimeout(() => setMessage(null), 1500);
      }
    } else {
      if (typeof item.price === 'number' && userPoints >= item.price) {
        onBuy(item, false);
        setMessage(`Поздравляем! Вы купили: ${item.icon} ${item.name}`);
        setTimeout(() => setMessage(null), 2000);
        setRerender(r => !r);
      } else {
        setMessage('Недостаточно очков!');
        setTimeout(() => setMessage(null), 1500);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-yellow-100 px-2 sm:px-0 pt-0 mt-0">
      <h1
        className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-2 mt-4 animate-bounce text-center"
        style={{
          fontFamily: "'Luckiest Guy', 'Rubik Mono One', 'Press Start 2P', 'Fredoka One', 'Montserrat', 'Comic Sans MS', Arial, sans-serif",
          color: '#00eaff',
          textShadow: '0 0 16px #00eaff, 0 2px 8px #222, 0 1px 4px #fff8',
          letterSpacing: '2px',
          filter: 'drop-shadow(0 0 8px #00eaff)',
          WebkitTextStroke: '1px #222',
        }}
      >
        🛒 Лутшоп
      </h1>
      
      {/* Debug: Show current XP */}
      <div style={{ position: 'absolute', top: 16, right: 32, background: '#fff', color: '#a21caf', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px #a21caf33', zIndex: 100 }}>
        XP: {userXP}
      </div>
      
      {/* Regular Items Section */}
      <div className="mb-8 w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center" style={{ 
          fontFamily: "'Luckiest Guy', 'Rubik Mono One', 'Fredoka One', 'Montserrat', Arial, sans-serif",
          color: '#2563eb',
          textShadow: '0 2px 8px #ffe066'
        }}>
          Обычные товары
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full justify-items-center px-2 sm:px-8 xl:px-32 mx-auto mb-8">
          {shopItems.filter(item => typeof item.price === 'number' && !item.xpPrice).map(item => {
            const price = item.price!; // Non-null assertion since we filtered for it
            return (
            <div key={item.id} className={`${cardClass} border-4 border-yellow-300`} style={{ 
              background: 'linear-gradient(135deg, #38bdf8 0%, #ffe066 100%)',
              boxShadow: '0 0 24px 4px #38bdf8aa, 0 2px 16px #6366f155, 0 0 32px 8px #fffde4',
              border: '4px solid #ffe066',
              filter: 'drop-shadow(0 0 8px #38bdf8)',
            }}>
              <span className="text-4xl mb-2" style={{ filter: 'drop-shadow(0 2px 8px #ffe066)' }}>{item.icon}</span>
              <h2 className="text-lg font-bold mb-1 text-center" style={{ fontFamily: 'Luckiest Guy, Rubik Mono One, Fredoka One, Montserrat, Comic Sans MS, Arial, sans-serif', color: '#facc15', textShadow: '0 2px 8px #38bdf8' }}>{item.name}</h2>
              <p className="text-gray-700 mb-2 text-center text-xs" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>{item.description}</p>
              <div className="flex items-center mb-2">
                <span className="text-base font-bold text-blue-700 mr-2">{price}</span>
                <span className="text-yellow-500 text-lg">⭐</span>
              </div>
              <button
                className={`px-5 py-1.5 rounded-full font-extrabold text-sm shadow-lg transition-all duration-200 border-2 border-blue-300
                  ${userPoints >= price
                    ? 'hover:scale-105'
                    : 'text-gray-400 cursor-not-allowed'}
                `}
                style={{
                  fontFamily: "'Luckiest Guy', 'Rubik Mono One', 'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
                  letterSpacing: '1px',
                  textShadow: userPoints >= price ? '0 2px 8px #ffe066, 0 0 8px #38bdf8' : 'none',
                  boxShadow: userPoints >= price ? '0 0 16px 4px #38bdf8aa, 0 0 8px #ffe066' : 'none',
                  background: userPoints >= price
                    ? 'linear-gradient(120deg, #38bdf8 0%, #fff 50%, #ffe066 100%)'
                    : 'linear-gradient(120deg, #b3e5fc 0%, #fffde4 60%, #ffe066 100%)',
                  filter: userPoints >= price ? undefined : 'grayscale(0.3) opacity(0.7)',
                }}
                onClick={() => handleBuy(item)}
                disabled={userPoints < price}
              >
                <span>
                  Купить
                </span>
              </button>
            </div>
          )})}
        </div>
      </div>

      {/* XP-Exclusive Items Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ 
          fontFamily: "'Luckiest Guy', 'Rubik Mono One', 'Fredoka One', 'Montserrat', Arial, sans-serif",
          color: '#a21caf',
          textShadow: '0 2px 8px #c084fc'
        }}>
          XP-Эксклюзив
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center px-2 sm:px-8 xl:px-32 mx-auto mb-8">
          {shopItems.filter(item => typeof item.xpPrice === 'number').map((item) => {
            const xpPrice = item.xpPrice!;
            return (
            <div key={item.id} className={`${cardClass} border-4 border-purple-400`} style={{ 
              background: 'linear-gradient(135deg, #c084fc 0%, #b4d2f7 100%)',
              boxShadow: '0 0 24px 4px #a21cafaa, 0 2px 16px #6366f155, 0 0 32px 8px #f3e8ff',
              border: '4px solid #c084fc',
              filter: 'drop-shadow(0 0 8px #a21caf)',
            }}>
              <span className="text-4xl mb-2" style={{ filter: 'drop-shadow(0 2px 8px #c084fc)' }}>{item.icon}</span>
              <h2 className="text-lg font-bold mb-1 text-center" style={{ fontFamily: 'Luckiest Guy, Rubik Mono One, Fredoka One, Montserrat, Comic Sans MS, Arial, sans-serif', color: '#f3e8ff', textShadow: '0 2px 8px #a21caf' }}>{item.name}</h2>
              <p className="text-gray-700 mb-2 text-center text-xs" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>{item.description}</p>
              <div className="flex items-center mb-2">
                <span className="text-base font-bold text-purple-700 mr-2">{xpPrice}</span>
                <span className="text-purple-400 text-lg">XP</span>
              </div>
              <button
                className={`px-5 py-1.5 rounded-full font-extrabold text-sm shadow-lg transition-all duration-200 border-2 border-purple-400
                  ${userXP >= xpPrice
                    ? 'hover:scale-105'
                    : 'text-gray-400'}
                `}
                style={{
                  fontFamily: "'Luckiest Guy', 'Rubik Mono One', 'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
                  letterSpacing: '1px',
                  textShadow: userXP >= xpPrice ? '0 2px 8px #c084fc, 0 0 8px #a21caf' : 'none',
                  boxShadow: userXP >= xpPrice ? '0 0 16px 4px #a21cafaa, 0 0 8px #c084fc' : 'none',
                  background: userXP >= xpPrice
                    ? 'linear-gradient(120deg, #c084fc 0%, #fff 50%, #a21caf 100%)'
                    : 'linear-gradient(120deg, #e9d5ff 0%, #f3e8ff 60%, #a21caf 100%)',
                  filter: userXP >= xpPrice ? undefined : 'grayscale(0.5) opacity(0.6)',
                  pointerEvents: userXP >= xpPrice ? 'auto' : 'none',
                  cursor: userXP >= xpPrice ? 'pointer' : 'not-allowed',
                }}
                onClick={() => {
                  if (userXP >= xpPrice) handleBuy(item, true);
                }}
                disabled={userXP < xpPrice}
              >
                <span>
                  Купить за XP
                </span>
              </button>
            </div>
          )})}
        </div>
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