/**
 * @fileoverview Vertical Tabs component for navigation
 * Provides a vertical tab interface with icons and labels for navigation
 * between different sections of content.
 */

import * as React from 'react';
import styled from 'styled-components';

import Colors from '../styles/colors';

// Tab item interface
export interface TabItem {
  id: string;
  label: string;
  iconSrc: string;
  content: React.ReactNode;
}

// Props for the VerticalTabs component
interface VerticalTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  width?: number;
  height?: number;
}

// Styled components
const TabsContainer = styled.div<{ width?: number; height?: number }>`
  display: flex;
  width: ${({ width }) => width || 1000}px;
  height: ${({ height }) => height || 500}px;
  position: relative;
`;

const TabList = styled.div`
  display: flex;
  flex-direction: column;
  width: 80px;
  background-color: ${Colors.darkOpaque};
  border-right: 1px solid ${Colors.greenLightOpaque};
  overflow-y: auto;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: ${({ isActive }) => 
    isActive ? Colors.greenLightOpaque : 'transparent'};
  border: none;
  border-bottom: 1px solid ${Colors.greenLightOpaque};
  cursor: pointer;
  transition: background-color 0.2s;
  width: 80px;
  height: 80px;

  &:hover {
    background-color: ${({ isActive }) => 
      isActive ? Colors.greenLightOpaque : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const TabIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

/**
 * Vertical Tabs Component
 * 
 * Features:
 * - Vertical tab navigation
 * - Icon and label for each tab
 * - Active tab highlighting
 * - Content area for the active tab
 * 
 * @param {VerticalTabsProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  width,
  height,
}) => {
  // Find the active tab object
  const activeTabObject = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <TabsContainer width={width} height={height}>
      <TabList>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            isActive={tab.id === activeTab}
            onClick={() => onTabChange(tab.id)}
          >
            <TabIcon src={tab.iconSrc} alt={tab.label} />
          </TabButton>
        ))}
      </TabList>
      <TabContent>
        {activeTabObject.content}
      </TabContent>
    </TabsContainer>
  );
};

export default VerticalTabs;
