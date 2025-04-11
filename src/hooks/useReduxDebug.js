import { useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook for debugging Redux state
 * @param {string} selector - The selector function to use
 * @param {string} label - The label to use for the console log
 * @param {Array} dependencies - The dependencies to use for the useEffect
 */
export const useReduxDebug = (selector, label, dependencies = []) => {
  const state = useSelector(selector);

  useEffect(() => {
    console.log(`Redux Debug [${label}]:`, state);
  }, [state, label, ...dependencies]);

  return state;
};

export default useReduxDebug; 