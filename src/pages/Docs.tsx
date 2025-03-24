import * as React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { BackButton } from "../components/button";
import { ExternalLinks } from "../Shared/Constants";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
`;

const IframeContainer = styled.div`
  width: 1200px;
  left: 60px;
  position relative;
  height: 100%;
  flex: 1;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  position: relative;
`;

const Docs: React.FC = () => {
  return (
    <Container>
      <BackButton />
      <IframeContainer>
        <StyledIframe
          src={ExternalLinks.Requirements}
          title="Spacemesh Documentation"
        />
      </IframeContainer>
    </Container>
  );
};

export default Docs;
