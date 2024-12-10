import React, { useEffect, useState } from 'react';
import { useConsole } from '../state/ConsoleContext';
import { callPostCli } from '../services/postcliService';
import styled from 'styled-components';
import Colors from '../styles/colors';

const TestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background-color: ${Colors.black}80;
  border-radius: 4px;
`;

const TestButton = styled.button<{ $isActive?: boolean }>`
  background-color: ${props => props.$isActive ? Colors.greenLight : Colors.black};
  color: ${props => props.$isActive ? Colors.black : Colors.greenLight};
  border: 1px solid ${Colors.greenLight};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Source Code Pro', monospace;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${Colors.greenLight}20;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ConsoleTest: React.FC = () => {
  const { updateConsole } = useConsole();
  const [isTestRunning, setIsTestRunning] = useState(false);

  // Test console on mount
  useEffect(() => {
    const initTest = async () => {
      console.log('ConsoleTest mounted, sending initial test message...');
      updateConsole('test', 'Console test component mounted');
    };

    initTest();
  }, [updateConsole]);

  const handleBasicTest = () => {
    console.log('Running basic test...');
    updateConsole('test', 'Basic test message');
    updateConsole('test', 'Another test message');
    updateConsole('test', 'And one more message');
  };

  const handleCommandTest = async () => {
    console.log('Running command test...');
    setIsTestRunning(true);
    
    try {
      updateConsole('test', 'Starting command test...');
      
      // First try a version command
      await callPostCli(['--help'], updateConsole);
            
      updateConsole('test', 'Command test completed successfully');
    } catch (err) {
      console.error('Command test failed:', err);
      updateConsole('error', `Command test failed: ${err}`);
    } finally {
      setIsTestRunning(false);
    }
  };

  const handleMultilineTest = () => {
    console.log('Running multiline test...');
    updateConsole('test', `Multiple line test message:
Line 1: Testing console output
Line 2: With multiple lines
Line 3: And different content
-------------------
Test complete`);
  };

  const handleErrorTest = () => {
    console.log('Running error test...');
    updateConsole('error', 'This is a test error message');
    updateConsole('error', 'And another error message');
    updateConsole('test', 'Followed by a normal message');
  };

  const handleStressTest = async () => {
    console.log('Running stress test...');
    setIsTestRunning(true);
    
    try {
      for (let i = 1; i <= 10; i++) {
        updateConsole('test', `Stress test message ${i}/10`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      updateConsole('success', 'Stress test completed successfully');
    } catch (err) {
      updateConsole('error', `Stress test failed: ${err}`);
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <TestContainer>
      <TestButton onClick={handleBasicTest} disabled={isTestRunning}>
        Basic Test
      </TestButton>
      <TestButton onClick={handleCommandTest} disabled={isTestRunning} $isActive={isTestRunning}>
        Command Test
      </TestButton>
      <TestButton onClick={handleMultilineTest} disabled={isTestRunning}>
        Multiline Test
      </TestButton>
      <TestButton onClick={handleErrorTest} disabled={isTestRunning}>
        Error Test
      </TestButton>
      <TestButton onClick={handleStressTest} disabled={isTestRunning} $isActive={isTestRunning}>
        Stress Test
      </TestButton>
    </TestContainer>
  );
};

export default ConsoleTest;
