import { Autocomplete, Box, FormControl, Select, styled, TextField } from "@mui/material";

export const NONE = { text: "(none)", value: "NONE" };

export const POPULATIONS = [
  { text: "African", value: "AFRICAN" },
  { text: "Native American", value: "AMERICAN" },
  { text: "East Asian", value: "EAST_ASIAN" },
  { text: "European", value: "EUROPEAN" },
  { text: "South Asian", value: "SOUTH_ASIAN" },
];

export const SUBPOPULATIONS: Map<string, { text: string; value: string }[]> = new Map([
  [
    "AFRICAN",
    [
      NONE,
      { text: "Gambian", value: "GAMBIAN" },
      { text: "Mende", value: "MENDE" },
      { text: "Easn", value: "ESAN" },
      { text: "African American", value: "AFRICAN_AMERICAN" },
      { text: "African Caribbean", value: "AFRICAN_CARIBBEAN" },
    ],
  ],
  [
    "AMERICAN",
    [
      NONE,
      { text: "Mexican", value: "MEXICAN" },
      { text: "Puerto Rican", value: "PUERTO_RICAN" },
      { text: "Colombian", value: "COLOMBIAN" },
      { text: "Peruvian", value: "PERUVIAN" },
      { text: "Southern Han Chinese", value: "SOUTHERN_HAN_CHINESE" },
    ],
  ],
  [
    "EAST_ASIAN",
    [
      NONE,
      { text: "Han Chinese from Beijing", value: "HAN_CHINESE_BEIJING" },
      { text: "Japanese", value: "JAPANESE" },
      { text: "Dai", value: "DAI" },
      { text: "Kinh", value: "KINH" },
      { text: "Southern Han Chinese", value: "SOUTHERN_HAN_CHINESE" },
    ],
  ],
  [
    "EUROPEAN",
    [
      NONE,
      { text: "Iberian", value: "IBERIAN" },
      { text: "British", value: "BRITISH" },
      { text: "Finnish", value: "FINNISH" },
      { text: "Toscani", value: "TOSCANI" },
      {
        text: "Utah resident northwest European",
        value: "UTAH_RESIDENT_NW_EUROPEAN",
      },
    ],
  ],
  [
    "SOUTH_ASIAN",
    [
      NONE,
      { text: "Gujarati", value: "GUJARATI" },
      { text: "Punjabi", value: "PUNJABI" },
      { text: "Bengali", value: "BENGALI" },
      { text: "Sri Lankan Tamil", value: "SRI_LANKAN_TAMIL" },
      { text: "Indian Telugu", value: "INDIAN_TELUGU" },
    ],
  ],
]);

export const StyledBox = styled(Box)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
  },
});

export const CodeBox = styled(Box)({
  backgroundColor: "#f5f5f5",
  padding: "16px",
  overflowX: "auto",
  fontFamily: "monospace",
});

export const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  marginTop: "8px",
});

export const SmallSelect = styled(Select)({
  minWidth: "200px",
  height: "32px",
  "& .MuiSelect-select": {
    padding: "6px 14px",
  },
});

export const SmallTextField = styled(TextField)({
  minWidth: "200px",
  "& .MuiInputBase-root": {
    height: "32px",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
    height: "40px",
    borderRadius: "24px",
    paddingLeft: "5px",
    "&:hover fieldset": {
      borderColor: "#673AB7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#673AB7",
    },
  },
});

export const PurpleAutocomplete = styled(Autocomplete)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#EDE7F6",
    "&:hover fieldset": {
      borderColor: "#673AB7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#673AB7",
    },
  },
  "& .MuiAutocomplete-endAdornment": {
    color: "#673AB7",
  },
});

export const PurpleFormControl = styled(FormControl)({
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#673AB7",
  },
});
