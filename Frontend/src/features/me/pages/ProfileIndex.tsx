import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup } from "@mui/material";
import { useMe } from "../hooks/meAuth";
import useMeStore from "../store/meStore";
import ProfileDetails from "../components/ProfileDetails";

const MeProfile = () => {
  const { getProfile, updateProfile } = useMe();
  const { me, loading } = useMeStore();
  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState("profile");

  useEffect(() => {
    getProfile();
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
    <Box className="h-full w-full p-6 flex flex-col items-center">
      {/* 🔹 ButtonGroup for navigation */}
      <ButtonGroup variant="contained" aria-label="Profile Tabs" sx={{ mb: 3 }}>
        <Button onClick={() => setSelectedTab("profile")}>Profile</Button>
        <Button onClick={() => setSelectedTab("preferences")}>
          Preferences
        </Button>
        <Button onClick={() => setSelectedTab("other")}>Other</Button>
      </ButtonGroup>

      {/* 🔹 Switchable content */}
      {selectedTab === "profile" && (
        <ProfileDetails
          me={me}
          loading={loading}
          email={email}
          setEmail={setEmail}
          editEmail={editEmail}
          setEditEmail={setEditEmail}
          handleSaveEmail={handleSaveEmail}
        />
      )}
      {/* {selectedTab === "preferences" && <PreferencesPanel />}
      {selectedTab === "other" && <OtherPanel />} */}
    </Box>
  );
};

export default MeProfile;
