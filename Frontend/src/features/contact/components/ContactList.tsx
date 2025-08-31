import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  IconButton,
  TextField,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import type { Person } from "../types/contact.type";
import * as React from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CakeIcon from "@mui/icons-material/Cake";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import NotesIcon from "@mui/icons-material/Notes";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

interface ContactListProps {
  contactList: Person[];
  onAddContact?: () => void;
  onEditSubmit?: (updatedPerson: Person) => void;
  onDelete?: (id: number) => void;
}

const ContactList = ({
  contactList,
  onAddContact,
  onEditSubmit,
  onDelete,
}: ContactListProps) => {
  const [selectedPerson, setSelectedPerson] = React.useState<Person | null>(
    null
  );
  const [editing, setEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState<Partial<Person>>({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleOpen = (person: Person) => {
    if (selectedPerson?.id === person.id) {
      setSelectedPerson(null);
      setEditing(false);
    } else {
      setSelectedPerson(person);
      setEditing(false);
      setEditForm({ ...person });
    }
  };

  const handleClose = () => {
    setSelectedPerson(null);
    setEditing(false);
  };

  const startEdit = () => {
    setEditing(true);
    setEditForm({ ...selectedPerson });
  };

  const handleEditChange = (field: keyof Person, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitEdit = () => {
    if (selectedPerson && onEditSubmit) {
      const updatedPerson = { ...editForm, id: selectedPerson.id } as Person;
      onEditSubmit(updatedPerson); // send updated data with ID
      setEditing(false);
      setSelectedPerson(updatedPerson); // update locally
    }
  };

  const panelWidth = isMobile ? "100%" : isTablet ? "60%" : "50%";

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left panel: contact list */}
      <Box
        sx={{
          flex: 1,
          bgcolor: theme.palette.background.paper,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color={theme.palette.text.primary}
          >
            Contact List
          </Typography>
          {onAddContact && (
            <Tooltip title="Add Contact">
              <IconButton color="primary" onClick={onAddContact}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <List>
          {contactList.map((person) => {
            const fullName = `${person.first_name} ${person.last_name}`;
            return (
              <ListItemButton
                key={person.id}
                onClick={() => handleOpen(person)}
                selected={selectedPerson?.id === person.id}
              >
                <ListItemIcon>
                  <PersonIcon sx={{ color: theme.palette.text.primary }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography color={theme.palette.text.primary}>
                      {fullName}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      color={theme.palette.text.secondary}
                      variant="body2"
                    >
                      {person.email}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Right panel: sliding details */}
      <Box
        sx={{
          width: selectedPerson ? panelWidth : 0,
          transition: "width 0.3s ease",
          overflow: "hidden",
          boxShadow: selectedPerson ? "-4px 0 20px rgba(0,0,0,0.1)" : "none",
          bgcolor: theme.palette.background.default,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {selectedPerson && (
          <Box
            sx={{
              p: 2,
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color={theme.palette.text.primary}
              >
                {editing
                  ? `${editForm.first_name} ${editForm.last_name}`
                  : `${selectedPerson.first_name} ${selectedPerson.last_name}`}
              </Typography>
              <Box>
                {editing ? (
                  <Tooltip title="Save">
                    <IconButton onClick={submitEdit}>
                      <SaveIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip title="Edit">
                      <IconButton onClick={startEdit}>
                        <EditIcon sx={{ color: theme.palette.primary.main }} />
                      </IconButton>
                    </Tooltip>
                    {onDelete && (
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => onDelete(selectedPerson?.id)}
                        >
                          <DeleteIcon
                            sx={{ color: theme.palette.error.main }}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                )}
                <IconButton onClick={handleClose}>
                  <CloseIcon sx={{ color: theme.palette.text.primary }} />
                </IconButton>
              </Box>
            </Box>

            {/* Scrollable content */}
            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              {/* Email & Phone */}
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: "12px",
                  boxShadow: 1,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                {editing ? (
                  <>
                    <TextField
                      label="Email"
                      value={editForm.email || ""}
                      fullWidth
                      size="small"
                      onChange={(e) =>
                        handleEditChange("email", e.target.value)
                      }
                    />
                    <TextField
                      label="Phone"
                      value={editForm.phone || ""}
                      fullWidth
                      size="small"
                      sx={{ mt: 1 }}
                      onChange={(e) =>
                        handleEditChange("phone", e.target.value)
                      }
                    />
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.primary}
                    >
                      <EmailIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.text.primary }}
                      />
                      {selectedPerson.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.primary}
                      sx={{ mt: 1 }}
                    >
                      <PhoneIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.text.primary }}
                      />
                      {selectedPerson.phone}
                    </Typography>
                  </>
                )}
              </Paper>

              {/* Address */}
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: "12px",
                  boxShadow: 1,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                {editing ? (
                  <TextField
                    label="Address"
                    value={editForm.address || ""}
                    fullWidth
                    size="small"
                    onChange={(e) =>
                      handleEditChange("address", e.target.value)
                    }
                  />
                ) : (
                  <Typography
                    variant="body2"
                    color={theme.palette.text.primary}
                  >
                    <HomeIcon
                      fontSize="small"
                      sx={{ mr: 1, color: theme.palette.text.primary }}
                    />
                    {selectedPerson.address}
                  </Typography>
                )}
              </Paper>

              {/* Emergency & Birthday */}
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: "12px",
                  boxShadow: 1,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                {editing ? (
                  <>
                    <TextField
                      label="Emergency Contact"
                      value={editForm.emergency_contact || ""}
                      fullWidth
                      size="small"
                      onChange={(e) =>
                        handleEditChange("emergency_contact", e.target.value)
                      }
                    />
                    <TextField
                      label="Birthday"
                      type="date"
                      value={editForm.birthday?.slice(0, 10) || ""}
                      fullWidth
                      size="small"
                      sx={{ mt: 1 }}
                      onChange={(e) =>
                        handleEditChange("birthday", e.target.value)
                      }
                    />
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.primary}
                    >
                      <ContactEmergencyIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.text.primary }}
                      />
                      Emergency: {selectedPerson.emergency_contact}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.primary}
                      sx={{ mt: 1 }}
                    >
                      <CakeIcon
                        fontSize="small"
                        sx={{ mr: 1, color: theme.palette.text.primary }}
                      />
                      Birthday:{" "}
                      {new Date(selectedPerson.birthday).toLocaleDateString()}
                    </Typography>
                  </>
                )}
              </Paper>

              {/* Notes */}
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  boxShadow: 1,
                  bgcolor: theme.palette.background.paper,
                }}
              >
                {editing ? (
                  <TextField
                    label="Notes"
                    value={editForm.notes || ""}
                    fullWidth
                    size="small"
                    multiline
                    rows={3}
                    onChange={(e) => handleEditChange("notes", e.target.value)}
                  />
                ) : (
                  <>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      color={theme.palette.text.primary}
                    >
                      Notes
                    </Typography>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.primary}
                    >
                      {selectedPerson.notes}
                    </Typography>
                  </>
                )}
              </Paper>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ContactList;
