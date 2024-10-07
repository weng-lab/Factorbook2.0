'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8169BF', // Define the primary color as purple
    },
  },
  typography: {
    fontFamily: 'Helvetica Neue',
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid #EDE7F6',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          color: '#000000', // Set header text color to black
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#000000', // Ensure header text remains black
          fontWeight: 'bold',
        },
        body: {
          fontSize: '14px',
        },
      },
    },
  },
});

export default theme;