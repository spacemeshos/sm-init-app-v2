import { Stage } from '../../types/posProgress';
import { parsePOSProgress } from '../posProgressParser';
import { calculateNumFiles } from '../sizeUtils';

describe('parsePOSProgress', () => {
  const mockSettings = {
    numUnits: 100,
    maxFileSize: 1000
  };

  it('returns default response for empty log', () => {
    const result = parsePOSProgress('', mockSettings);
    expect(result).toEqual({
      stage: Stage.Processing,
      progress: 0,
      details: 'Generating Proof of Space data...',
      isError: false
    });
  });

  it('correctly parses file completion log', () => {
    const log = '2024-12-17T22:34:57.991+0100    INFO    initialization: completed       {"fileIndex": 5}';
    const result = parsePOSProgress(log, mockSettings);
    
    const totalFiles = calculateNumFiles(mockSettings.numUnits, mockSettings.maxFileSize);
    const progress = ((5 + 1) / totalFiles) * 100;
    
    expect(result).toEqual({
      stage: Stage.Processing,
      progress,
      details: `6 of ${totalFiles} files generated (${Math.round(progress)}%)`,
      isError: false,
      fileProgress: {
        currentFile: 5,
        totalFiles
      }
    });
  });

  it('handles postcli stdout prefix', () => {
    const log = 'postcli stdout: INFO    initialization: completed       {"fileIndex": 5}';
    const result = parsePOSProgress(log, mockSettings);
    
    expect(result.stage).toBe(Stage.Processing);
    expect(result.fileProgress).toBeDefined();
    expect(result.fileProgress?.currentFile).toBe(5);
  });

  it('detects errors in logs', () => {
    const log = 'ERROR: Failed to write file';
    const result = parsePOSProgress(log, mockSettings);
    
    expect(result).toEqual({
      stage: Stage.Error,
      progress: 0,
      details: log,
      isError: true
    });
  });

  it('detects final completion', () => {
    const log = 'cli: initialization completed';
    const totalFiles = calculateNumFiles(mockSettings.numUnits, mockSettings.maxFileSize);
    const result = parsePOSProgress(log, mockSettings);
    
    expect(result).toEqual({
      stage: Stage.Complete,
      progress: 100,
      details: `All ${totalFiles} files have been generated successfully`,
      isError: false
    });
  });

  it('returns default response for unrecognized log format', () => {
    const log = 'some random log message';
    const result = parsePOSProgress(log, mockSettings);
    
    expect(result).toEqual({
      stage: Stage.Processing,
      progress: 0,
      details: 'Generating Proof of Space data...',
      isError: false
    });
  });
});
