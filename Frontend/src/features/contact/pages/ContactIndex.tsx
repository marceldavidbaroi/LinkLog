import { useEffect, useState } from "react";
import { useContact } from "../hooks/contactAuth";
import useContactStore from "../store/contactStore";
import { Box, Paper } from "@mui/material";
import AddContactDialog from "../components/AddContactDialog";
import ContactList from "../components/ContactList";
import type { Person } from "../types/contact.type";
import DeleteDialog from "../../../components/DeleteDialog";

const ContactIndex = () => {
  const { getAll, create, update, remove } = useContact();
  const contactStore = useContactStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAll(); // fetch all contacts on mount
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = async (data: Partial<Person>) => {
    await create(data); // errors handled inside the hook/store
  };

  const updateContact = async (data: Partial<Person>) => {
    if (!data.id) return;

    const payload: Partial<Person> = {
      email: data.email ?? "",
      emergency_contact: data.emergency_contact ?? "",
      first_name: data.first_name ?? "",
      last_name: data.last_name ?? "",
      notes: data.notes ?? "",
      phone: data.phone ?? "",
      address: data.address ?? "",
      birthday: data.birthday ?? null,
    };

    await update(data.id, payload); // errors handled in hook/store
  };

  // const deleteContact = async (id: number) => {
  //   if (!id) return;
  //   await remove(id); // errors handled in hook/store
  // };

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setDeleteOpen(true);
  };

  const handleCancel = () => setDeleteOpen(false);

  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      await remove(selectedId); // errors handled in hook/store
    }
    setDeleteOpen(false);
  };
  return (
    <Box component={Paper} elevation={0} className="p-6 flex-1 flex flex-col">
      <ContactList
        contactList={contactStore.contactList}
        onAddContact={handleOpen}
        onEditSubmit={updateContact}
        onDelete={handleDeleteClick}
      />

      <AddContactDialog open={open} onClose={handleClose} onSave={handleSave} />
      <DeleteDialog
        open={deleteOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default ContactIndex;
