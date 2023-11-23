import { TELERGAM_SUPPORT } from 'consts';
import { styled } from 'styled-components';
import { blue } from 'theme';
import { FaTelegramPlane } from "react-icons/fa";

export function ModalErrorContent({message}: {message?: string}) {
  return (
    <Container>
      {message && <Text>{message}</Text>}
      <SupportLink>
        Ask us on{" "}
        <a href={TELERGAM_SUPPORT} target="_blank">
          telegram <FaTelegramPlane />
        </a>
      </SupportLink>
    </Container>
  );
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`


const SupportLink = styled('p')`
  font-size: 14px;
  
  a {
    color: ${blue};
    text-decoration: none;
    svg {
      position: relative;
      top: 2px;
    }
    &:hover {
      text-decoration: underline;
    }
  }
`;



const Text = styled('p')`
  width: 100%;
  text-align: center;
  font-size: 15px;
  line-height: 22px;
`;
