"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { type HelpTipId, helpTips } from "@/data/help-tips";
import { useTooltipPosition } from "@/lib/hooks/use-tooltip-position";
import { cn } from "@/lib/utils";

interface HelpTipProps {
  tipId: HelpTipId;
  className?: string;
}

export function HelpTip({ tipId, className }: HelpTipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverOpenTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  const { placement, updatePlacement } = useTooltipPosition();

  const text = helpTips[tipId];

  // Update placement when tooltip opens
  const openTooltip = useCallback(() => {
    setOpen(true);
    updatePlacement(triggerRef.current);
  }, [updatePlacement]);

  const closeAll = useCallback(() => {
    setOpen(false);
    setPinned(false);
  }, []);

  // Click/tap: toggle open AND pinned
  function handleClick() {
    if (open && pinned) {
      closeAll();
    } else {
      openTooltip();
      setPinned(true);
    }
  }

  // Hover enter: open only if not pinned (with 300ms delay)
  function handleMouseEnter() {
    if (hoverCloseTimeout.current) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
    if (pinned) return;
    hoverOpenTimeout.current = setTimeout(() => {
      if (!pinned) {
        openTooltip();
      }
    }, 300);
  }

  // Hover leave: close only if not pinned (with 150ms delay)
  function handleMouseLeave() {
    if (hoverOpenTimeout.current) {
      clearTimeout(hoverOpenTimeout.current);
      hoverOpenTimeout.current = null;
    }
    if (pinned) return;
    hoverCloseTimeout.current = setTimeout(() => {
      if (!pinned) {
        setOpen(false);
      }
    }, 150);
  }

  // Focus: open immediately
  function handleFocus() {
    openTooltip();
  }

  // Blur: close only if not pinned
  function handleBlur() {
    if (!pinned) {
      setOpen(false);
    }
  }

  // Escape key: close and unpin
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeAll();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeAll]);

  // Outside click: close and unpin
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        tooltipRef.current?.contains(target)
      ) {
        return;
      }
      closeAll();
    }

    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, [open, closeAll]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverOpenTimeout.current) clearTimeout(hoverOpenTimeout.current);
      if (hoverCloseTimeout.current) clearTimeout(hoverCloseTimeout.current);
    };
  }, []);

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={open ? tooltipId : undefined}
        className="w-5 h-5 rounded-full bg-gold/20 text-gold hover:bg-gold/30 focus:ring-2 focus:ring-gold/50 focus:outline-none inline-flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
      >
        ?
      </button>

      {open && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "absolute z-50 px-3 py-2 text-xs text-white bg-primary rounded-lg shadow-lg max-w-[200px] w-max pointer-events-auto",
            placement === "top"
              ? "bottom-full left-1/2 -translate-x-1/2 mb-2"
              : "top-full left-1/2 -translate-x-1/2 mt-2",
          )}
        >
          {text}
          {/* Arrow */}
          <span
            className={cn(
              "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
              placement === "top"
                ? "top-full border-t-primary"
                : "bottom-full border-b-primary",
            )}
          />
        </div>
      )}
    </span>
  );
}
