import React from "react";

import { BodyText, Header, Subheader } from "../styles/texts";

const Confirmation: React.FC = () => {
  return (
    <>
      <Header>Congratulations </Header>
      <Subheader>on launching your first proof of space</Subheader>
      <BodyText>
        {
          <>
            WHAT NOW?
            <br />
            <br />
            Leave your PC on and plugged into a power source 24/7. Your GPU will
            generate the POS data.
            <br />
            <br />
            After your PoS data is ready, set up a node to participate in the
            network and get rewards.
            <br />
            <br />
            [TO DO]
          </> //TODO more explanation to be added
        }
      </BodyText>
    </>
  );
};

export default Confirmation;
