import { useEffect, useRef } from "react";
import { createConsumer } from "@rails/actioncable";
import { useAuthStore } from "../store/auth-store";
import type { Notification } from "../types";

// Connects to Rails Action Cable NotificationsChannel
// JWT token is passed via query param for WebSocket auth
export function useNotificationsChannel(
  onNotification: (notification: Notification) => void
) {
  const { token } = useAuthStore();
  const consumerRef = useRef<ReturnType<typeof createConsumer> | null>(null);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    if (!token) return;

    // VITE_API_URL is empty for local (nginx proxy), set to backend URL on Vercel
    const apiUrl = import.meta.env.VITE_API_URL ?? "";
    const wsBase = apiUrl.replace(/^https/, "wss").replace(/^http/, "ws");
    const wsUrl = `${wsBase}/cable?token=${encodeURIComponent(token)}`;
    consumerRef.current = createConsumer(wsUrl);

    subscriptionRef.current = consumerRef.current.subscriptions.create(
      "NotificationsChannel",
      {
        received(data: Notification) {
          onNotification(data);
        },
      }
    );

    return () => {
      subscriptionRef.current?.unsubscribe();
      consumerRef.current?.disconnect();
    };
  }, [token, onNotification]);
}
