import { TELERGAM_SUPPORT } from 'consts';
import { styled } from 'styled-components';
import { blue } from 'theme';

export function ModalErrorContent({message}: {message?: string}) {

  const link = (
    <SupportLink href={TELERGAM_SUPPORT} target="_blank">
      Get support on telegram
    </SupportLink>
  );
  return (
    <Container>
      {message ? (
        <Text>
          {message} {link}
        </Text>
      ) : (
        link
      )}
    </Container>
  );
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`


const SupportLink = styled("a")`
  font-size: 14px;
  color: ${blue};
  text-decoration: underline;
  svg {
    position: relative;
    top: 2px;
  }
`;



const Text = styled("p")`
  width: 100%;
  text-align: left;
  font-size: 15px;
  line-height: 22px;
`;
