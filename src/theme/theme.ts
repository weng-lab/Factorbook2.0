'use client';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
  /**
   * @todo are these the reason why declaring color="black" doesn't work as expected?
   */
  interface Palette {
    gray: Palette['primary'];
    link: Palette['primary'];
    black: Palette['primary'];
  }
  interface PaletteOptions {
    gray?: PaletteOptions['primary'];
    link?: PaletteOptions['primary'];
    black?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#8169BF',  // Primary purple color
    },
    secondary: {
      main: '#673AB7',  // Secondary purple color
    },
    error: {
      main: "#ee725f"
    },
    gray: {
      main: '#EDE7F6',  // Light gray used for backgrounds
    },
    link: {
      main: 'purple',   // Link color
    },
    black: {
      main: '#000000',  // Black used in text (like headers)
    },
  },
  shape: {
    borderRadius: 20
  },
  components: {
    // Customize Table styles
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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      },
    },
    MuiMenu: {
      defaultProps: {
        disableScrollLock: true
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none"
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          backgroundColor: "#F2F0FF",
          color: "#5056A9",
          "& .MuiAlert-icon": {
            color: "#5056A9",
          },
        },
      }
    }
  },
});

export default theme;
