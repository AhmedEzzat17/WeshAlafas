import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to track scroll position and direction.
 * Used for navbar hide/show behavior on mobile.
 *
 * @param {number} threshold - Pixels scrolled before triggering "scrolled" state
 * @returns {{ isScrolled: boolean, scrollY: number }}
 */
export function useScrollPosition(threshold = 50) {
  const [isScrolled, setIsScrolled] = useState(() => 
    typeof window !== "undefined" ? window.scrollY > threshold : false
  );
  const [scrollY, setScrollY] = useState(() => 
    typeof window !== "undefined" ? window.scrollY : 0
  );

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setIsScrolled(currentScrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    // Use passive listener for performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { isScrolled, scrollY };
}
