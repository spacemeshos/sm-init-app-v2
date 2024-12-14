import { open } from "@tauri-apps/api/shell";
import React from "react";
import styled from "styled-components";

import ConsoleView from "./components/ConsoleView";
import { ExternalLinks } from "./Shared/Constants";
import AppRoutes from "./Shared/Routes";
import { ConsoleProvider } from "./state/ConsoleContext";
import Colors from "./styles/colors";
import GlobalStyles from "./styles/globalStyles";

const AppWrapper = styled.div`
  height: 800px;
  width: 1300px;
  position: absolute;
  background-color: ${Colors.greenDark};
`;

const ConsoleWrapper = styled.div`
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 1300px;
  z-index: 1;
  pointer-events: auto;
`;

const Footer = styled.div`
  position: fixed;
  width: 1300px;
  height: 30px;
  bottom: 0px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;
`;

// Wrapper component to use hooks
const AppContent: React.FC = () => {
  const navigateToIssue = () => open(ExternalLinks.Report);

  return (
    <AppWrapper>
      <GlobalStyles />
      <AppRoutes />
      <Footer>
        <ConsoleWrapper>
          <ConsoleView />
        </ConsoleWrapper>

        <a
          onClick={navigateToIssue}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer" }}
        >
          report an issue
        </a>
      </Footer>
    </AppWrapper>
  );
};

function App() {
  return (
    <ConsoleProvider>
      <AppContent />
    </ConsoleProvider>
  );
}

export default App;
