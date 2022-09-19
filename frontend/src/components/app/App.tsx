import React from 'react';
import NavBar from '../bars/NavBar';
import ActionBar from '../bars/ActionBar';
import Containers from '../containers/Containers';
import { createTheme, ThemeProvider } from '@mui/material';
import { store } from '../../store/store';
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
