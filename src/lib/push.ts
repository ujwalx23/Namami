import { supabase } from "@/integrations/supabase/client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function saveSubscriptionToDb(subscription: PushSubscription) {
  const subscriptionJson = subscription.toJSON();
  if (
    !subscriptionJson.endpoint ||
    !subscriptionJson.keys?.p256dh ||
    !subscriptionJson.keys?.auth
  ) {
    throw new Error("Invalid push subscription object.");
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      endpoint: subscriptionJson.endpoint,
      p256dh: subscriptionJson.keys.p256dh,
      auth: subscriptionJson.keys.auth,
    },
    { onConflict: "endpoint" },
  );

  if (error) {
    console.error("Failed to save push subscription:", error.message);
    return false;
  }
  return true;
}

/** Subscribe device for background push (PWA / installed app). */
export async function subscribeToNotifications(): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push messaging is not supported in this browser.");
    return false;
  }

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    console.warn(
      "VITE_VAPID_PUBLIC_KEY is missing. Add VAPID keys to .env and Supabase Edge Function secrets for phone notifications.",
    );
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    const saved = await saveSubscriptionToDb(subscription);
    if (saved) {
      console.log("Push notifications enabled for this device.");
    }
    return saved;
  } catch (err) {
    console.error("Error subscribing to push notifications:", err);
    return false;
  }
}

export function isPushConfigured(): boolean {
  return Boolean(import.meta.env.VITE_VAPID_PUBLIC_KEY);
}
