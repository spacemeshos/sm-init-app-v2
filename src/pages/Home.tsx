import * as React from "react";
import styled from "styled-components";
import { Button } from "../components/button";
import { Title } from "../components/texts";
import Colors from "../styles/colors";
import { HoverAccordionMenu } from "../components/accordion";
import { ExternalLinks } from "../shared/Constants";
import { useNavigate } from "react-router-dom";
import LogoWhite from "../assets/transparentbg.gif";
import Add from "../assets/plus.png";
import Edit from "../assets/edit.png";
import Check from "../assets/check.png";

const ContainerLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 450px;
  height: 740px;
  left: 0px;
  position: absolute;
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
  top: 40px;
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
  position: relative;
  margin-bottom: 10px;
`;

const TextWrapper = styled.div`
  width: 300px;
  position: relative;
  margin-bottom: 10px;
`;

const VerticalDivider = styled.div`
  background: linear-gradient(
    to top,
    ${Colors.purpleLight},
    ${Colors.purpleDark}
  );
  border-image-slice: 1;
  bottom: 50px;
  left: 450px;
  height: 540px;
  width: 1px;
  position: absolute;
`;

const Home: React.FC = () => {
  // State to track which menu is hovered
  const [hoveredMenu, setHoveredMenu] = React.useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  // Function to navigate to the prerequisites page
  const navigateToReqs = () => window.open(ExternalLinks.Requirements);

  // Button configurations for the "Create" menu
  const CreateButtons = [
    {
      label: "Guided Setup",
      onClick: () => navigate("/guided/SelectDirectory"),
      width: 240,
    },
    {
      label: "Advanced Setup",
      onClick: () => navigate("advanced/Directory"),
      width: 240,
    },
    {
      label: "Split In Subsets",
      onClick: () => console.log("Button 2 clicked"),
      width: 240,
    },
  ];
  // Button configurations for the "Edit" menu
  const EditButtons = [
    {
      label: "POS data Size",
      onClick: () => console.log("Button 1 clicked"),
      width: 240,
    },
    {
      label: "Proving Settings",
      onClick: () => console.log("Button 2 clicked"),
      width: 240,
    },
    {
      label: "Find VRF Nonce",
      onClick: () => console.log("Button 2 clicked"),
      width: 240,
    },
  ];
  // Button configurations for the "Check" menu
  const CheckButtons = [
    {
      label: "Generation speed",
      onClick: () => console.log("Button 1 clicked"),
      width: 160,
    },
    {
      label: "Proving Capacity",
      onClick: () => console.log("Button 2 clicked"),
      width: 160,
    },
    {
      label: "POS data Validity",
      onClick: () => console.log("Button 2 clicked"),
      width: 160,
    },
  ];

  return (
    <>
      <CustomTitle>PROOF OF SPACE-TIME MANAGER</CustomTitle>

      {/* Left container with logo, divider, and button */}
      <ContainerLeft>
        <Image src={LogoWhite} />
        <VerticalDivider />
        <TextWrapper>
          <Title text="ARE YOU READY?" />
        </TextWrapper>
        <Button
          onClick={navigateToReqs}
          label="Check prerequisites"
          width={300}
          height={60}
        />
      </ContainerLeft>

      {/* Right container with hover accordion menus */}
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
