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
import type { Person } from "../types/interaction.type";
import * as React from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CakeIcon from "@mui/icons-material/Cake";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import SlidingPanel from "../../../components/SlidingPanel";

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

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 10); // yyyy-MM-dd
  };

  const handleOpen = (person: Person) => {
    setSelectedPerson(person);
    setEditing(false);
    setEditForm({
      ...person,
      birthday: formatDate(person.birthday),
    });
  };

  const startEdit = () => {
    if (!selectedPerson) return;
    setEditing(true);
    setEditForm({
      ...selectedPerson,
      birthday: formatDate(selectedPerson.birthday),
    });
  };

  const handleClose = () => {
    setSelectedPerson(null);
    setEditing(false);
  };

  const handleEditChange = (field: keyof Person, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitEdit = () => {
    if (selectedPerson && onEditSubmit) {
      const updatedPerson = { ...editForm, id: selectedPerson.id } as Person;
      console.log("Submitting edit:", updatedPerson);
      onEditSubmit(updatedPerson);
      setEditing(false);
      setSelectedPerson(updatedPerson);
    }
  };

  const panelWidth = isMobile ? "100%" : isTablet ? "60%" : "50%";

  return (
    <Box sx={{ display: "flex", overflow: "hidden" }}>
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
          <Typography variant="h5" fontWeight="bold">
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
                  primary={fullName}
                  secondary={person.email}
                  primaryTypographyProps={{
                    color: theme.palette.text.primary,
                  }}
                  secondaryTypographyProps={{
                    variant: "body2",
                    color: theme.palette.text.secondary,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* SlidingPanel replaces right panel */}
      <SlidingPanel
        open={!!selectedPerson}
        onClose={handleClose}
        title={
          editing
            ? `${editForm.first_name} ${editForm.last_name}`
            : `${selectedPerson?.first_name} ${selectedPerson?.last_name}`
        }
        width={panelWidth}
        side="right"
        actions={
          editing ? (
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
              {onDelete && selectedPerson && (
                <Tooltip title="Delete">
                  <IconButton onClick={() => onDelete(selectedPerson.id)}>
                    <DeleteIcon sx={{ color: theme.palette.error.main }} />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )
        }
      >
        {selectedPerson && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Email & Phone */}
            <Paper
              sx={{
                p: 2,
                borderRadius: "8px",
                boxShadow: 0,
                border: 1,
                borderColor: theme.palette.background.paper,
                bgcolor: "transparent",
              }}
            >
              {editing ? (
                <>
                  <TextField
                    label="Email"
                    value={editForm.email || ""}
                    fullWidth
                    size="small"
                    onChange={(e) => handleEditChange("email", e.target.value)}
                  />
                  <TextField
                    label="Phone"
                    value={editForm.phone || ""}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                    onChange={(e) => handleEditChange("phone", e.target.value)}
                  />
                </>
              ) : (
                <>
                  <Typography variant="body2" color="text">
                    <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                    {selectedPerson.email}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                    {selectedPerson.phone}
                  </Typography>
                </>
              )}
            </Paper>

            {/* Address */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "8px",
                boxShadow: 0,
                border: 1,
                borderColor: theme.palette.background.paper,
                bgcolor: "transparent",
              }}
            >
              {editing ? (
                <TextField
                  label="Address"
                  value={editForm.address || ""}
                  fullWidth
                  size="small"
                  onChange={(e) => handleEditChange("address", e.target.value)}
                />
              ) : (
                <Typography variant="body2">
                  <HomeIcon fontSize="small" sx={{ mr: 1 }} />
                  {selectedPerson.address}
                </Typography>
              )}
            </Paper>

            {/* Emergency & Birthday */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "8px",
                boxShadow: 0,
                border: 1,
                borderColor: theme.palette.background.paper,

                bgcolor: "transparent",
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
                    value={editForm.birthday || ""} // already normalized
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
                  <Typography variant="body2">
                    <ContactEmergencyIcon fontSize="small" sx={{ mr: 1 }} />
                    Emergency: {selectedPerson.emergency_contact}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <CakeIcon fontSize="small" sx={{ mr: 1 }} />
                    Birthday:{" "}
                    {selectedPerson.birthday
                      ? new Date(selectedPerson.birthday).toLocaleDateString()
                      : "N/A"}{" "}
                  </Typography>
                </>
              )}
            </Paper>

            {/* Notes */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "8px",
                boxShadow: 0,
                border: 1,
                borderColor: theme.palette.background.paper,
                bgcolor: "transparent",
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
                  <Typography variant="subtitle2" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2">
                    {selectedPerson.notes}
                  </Typography>
                </>
              )}
            </Paper>
          </Box>
        )}
      </SlidingPanel>
    </Box>
  );
};

export default ContactList;
