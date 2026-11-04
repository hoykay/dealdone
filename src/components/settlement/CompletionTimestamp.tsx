"use client";

import { useEffect, useState } from "react";

export default function CompletionTimestamp({
  completedAt,
}: {
  completedAt?: string;
}) {
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    if (!completedAt) {
      setFormattedTime("Not available");
      return;
    }

    const date = new Date(completedAt);

    setFormattedTime(
      date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    );
  }, [completedAt]);

  return <span>{formattedTime || "—"}</span>;
}