"use client";

import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
} from "@mui/material";
import Image from "next/image";

export default function Home() {
  const theme = useTheme();

  return (
    <Box className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main, // primary color background
          color: "#fff",
          py: 20,
        }}
      >
        <Container
          maxWidth="lg"
          className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12"
        >
          <Box className="flex-1 text-center lg:text-left space-y-6">
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              MindVault
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
              Personal finance tracker — manage your expenses, budgets, and
              insights in one place.
            </Typography>
            <Box className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
              <Button
                variant="contained"
                size="medium"
                color="secondary"
                sx={{
                  color: "white",
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="medium"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  borderWidth: 2,
                  color: "#fff",
                  borderColor: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
          <Box className="flex-1 flex justify-center lg:justify-end">
            <Image
              src="/finance-illustration.svg"
              alt="Finance illustration"
              width={450}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
          </Box>
        </Container>
      </Box>

      {/* Feature Section */}
      <Box sx={{ py: 20, backgroundColor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              mb: 12,
              color: theme.palette.text.primary,
            }}
          >
            Finance Tracker
          </Typography>
          <Grid container justifyContent="center" spacing={6}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  p: 6,
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "all 0.3s",
                  "&:hover": { boxShadow: 8, transform: "translateY(-5px)" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Image
                  src="/icons/finance.svg"
                  alt="Finance Icon"
                  width={64}
                  height={64}
                />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Track Your Expenses
                </Typography>
                <Typography sx={{ color: theme.palette.text.secondary }}>
                  Monitor your daily spending, set budgets, and gain insights
                  into your financial habits.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.grey[100],
        }}
      >
        © 2025 MindVault. All rights reserved.
      </Box>
    </Box>
  );
}
