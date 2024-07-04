import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Colors from "../styles/colors";
import Tile from "./tile";
import { Button, CancelButton, SaveButton } from "./button";
import CustomNumberInput from "./input";
import { FindProviders } from "../services/parseResponse";
import { ErrorMessage, Subheader } from "./texts";
import size from "../assets/duplicate.png";
import cpu from "../assets/cpu.png";
import gpu from "../assets/graphics-card.png";
import Frame from "./frames";
import { useNavigate } from "react-router-dom";
import rocket from "../../assets/rocket.png";

const BgImage = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  width: 250px;
  position: absolute;
  left: 20px;
  top: -200px;
  opacity: 0.02;
`;

const BottomContainer = styled.div`
  height: 400px;
  width: 1200px;
  position: absolute;
  top: 270px;
  left: 0px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
`;

const ContainerSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  left: 75px;
  top: 300px;
  width: 675px;
  height: 320px;
  position: absolute;
`;

const ContainerStart = styled.div`
  left: 800px;
  top: 300px;
  width: 300px;
  height: 300px;
  position: absolute;
`;

const TileWrapper = styled.div<{
  width?: number;
}>`
  height: 370px;
  width: ${({ width }) => width || 450}px;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: row;
`;

const SelectedValue = styled.h1`
  color: ${Colors.greenLight};
  font-family: "Source Code Pro ExtraLight", sans-serif;
  font-weight: 300;
  font-size: 50px;
  position: relative;
`;

interface Settings {
  datadir?: string; //default "/Users/username/post/data"
  pubKey?: string; //optional, id/public key, if not provided, it will be generated automatically
  numUnits?: number; //to be set by user: one unit = 64GiB, minimum to be set is 4 units (256GiB)
  maxFileSize?: number; //default 4096
  numCores?: number; //default 3/4 of the user's CPU -to be detected and calculated
  numNonces?: number; //default 288
  provider?: number; //default 0
}

const SetupSize: React.FC = () => {
  const [isPOSInputVisible, setIsPOSInputVisible] = useState(true);
  const [isFileInputVisible, setIsFileInputVisible] = useState(true);
  const [dataSizeValue, setPOSsizeValue] = useState(256);
  const [fileSizeValue, setFileSizeValue] = useState(4096);

  const handleCancelDataSize = () => {
    setPOSsizeValue(256); // Reset to default value
    setIsPOSInputVisible(true);
  };

  const handleSaveDataSize = () => {
    setIsPOSInputVisible(false);
  };

  const handleCancelFileSize = () => {
    setFileSizeValue(4096); // Reset to default value
    setIsFileInputVisible(true);
  };

  const handleSaveFileSize = () => {
    setIsFileInputVisible(false);
  };

  return (
    <BottomContainer>
      <BgImage src={size} />

      <TileWrapper>
        <Tile
          heading="Select POS data size"
          subheader="Gibibytes"
          footer="more data -> more rewards, but longer generation and proving"
        />
        {isPOSInputVisible ? (
          <>
            <CustomNumberInput
              min={256}
              max={999999}
              step={64}
              value={dataSizeValue}
              onChange={(val) => setPOSsizeValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveDataSize} />
            <CancelButton buttonLeft={45} onClick={handleCancelDataSize} />
          </>
        ) : (
          <>
            <SelectedValue>{dataSizeValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelDataSize} />
          </>
        )}
      </TileWrapper>
      <TileWrapper>
        <Tile
          heading="Select file size"
          subheader="Mebibytes"
          footer="POS will be stored across [XXX] files" //TODO
        />
        {isFileInputVisible ? (
          <>
            <CustomNumberInput
              min={10}
              max={99999}
              step={1}
              value={fileSizeValue}
              onChange={(val) => setFileSizeValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveFileSize} />
            <CancelButton buttonLeft={45} onClick={handleCancelFileSize} />
          </>
        ) : (
          <>
            <SelectedValue>{fileSizeValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelFileSize} />
          </>
        )}
      </TileWrapper>
    </BottomContainer>
  );
};

export default SetupSize;

const SetupProving: React.FC = () => {
  const [cpuValue, setCpuValue] = useState(8); //placeholder
  const [noncesValue, setNoncesValue] = useState(288);
  const [isCpuInputVisible, setIsCpuInputVisible] = useState(true);
  const [isNoncesInputVisible, setIsNoncesInputVisible] = useState(true);

  const handleCancelCpu = () => {
    setCpuValue(8); // Reset to default value
    setIsCpuInputVisible(true);
  };

  const handleSaveCpu = () => {
    setIsCpuInputVisible(false);
  };

  const handleCancelNonces = () => {
    setNoncesValue(288); // Reset to default value
    setIsNoncesInputVisible(true);
  };

  const handleSaveNonces = () => {
    setIsNoncesInputVisible(false);
  };

  return (
    <BottomContainer>
      <BgImage src={cpu} />
      <TileWrapper>
        <Tile
          heading="Select number of CPU cores"
          footer="more CPU cores -> faster proof generation"
        />
        {isCpuInputVisible ? (
          <>
            <CustomNumberInput
              min={1}
              max={16}
              step={1}
              value={cpuValue}
              onChange={(val) => setCpuValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveCpu} />
            <CancelButton buttonLeft={45} onClick={handleCancelCpu} />
          </>
        ) : (
          <>
            <SelectedValue>{cpuValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelCpu} />
          </>
        )}
      </TileWrapper>
      <TileWrapper>
        <Tile
          heading="Select number of Nonces"
          footer="more nonces -> more likely proof generated on the first try"
        />
        {isNoncesInputVisible ? (
          <>
            <CustomNumberInput
              min={16}
              max={9999}
              step={16}
              value={noncesValue}
              onChange={(val) => setNoncesValue(val)}
            />
            <SaveButton buttonLeft={55} onClick={handleSaveNonces} />
            <CancelButton buttonLeft={45} onClick={handleCancelNonces} />
          </>
        ) : (
          <>
            <SelectedValue>{noncesValue}</SelectedValue>
            <CancelButton buttonLeft={50} onClick={handleCancelNonces} />
          </>
        )}
      </TileWrapper>
    </BottomContainer>
  );
};

type Props = {
  isOpen: boolean;
};

const SetupGPU: React.FC<Props> = ({ isOpen }) => {
  const { run, response, loading, error } = FindProviders();

  useEffect(() => {
    if (isOpen) {
      run(["-printProviders"]);
    }
  }, [isOpen]);

  function createTile(processor: {
    ID: number;
    Model: string;
    DeviceType: string;
  }) {
    const isFastest = processor.ID === 0;
    const icon = processor.DeviceType === "GPU" ? gpu : cpu;

    return (
      <TileWrapper width={350} key={processor.ID}>
        <Tile
          heading={processor.Model}
          subheader={processor.DeviceType}
          footer={isFastest ? "The Fastest" : ""}
          imageSrc={icon}
          //implement onCLick: select the clicked provider - save it's ID to pass to the binary as a -provider flag
        />
      </TileWrapper>
    );
  }

  return (
    <BottomContainer>
      <BgImage src={gpu} />
      {loading && <Subheader text="Loading..." left={0} />}
      {error ? (
        <ErrorMessage text="Error:"> {error}</ErrorMessage>
      ) : response && response.length > 0 ? (
        response.map(createTile)
      ) : (
        <Subheader text={"No processors detected"} />
      )}
    </BottomContainer>
  );
};

const SetupSummary: React.FC = () => {
  const navigate = useNavigate();
  const Confirmation = () => navigate("/guided/Confirmation");

  return (
    <>
      <ContainerSummary>
        <Frame
          height={25}
          heading=" POS DATA" //numUnits + maxFileSize
          subheader="placeholder summary"
        />
        <Frame
          height={25}
          heading="POS Directory" //dataDir
          subheader="placeholder summary"
        />
        <Frame
          height={25}
          heading="POS Generation" //provider
          subheader="placeholder summary"
        />
        <Frame
          height={25}
          heading="POST Proving" //numCores + numNonces
          subheader="placeholder summary"
        />
      </ContainerSummary>
      <ContainerStart>
        <BgImage src={rocket} />
        <Button
          label="Start Data generation"
          borderColor={Colors.purpleLight}
          backgroundColor={Colors.darkerPurple}
          buttonTop={160}
          buttonLeft={25}
          height={80}
          onClick={Confirmation} //implement running the postcli command with the collected flags
        />
      </ContainerStart>
    </>
  );
};

export { SetupSize, SetupProving, SetupGPU, SetupSummary };
