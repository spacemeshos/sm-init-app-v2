import styled from "styled-components";

import Colors from "../../styles/colors";

export const BottomContainer = styled.div`
  height: 80%;
  width: 100%;
  position: absolute;
  top: 70px;
  left: 0px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  align-items: center;
`;

export const TileWrapper = styled.div<{
  width?: number;
}>`
  height: 90%;
  width: ${({ width }) => width || 450}px;
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
