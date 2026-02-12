"use client";

import { useCallback, useState } from "react";

type Placement = "top" | "bottom";

export function useTooltipPosition() {
  const [placement, setPlacement] = useState<Placement>("top");

  const updatePlacement = useCallback((triggerEl: HTMLElement | null) => {
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    setPlacement(rect.top < 80 ? "bottom" : "top");
  }, []);

  return { placement, updatePlacement };
}
