// precisa instalar duas extensões para utilizar os styles components 1- vscode styled components
// precisa instalar o styled components com npm i styled-components no terminal
import styled from 'styled-components';

// estamos exportando o styled pro h1 do index.js
export const Title = styled.h1`
  background: white;
  small {
    font-size: 12pt;
    margin-left: 15px;
    color: red;
  }
`;

export const Paragrafo = styled.p`
  font-size: 80px;
`;
