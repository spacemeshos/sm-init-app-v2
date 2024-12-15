import React from "react";
import styled from "styled-components";

import ConsoleView from "./components/ConsoleView";
import AppRoutes from "./Shared/Routes";
import { ConsoleProvider } from "./state/ConsoleContext";
import Colors from "./styles/colors";
import GlobalStyles from "./styles/globalStyles";

const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: ${Colors.greenDark};
`;

const ConsoleWrapper = styled.div`
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 100%;
  z-index: 1;
  pointer-events: auto;
`;

// Wrapper component to use hooks
const App: React.FC = () => {
  return (
    <ConsoleProvider>
      <AppWrapper>
        <GlobalStyles />
        <AppRoutes />
        <ConsoleWrapper>
          <ConsoleView />
        </ConsoleWrapper>
      </AppWrapper>
    </ConsoleProvider>
  );
};

export default App;
