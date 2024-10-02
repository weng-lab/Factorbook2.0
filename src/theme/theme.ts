'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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
          backgroundColor: '#7151A1',
          color: '#EDE7F6',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#EDE7F6',
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