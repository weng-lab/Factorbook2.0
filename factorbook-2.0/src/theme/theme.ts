'use client';
import { createTheme } from '@mui/material/styles';

// Define your custom theme with "Helvetica Neue" as the font family
const theme = createTheme({
  typography: {
    fontFamily: 'Helvetica Neue, Arial, sans-serif', // Ensure fallback fonts
  },
});

export default theme;
