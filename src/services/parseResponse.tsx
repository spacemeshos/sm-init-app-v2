import { useState } from "react";
import { callPostCli } from "./postcliService";

interface Provider {
  ID: number;
  Model: string;
  DeviceType: string;
}

interface UsePostCliReturn {
  run: (args: string[]) => Promise<void>;
  response: Provider[] | null;
  error: string | null;
  loading: boolean;
}

const FindProviders = (): UsePostCliReturn => {
  const [response, setResponse] = useState<Provider[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const run = async (args: string[]): Promise<void> => {
    setLoading(true);
    try {
      const result: any = await callPostCli(args);
      const parsedResult = parseResponse(result);
      setResponse(parsedResult);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const parseResponse = (response: string): Provider[] => {
    const providers: Provider[] = [];
    const regex =
      /\(postrs\.Provider\)\s*\{\s*ID:\s*\(uint32\)\s*(\d+),\s*Model:\s*\(string\)\s*\(len=\d+\)\s*"([^"]+)",\s*DeviceType:\s*\(postrs\.DeviceClass\)\s*(\w+)\s*\}/g;
    let match;

    while ((match = regex.exec(response)) !== null) {
      const provider: Provider = {
        ID: parseInt(match[1], 10),
        Model: match[2],
        DeviceType: match[3],
      };
      providers.push(provider);
    }

    return providers;
  };

  return { run, response, error, loading };
};

export {FindProviders};