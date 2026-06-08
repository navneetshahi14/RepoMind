"use client";

import { useEffect, useRef, useState } from "react";

export function useAutoScroll<T extends HTMLElement>(dependencies: unknown[]) {
  const ref = useRef<T>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldAutoScroll(isAtBottom);
      lastScrollTop.current = scrollTop;
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !shouldAutoScroll) return;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });
  }, dependencies);

  return ref;
}
