import React from "react";
import AppBar from "../AppBar/AppBar";
import { ReactNode } from "react";
import { AbsoluteCenter, Box, Container } from "@chakra-ui/react";
 
type Props = { 
    children?: JSX.Element
}
//Define a layout component that wraps the entire app and renders the AppBar component.
export const Layout = ({children}:Props) => {
    return (
        <>
        <div>
        <AppBar />
        </div>
        <main>
            <Box className="App">
                {children}
            </Box>
        </main>
        </>
    );
    };
