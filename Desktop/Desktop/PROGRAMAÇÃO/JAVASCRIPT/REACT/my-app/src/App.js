import React from 'react';
import Login from './pages/Login';
import GlobalStyle from './styles/GlobalStyles';

function App() {
  // essa funcão retorna o componente login do index.js
  return (
    <>
      <Login />
      <GlobalStyle />;
    </>
  );
}

export default App;
