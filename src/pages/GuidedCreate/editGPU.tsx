import React from "react";
import styled from "styled-components";
import Colors from "../../styles/colors";
import usePostCli from "../../hooks/usepostcli";
import { Button } from "../../components/button";


const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.darkerGreen};
  z-index: 1000;
  width: 1200px;
  height: 740px;
`;

const Header = styled.h1`
  color: ${Colors.white};
  text-align: center;
  font-family: "Source Code Pro", sans-serif;
  font-size: 26px;
  margin-top: 40px;
  font-weight: 200;
  text-transform: uppercase;
  letter-spacing: 5px;
`;

const Subheader = styled.h2`
  color: ${Colors.greenLight};
  text-align: center;
  font-family: "Source Code Pro", sans-serif;
  font-size: 16px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 26px;
  padding: 0px 75px 10px;
`;

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 250px;
  position: absolute;
  left: 20px;
  top: 20px;
  opacity: 0.02;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: ${Colors.purpleLight};
  cursor: pointer;
  font-size: 28px;
`;

type Props = {
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
};

// GPUedit component
const GPUedit = ({ onClose, isOpen }: Props) => {
  const { run, response, loading, error } = usePostCli();

const handleButtonClick = () => {
    run(['-printProviders']); 
};
  if (!isOpen) return null;
  const gpu = require('../../assets/graphics-card.png');

  return (
    <Backdrop onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>Select processor to generate POS</Header>
        <Subheader>
          The selected processor will be fully utilized until all POS data is
          generated. <br />
          During this time, it will not be available for other tasks.
        </Subheader>
        <BgImage src={gpu} />
        <Button onClick={handleButtonClick} label="run command" buttonTop={200} buttonLeft={60}/>
        <div>
            <button onClick={handleButtonClick}>Run Command</button>
            {loading && <p>Loading...</p>}
            {response && <p>Response: {response}</p>}
            {error && <p>Error: {error}</p>}

        </div>
      </Wrapper>
    </Backdrop>
  );
};

export default GPUedit;