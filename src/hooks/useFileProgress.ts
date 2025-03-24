import { join } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';

const useFileProgress = (posDir: string, maxFileSize: number, pollInterval = 10000) => {
  const [fileProgress, setFileProgress] = useState(0);
  const [fileIndex, setFileIndex] = useState<number | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);

  useEffect(() => {
    if (fileIndex === null) {
      setFilePath(null);
      return;
    };

    (async () => {
      const filePath = await join(posDir, `postdata_${fileIndex}.bin`);
      setFilePath(filePath);
    })();
  }, [fileIndex]);

  useEffect(() => {
    if (!filePath || !maxFileSize) return;

    const interval = setInterval(async () => {
      try {
        const size = await invoke<number>('get_file_size', { filePath });
        const percent = (size / maxFileSize) * 100;
        console.log('GET SIZE oF', filePath, '=', size, `${percent}%`);
        setFileProgress(percent);
      } catch (err) {
        setFileProgress(0);
        console.error('Failed to get file size:', err, '??', filePath);
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [filePath, maxFileSize, pollInterval]);

  return {
    filePath,
    setFileIndex,
    fileProgress,
  };
};

export default useFileProgress;
