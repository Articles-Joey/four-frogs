"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import useUserDetails from "@articles-media/articles-dev-box/useUserDetails";
import useUserToken from "@articles-media/articles-dev-box/useUserToken";

export default function IsDev({ className, noOutline, children, inline }) {
    const { data: userToken } = useUserToken(process.env.NEXT_PUBLIC_GAME_PORT);
    const { data: userDetails } = useUserDetails({ token: userToken });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!children || !userDetails?.roles?.isDev || !isMounted) return null;

    return (
        <Box
            className={['is-dev-content', noOutline ? 'no-outline' : '', className || ''].filter(Boolean).join(' ')}
            sx={{ display: inline ? "inline-block" : "block" }}
        >
            {children}
        </Box>
    );
}
