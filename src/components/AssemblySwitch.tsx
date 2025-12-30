import { useState, useRef, MouseEvent } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BoyIcon from '@mui/icons-material/Boy';
import PestControlRodentIcon from '@mui/icons-material/PestControlRodent';
import { Stack } from "@mui/material";

export type Assembly = "GRCh38" | "mm10";

interface AssemblySwitchProps {
  assembly: Assembly;
  onChange: (assembly: Assembly) => void;
  iconColor?: string;
}

export default function AssemblySwitch({ assembly, onChange, iconColor = "black" }: AssemblySwitchProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dropdownRef = useRef<HTMLButtonElement | null>(null);

  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (value: Assembly) => {
    onChange(value);
    handleClose();
  };

  const Icon = assembly === "GRCh38" ? BoyIcon : PestControlRodentIcon;

  return (
    <Stack direction="row" alignItems="center" spacing={-2}>
      <IconButton onClick={handleOpen}>
        <Icon sx={{ color: iconColor, fontSize: 40 }} />
      </IconButton>

      <IconButton
        ref={dropdownRef}
        onClick={handleOpen}
        size="small"
        sx={{ color: iconColor }}
        aria-controls={anchorEl ? "assembly-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
      >
        <ArrowDropDownIcon />
      </IconButton>

      <Menu
        id="assembly-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem selected={assembly === "GRCh38"} onClick={() => handleSelect("GRCh38")}>
          Human
        </MenuItem>
        <MenuItem selected={assembly === "mm10"} onClick={() => handleSelect("mm10")}>
          Mouse
        </MenuItem>
      </Menu>
    </Stack>
  );
}
