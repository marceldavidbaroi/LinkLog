import { useEffect, useState } from "react";
import { useContact } from "../hooks/contactAuth";
import useContactStore from "../store/contactStore";
import { Box, Paper } from "@mui/material";
import ThemeSelector from "../../../components/ThemeSelector";
import AddPersonDialog from "../components/AddPersonDialog";
import ContactList from "../components/ContactList";

const ContactIndex = () => {
  const { getAll } = useContact();
  const contactStore = useContactStore();
  const [contacts, setContacts] = useState([]);
  const getAllContacts = async () => {
    await getAll();
  };

  useEffect(() => {
    const response = getAllContacts();
    console.log("test for the store ", contactStore.contactList);
  }, []);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = (personName: string, notes: string) => {
    console.log("Saved person:", personName, notes);
    // Add to your store or call API here
  };

  return (
    <>
      <Box component={Paper} elevation={0} className=" min-h-screen p-6 ">
        <ContactList
          contactList={contactStore.contactList}
          onAddContact={() => {
            console.log("Add contact clicked!");
          }}
          onEditSubmit={(updated) => console.log("Updated contact", updated)}
          onDelete={(person) => console.log("Delete contact", person)}
        />
        <button onClick={handleOpen}>Add Person</button>
        <AddPersonDialog
          open={open}
          onClose={handleClose}
          onSave={handleSave}
        />
      </Box>
    </>
  );
};

export default ContactIndex;
