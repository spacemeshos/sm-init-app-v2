import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Colors from '../styles/colors';
import { useConsole } from '../state/ConsoleContext';

const ConsoleContainer = styled.div`
  background-color: ${Colors.black};
  padding: 16px;
  margin: 10px 0;
  font-family: 'Courier New', Courier, monospace;
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
  color: ${Colors.white};
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${Colors.black};
  }

  &::-webkit-scrollbar-thumb {
    background: ${Colors.greenLight}40;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${Colors.greenLight}80;
  }
`;

const CommandLine = styled.div`
  color: ${Colors.greenLight};
  margin-bottom: 8px;
  font-weight: bold;
  &:before {
    content: '$ ';
    opacity: 0.7;
  }
`;

const Output = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
`;

const EmptyState = styled.div`
  color: ${Colors.grayLight};
  text-align: center;
  padding: 20px;
  font-style: italic;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 16px;
  background-color: ${Colors.greenLight};
  margin-left: 4px;
  animation: blink 1s step-end infinite;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

const ConsoleView: React.FC = () => {
  const { command, output } = useConsole();
  const consoleRef = useRef<HTMLDivElement>(null);
  const prevOutputRef = useRef(output);

  // Debug logging
  useEffect(() => {
    console.log('ConsoleView rendered with:', { command, output });
  }, [command, output]);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (consoleRef.current && output !== prevOutputRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      prevOutputRef.current = output;
      console.log('Scrolled to bottom, new output:', output);
    }
  }, [output]);

  const renderLine = (line: string, index: number) => {
    // Check if line contains timestamp
    const timestampMatch = line.match(/^\[([\d:]+(?:\s?[AP]M)?)\]/);
    if (timestampMatch) {
      const [fullTimestamp] = timestampMatch;
      const content = line.slice(fullTimestamp.length);
      
      // Determine text color based on content
      let contentColor = Colors.white;
      if (content.includes('Error') || content.includes('error')) {
        contentColor = Colors.red;
      } else if (content.includes('Success') || content.includes('success')) {
        contentColor = Colors.greenLight;
      }

      return (
        <div key={index}>
          <span style={{ color: Colors.grayLight }}>{fullTimestamp}</span>
          <span style={{ color: contentColor }}>{content}</span>
        </div>
      );
    }
    return <div key={index}>{line}</div>;
  };

  const renderContent = () => {
    if (!output && !command) {
      return (
        <EmptyState>
          Initializing console<Cursor />
        </EmptyState>
      );
    }

    return (
      <>
        {command && <CommandLine>{command}</CommandLine>}
        <Output>
          {output.split('\n').map((line, index) => renderLine(line, index))}
        </Output>
      </>
    );
  };

  return (
    <ConsoleContainer ref={consoleRef}>
      {renderContent()}
    </ConsoleContainer>
  );
};

export default ConsoleView;
