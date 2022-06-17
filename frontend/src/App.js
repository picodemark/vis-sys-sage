import React from 'react';
import NavBar from './components/bars/NavBar';
import ActionBar from './components/bars/ActionBar';
import Containers from './components/containers/Containers';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#fba92c',
      dark: '#002884',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff7961',
      main: '#d3d3d3',
      dark: '#ba000d',
      contrastText: '#000'
    }
  }
});

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <NavBar></NavBar>
        <ActionBar></ActionBar>
        <Containers></Containers>
      </ThemeProvider>
    </div>
  );
}

export default App;
