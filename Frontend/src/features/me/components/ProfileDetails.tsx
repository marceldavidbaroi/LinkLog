import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProfileDetails = ({
  me,
  loading,
  email,
  setEmail,
  editEmail,
  setEditEmail,
  handleSaveEmail,
}: any) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        width: "100%",
        p: 4,
        borderRadius: 4,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Header */}
      <Box className="flex items-center gap-4 mb-6">
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: theme.palette.primary.main,
            fontSize: "1.5rem",
          }}
        >
          {me?.username?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {me?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Profile details & settings
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Email */}
      <Box className="flex items-center gap-2 mb-4">
        <Typography variant="body1" fontWeight="500">
          Email:
        </Typography>
        {editEmail ? (
          <>
            <TextField
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveEmail}
              disabled={loading}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<CloseIcon />}
              onClick={() => {
                setEmail(me?.email || "");
                setEditEmail(false);
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" color="text.primary">
              {me?.email}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setEditEmail(true)}
            >
              Edit
            </Button>
          </>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Preferences Button */}
      {/* <Box className="flex justify-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<Settings />}
          onClick={() => navigate("/preferences")}
        >
          Preferences
        </Button>
      </Box> */}
    </Paper>
  );
};

export default ProfileDetails;
