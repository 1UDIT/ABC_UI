import { useCallback, useEffect, useRef } from "react";
import type React from "react";

type UseRowKeyboardNavigationProps = {
  tableRef: React.RefObject<HTMLTableElement | null>;
  autoFocusFirstRow?: boolean;
  focusDependency?: unknown;
  setSelectedRowIndex: React.Dispatch<React.SetStateAction<number>>;
  rowCount: number;
  navigationDelay?: number;
  disabled?: boolean;
};

function isTypingElement(target: EventTarget | Element | null) {
  const element = target as HTMLElement | null;

  if (!element) return false;

  return (
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT" ||
    element.isContentEditable
  );
}

export function useRowKeyboardNavigation({
  tableRef,
  autoFocusFirstRow = false,
  focusDependency,
  setSelectedRowIndex,
  rowCount,
  navigationDelay = 180,
  disabled = false
}: UseRowKeyboardNavigationProps) {
  const lastMoveTimeRef = useRef(0);
  const hasAutoFocusedRef = useRef(false);

  const focusRow = useCallback(
    (rowIndex: number, shouldScroll = false) => {
      if (isTypingElement(document.activeElement)) return;

      const row = tableRef.current?.querySelector<HTMLTableRowElement>(
        `[data-row-index="${rowIndex}"]`
      );

      if (!row) return;

      row.focus({ preventScroll: true });

      if (shouldScroll) {
        row.scrollIntoView({
          block: "center",
        });
      }
    },
    [tableRef]
  );

  const moveRow = useCallback(
    (direction: "up" | "down") => {
      if (rowCount <= 0) return;
      if (isTypingElement(document.activeElement)) return;

      const now = Date.now();

      if (now - lastMoveTimeRef.current < navigationDelay) {
        return;
      }

      lastMoveTimeRef.current = now;

      setSelectedRowIndex((currentIndex) => {
        let nextIndex = currentIndex;

        if (direction === "down") {
          nextIndex = Math.min(currentIndex + 1, rowCount - 1);
        }

        if (direction === "up") {
          nextIndex = Math.max(currentIndex - 1, 0);
        }

        window.setTimeout(() => {
          focusRow(nextIndex, true);
        }, 0);

        return nextIndex;
      });
    },
    [rowCount, setSelectedRowIndex, focusRow, navigationDelay]
  );

  // Reset auto focus only when page changes
  useEffect(() => {
    hasAutoFocusedRef.current = false;
  }, [focusDependency]);

  // Auto focus first row only once per page
  useEffect(() => {
    if (hasAutoFocusedRef.current) return;
    if (!autoFocusFirstRow || rowCount <= 0) return;
    if (isTypingElement(document.activeElement)) return;

    const timer = window.setTimeout(() => {
      if (isTypingElement(document.activeElement)) return;

      setSelectedRowIndex(0);
      focusRow(0);
      hasAutoFocusedRef.current = true;
    }, 100);

    return () => window.clearTimeout(timer);
  }, [autoFocusFirstRow, rowCount, setSelectedRowIndex, focusRow]);

  useEffect(() => {
    if (disabled) return;

    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (document.querySelector('[role="dialog"]')) return;

      if (isTypingElement(event.target)) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveRow("down");
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveRow("up");
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [moveRow, disabled]);

  return {};
}