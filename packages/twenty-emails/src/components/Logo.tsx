import { Img } from '@react-email/components';

const logoStyle = {
  marginBottom: '40px',
};

export const Logo = () => {
  return (
    <Img
      src="https://raw.githubusercontent.com/devops-interact/crm-ab-asesores/main/packages/twenty-front/public/branding/abcorp-logo.png"
      alt="AB Corporativo logo"
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
