import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useConsole } from "../state/ConsoleContext";
import Colors from "../styles/colors";

interface ConsoleContainerProps {
  $isExpanded: boolean;
  $height?: number;
}

const ConsoleContainer = styled.div<ConsoleContainerProps>`
  background-color: ${Colors.black};
  font-family: 'Courier New', Courier, monospace;
  min-height: 20px;
  height: ${props => props.$isExpanded ? `${props.$height || 300}px` : '30px'};
  max-height: ${props => props.$isExpanded ? '500px' : '30px'};
  overflow-y: auto;
  color: ${Colors.greenVeryLight};
  font-size: 12px;
  line-height: 1.4;
  position: relative;
  transition: height 0.3s ease;
  resize: ${props => props.$isExpanded ? 'vertical' : 'none'};
  
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

  /* Resize handle styling */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    cursor: ${props => props.$isExpanded ? 'ns-resize' : 'default'};
    background: ${props => props.$isExpanded ? `${Colors.greenLight}20` : 'transparent'};
    transition: background 0.2s ease;
  }

  &:hover::after {
    background: ${props => props.$isExpanded ? `${Colors.greenLight}40` : 'transparent'};
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
  z-index: 1;
`;

const ConsoleButton = styled.button`
  background-color: ${Colors.black};
  border: 1px solid ${Colors.greenLight};
  color: ${Colors.greenLight};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  font-family: 'Courier New', Courier, monospace;

  &:hover {
    background-color: ${Colors.greenLight}20;
  }
`;

const CommandGroup = styled.div`
  margin-bottom: 16px;
  padding: 0 8px;
`;

const CommandLine = styled.div`
  color: ${Colors.greenLight};
  margin-bottom: 8px;
  font-weight: bold;
`;

interface OutputProps {
  $content: string;
}

const Output = styled.pre<OutputProps>`
  margin: 0 0 8px 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  color: ${(props) => {
    const content = props.$content;
    if (content.includes("Error") || content.includes("error")) {
      return Colors.red;
    }
    if (content.includes("Success") || content.includes("success")) {
      return Colors.greenLight;
    }
    return Colors.white;
  }};
`;

const Timestamp = styled.span`
  color: ${Colors.grayLight};
`;

const ConsoleView: React.FC = () => {
  const { entries, clearConsole, isExpanded, toggleExpand } = useConsole();
  const consoleRef = useRef<HTMLDivElement>(null);
  const prevEntriesLengthRef = useRef(entries.length);
  const [height, setHeight] = useState(300);

  // Handle resize observer
  useEffect(() => {
    if (!consoleRef.current || !isExpanded) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(consoleRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isExpanded]);

  // Debug logging
  useEffect(() => {
    console.log("ConsoleView rendered with:", { entries, isExpanded });
  }, [entries, isExpanded]);

  // Auto-scroll to bottom when entries change
  useEffect(() => {
    if (consoleRef.current && entries.length !== prevEntriesLengthRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      prevEntriesLengthRef.current = entries.length;
      console.log("Scrolled to bottom, new entries length:", entries.length);
    }
  }, [entries]);

  const groupEntriesByCommand = () => {
    const grouped = new Map<string, { timestamp: string; output: string }[]>();

    entries.forEach((entry) => {
      if (!grouped.has(entry.command)) {
        grouped.set(entry.command, []);
      }
      grouped
        .get(entry.command)
        ?.push({ timestamp: entry.timestamp, output: entry.output });
    });

    return grouped;
  };

  const renderContent = () => {
    const groupedEntries = groupEntriesByCommand();

    return Array.from(groupedEntries.entries()).map(
      ([command, outputs], groupIndex) => (
        <CommandGroup key={groupIndex}>
          {command && <CommandLine>{command}</CommandLine>}
          {outputs.map((output, index) => (
            <Output key={index} $content={output.output}>
              <Timestamp>[{output.timestamp}]</Timestamp> {output.output}
            </Output>
          ))}
        </CommandGroup>
      )
    );
  };

  return (
    <ConsoleContainer 
      ref={consoleRef} 
      $isExpanded={isExpanded}
      $height={height}
    >
      <ButtonContainer>
        {entries.length > 0 && (
          <ConsoleButton onClick={clearConsole}>Clear</ConsoleButton>
        )}
        <ConsoleButton onClick={toggleExpand}>
          {isExpanded ? 'Minimize' : 'Expand'}
        </ConsoleButton>
      </ButtonContainer>
      {renderContent()}
    </ConsoleContainer>
  );
};

export default ConsoleView;
