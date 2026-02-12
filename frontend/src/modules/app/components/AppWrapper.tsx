import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { app } from "../main";

//Little theme
const theme = createTheme({
    palette: {
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
    },
});

export const AppWrapper: React.FC<{ children: React.ReactNode }> =
    ({ children }) => {
        return (
            <Provider store={app.store}>
                <ThemeProvider theme={theme}>
                    {children}
                </ThemeProvider>
            </Provider>
        );
    };