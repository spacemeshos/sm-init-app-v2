import { useState } from 'react';
import { callPostCli } from '../services/postcliService';

const usePostCli = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const run = async (args) => {
        setLoading(true);
        try {
            const result = await callPostCli(args);
            setResponse(result);
            setError(null);
        } catch (error) {
            setError(error);
            setResponse(null);
        } finally {
            setLoading(false);
        }
    };

    return { run, response, error, loading };
};

export default usePostCli;