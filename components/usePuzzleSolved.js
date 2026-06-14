import { useCallback, useEffect, useRef } from 'react';

export function usePuzzleSolved(onSolved) {
  const solvedRef = useRef(false);
  const onSolvedRef = useRef(onSolved);
  onSolvedRef.current = onSolved;

  useEffect(() => {
    solvedRef.current = false;
  }, []);

  const markSolved = useCallback(() => {
    if (solvedRef.current) return;
    solvedRef.current = true;
    onSolvedRef.current?.();
  }, []);

  return markSolved;
}
