import styled from "styled-components";

import Colors from "./colors";

export const Background = styled.img`
  position: fixed;
  width: 100%;
  object-fit: cover;
`;

export const MainContainer = styled.div`
  width: 1000px;
  height: 750px;
  position: absolute;
  top: 0px;
  left: 80px;
  background-color: ${Colors.darkOpaque};
  backdrop-filter: blur(20px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: 10px;
  /* Gradient border */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 10px;
    padding: 1px;
    background: linear-gradient(
      45deg,
      ${Colors.greenLightOpaque},
      ${Colors.whiteOpaque}
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

export const PageTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  position: absolute;
  top: 50px;
  left: 50%;
  height: 80px;
  width: 80%;
  transform: translateX(-50%);
  text-transform: uppercase;
  border-bottom: 1px solid ${Colors.greenLight};
`;

export const SetupContainer = styled.div`
  height: 95%;
  width: 80%;
  position: absolute;
  top: 0px;
  padding-top: 20px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  align-items: center;
`;

export const SetupTileWrapper = styled.div<{
  width?: number;
}>`
  height: 100%;
  width: ${({ width }) => width || 100}%;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-direction: column;
`;

export const SelectedValue = styled.h1`
  color: ${Colors.greenLight};
  font-family: "Univers55", sans-serif;
  font-weight: 300;
  font-size: 50px;
  position: relative;
`;
