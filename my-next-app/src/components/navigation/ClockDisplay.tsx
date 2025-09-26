import { Box, Typography } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import WbTwilightOutlinedIcon from "@mui/icons-material/WbTwilightOutlined";
import NightsStayIcon from "@mui/icons-material/NightsStay";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getTimeOfDayIcon = (hour: number) => {
  if (hour >= 5 && hour < 12)
    return <WbTwilightIcon sx={{ animation: "spin 10s linear infinite" }} />;
  if (hour >= 12 && hour < 17)
    return <WbSunnyIcon sx={{ animation: "spin 10s linear infinite" }} />;
  if (hour >= 17 && hour < 20)
    return (
      <WbTwilightOutlinedIcon sx={{ animation: "spin 10s linear infinite" }} />
    );
  return <NightsStayIcon sx={{ animation: "spin 10s linear infinite" }} />;
};

interface ClockDisplayProps {
  time: Date;
}

export default function ClockDisplay({ time }: ClockDisplayProps) {
  const hours = time.getHours();
  const minutes = String(time.getMinutes()).padStart(2, "0");
  const isAM = hours < 12;
  const displayHour = hours % 12 || 12;
  const amPm = isAM ? "AM" : "PM";
  const day = days[time.getDay()];
  const date = time.getDate();
  const month = months[time.getMonth()];
  const timeIcon = getTimeOfDayIcon(hours);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, color: "#fff" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontFamily: "monospace",
          fontWeight: "bold",
        }}
      >
        <Typography sx={{ animation: "flip 0.5s ease-in-out" }}>
          {displayHour}:{minutes}
        </Typography>
        <Typography>{amPm}</Typography>
        <Typography sx={{ fontSize: "1.2rem" }}>{timeIcon}</Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "auto auto",
          justifyItems: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "0.85rem",
          minWidth: 60,
        }}
      >
        <Typography
          sx={{ gridRow: 1, gridColumn: "1 / span 2", fontWeight: "bold" }}
        >
          {day}
        </Typography>
        <Typography sx={{ gridRow: 2, gridColumn: 1 }}>{date}</Typography>
        <Typography sx={{ gridRow: 2, gridColumn: 2 }}>{month}</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <WbSunnyIcon sx={{ animation: "spin 10s linear infinite" }} />
        <Typography>28°C</Typography>
      </Box>
    </Box>
  );
}
