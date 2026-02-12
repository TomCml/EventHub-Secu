import { CssBaseline, Toolbar, Typography, Container } from "@mui/material";

export const Layout: React.FC <{children: React.ReactNode}> = ({children}) => {

    return (
        <>
            <CssBaseline />
            <Toolbar sx={({borderBottom: 1, borderBottomColor: 'divider'})}>
                <Typography variant="h3" noWrap component="div" sx={({flexGrow: 1})}>
                    EventHub
                </Typography>
            </Toolbar>
            <Container maxWidth="lg" sx={({ mt: 2})}>
                {children}
            </Container>
        </>
    )
}