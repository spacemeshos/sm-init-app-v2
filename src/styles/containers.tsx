import styled from "styled-components";
import Colors from "./colors";

export const Background = styled.img`
  position: fixed;
  width: 100%;
  object-fit: cover;
`;

export const MainContainer = styled.div`
  width: 1000px;
  height: 800px;
  position: fixed;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${Colors.darkOpaque};
  backdrop-filter: blur(8px);
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
