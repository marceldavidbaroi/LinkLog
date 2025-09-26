import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import KeyIcon from "@mui/icons-material/Key";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import WbTwilightOutlinedIcon from "@mui/icons-material/WbTwilightOutlined";
import NightsStayIcon from "@mui/icons-material/NightsStay";

interface NavLink {
  iconName: string;
  text: string;
  href: string;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  time: Date;
}

// Time constants
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

const iconMap: Record<string, JSX.Element> = {
  Dashboard: <DashboardIcon />,
  Finance: <AccountBalanceWalletIcon />,
  Vault: <KeyIcon />,
  Profile: <AccountCircleIcon />,
};

export default function MobileDrawer({
  open,
  onClose,
  navLinks,
  time,
}: MobileDrawerProps) {
  const theme = useTheme();

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
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: 250,
          mt: "80px",
          backgroundColor: theme.palette.primary.main + "CC",
          p: 2,
        },
      }}
    >
      {/* Clock + Date + Weather */}
      <Box sx={{ mb: 3, color: "#fff", textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
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
            mt: 1,
            fontSize: "0.85rem",
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            mt: 1,
          }}
        >
          <WbSunnyIcon sx={{ animation: "spin 10s linear infinite" }} />
          <Typography>28°C</Typography>
        </Box>
      </Box>

      {/* Navigation links */}
      <List>
        {navLinks.map((link, idx) => (
          <ListItem
            button
            key={idx}
            component="a"
            href={link.href}
            onClick={onClose}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              {iconMap[link.iconName]}
            </ListItemIcon>
            <ListItemText primary={link.text} sx={{ color: "#fff" }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
