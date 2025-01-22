import * as React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import BackgroundImage from "../assets/home.png";
import Logo from "../assets/Full logo - White.png";
import { HoverAccordionMenu } from "../components/accordion";
import { Button } from "../components/button";
import { Subheader, Title } from "../styles/texts";
import Image from "../components/image";
import { Background } from "../styles/containers";

const MenuContainer = styled.div`
  position: fixed;
  width: 500px;
  height: 400px;
  right: 50px;
  top: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: center;
  align-items: center;
  z-index: 1;
`;

const Home: React.FC = () => {
  // State to track which menu is hovered
  const [hoveredMenu, setHoveredMenu] = React.useState<string | null>(null);
  const navigate = useNavigate();

  // Function to navigate to the docs page
  const navigateToReqs = () => navigate("/docs");
  // Function to navigate to the profiler
  const navigateToProfiler = () => navigate("/profiler");


  // Button configurations for the "Check" menu
  const CheckButtons = [
    {
      label: "Requirements",
      onClick: () => navigateToReqs(),
      width: 300,
    },
    {
      label: "Max POS Proving capability",
      onClick: () => navigateToProfiler(),
      width: 300,
    },
  ];

  return (
    <>
      <Background src={BackgroundImage} />
      <MenuContainer>
        <Image src={Logo} width={200} top={-60} />

        <Title text="Proof of Space" />
        <Subheader text="Initialization App" top={0} />
        <Button
          top={30}
          onClick={() => navigate("/generate")}
          width={250}
          label="Generate"
        />
        <HoverAccordionMenu
          $isHovered={hoveredMenu === "check"}
          onMouseEnter={() => setHoveredMenu("check")}
          onMouseLeave={() => setHoveredMenu(null)}
          title="check"
          buttons={CheckButtons}
        />
      </MenuContainer>
    </>
  );
};

export default Home;
