'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Helvetica Neue, Arial, sans-serif', // Ensure fallback fonts
  },
});

export default theme;