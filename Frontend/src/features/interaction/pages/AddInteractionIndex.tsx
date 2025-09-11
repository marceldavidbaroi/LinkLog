import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Paper,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useInteraction } from "../hooks/interactionAuth";
import type {
  Interaction,
  MoodType,
  InteractionTag,
} from "../types/interaction.type";

const moods: MoodType[] = ["happy", "excited", "neutral", "sad", "angry"];
const tags: InteractionTag[] = [
  "work",
  "personal",
  "friendship",
  "romance",
  "networking",
  "family",
  "other",
];

const AddInteractionIndex = () => {
  const navigate = useNavigate();
  const { create } = useInteraction();
  const [interactionData, setInteractionData] = useState<Partial<Interaction>>({
    title: "",
    description: "",
    date: "",
    mood: undefined,
    tags: [],
    context: "",
    medium: "",
    duration_minutes: undefined,
    location: "",
    energy_level: undefined,
    person_mood: "",
    gratitude_level: undefined,
    reflection: "",
    takeaways: "",
    memorable_quote: "",
    fun_factor: undefined,
    novelty_flag: false,
    mystery_flag: false,
    reminder_at: "",
    highlight: "",
    attachments: [],
    person: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof Interaction, value: any) => {
    setInteractionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !interactionData.title ||
      !interactionData.description ||
      !interactionData.date
    ) {
      setError("Title, description, and date are required");
      return;
    }

    if (
      (interactionData.fun_factor && interactionData.fun_factor > 10) ||
      (interactionData.energy_level && interactionData.energy_level > 10) ||
      (interactionData.gratitude_level && interactionData.gratitude_level > 10)
    ) {
      setError("Fun factor, Energy level and Gratitude must not exceed 10");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await create(interactionData);
      navigate("/interactions");
    } catch (err: any) {
      setError(err.message || "Failed to create interaction");
    } finally {
      setLoading(false);
    }
  };

  const sectionPaperProps = {
    sx: { p: 3, mb: 3, borderRadius: 3, boxShadow: 3 },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 900, mx: "auto" }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Create Interaction
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }} textAlign="center">
            {error}
          </Typography>
        )}

        {/* Basic Info */}
        <Paper {...sectionPaperProps}>
          <Typography variant="h6" gutterBottom>
            Basic Info
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                value={interactionData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Person ID"
                type="number"
                value={interactionData.person || ""}
                onChange={(e) => handleChange("person", Number(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={interactionData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                fullWidth
                multiline
                minRows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date"
                value={
                  interactionData.date ? new Date(interactionData.date) : null
                }
                onChange={(date) =>
                  handleChange(
                    "date",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Reminder At"
                value={
                  interactionData.reminder_at
                    ? new Date(interactionData.reminder_at)
                    : null
                }
                onChange={(date) =>
                  handleChange(
                    "reminder_at",
                    date ? date.toISOString().split("T")[0] : ""
                  )
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Context & Mood */}
        <Paper {...sectionPaperProps}>
          <Typography variant="h6" gutterBottom>
            Context & Mood
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Mood"
                value={interactionData.mood || ""}
                onChange={(e) => handleChange("mood", e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {moods.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Tag"
                value={interactionData.tags?.[0] || ""}
                onChange={(e) =>
                  handleChange("tags", e.target.value ? [e.target.value] : [])
                }
                fullWidth
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {tags.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Location"
                value={interactionData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Medium"
                value={interactionData.medium || ""}
                onChange={(e) => handleChange("medium", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Duration (minutes)"
                type="number"
                value={interactionData.duration_minutes || ""}
                onChange={(e) =>
                  handleChange("duration_minutes", Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Emotional & Reflection */}
        <Paper {...sectionPaperProps}>
          <Typography variant="h6" gutterBottom>
            Emotional & Reflection
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Energy Level (1-10)"
                type="number"
                inputProps={{ min: 0, max: 10 }}
                value={interactionData.energy_level || ""}
                onChange={(e) =>
                  handleChange(
                    "energy_level",
                    Math.min(Number(e.target.value) || 0, 10)
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Fun Factor (1-10)"
                type="number"
                inputProps={{ min: 0, max: 10 }}
                value={interactionData.fun_factor || ""}
                onChange={(e) =>
                  handleChange(
                    "fun_factor",
                    Math.min(Number(e.target.value) || 0, 10)
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Gratitude Level (1-10)"
                type="number"
                inputProps={{ min: 0, max: 10 }}
                value={interactionData.gratitude_level || ""}
                onChange={(e) =>
                  handleChange(
                    "gratitude_level",
                    Math.min(Number(e.target.value) || 0, 10)
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Person Mood"
                value={interactionData.person_mood || ""}
                onChange={(e) => handleChange("person_mood", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Reflection"
                value={interactionData.reflection || ""}
                onChange={(e) => handleChange("reflection", e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Takeaways"
                value={interactionData.takeaways || ""}
                onChange={(e) => handleChange("takeaways", e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Memorable Quote"
                value={interactionData.memorable_quote || ""}
                onChange={(e) =>
                  handleChange("memorable_quote", e.target.value)
                }
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Tracking & Flags */}
        <Paper {...sectionPaperProps}>
          <Typography variant="h6" gutterBottom>
            Tracking & Flags
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Highlight"
                value={interactionData.highlight || ""}
                onChange={(e) => handleChange("highlight", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={interactionData.novelty_flag || false}
                    onChange={(e) =>
                      handleChange("novelty_flag", e.target.checked)
                    }
                  />
                }
                label="Novelty"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={interactionData.mystery_flag || false}
                    onChange={(e) =>
                      handleChange("mystery_flag", e.target.checked)
                    }
                  />
                }
                label="Mystery"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Submit Button */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : "Create Interaction"}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AddInteractionIndex;
