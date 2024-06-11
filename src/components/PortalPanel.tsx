"use client";

import React, { isValidElement, cloneElement, ReactElement } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import Image from "next/image";
import StyledButton from "@/components/StyledButton";
import { SelectComponentProps } from "@/components/Select";

interface PortalPanelProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  buttonText?: string;
  buttonHref?: string;
  selectComponent?: ReactElement<SelectComponentProps>;
  reverse?: boolean;
}

const PortalPanel: React.FC<PortalPanelProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  buttonText,
  buttonHref = "#",
  selectComponent,
  reverse = false,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const clonedSelectComponent = isValidElement<SelectComponentProps>(
    selectComponent
  )
    ? cloneElement(selectComponent, { sx: { ml: 2 } })
    : selectComponent;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "auto",
        margin: "0 auto",
        p: "5% 10%",
        overflow: "hidden",
      }}
    >
      <Grid2 container spacing={2} alignItems="center">
        <Grid2
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            order: isSmallScreen ? 0 : reverse ? 1 : 0,
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={544}
            height={396}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </Grid2>
        <Grid2
          xs={12}
          sm={6}
          sx={{
            textAlign: isSmallScreen ? "center" : "left",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: isSmallScreen ? "center" : "flex-start",
            gap: 2,
            order: isSmallScreen ? 1 : reverse ? 0 : 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "rgba(0, 0, 0, 0.87)",
              fontFeatureSettings: "'clig' off, 'liga' off",
              fontSize: "34px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "123.5%",
              p: 2,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#333",
              maxWidth: "539px",
              p: "8px 16px",
            }}
          >
            {description}
          </Typography>
          {buttonText && (
            <>
              <StyledButton
                text={buttonText}
                href={buttonHref}
                display={isSmallScreen ? "block" : "none"}
              />
              <StyledButton
                text={buttonText}
                href={buttonHref}
                display={isSmallScreen ? "none" : "block"}
                sx={{ ml: 2 }}
              />
            </>
          )}
          {clonedSelectComponent}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default PortalPanel;
