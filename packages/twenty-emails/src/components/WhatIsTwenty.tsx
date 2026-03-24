import { type I18n } from '@lingui/core';
import { MainText } from 'src/components/MainText';
import { SubTitle } from 'src/components/SubTitle';

type WhatIsTwentyProps = {
  i18n: I18n;
};

export const WhatIsTwenty = ({ i18n }: WhatIsTwentyProps) => {
  return (
    <>
      <SubTitle value="¿Qué es un CRM?" />
      <MainText>
        Es una plataforma diseñada para optimizar la gestión de clientes, procesos y relaciones comerciales dentro de la empresa, facilitando la organización y el crecimiento del negocio.
      </MainText>
    </>
  );
};
