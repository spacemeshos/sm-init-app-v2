import { useState } from 'react';

import useDebounce from './useDebounce';

/**
 * Custom hook to manage tile hover behavior with close button functionality.
 * 
 * This hook provides a way to show content on hover, hide it when a close button
 * is clicked, and only re-enable the hover behavior when the mouse leaves and re-enters.
 * 
 * @param debounceDelay Optional delay in ms for debouncing the hover state (default: 50ms)
 * @returns An object containing state and handlers for the tile hover behavior
 */
const useTileHover = (debounceDelay: number = 50) => {
  // Content visibility state
  const [isHovering, setIsHovering] = useState(false);
  
  // Track if tile is in "closed" state (close button was clicked)
  const [isClosed, setIsClosed] = useState(false);
  
  // Track if mouse is over tile
  const [isMouseOver, setIsMouseOver] = useState(false);
  
  // Debounced state to prevent flickering
  const isVisible = useDebounce(isHovering, debounceDelay);
  
  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsMouseOver(true);
    if (!isClosed) {
      setIsHovering(true);
    }
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsMouseOver(false);
    // Reset closed state when mouse leaves
    setIsClosed(false);
  };
  
  // Handle close button click
  const handleClose = () => {
    setIsHovering(false);
    setIsClosed(true);
  };
  
  return {
    isVisible,
    isMouseOver,
    isClosed,
    handleMouseEnter,
    handleMouseLeave,
    handleClose
  };
};

export default useTileHover;
