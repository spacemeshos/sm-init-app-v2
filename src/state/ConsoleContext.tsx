/**
 * @fileoverview Context provider for managing console output
 * Provides a centralized way to manage and display command outputs and logs
 * with timestamps and expandable interface.
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

/**
 * Represents a single console entry with command, output, and timestamp
 */
interface ConsoleEntry {
  /** Command that was executed */
  command: string;
  /** Output from the command execution */
  output: string;
  /** Timestamp when the entry was created */
  timestamp: string;
}

/**
 * Console state containing entries and UI state
 */
interface ConsoleState {
  entries: ConsoleEntry[];
  isExpanded: boolean;
}

/**
 * Union type of all possible console actions
 * - UPDATE: Add new console entry
 * - CLEAR: Remove all entries
 * - INITIALIZE: Set up initial console state
 * - TOGGLE_EXPAND: Toggle console expanded state
 */
type ConsoleAction = 
  | { type: 'UPDATE'; command: string; output: string }
  | { type: 'CLEAR' }
  | { type: 'INITIALIZE' }
  | { type: 'TOGGLE_EXPAND' };

/**
 * Context interface exposing console state and actions
 */
interface ConsoleContextType extends ConsoleState {
  updateConsole: (command: string, output: string) => void;
  clearConsole: () => void;
  toggleExpand: () => void;
}

/**
 * Initial state for console
 * Starts with empty entries and collapsed state
 */
const initialState: ConsoleState = {
  entries: [],
  isExpanded: false
};

/**
 * Reducer for managing console state
 * Handles all console actions and state updates
 * 
 * @param {ConsoleState} state - Current console state
 * @param {ConsoleAction} action - Action to perform
 * @returns {ConsoleState} New console state
 */
function consoleReducer(state: ConsoleState, action: ConsoleAction): ConsoleState {
  console.log('Console reducer called with action:', action);
  
  switch (action.type) {
    case 'UPDATE': {
      const timestamp = new Date().toLocaleTimeString();
      const newEntry: ConsoleEntry = {
        command: action.command,
        output: action.output,
        timestamp
      };
      
      console.log('New state after update:', {
        ...state,
        entries: [...state.entries, newEntry]
      });
      
      return {
        ...state,
        entries: [...state.entries, newEntry]
      };
    }
      
    case 'CLEAR':
      return {
        ...state,
        entries: []
      };
      
    case 'INITIALIZE': {
      const timestamp = new Date().toLocaleTimeString();
      return {
        ...state,
        entries: [{
          command: '',
          output: 'Console initialized',
          timestamp
        }]
      };
    }

    case 'TOGGLE_EXPAND':
      return {
        ...state,
        isExpanded: !state.isExpanded
      };
      
    default:
      return state;
  }
}

// Create context with undefined default value
const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined);

/**
 * Provider component for console management
 * Provides console state and actions to children
 * 
 * Features:
 * - Automatic initialization
 * - Entry management
 * - Expansion control
 * - Debug logging
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(consoleReducer, initialState);

  // Initialize console on mount
  useEffect(() => {
    console.log('Initializing console...');
    dispatch({ type: 'INITIALIZE' });
  }, []);

  /**
   * Add new entry to console
   * @param {string} command - Command that was executed
   * @param {string} output - Output from command execution
   */
  const updateConsole = useCallback((command: string, output: string) => {
    console.log('updateConsole called with:', { command, output });
    dispatch({ type: 'UPDATE', command, output });
  }, []);

  /**
   * Clear all console entries
   * Resets console to empty state
   */
  const clearConsole = useCallback(() => {
    console.log('clearConsole called');
    dispatch({ type: 'CLEAR' });
  }, []);

  /**
   * Toggle console expansion state
   * Controls visibility of full console in UI
   */
  const toggleExpand = useCallback(() => {
    console.log('toggleExpand called');
    dispatch({ type: 'TOGGLE_EXPAND' });
  }, []);

  // Debug log state changes
  useEffect(() => {
    console.log('Console state:', state);
  }, [state]);

  // Memoize context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    ...state,
    updateConsole,
    clearConsole,
    toggleExpand
  }), [state, updateConsole, clearConsole, toggleExpand]);

  return (
    <ConsoleContext.Provider value={value}>
      {children}
    </ConsoleContext.Provider>
  );
};

/**
 * Hook for accessing console context
 * @returns {ConsoleContextType} Console state and actions
 * @throws {Error} If used outside ConsoleProvider
 */
export const useConsole = () => {
  const context = useContext(ConsoleContext);
  if (!context) {
    const error = new Error('useConsole must be used within a ConsoleProvider');
    console.error(error);
    throw error;
  }
  return context;
};

/**
 * Debug utility for inspecting console state
 * Logs detailed information about current console state
 * 
 * @param {ConsoleState} state - Console state to inspect
 */
export const debugConsoleState = (state: ConsoleState) => {
  console.log('Current console state:', {
    entries: state.entries,
    entryCount: state.entries.length,
    hasContent: state.entries.length > 0,
    isExpanded: state.isExpanded
  });
};
