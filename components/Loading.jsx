import { Circle } from "better-react-spinkit";
import Image from "next/image";
import styled from "styled-components";

function Loading() {
  return (
    <center>
      <div>
        <ImageContainer>
          <Image layout="fill" src="/favicon.png" />
        </ImageContainer>
      </div>
      <Circle color="#3CBC28" size={50} />
    </center>
  );
}

export default Loading;

const ImageContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 200px;
  height: 200px;
`;
