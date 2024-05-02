import * as React from "react";
import styled from "styled-components";
import { Button } from "../components/button";
import Title from "../components/titles";
import Colors from "../styles/colors";
import { HoverAccordionMenu } from "../components/accordion";
import { ExternalLinks } from "../Shared/Constants";
import { useNavigate } from "react-router-dom";

const ContainerLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 450px;
  height: 740px;
  position: relative;
`;

const ContainerRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: flex-start;
  top: 220px;
  left: 520px;
  width: 600px;
  position: absolute;
`;
const CustomTitle = styled.h1`
  width: 1200px;
  height: 21px;
  top: 50px;
  position: absolute;
  color: ${Colors.grayLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  text-align: center;
  white-space: nowrap;
  text-transform: uppercase;
  font-size: 28px;
  font-weight: 100;
  letter-spacing: 5px;
`;

const Image = styled.img`
  width: auto;
  height: 215px;
  top: 196px;
  position: relative;
`;

const TextWrapper = styled.div`
  width: 300px;
  top: 443px;
  position: absolute;
`;

const PrereqButton = styled.div`
  height: 60px;
  top: 500px;
  width: 300px;
  position: absolute;
`;

const VerticalDivider = styled.div`
  background: linear-gradient(
    to top,
    ${Colors.purpleLight},
    ${Colors.purpleDark}
  );
  border-image-slice: 1;
  margin-top: 150px;
  left: 450px;
  height: 540px;
  width: 1px;
  position: absolute;
`;

const Home: React.FC = () => {
  const LogoWhite = require("../assets/transparentbg.gif");
  const Add = require("../assets/plus.png");
  const Edit = require("../assets/edit.png");
  const Check = require("../assets/check.png");
  const [hoveredMenu, setHoveredMenu] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const navigateToReqs = () => window.open(ExternalLinks.Requirements);

  const CreateButtons = [
    { label: "Guided Mode", onClick: () => navigate("/guided/step1") },
    { label: "Advanced Mode", onClick: () => console.log("Button 2 clicked") },
  ];
  const EditButtons = [
    { label: "POS data Size", onClick: () => console.log("Button 1 clicked") },
    {
      label: "Proving Settings",
      onClick: () => console.log("Button 2 clicked"),
    },
  ];
  const CheckButtons = [
    {
      label: "Generation speed",
      onClick: () => console.log("Button 1 clicked"),
    },
    {
      label: "Proving Capacity",
      onClick: () => console.log("Button 2 clicked"),
    },
    {
      label: "POS data Validity",
      onClick: () => console.log("Button 2 clicked"),
    },
  ];

  return (
    <>
      <CustomTitle>PROOF OF SPACE-TIME MANAGER</CustomTitle>

      <ContainerLeft>
        <Image src={LogoWhite} />
        <VerticalDivider />
        <TextWrapper>
          <Title text="ARE YOU READY?" />
        </TextWrapper>
        <PrereqButton>
          <Button onClick={navigateToReqs} label="Check prerequisites" />
        </PrereqButton>
      </ContainerLeft>
      <ContainerRight>
        <HoverAccordionMenu
          $isHovered={hoveredMenu === "generate"}
          onMouseEnter={() => setHoveredMenu("generate")}
          onMouseLeave={() => setHoveredMenu(null)}
          imageSrc={Add}
          title="Generate POS Data"
          buttons={CreateButtons}
        />
        <HoverAccordionMenu
          $isHovered={hoveredMenu === "edit"}
          onMouseEnter={() => setHoveredMenu("edit")}
          onMouseLeave={() => setHoveredMenu(null)}
          imageSrc={Edit}
          title="Edit"
          buttons={EditButtons}
        />
        <HoverAccordionMenu
          $isHovered={hoveredMenu === "check"}
          onMouseEnter={() => setHoveredMenu("check")}
          onMouseLeave={() => setHoveredMenu(null)}
          imageSrc={Check}
          title="Check"
          buttons={CheckButtons}
        />
      </ContainerRight>
    </>
  );
};

export default Home;
