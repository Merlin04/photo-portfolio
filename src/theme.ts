import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: "#aec1bf",
            light: "#e0f4f2",
            dark: "#7f918f",
        },
        secondary: {
            main: "#aeb0c2",
            light: "#e0e2f5",
            dark: "#7f8192",
        },
        background: {
            // default: "#e1e2e1",
            // paper: "#e1e2e1",
            default: "#e0e0e0",
            paper: "#e0e0e0"
        },
    },
    typography: {
        fontFamily: '"NeueBit Regular", sans-serif',
        fontSize: 16,
        h1: {
            fontFamily: '"Mondwest Bold", serif',
        },
        h2: {
            fontFamily: '"Mondwest Regular", serif',
        },
        h3: {
            fontFamily: '"NeueBit Bold", sans-serif',
        },
        h4: {
            fontFamily: '"NeueBit Bold", sans-serif',
        },
        h5: {
            fontFamily: '"NeueBit Regular", sans-serif',
        },
        h6: {
            fontFamily: '"NeueBit Regular", sans-serif',
        },
        body1: {
            fontSize: 24
        }
    },
    shape: {
        borderRadius: 0,
    }
});

export default theme;
