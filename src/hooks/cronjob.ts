import { useEffect } from "react";

export function useKeepCronAlive() {
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/send-video").catch(() =>
        console.error("Failed to ping cron job")
      );
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, []);
}
