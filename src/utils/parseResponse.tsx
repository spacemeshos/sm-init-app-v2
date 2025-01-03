import { useCallback, useRef, useState } from "react";

import { callPostCli } from "../services/postcliService";

interface Provider {
  ID: number;
  Model: string;
  DeviceType: string;
}

interface UsePostCliReturn {
  run: (args: string[], updateConsole?: (command: string, output: string) => void) => Promise<void>;
  response: Provider[] | null;
  setResponse: React.Dispatch<React.SetStateAction<Provider[] | null>>;
  error: string | null;
  loading: boolean;
}

const FindProviders = (): UsePostCliReturn => {
  const [response, setResponse] = useState<Provider[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const parseResponse = useCallback((response: string): Provider[] => {
    const providers: Provider[] = [];
    
    // More flexible regex pattern that's more tolerant of different line endings and whitespace
    // Also handles potential variations in output format between Windows and Unix
    const regex = /ID:\s*(?:\(uint32\)|uint32)?\s*(\d+)[\s\S]*?Model:\s*(?:\(string\)|string)?(?:\s*\(len=\d+\))?\s*"(?:\[(?:CPU|GPU)\])?\s*([^"]+)"[\s\S]*?DeviceType:\s*(?:\(postrs\.DeviceClass\)|string)?\s*(\w+)/g;
    
    let match;
    while ((match = regex.exec(response)) !== null) {
      try {
        const provider: Provider = {
          ID: parseInt(match[1], 10),
          Model: match[2].trim(),
          DeviceType: match[3].trim(),
        };
        
        // Validate parsed values
        if (isNaN(provider.ID) || !provider.Model || !provider.DeviceType) {
          console.warn('Invalid provider data:', match);
          continue;
        }
        
        providers.push(provider);
      } catch (err) {
        console.error('Error parsing provider:', err);
        continue;
      }
    }

    // If no providers were found with the main regex, try a simpler fallback pattern
    if (providers.length === 0) {
      console.log('Attempting fallback provider parsing');
      const fallbackRegex = /ID:\s*(\d+).*?Model:\s*"([^"]+)".*?DeviceType:\s*(\w+)/g;
      while ((match = fallbackRegex.exec(response)) !== null) {
        try {
          const provider: Provider = {
            ID: parseInt(match[1], 10),
            Model: match[2].trim(),
            DeviceType: match[3].trim(),
          };
          
          if (isNaN(provider.ID) || !provider.Model || !provider.DeviceType) {
            console.warn('Invalid provider data in fallback:', match);
            continue;
          }
          
          providers.push(provider);
        } catch (err) {
          console.error('Error parsing provider in fallback:', err);
          continue;
        }
      }
    }

    // Log the parsed results for debugging
    console.log('Parsed providers:', providers);
    console.log('Original response:', response);

    return providers;
  }, []);

  const run = useCallback(async (args: string[], updateConsole?: (command: string, output: string) => void): Promise<void> => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      // Pass only the supported arguments to callPostCli
      const result = await callPostCli(args, updateConsole);
      
      // Log the raw output for debugging
      console.log('Raw postcli output:', result);
      
      if (!result.stdout && result.stderr) {
        throw new Error(result.stderr);
      }
      
      const parsedResult = parseResponse(result.stdout);
      
      if (parsedResult.length === 0) {
        throw new Error('No providers found in the output. Please check if postcli is working correctly.');
      }
      
      setResponse(parsedResult);
      setError(null);
    } catch (err: any) {
      // Don't set error state if the request was intentionally cancelled
      if (err.name !== 'AbortError') {
        const errorMessage = err.message || 'Unknown error occurred while finding providers';
        console.error('Provider detection error:', errorMessage);
        setError(errorMessage);
        setResponse(null);
      }
    } finally {
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      setLoading(false);
    }
  }, [parseResponse]);

  return { run, response, setResponse, error, loading };
};

export { FindProviders };
export type { Provider };
