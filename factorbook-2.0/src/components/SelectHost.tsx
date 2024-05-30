"use client";

import * as React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface SelectHostProps {
  text: string;
  options: { value: string; label: string }[];
  onChange: (event: SelectChangeEvent<unknown>) => void;
}

const SelectHost: React.FC<SelectHostProps> = ({ text, options, onChange }) => (
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
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SelectHost;
