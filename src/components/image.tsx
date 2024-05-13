import * as React from "react";
import styled from "styled-components";

interface ImageProps {
  src: string;
  alt?: string;
  top?: number;
  left?: number;
  height?: number;
  width?: number;
  opacity?: number;
}

const StyledImage = styled.img<ImageProps>`
  position: absolute;
  top: ${({ top }) => (top ? `${top}px` : "auto")};
  left: ${({ left }) => (left ? `${left}px` : "auto")};
  height: ${({ height }) => (height ? `${height}px` : "auto")};
  width: ${({ width }) => (width ? `${width}px` : "auto")};
  object-fit: contain;
  opacity: ${({ opacity }) => (opacity ? opacity : 1)};
`;

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  top,
  left,
  height,
  width,
  opacity,
}) => {
  return (
    <StyledImage
      src={src}
      alt={alt}
      top={top}
      left={left}
      height={height}
      width={width}
      opacity={opacity}
    />
  );
};

export default Image;
