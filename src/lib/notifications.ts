import type { Router } from "@tanstack/react-router";
import { toast } from "sonner";

export type SiteNotificationPayload = {
  title: string;
  body: string;
  url?: string;
};

export function showSiteNotification(payload: SiteNotificationPayload, router?: Router<any>) {
  const title = payload.title?.trim() || "Namami Vindhyavasini";
  const body = payload.body?.trim() || "";
  const url = payload.url?.trim() || "/";

  toast.success(title, {
    description: body || undefined,
    duration: 4000,
    action: router
      ? {
          label: "View",
          onClick: () => {
            if (url.startsWith("/inbox")) {
              const hashIndex = url.indexOf("#");
              const toPath = hashIndex !== -1 ? url.substring(0, hashIndex) : url;
              const hashVal = hashIndex !== -1 ? url.substring(hashIndex + 1) : undefined;
              void router.navigate({ to: toPath, hash: hashVal });
            } else {
              void router.navigate({ to: url });
            }
          },
        }
      : undefined,
  });
}
