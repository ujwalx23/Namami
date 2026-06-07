import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/panchang")({
  beforeLoad: () => {
    throw redirect({
      to: "/calendar",
      statusCode: 301,
    });
  },
});
