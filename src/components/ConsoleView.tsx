import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import { useConsole } from "../state/ConsoleContext";

const ConsoleContainer = styled.div`
  background-color: ${Colors.black};
  font-family: 'Courier New', Courier, monospace;
  min-height: 20px;
  max-height: 60px;
  overflow-y: auto;
  color: ${Colors.greenVeryLight};
  font-size: 12px;
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

const CommandGroup = styled.div`
  margin-bottom: 16px;
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

const Timestamp = styled.span`
  color: ${Colors.grayLight};
`;

const ConsoleView: React.FC = () => {
  const { entries } = useConsole();
  const consoleRef = useRef<HTMLDivElement>(null);
  const prevEntriesLengthRef = useRef(entries.length);

  // Debug logging
  useEffect(() => {
    console.log("ConsoleView rendered with:", { entries });
  }, [entries]);

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
    if (entries.length === 0) {
      return (
        <EmptyState>
          Initializing console
          <Cursor />
        </EmptyState>
      );
    }

    const groupedEntries = groupEntriesByCommand();

    return Array.from(groupedEntries.entries()).map(
      ([command, outputs], groupIndex) => (
        <CommandGroup key={groupIndex}>
          <CommandLine>{command}</CommandLine>
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
    <ConsoleContainer ref={consoleRef}>{renderContent()}</ConsoleContainer>
  );
};

export default ConsoleView;
