import { parsePOSProgress } from '../posProgressParser';
import { Stage } from '../../types/posProgress';

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
      details: 'Starting POS data generation...',
      isError: false
    });
  });

  it('correctly parses file completion log', () => {
    const log = '2024-12-17T22:34:57.991+0100    INFO    initialization: completed       {"fileIndex": 5, "numLabelsWritten": 26559}';
    const result = parsePOSProgress(log, mockSettings);
    
    expect(result).toMatchObject({
      stage: Stage.Processing,
      isError: false,
      fileProgress: {
        currentFile: 5,
        currentLabels: 26559,
        targetLabels: 26559
      }
    });
  });

  it('correctly parses file start log', () => {
    const log = '2024-12-17T22:34:57.992+0100    INFO    initialization: starting to write file  {"fileIndex": 6, "currentNumLabels": 0, "targetNumLabels": 26559, "startPosition": 159354}';
    const result = parsePOSProgress(log, mockSettings);
    
    expect(result).toMatchObject({
      stage: Stage.Processing,
      isError: false,
      fileProgress: {
        currentFile: 6,
        currentLabels: 0,
        targetLabels: 26559
      }
    });
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
    const log = 'initialization: completed, found nonce';
    const result = parsePOSProgress(log, mockSettings);
    
    expect(result).toEqual({
      stage: Stage.Complete,
      progress: 100,
      details: expect.stringContaining('files have been generated successfully'),
      isError: false
    });
  });

  it('returns default response for unrecognized log format', () => {
    const log = 'some random log message';
    const result = parsePOSProgress(log, mockSettings);
    
    expect(result).toEqual({
      stage: Stage.Processing,
      progress: 0,
      details: 'Starting POS data generation...',
      isError: false
    });
  });
});
