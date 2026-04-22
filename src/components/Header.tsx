import { useState } from "react";
import { useAuthStore } from "../store/auth-store";
import { AuthModal } from "./AuthModal";
import { ShareVideoModal } from "./ShareVideoModal";

interface HeaderProps {
  onVideoShared: () => void;
}

export function Header({ onVideoShared }: HeaderProps) {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);
  const [showShare, setShowShare] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <h1 className="logo">
            <span className="logo-icon">▶</span> Funny Movies
          </h1>
          <nav className="nav">
            {isAuthenticated ? (
              <>
                <span className="nav-user">Welcome, {user?.name}</span>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowShare(true)}
                >
                  + Share a movie
                </button>
                <button className="btn btn-outline" onClick={clearAuth}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-outline"
                  onClick={() => setAuthMode("login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setAuthMode("register")}
                >
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      )}

      {showShare && (
        <ShareVideoModal
          onClose={() => setShowShare(false)}
          onSuccess={() => {
            setShowShare(false);
            onVideoShared();
          }}
        />
      )}
    </>
  );
}
