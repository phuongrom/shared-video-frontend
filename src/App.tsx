import { useCallback, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { Header } from "./components/Header";
import { VideoList } from "./components/VideoList";
import { useNotificationsChannel } from "./hooks/use-action-cable";
import { useAuthStore } from "./store/auth-store";
import type { Notification } from "./types";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

function AppInner() {
  const { isAuthenticated, user } = useAuthStore();
  const refetchRef = useRef(0);
  const [refetchSignal, setRefetchSignal] = useState(0);

  const handleNotification = useCallback(
    (notification: Notification) => {
      // Don't notify the user who just shared the video
      if (user?.id === notification.shared_by_id) return;

      toast(
        <div className="toast-content">
          <strong>{notification.shared_by}</strong> shared a new video:
          <br />
          <em>"{notification.video_title}"</em>
        </div>,
        { duration: 6000 }
      );
    },
    [user]
  );

  useNotificationsChannel(handleNotification);

  function handleVideoShared() {
    refetchRef.current += 1;
    setRefetchSignal(refetchRef.current);
  }

  return (
    <div className="app">
      <Header onVideoShared={handleVideoShared} />
      <main className="main">
        {!isAuthenticated && (
          <div className="auth-hint">
            Login or register to share your favorite YouTube videos!
          </div>
        )}
        <VideoList refetchSignal={refetchSignal} />
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
