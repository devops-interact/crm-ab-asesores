import { type I18n } from '@lingui/core';
import { Column, Container, Row } from '@react-email/components';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

const footerContainerStyle = {
  marginTop: '12px',
};

type FooterProps = {
  i18n: I18n;
};

export const Footer = ({ i18n }: FooterProps) => {
  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column>
          <ShadowText>
            <Link
              href="https://abcorporativo.com"
              value="Sitio web"
              aria-label="Sitio web de AB Corporativo"
            />
          </ShadowText>
        </Column>
      </Row>
      <ShadowText>
        <>
          AB Corporativo
          <br />
          México
        </>
      </ShadowText>
    </Container>
  );
};
