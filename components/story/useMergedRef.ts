"use client";

import { useCallback, useRef, type Ref } from "react";

/** Local ref for scroll measurement that also forwards to a parent's `ref` prop. */
export function useMergedRef<T>(ref?: Ref<T>) {
  const local = useRef<T | null>(null);
  const set = useCallback(
    (el: T | null) => {
      local.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );
  return [local, set] as const;
}
