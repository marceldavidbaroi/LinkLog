import { IconButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import KeyIcon from "@mui/icons-material/Key";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface NavLinkButtonProps {
  iconName: string;
  href: string;
}

const iconMap: Record<string, JSX.Element> = {
  Dashboard: <DashboardIcon />,
  Finance: <AccountBalanceWalletIcon />,
  Vault: <KeyIcon />,
  Profile: <AccountCircleIcon />,
};

export default function NavLinkButton({ iconName, href }: NavLinkButtonProps) {
  return (
    <IconButton
      sx={{
        color: "#fff",
        transition: "all 0.3s",
        "&:hover": { transform: "scale(1.2)" },
      }}
      href={href}
    >
      {iconMap[iconName]}
    </IconButton>
  );
}
