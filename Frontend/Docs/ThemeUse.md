Absolutely! Here’s a polished, professional Markdown document for your team, with **summary first**, **examples**, and then detailed explanation of **when to use theme colors directly** vs **when to pick properties**.

---

````markdown
# MUI Theme Usage Guide

## **Summary: How to Use Theme Colors**

MUI provides a centralized `theme` system for consistent styling. Use the theme to ensure colors adapt to light/dark modes and custom themes.

**Key Points:**

- Components with a `color` prop (like `AppBar`, `Button`, `IconButton`) can use `primary`, `secondary`, `error`, etc., **directly**.
- CSS properties (`sx`) require **string color values** from the theme (e.g., `theme.palette.primary.main`, `theme.palette.background.paper`).
- Theme objects contain multiple properties — always pick the appropriate string property.

**Quick Examples:**

```ts
// Using "color" prop directly
<AppBar color="primary">App Bar</AppBar>
<Button color="secondary">Click Me</Button>
<IconButton color="error"><DeleteIcon /></IconButton>

// Using theme in sx
<Box sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}>
  Content
</Box>
<Paper sx={{ border: 1, borderColor: theme.palette.primary.main }}>Panel</Paper>
<Typography sx={{ color: theme.palette.text.secondary }}>Subtitle</Typography>
```
````

---

## **1. Theme Color Structure**

```ts
theme.palette = {
  primary: {
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    contrastText: "#fff",
  },
  secondary: {
    main: "#9c27b0",
    light: "#ba68c8",
    dark: "#7b1fa2",
    contrastText: "#fff",
  },
  error: { main: "#d32f2f" },
  warning: { main: "#ed6c02" },
  info: { main: "#0288d1" },
  success: { main: "#2e7d32" },
  background: { default: "#fff", paper: "#f5f5f5" },
  text: { primary: "#000", secondary: "#666" },
};
```

**Important:** Some palette entries are objects (primary, secondary), some are strings (error.main). Always use the correct property for CSS.

---

## **2. When to Use Theme Colors Directly**

Components that have a **`color` prop** (MUI handles the mapping automatically):

- `AppBar color="primary"` ✅
- `Button color="secondary"` ✅
- `IconButton color="error"` ✅
- `TextField color="primary"` ✅

No need to use `theme.palette` in these cases.

---

## **3. Using Theme Colors in `sx`**

For `sx` props, **always pick a string value**, not the entire object:

```ts
<Box sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }} />
<Paper sx={{ border: 1, borderColor: theme.palette.primary.main }} />
<IconButton sx={{ color: theme.palette.error.main }} />
<Typography sx={{ color: theme.palette.text.secondary }}>Subtitle</Typography>
```

**Common Mistakes:**

| Mistake                                 | Why It Fails              | Correct Usage                                 |
| --------------------------------------- | ------------------------- | --------------------------------------------- |
| `borderColor: theme.palette.background` | `background` is an object | `borderColor: theme.palette.background.paper` |
| `bgcolor: theme.palette.primary`        | `primary` is an object    | `bgcolor: theme.palette.primary.main`         |

---

## **4. Theme Colors for Borders, Backgrounds, Text**

- **Borders:** `borderColor: theme.palette.primary.main` or `error.main`
- **Backgrounds:** `bgcolor: theme.palette.background.paper` or `background.default`
- **Text:** `color: theme.palette.text.primary` or `text.secondary`

```ts
<Paper sx={{ border: 1, borderColor: theme.palette.primary.main, bgcolor: theme.palette.background.paper }}>
  Panel Content
</Paper>
<Typography sx={{ color: theme.palette.text.secondary }}>Secondary text</Typography>
```

---

## **5. Handling Light/Dark Modes**

Always reference the theme instead of hardcoding colors:

```ts
<Box
  sx={{
    bgcolor: theme.palette.background.default,
    color: theme.palette.text.primary,
  }}
>
  Page Content adapts to theme
</Box>
```

This ensures your app adapts to theme changes dynamically.

---

## **6. Best Practices**

1. **Wrap your app in a ThemeProvider**:

```ts
<ThemeProvider>
  <App />
</ThemeProvider>
```

2. **Use `useTheme()` hook** for functional components.
3. **Use `.main`, `.contrastText`, `.paper`, `.default`** when referencing colors in `sx`.
4. **Use direct `color` props** whenever the component supports it.
5. **Avoid hardcoding color strings**; always reference the theme.
6. **For borders and outlines**, always pick string properties, not objects.

---

## **7. Summary Table**

| Component / Prop               | How to Use Theme Color                         | Example                                                                               |
| ------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| AppBar                         | Directly via `color` prop                      | `<AppBar color="primary" />`                                                          |
| Button                         | Directly via `color` prop                      | `<Button color="secondary" />`                                                        |
| IconButton                     | Directly via `color` prop                      | `<IconButton color="error" />`                                                        |
| Box / Paper / Typography / div | Use `sx` with string property                  | `sx={{ bgcolor: theme.palette.background.paper, color: theme.palette.text.primary }}` |
| Border                         | Use specific string                            | `sx={{ border: 1, borderColor: theme.palette.primary.main }}`                         |
| Text                           | Use `text.primary` or `text.secondary`         | `sx={{ color: theme.palette.text.secondary }}`                                        |
| Background                     | Use `background.paper` or `background.default` | `sx={{ bgcolor: theme.palette.background.default }}`                                  |

---

This ensures **consistency** and **theme adaptability** throughout the project.

```

---

If you want, I can **also create a one-page visual cheat sheet** of the **theme palette → how to use for CSS, borders, text, and MUI components**. This is very handy for developers referencing quickly.

Do you want me to make that cheat sheet?
```
