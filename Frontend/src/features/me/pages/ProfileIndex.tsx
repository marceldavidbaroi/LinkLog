import { useEffect, useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useMe } from "../hooks/meAuth";
import useMeStore from "../store/meStore";
import { useNavigate } from "react-router-dom";

const MeProfile = () => {
  const { getProfile, updateProfile } = useMe();
  const { me, loading } = useMeStore();
  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
    console.log("Fetching profile data...", me);
  }, []);

  useEffect(() => {
    if (me?.email) setEmail(me.email);
  }, [me]);

  const handleSaveEmail = async () => {
    if (!email) return;
    await updateProfile({ email });
    setEditEmail(false);
  };

  return (
    <Box component={Paper} elevation={0} className="p-6 flex flex-col gap-4">
      <Typography variant="h5" gutterBottom>
        My Profile
      </Typography>

      {/* Username */}
      <Typography variant="body1">
        <strong>Username:</strong> {me?.username}
      </Typography>

      {/* Email (editable) */}
      <Box className="flex items-center gap-2">
        <Typography variant="body1">
          <strong>Email:</strong>
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
              color="primary"
              onClick={handleSaveEmail}
              disabled={loading}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
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
            <Typography variant="body1">{me?.email}</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setEditEmail(true)}
            >
              Edit
            </Button>
          </>
        )}
      </Box>

      {/* Preferences Redirect */}
      <Box>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/preferences")}
        >
          Go to Preferences
        </Button>
      </Box>
    </Box>
  );
};

export default MeProfile;
