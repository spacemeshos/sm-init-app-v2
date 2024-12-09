import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

interface ConsoleState {
  command: string;
  output: string;
}

type ConsoleAction = 
  | { type: 'UPDATE'; command: string; output: string }
  | { type: 'CLEAR' }
  | { type: 'INITIALIZE' };

interface ConsoleContextType extends ConsoleState {
  updateConsole: (command: string, output: string) => void;
  clearConsole: () => void;
}

const initialState: ConsoleState = {
  command: '',
  output: ''
};

function consoleReducer(state: ConsoleState, action: ConsoleAction): ConsoleState {
  console.log('Console reducer called with action:', action);
  
  switch (action.type) {
    case 'UPDATE': {
      const timestamp = new Date().toLocaleTimeString();
      const newEntry = `[${timestamp}] ${action.output}`;
      const newOutput = state.output 
        ? `${state.output}\n${newEntry}`
        : newEntry;
      
      console.log('New state after update:', {
        command: action.command,
        output: newOutput
      });
      
      return {
        command: action.command,
        output: newOutput
      };
    }
      
    case 'CLEAR':
      return initialState;
      
    case 'INITIALIZE': {
      const timestamp = new Date().toLocaleTimeString();
      return {
        ...state,
        output: `[${timestamp}] Console initialized`
      };
    }
      
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

  // Debug log state changes
  useEffect(() => {
    console.log('Console state:', state);
  }, [state]);

  const value = React.useMemo(() => ({
    ...state,
    updateConsole,
    clearConsole
  }), [state, updateConsole, clearConsole]);

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
    command: state.command,
    output: state.output,
    outputLength: state.output.length,
    hasContent: Boolean(state.output),
    lines: state.output.split('\n').length
  });
};
