import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface SelectComponentProps {
  onChange: (event: SelectChangeEvent<unknown>) => void;
  onClick: () => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  onChange,
  onClick,
}) => {
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
          <InputLabel>Select your host</InputLabel>
          <Select
            label="Select your host"
            IconComponent={ArrowDropDownIcon}
            onChange={onChange}
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
        <Button
          variant="contained"
          onClick={onClick}
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
