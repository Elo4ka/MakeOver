import React, { useState } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { uploadAvatarImage, updateUserAvatar } from '../firebaseHelpers';

interface ProfileProps {
  user: User;
}

const emojiOptions = ["🦫", "🐻", "🦊", "🐱", "🐶", "🦄", "🐸", "🐧", "🐼", "👾", "👤"];

const Profile: React.FC<ProfileProps> = ({ user }: ProfileProps) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar);
  const [saved, setSaved] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);

  // Handler for emoji selection
  const handleEmojiSelect = async (emoji: string) => {
    await updateUserAvatar(user.id, emoji);
    setAvatar(emoji);
    setSaved(true);
    setTimeout(() => setSaved(false), 1000);
  };

  // Handler for image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAvatarImage(file, user.id);
      setPendingAvatar(url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen"
      style={{
        background: "radial-gradient(circle at 60% 40%, #1e293b 60%, #0f172a 100%)",
        minHeight: "100vh",
        padding: "2rem 0",
      }}
    >
      <div
        className="relative rounded-3xl shadow-2xl p-10"
        style={{
          background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
          border: "4px solid #38bdf8",
          boxShadow: "0 0 40px #38bdf8, 0 8px 32px #000a",
          maxWidth: 700,
          width: "100%",
          color: "#fff",
          fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            background: "#0ea5e9",
            color: "#fff",
            fontWeight: "bold",
            border: "2px solid #f87171",
            borderRadius: "50%",
            width: 44,
            height: 44,
            boxShadow: "0 0 8px #f87171, 0 0 2px #fff",
            fontSize: "1.5rem",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s"
          }}
          title="Закрыть профиль"
        >
          ✕
        </button>
        <h1
          style={{
            fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
            fontSize: "2.2rem",
            color: "#38bdf8",
            textShadow: "0 2px 12px #38bdf8, 0 1px 8px #2228",
            marginBottom: "2rem"
          }}
        >
          Profile
        </h1>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          {(pendingAvatar || avatar) && (pendingAvatar || avatar).startsWith("http") ? (
            <img
              src={pendingAvatar || avatar}
              alt="avatar"
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 0 24px #38bdf8, 0 0 8px #fff",
                animation: "bounce 1.2s infinite alternate"
              }}
            />
          ) : (
            <span style={{
              fontSize: "3.5rem",
              textShadow: "0 0 24px #38bdf8, 0 0 8px #fff",
              animation: "bounce 1.2s infinite alternate"
            }}>{pendingAvatar || avatar}</span>
          )}
        </div>
        {user.name !== "Гость" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 48px)",
              gap: "1rem",
              justifyContent: "center",
              margin: "1rem 0",
              width: "max-content"
            }}
          >
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                style={{
                  fontSize: "2rem",
                  background: avatar === emoji ? "#38bdf8" : "#232526",
                  border: avatar === emoji ? "2px solid #fff" : "2px solid #38bdf8",
                  borderRadius: "50%",
                  boxShadow: avatar === emoji ? "0 0 16px #38bdf8" : "0 0 8px #38bdf8",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
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
                fontSize: "2rem",
                background: avatar && avatar.startsWith("http") ? "#38bdf8" : "#232526",
                border: avatar && avatar.startsWith("http") ? "2px solid #fff" : "2px solid #38bdf8",
                borderRadius: "50%",
                boxShadow: avatar && avatar.startsWith("http") ? "0 0 16px #38bdf8" : "0 0 8px #38bdf8",
                padding: "0.2rem 0.5rem",
                width: "60px",
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
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
            {uploading && (
              <span
                style={{
                  color: "#38bdf8",
                  marginLeft: "0.5rem",
                  gridColumn: "span 7",
                  textAlign: "center"
                }}
              >
                Uploading...
              </span>
            )}
          </div>
        )}
        <div style={{
          background: "rgba(56, 189, 248, 0.15)",
          borderRadius: "1rem",
          padding: "1.5rem",
          margin: "1rem 0",
          boxShadow: "0 0 16px #38bdf8",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.5rem",
          fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
          fontSize: "1.1rem"
        }}>
          <div>
            <div style={{ color: "#38bdf8", fontWeight: "bold" }}>Level</div>
            <div style={{ color: "#fff", fontSize: "1.5rem" }}>{user.level}</div>
          </div>
          <div>
            <div style={{ color: "#38bdf8", fontWeight: "bold" }}>Experience</div>
            <div style={{ color: "#fff", fontSize: "1.5rem" }}>{user.experience} XP</div>
          </div>
          <div>
            <div style={{ color: "#38bdf8", fontWeight: "bold" }}>Points</div>
            <div style={{ color: "#fff", fontSize: "1.5rem" }}>{user.points} ⭐</div>
          </div>
          <div>
            <div style={{ color: "#38bdf8", fontWeight: "bold" }}>Streak</div>
            <div style={{ color: "#fff", fontSize: "1.5rem" }}>{user.streak} days</div>
          </div>
        </div>
        <div style={{
          display: "flex",
          gap: "1.5rem",
          margin: "1.5rem 0",
          justifyContent: "center"
        }}>
          <div
            style={{
              background: "rgba(56, 189, 248, 0.15)",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 0 16px #38bdf8",
              color: "#38bdf8",
              fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
              fontSize: "1.1rem",
              flex: 1
            }}
          >
            <div style={{ fontWeight: "bold" }}>Lessons Completed</div>
            <div style={{ color: "#fff", fontSize: "1.5rem" }}>{user.completedLessons.length}</div>
          </div>
          <div
            style={{
              background: "rgba(34, 197, 94, 0.15)",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 0 16px #22c55e",
              color: "#22c55e",
              fontFamily: "'Press Start 2P', 'Fredoka One', 'Montserrat', Arial, sans-serif",
              fontSize: "1.1rem",
              flex: 1
            }}
          >
            <div style={{ fontWeight: "bold" }}>Achievements</div>
            <div style={{ color: "#fff", fontSize: "1.5rem" }}>{user.achievements.length}</div>
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
      </div>
    </div>
  );
};

export default Profile; 