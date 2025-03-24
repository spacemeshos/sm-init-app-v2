/**
 * @fileoverview Console output display component
 * Provides an expandable console interface for displaying command outputs,
 * logs, and errors with automatic scrolling and entry grouping.
 */

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { useConsole } from "../state/ConsoleContext";
import Colors from "../styles/colors";

interface ConsoleContainerProps {
  $isExpanded: boolean;
  $height?: number;
}

/**
 * Main console container with expansion animation
 * Transitions between collapsed and expanded states
 */
const ConsoleContainer = styled.div<ConsoleContainerProps>`
  background-color: ${Colors.black};
  font-family: 'Courier New', Courier, monospace;
  min-height: 20px;
  height: ${props => props.$isExpanded ? `300px` : '30px'};
  color: ${Colors.greenVeryLight};
  font-size: 12px;
  line-height: 1.4;
  position: relative;
  transition: height 0.3s ease;
  display: flex;
  flex-direction: column;
`;

/**
 * Container for console control buttons
 * Sticks to top during scrolling
 */
const ButtonContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: ${Colors.black};
  padding: 4px;
  display: flex;
  gap: 4px;
  z-index: 1;
  justify-content: flex-end;
  flex-shrink: 0;
`;

/**
 * Scrollable container for console entries
 * Includes custom scrollbar styling
 */
const ScrollContainer = styled.div`
  overflow-y: auto;
  flex-grow: 1;
  
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

/**
 * Styled button for console controls
 */
const ConsoleButton = styled.button`
  background-color: ${Colors.black};
  border: none;
  color: ${Colors.greenLight};
  padding: 2px 8px;
  font-size: 10px;
  cursor: pointer;
  font-family: "Univers55", sans-serif;

  &:hover {
    background-color: ${Colors.greenLight}20;
  }

  user-select: none;
  -webkit-user-select: none;
`;

/**
 * Container for grouped command entries
 */
const CommandGroup = styled.div`
  margin-bottom: 16px;
  padding: 0 8px;
`;

/**
 * Command line display with distinct styling
 */
const CommandLine = styled.div`
  color: ${Colors.greenLight};
  margin-bottom: 8px;
  font-weight: bold;
`;

/**
 * Props for output styling based on content
 */
interface OutputProps {
  $content: string;
}

/**
 * Styled output display with content-based coloring
 * - Red for errors
 * - Green for success
 * - White for standard output
 */
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

/**
 * Console View Component
 * 
 * Features:
 * - Expandable/collapsible view
 * - Command output grouping
 * - Automatic scrolling
 * - Content-based styling
 * - Clear functionality
 * 
 * The component handles:
 * 1. Entry Display:
 *    - Groups entries by command
 *    - Formats timestamps
 *    - Colors output by type
 * 
 * 2. Scrolling:
 *    - Auto-scrolls to new entries
 *    - Custom scrollbar styling
 * 
 * 3. User Interaction:
 *    - Expand/collapse toggle
 *    - Clear console
 *    - Manual scrolling
 */
const ConsoleView: React.FC = () => {
  const { entries, clearConsole, isExpanded, toggleExpand } = useConsole();
  const consoleRef = useRef<HTMLDivElement>(null);
  const prevEntriesLengthRef = useRef(entries.length);
  const [height, setHeight] = useState(300);

  /**
   * Handle console resizing
   * Updates height state when container is resized
   */
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

  // Debug logging for render tracking
  useEffect(() => {
    console.log("ConsoleView rendered with:", { entries, isExpanded });
  }, [entries, isExpanded]);

  /**
   * Auto-scroll to bottom on new entries
   * Tracks entry count changes to trigger scrolling
   */
  useEffect(() => {
    if (consoleRef.current && entries.length !== prevEntriesLengthRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      prevEntriesLengthRef.current = entries.length;
      console.log("Scrolled to bottom, new entries length:", entries.length);
    }
  }, [entries]);

  /**
   * Groups console entries by command
   * Creates map of command -> array of outputs
   */
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

  /**
   * Renders grouped console entries
   * Each group includes:
   * - Command line (if present)
   * - Timestamped outputs
   */
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
      <ScrollContainer ref={consoleRef}>
        {renderContent()}
      </ScrollContainer>
    </ConsoleContainer>
  );
};

export default ConsoleView;
