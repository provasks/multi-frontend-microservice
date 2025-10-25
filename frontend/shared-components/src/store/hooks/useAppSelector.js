import { useSelector } from 'react-redux';

/**
 * Typed useSelector hook
 * Provides type safety for state selection
 */
export const useAppSelector = (selector) => useSelector(selector);
