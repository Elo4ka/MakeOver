import React, { useState } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { uploadAvatarImage, updateUserAvatar } from '../firebaseHelpers';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import { shopItems } from '../data/educationalData';
import { ShopItem } from '../types';

interface ProfileProps {
  user: User;
  onAvatarChange?: (newAvatar: string) => void;
  onMarkItemUsed?: (itemId: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onAvatarChange, onMarkItemUsed }: ProfileProps) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar);
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar);

  // Super Avatar logic
  const superAvatarItem = shopItems.find(item => item.id === 'super-avatar');
  const hasSuperAvatar = user.purchasedItems?.some(p => p.id === 'super-avatar');
  const emojiOptions = [
    "🦫", "🐻", "🦊", "🐱", "🐶", "🦄", "🐸", "🐧", "🐼", "👾", "👤",
    ...(hasSuperAvatar && superAvatarItem ? [superAvatarItem.icon] : [])
  ];

  // Handler for emoji selection
  const handleEmojiSelect = async (emoji: string) => {
    await updateUserAvatar(user.id, emoji);
    setAvatar(emoji);
  };

  // Handler for image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAvatarImage(file, user.id);
      setPendingAvatar(url);
      setSelectedAvatar(url);
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmAvatar = async () => {
    if (selectedAvatar && selectedAvatar !== avatar) {
      setAvatar(selectedAvatar);
      // Update in Firestore
      const userAuth = auth.currentUser;
      if (userAuth) {
        const db = getFirestore();
        await setDoc(doc(db, 'users', userAuth.uid), {
          avatar: selectedAvatar
        }, { merge: true });
      }
      if (onAvatarChange) {
        onAvatarChange(selectedAvatar);
      }
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        background: "radial-gradient(circle at 60% 40%, #1e293b 60%, #0f172a 100%)",
        minHeight: "100vh",
        padding: "1rem 0",
      }}
    >
      <div
        className="relative rounded-3xl shadow-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #232526 0%, #3a3f5a 100%)",
          border: "4px solid #38bdf8",
          boxShadow: "0 0 40px #38bdf8, 0 8px 32px #000a",
          maxWidth: 700,
          width: "100%",
          color: "#fff",
          fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
          maxHeight: "96vh",
          overflowY: "auto",
          paddingLeft: "2rem",
          paddingRight: "2rem"
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "#232526",
            color: "#fff",
            border: "2px solid #38bdf8",
            borderRadius: "50%",
            width: 28,
            height: 28,
            boxShadow: "0 0 8px #38bdf8",
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s, border 0.2s",
            zIndex: 10
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#38bdf8';
            e.currentTarget.style.color = '#232526';
            e.currentTarget.style.border = '2px solid #fff';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#232526';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.border = '2px solid #38bdf8';
          }}
          title="Закрыть профиль"
        >
          ×
        </button>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1rem",
          justifyContent: "center"
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {(pendingAvatar || avatar) && (pendingAvatar || avatar).startsWith("http") ? (
              <img
                src={pendingAvatar || avatar}
                alt="avatar"
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 0 24px #38bdf8, 0 0 8px #fff",
                  animation: "bounce 1.2s infinite alternate",
                  display: "block",
                  margin: "0 auto"
                }}
              />
            ) : (
              <span style={{
                fontSize: "4rem",
                textShadow: "0 0 24px #38bdf8, 0 0 8px #fff",
                animation: "bounce 1.2s infinite alternate",
                display: "block",
                margin: "0 auto"
              }}>{pendingAvatar || avatar}</span>
            )}
            {user.purchasedItems?.some(p => p.id === 'golden-badge') && (
              <span title="Golden Badge" style={{ fontSize: '2.5rem', marginLeft: '0.5rem', filter: 'drop-shadow(0 0 8px #ffe066)' }}>🏅</span>
            )}
          </div>
        </div>
        {user.name !== "Гость" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              margin: "1.2rem 0",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem"
            }}
          >
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.7rem",
              width: "100%",
              boxSizing: "border-box"
            }}>
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedAvatar(emoji)}
                  style={{
                    fontSize: "1.7rem",
                    background: avatar === emoji ? "#38bdf8" : "#232526",
                    border: avatar === emoji ? "2px solid #fff" : "2px solid #38bdf8",
                    borderRadius: "50%",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: selectedAvatar === emoji ? '2px solid #fff' : undefined,
                    boxShadow: selectedAvatar === emoji ? '0 0 16px #38bdf8, 0 0 8px #fff' : (avatar === emoji ? '0 0 16px #38bdf8' : '0 0 8px #38bdf8')
                  }}
                  title={emoji}
                  disabled={uploading}
                >
                  {emoji}
                </button>
              ))}
              <label
                style={{
                  cursor: "pointer",
                  fontSize: "1.7rem",
                  background: avatar && avatar.startsWith("http") ? "#38bdf8" : "#232526",
                  border: avatar && avatar.startsWith("http") ? "2px solid #fff" : "2px solid #38bdf8",
                  borderRadius: "50%",
                  padding: "0.1rem 0.2rem",
                  width: "48px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  outline: selectedAvatar && selectedAvatar.startsWith('http') ? '2px solid #fff' : undefined,
                  boxShadow: selectedAvatar && selectedAvatar.startsWith('http') ? '0 0 16px #38bdf8, 0 0 8px #fff' : (avatar && avatar.startsWith('http') ? '0 0 16px #38bdf8' : '0 0 8px #38bdf8')
                }}
                title="Upload image"
              >
                📷
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && (
              <span
                style={{
                  color: "#38bdf8",
                  marginLeft: "1rem",
                  alignSelf: "center"
                }}
              >
                Uploading...
              </span>
            )}
          </div>
        )}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={handleConfirmAvatar}
            disabled={uploading || !selectedAvatar || selectedAvatar === avatar}
            style={{
              background: uploading || !selectedAvatar || selectedAvatar === avatar ? '#888' : '#38bdf8',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              padding: '0.3rem 1.5rem',
              fontWeight: 700,
              fontSize: '1.1rem',
              boxShadow: '0 0 8px #38bdf8',
              cursor: uploading || !selectedAvatar || selectedAvatar === avatar ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
              marginTop: 0
            }}
          >
            {uploading ? 'Saving...' : 'Confirm'}
          </button>
        </div>
        <div style={{
          background: "rgba(56, 189, 248, 0.15)",
          borderRadius: "1rem",
          padding: "0.5rem",
          margin: "0.5rem 0",
          boxShadow: "0 0 16px #38bdf8",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.2rem",
          fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
          fontSize: "1.05rem",
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "0.9rem" }}>Level</span>
            <span style={{ color: "#fff", fontSize: "1.05rem" }}>{user.level}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "0.9rem" }}>Experience</span>
            <span style={{ color: "#fff", fontSize: "1.05rem" }}>{user.experience} XP</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "0.9rem" }}>Points</span>
            <span style={{ color: "#fff", fontSize: "1.05rem" }}>{user.points} ⭐</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <span style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "0.9rem" }}>Streak</span>
            <span style={{ color: "#fff", fontSize: "1.05rem" }}>{user.streak} days</span>
          </div>
        </div>
        <div style={{
          display: "flex",
          gap: "1.2rem",
          margin: "0.5rem 0",
          justifyContent: "center"
        }}>
          <div
            style={{
              background: "rgba(56, 189, 248, 0.15)",
              borderRadius: "1rem",
              padding: "0.5rem",
              boxShadow: "0 0 16px #38bdf8",
              color: "#38bdf8",
              fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
              fontSize: "0.9rem",
              flex: 1,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingLeft: '1rem', paddingRight: '1rem'
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Lessons Completed</span>
            <span style={{ color: "#fff", fontSize: "1.05rem" }}>{user.completedLessons.length}</span>
          </div>
          <div
            style={{
              background: "rgba(34, 197, 94, 0.15)",
              borderRadius: "1rem",
              padding: "0.5rem",
              boxShadow: "0 0 16px #22c55e",
              color: "#22c55e",
              fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
              fontSize: "0.9rem",
              flex: 1,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingLeft: '1rem', paddingRight: '1rem'
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Achievements</span>
            <span style={{ color: "#fff", fontSize: "1.05rem" }}>{user.achievements.length}</span>
          </div>
        </div>
        {user.achievements.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <h2
              style={{
                fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
                color: "#ffe066",
                textShadow: "0 2px 8px #ffe066, 0 1px 4px #2228",
                fontSize: "1.2rem",
                marginBottom: "1rem"
              }}
            >
              Achievements
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.5rem"
              }}
            >
              {user.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  style={{
                    background: "rgba(255, 224, 102, 0.15)",
                    border: "2px solid #ffe066",
                    borderRadius: "1rem",
                    padding: "1rem",
                    boxShadow: "0 0 12px #ffe066",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}
                >
                  <span style={{ fontSize: "2rem", textShadow: "0 0 8px #ffe066" }}>
                    {achievement.icon}
                  </span>
                  <div>
                    <div style={{ color: "#fff", fontWeight: "bold" }}>{achievement.name}</div>
                    <div style={{ color: "#ffe066", fontSize: "0.9rem" }}>{achievement.description}</div>
                    <div style={{ color: "#fff", fontSize: "0.8rem" }}>+{achievement.points} points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* My Purchases Section */}
        {user.purchasedItems && user.purchasedItems.length > 0 && (
          <div className="mt-8 mb-4">
            <h2 className="text-xl font-bold mb-2">🛍️ Мои покупки</h2>
            <div className="flex flex-wrap gap-4">
              {user.purchasedItems?.map((p) => {
                const item = shopItems.find((i: ShopItem) => i.id === p.id);
                return item ? (
                  <div key={item.id} className={`flex flex-col items-center p-2 bg-white bg-opacity-10 rounded-xl shadow border border-blue-400 min-w-[72px] ${p.used ? 'opacity-50 grayscale' : ''}`}>
                    <span className="text-3xl mb-1">{item.icon}</span>
                    <span className="text-xs font-bold text-white text-center" style={{textShadow: '0 1px 4px #2228'}}>{item.name}</span>
                    {!p.used && (
                      <button className="mt-1 px-2 py-1 text-xs rounded bg-blue-400 text-white hover:bg-blue-500" onClick={() => onMarkItemUsed && onMarkItemUsed(p.id)}>Mark as used</button>
                    )}
                    {p.used && (
                      <span className="mt-1 text-xs text-gray-300">Used</span>
                    )}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

export {} 