/**
 * @fileoverview Vertical Tabs component for navigation
 * Provides a vertical tab interface with icons and labels for navigation
 * between different sections of content. Supports collapsible sidebar.
 */

import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import Colors from '../styles/colors';

// Tab item interface
export interface TabItem {
  id: string;
  label: string;
  description?: string; // Added field for settings value display
  iconSrc: string;
  content?: React.ReactNode;
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

const TabList = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: ${({ isCollapsed }) => (isCollapsed ? '80px' : '1000px')};
  transition: width 0.3s ease;
  background-color: ${Colors.darkOpaque};
  border-right: 1px solid ${Colors.greenLightOpaque};
  overflow-y: auto;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: ${({ isActive }) =>
    isActive ? Colors.greenLightOpaque : 'transparent'};
  border: none;
  border-bottom: 1px solid ${Colors.greenLightOpaque};
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  height: 80px;
  text-align: left;

  &:hover {
    background-color: ${Colors.greenLightOpaque};
  }
`;

const TabIcon = styled.img<{ isCollapsed: boolean }>`
  width: 26px;
  height: 26px;
  margin: ${({ isCollapsed }) => (isCollapsed ? '0 auto' : '0px 22px')};
`;

const TabTextContainer = styled.div<{ isCollapsed: boolean }>`
  display: ${({ isCollapsed }) => (isCollapsed ? 'none' : 'flex')};
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
`;

const TabLabel = styled.span`
  color: ${Colors.white};
  font-family: 'Univers55', sans-serif;
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const TabDescription = styled.span`
  color: ${Colors.grayLight};
  font-family: 'Univers45', sans-serif;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  right: 20px;
  position: absolute;
  margin-right: 22px;
`;

const TabContent = styled.div`
  flex: 1;
  padding: 20px;
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
 * - Collapsible sidebar
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
  // State to track whether the tab list is collapsed
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Find the active tab object
  const activeTabObject = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  // Handle tab click - collapse the tab list and change the active tab
  const handleTabClick = (tabId: string) => {
    // If clicking on the summary tab
    if (tabId === 'summary') {
      // If a component is open (tabs are collapsed), close it and uncollapse the tabs
      if (isCollapsed) {
        setIsCollapsed(false);
      }
      // If tabs are not collapsed, do nothing special
      onTabChange(tabId);
    } else {
      // For non-summary tabs, collapse the tabs and show the component
      onTabChange(tabId);
      setIsCollapsed(true);
    }
  };

  return (
    <TabsContainer width={width} height={height}>
      <TabList isCollapsed={isCollapsed}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            isActive={tab.id === activeTab}
            onClick={() => {
              handleTabClick(tab.id);
            }}
          >
            <TabIcon
              src={tab.iconSrc}
              alt={tab.label}
              isCollapsed={isCollapsed}
            />
            <TabTextContainer isCollapsed={isCollapsed}>
              <TabLabel>{tab.label}</TabLabel>
              {tab.description && (
                <TabDescription>{tab.description}</TabDescription>
              )}
            </TabTextContainer>
          </TabButton>
        ))}
      </TabList>
      <TabContent>{activeTabObject.content}</TabContent>
    </TabsContainer>
  );
};

export default VerticalTabs;
