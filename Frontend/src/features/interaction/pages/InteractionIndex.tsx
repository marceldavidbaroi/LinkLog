import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import AddPersonDialog from "../../contact/components/AddContactDialog";

interface Person {
  id: number;
  name: string;
  notes?: string;
}

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ]);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddPerson = (name: string, notes: string) => {
    const newPerson: Person = {
      id: people.length + 1,
      name,
      notes,
    };
    setPeople([...people, newPerson]);
    setSelectedPerson(newPerson);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        People Manager
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "center" }}>
        <Autocomplete
          options={people}
          getOptionLabel={(option) => option.name}
          value={selectedPerson}
          onChange={(_, newValue) => setSelectedPerson(newValue)}
          sx={{ width: 250 }}
          renderInput={(params) => (
            <TextField {...params} label="Select Person" />
          )}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Add Person
        </Button>
      </Box>

      <AddPersonDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleAddPerson}
      />
    </Box>
  );
}
