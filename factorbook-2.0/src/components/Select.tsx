import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface SelectHostProps {
  text: string;
}

const SelectHost: React.FC<SelectHostProps> = ({ text }) => (
  <FormControl
    variant="outlined"
    sx={{
      width: "220px",
      backgroundColor: "rgba(138, 43, 226, 0.1)",
      borderRadius: "24px",
      height: "41px",
      display: "flex",
      justifyContent: "center",
      "& .MuiOutlinedInput-root": {
        borderRadius: "24px",
      },
      "& .MuiInputLabel-outlined": {
        transform: "translate(14px, 10px) scale(1)",
      },
      "& .MuiInputLabel-shrink": {
        transform: "translate(14px, -6px) scale(0.75)",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(0, 0, 0, 0.23)",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(0, 0, 0, 0.87)",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(0, 0, 0, 0.87)",
      },
    }}
  >
    <InputLabel>{text}</InputLabel>
    <Select
      label={text}
      IconComponent={ArrowDropDownIcon}
      sx={{
        borderRadius: "24px",
        height: "41px",
        display: "flex",
        alignItems: "center",
        "& .MuiOutlinedInput-notchedOutline": {
          borderRadius: "24px",
        },
        "& .MuiSelect-icon": {
          right: "14px",
        },
      }}
    >
      <MenuItem value="human">Human</MenuItem>
      <MenuItem value="mouse">Mouse</MenuItem>
    </Select>
  </FormControl>
);

const SelectComponent: React.FC = () => {
  return (
    <Box
      component="section"
      sx={{
        display: "inline-flex",
        height: "169px",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          width: "100%",
          color: "rgba(0, 0, 0, 0.87)",
          fontFamily: "Helvetica Neue",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "24px",
          letterSpacing: "0.15px",
          fontFeatureSettings: "'clig' off, 'liga' off",
          mb: 2,
        }}
      >
        Explore TFs in
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <SelectHost text="Select your host" />
        <Button
          variant="contained"
          sx={{
            width: "80px",
            height: "41px",
            padding: "8px 22px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#8169BF",
            borderRadius: "24px",
            textTransform: "none",
            fontWeight: "medium",
            color: "white",
          }}
        >
          Go
        </Button>
      </Box>
    </Box>
  );
};

export default SelectComponent;
