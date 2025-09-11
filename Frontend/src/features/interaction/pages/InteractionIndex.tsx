import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { useInteraction } from "../hooks/interactionAuth";
import useInteractionStore from "../store/interactionStore";

const InteractionIndexPage = () => {
  const { getAll } = useInteraction();
  const { interactionList, loading, error } = useInteractionStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAll();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Interactions</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/interactions/create")}
        >
          Create Interaction
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      {interactionList.length === 0 && !loading && (
        <Typography>No interactions found.</Typography>
      )}

      {interactionList.map((interaction) => (
        <Paper
          key={interaction.id}
          sx={{ p: 3, mb: 2, borderRadius: 2, boxShadow: 1 }}
        >
          <Typography variant="h6">{interaction.title}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {interaction.description}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default InteractionIndexPage;
