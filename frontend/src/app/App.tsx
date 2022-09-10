import React from 'react';
import NavBar from '../components/bars/NavBar';
import ActionBar from '../components/bars/ActionBar';
import Containers from '../components/containers/Containers';
import { createTheme, ThemeProvider } from '@mui/material';
import { store } from '../store/store';
import { Provider } from 'react-redux';

const theme = createTheme({
  palette: {
    primary: {
      light: '#fff',
      main: '#0065bd',
      dark: '#dad7cb',
      contrastText: '#fff'
    },
    secondary: {
      light: '#ff7961',
      main: '#fff',
      dark: '#ba000d',
      contrastText: '#000'
    }
  }
});

export default function App() {
  return (
    <div>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <NavBar />
          <ActionBar />
          <Containers />
        </ThemeProvider>
      </Provider>
    </div>
  );
}
