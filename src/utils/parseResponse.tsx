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
    const regex = /ID:\s*\(uint32\)\s*(\d+),[\s\S]*?Model:\s*\(string\)\s*\(len=\d+\)\s*"\[(CPU|GPU)\]\s*([^"]+)",[\s\S]*?DeviceType:\s*\(postrs\.DeviceClass\)\s*(\w+)/g;
    let match;

    while ((match = regex.exec(response)) !== null) {
      const provider: Provider = {
        ID: parseInt(match[1], 10),
        Model: match[3],
        DeviceType: match[4],
      };
      providers.push(provider);
    }

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
      const parsedResult = parseResponse(result.stdout);
      setResponse(parsedResult);
      setError(null);
    } catch (err: any) {
      // Don't set error state if the request was intentionally cancelled
      if (err.name !== 'AbortError') {
        setError(err.message);
        setResponse(null);
      }
    } finally {
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      setLoading(false);
    }
  }, [parseResponse]);

  return { run, response, error, loading };
};

export { FindProviders };
export type { Provider };
