"use client";

import { Button, ButtonProps, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

type SecureGateButtonAppearance = "primary" | "secondary" | "danger";
type SecureGateButtonSize = "sm" | "md" | "lg";

type SecureGateButtonProps = Omit<
  ButtonProps,
  "variant" | "startIcon" | "endIcon"
> & {
  label: string;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  href?: string;
  appearance?: SecureGateButtonAppearance;
  buttonSize?: SecureGateButtonSize;
  mobileFullWidth?: boolean;
};

export const SecureGateButton = ({
  label,
  icon,
  iconPosition = "start",
  href,
  appearance = "primary",
  buttonSize = "md",
  mobileFullWidth = true,
  onClick,
  disabled,
  fullWidth,
  sx,
  type = "button",
  ...rest
}: SecureGateButtonProps) => {
  const router = useRouter();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isPrimary = appearance === "primary";
  const isDanger = appearance === "danger";

  const getDesktopMinWidth = (size: SecureGateButtonSize) => {
    switch (size) {
      case "lg":
        return 180;
      case "md":
        return 150;
      default:
        return 120;
    }
  };

  const getDesktopMinHeight = (size: SecureGateButtonSize) => {
    switch (size) {
      case "lg":
        return 64;
      case "md":
        return 52;
      default:
        return 42;
    }
  };

  const getDesktopPx = (size: SecureGateButtonSize) =>
    size === "lg" ? 3 : 2.25;
  const getDesktopFontSize = (size: SecureGateButtonSize) =>
    size === "lg" ? 15 : 14;

  const handleClick: ButtonProps["onClick"] = (event) => {
    onClick?.(event);

    if (!event.defaultPrevented && href) {
      router.push(href);
    }
  };

  return (
    <Button
      type={type}
      disabled={disabled}
      fullWidth={fullWidth || (isMobile && mobileFullWidth)}
      variant={isPrimary || isDanger ? "contained" : "outlined"}
      startIcon={iconPosition === "start" ? icon : undefined}
      endIcon={iconPosition === "end" ? icon : undefined}
      onClick={handleClick}
      sx={{
        minWidth: isMobile ? "100%" : getDesktopMinWidth(buttonSize),
        minHeight: isMobile ? 50 : getDesktopMinHeight(buttonSize),
        px: isMobile ? 2 : getDesktopPx(buttonSize),
        py: 1.25,
        borderRadius: "10px",
        textTransform: "none",
        fontWeight: 700,
        fontSize: isMobile ? 14 : getDesktopFontSize(buttonSize),
        lineHeight: 1.25,
        whiteSpace: "normal",
        boxShadow: isPrimary ? "0 8px 18px rgba(0, 91, 211, 0.18)" : "none",

        ...(isPrimary && {
          bgcolor: "#005BD3",
          color: "#ffffff",
          border: "1px solid #005BD3",
          "&:hover": {
            bgcolor: "#004BB3",
            borderColor: "#004BB3",
          },
        }),

        ...(appearance === "secondary" && {
          bgcolor: "#ffffff",
          color: "#111827",
          border: "1px solid #C9CED6",
          "&:hover": {
            bgcolor: "#F8FAFC",
            borderColor: "#9CA3AF",
          },
        }),

        ...(isDanger && {
          bgcolor: "#DC2626",
          color: "#ffffff",
          border: "1px solid #DC2626",
          "&:hover": {
            bgcolor: "#B91C1C",
            borderColor: "#B91C1C",
          },
        }),

        ...sx,
      }}
      {...rest}
    >
      {label}
    </Button>
  );
};
