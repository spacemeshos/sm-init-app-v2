import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

interface ConsoleEntry {
  command: string;
  output: string;
  timestamp: string;
}

interface ConsoleState {
  entries: ConsoleEntry[];
  isExpanded: boolean;
}

type ConsoleAction = 
  | { type: 'UPDATE'; command: string; output: string }
  | { type: 'CLEAR' }
  | { type: 'INITIALIZE' }
  | { type: 'TOGGLE_EXPAND' };

interface ConsoleContextType extends ConsoleState {
  updateConsole: (command: string, output: string) => void;
  clearConsole: () => void;
  toggleExpand: () => void;
}

const initialState: ConsoleState = {
  entries: [],
  isExpanded: false
};

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

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined);

export const ConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(consoleReducer, initialState);

  // Initialize the console
  useEffect(() => {
    console.log('Initializing console...');
    dispatch({ type: 'INITIALIZE' });
  }, []);

  const updateConsole = useCallback((command: string, output: string) => {
    console.log('updateConsole called with:', { command, output });
    dispatch({ type: 'UPDATE', command, output });
  }, []);

  const clearConsole = useCallback(() => {
    console.log('clearConsole called');
    dispatch({ type: 'CLEAR' });
  }, []);

  const toggleExpand = useCallback(() => {
    console.log('toggleExpand called');
    dispatch({ type: 'TOGGLE_EXPAND' });
  }, []);

  // Debug log state changes
  useEffect(() => {
    console.log('Console state:', state);
  }, [state]);

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

export const useConsole = () => {
  const context = useContext(ConsoleContext);
  if (!context) {
    const error = new Error('useConsole must be used within a ConsoleProvider');
    console.error(error);
    throw error;
  }
  return context;
};

// Debug helper
export const debugConsoleState = (state: ConsoleState) => {
  console.log('Current console state:', {
    entries: state.entries,
    entryCount: state.entries.length,
    hasContent: state.entries.length > 0,
    isExpanded: state.isExpanded
  });
};
