// app/auth/sign-in/layout.tsx
"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ overflow: "hidden" }}
    >
      {/* Background image */}
      <Image
        src="/images/auth-bg.png"
        alt="Auth background"
        fill
        style={{
          objectFit: "cover", // stretches & crops
          objectPosition: "center", // keep center focus
          zIndex: -1, // behind content
        }}
        priority
      />

      {/* Foreground content */}
      {children}
    </Box>
  );
}
