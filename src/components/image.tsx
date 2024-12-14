import * as React from "react";
import styled from "styled-components";

interface ImageProps {
  src: string;
  alt?: string;
  top?: number;
  left?: number;
  width?: number;
  opacity?: number;
}

const StyledImage = styled.img<ImageProps>`
  position: absolute;
  top: ${({ top }) => `${top ?? 0}px`};
  left: ${({ left }) => (left == null ? "50%" : `${left}px`)};
  transform: ${({ left }) => (left == null ? "translateX(-50%)" : "none")};
  height: "auto";
  width: ${({ width }) => `${width ?? 100}%`};
  object-fit: contain;
  opacity: ${({ opacity }) => `${opacity ?? 1}`};
`;

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  top,
  left,
  width,
  opacity,
}) => {
  return (
    <StyledImage
      src={src}
      alt={alt}
      top={top}
      left={left}
      width={width}
      opacity={opacity}
    />
  );
};

export default Image;
