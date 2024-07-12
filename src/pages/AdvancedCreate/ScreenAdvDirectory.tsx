import * as React from "react";
import styled from "styled-components";
import {
  BackButton,
  ForwardButton,
  Button,
  TooltipButton,
} from "../../components/button";
import { Title } from "../../components/texts";
import Colors from "../../styles/colors";
import ProgressBar from "../../components/progress";
import Tile from "../../components/tile";
import { ExternalLinks } from "../../shared/Constants";
import { useNavigate } from "react-router-dom";
import key from "../../assets/key.png";
import SelectDirectory from "../../components/selectDir";

const NavProgress = styled.div`
  width: 1200px;
  height: 160px;
  position: abslute;
`;

const TextWrapper = styled.div`
  width: 1200px;
  height: 22px;
  top: 170px;
  position: absolute;
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", monospace;
  text-align: center;
  font-size: 16px;
  font-weight: 100;
  letter-spacing: 2px;
`;

const ContainerBottom = styled.div`
  display: flex;
  flex: none;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
  top: 278px;
  width: 1200px;
  height: 400px;
  position: absolute;
`;

const IDWrapper = styled.div`
  height: 370px;
  width: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  position: relative;
`;

const ScreenAdvDirectory: React.FC = () => {
  // Functions to navigate to external links
  const navigateToDocs = () => window.open(ExternalLinks.Docs);
  const navigateToDiscord = () => window.open(ExternalLinks.Discord);

  // React Router's navigation hook
  const navigate = useNavigate();
  const ScreenAdvSize = () => navigate("/advanced/SetupSize");

  return (
    <>
      <NavProgress>
        <ProgressBar progress={20} />
        <BackButton />
        <ForwardButton onClick={ScreenAdvSize} />
      </NavProgress>
      {/* Text wrapper for title and links to documentation and Discord */}
      <TextWrapper>
        <Title text="Your Path to Crypto Starts Here" top={-20} />
        Whenever you feel lost, remember to read the tips,{" "}
        <a
          onClick={navigateToDocs}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Spacemesh docs
        </a>
        {", and "}
        <a
          onClick={navigateToDiscord}
          role="button"
          tabIndex={0}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Discord FAQ
        </a>
      </TextWrapper>
      <ContainerBottom>
        {/* Directory selection section */}
        <SelectDirectory/>
        {/* Hint section for additional information */}
        <IDWrapper>
          <Tile
            heading="Add existing identity"
            subheader="(optional)"
            imageSrc={key}
            imageTop={45}
          />
          <Button
            //onClick=  TODO
            label="Choose Identity.key file"
            width={320}
            buttonTop={100}
            backgroundColor={Colors.darkerPurple}
            borderColor={Colors.purpleLight}
            /* TO DO */
          />
          <TooltipButton
            modalText={
              <>
                The POS Data is valid only for one Identity. You can add your
                existing identity.key here.
                <br />
                <br />
                You can skip this step. Then a new identity.key will be
                automatically created.
                <br />
                <br />
                If you will be moving the POS data elsewhere, remember to
                include identity.key file.
              </>
            }
            modalTop={1}
            modalLeft={1}
            buttonTop={96}
          />
        </IDWrapper>
      </ContainerBottom>
    </>
  );
};

export default ScreenAdvDirectory;
