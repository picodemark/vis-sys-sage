import React from 'react';
import NavBar from 'components/bars/NavBar';
import ActionBar from 'components/bars/ActionBar';
import Containers from 'components/containers/Containers';
import { createTheme, ThemeProvider } from '@mui/material';
import { store } from 'store/store';
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#5E94D4',
      main: '#3070B3'
    },
    secondary: {
      light: '#ff7961',
      main: '#ffffff'
    },
    background: {
      default: '#E8E8E8'
    }
  }
});

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <NavBar />
          <ActionBar />
          <Containers />
        </ThemeProvider>
      </Provider>
    </StyledEngineProvider>
  );
}
