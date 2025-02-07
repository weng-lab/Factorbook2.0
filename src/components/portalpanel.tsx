"use client";

import React, { isValidElement, cloneElement, ReactElement } from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme, Grid2 } from "@mui/material";
import Image from "next/image";
import StyledButton from "@/components/styledbutton";
import { SelectComponentProps } from "@/components/select";

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

  // Clone select component if provided
  const clonedSelectComponent =
    selectComponent && isValidElement<SelectComponentProps>(selectComponent)
      ? cloneElement(selectComponent, { sx: { ml: 2 } })
      : selectComponent;

  return (
    (<Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        margin: "0 auto",
        py: "5%",
        overflow: "hidden",
        maxWidth: "1300px"
      }}
    >
      <Grid2 container spacing={2} alignItems="center">
        <Grid2
          sx={{
            display: "flex",
            order: isSmallScreen ? 0 : reverse ? 1 : 0,
            justifyContent: "center",
          }}
          size={{
            xs: 12,
            sm: 6
          }}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={544}
            height={396}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Grid2>
        <Grid2
          sx={{
            textAlign: isSmallScreen ? "center" : "left",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            order: isSmallScreen ? 1 : reverse ? 0 : 1,
          }}
          size={{
            xs: 12,
            sm: 6
          }}>
          <Stack
            sx={{
              alignItems: isSmallScreen ? "center" : "flex-start",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
                fontFeatureSettings: "'clig' off, 'liga' off",
                fontSize: "34px",
                fontWeight: 400,
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
              <StyledButton
                text={buttonText}
                href={buttonHref}
                sx={{
                  width:"auto",
                  display: isSmallScreen ? "block" : "inline-block",
                  ml: isSmallScreen ? 0 : 2,
                }}
              />
            )}
            {clonedSelectComponent}
          </Stack>
        </Grid2>
      </Grid2>
    </Box>)
  );
};

export default PortalPanel;
