"use client";

import DevBoxButton from "@articles-media/articles-dev-box/Button";

// Keep the game's peach buttons while sharing dev-box's MUI button behavior.
export const gameButtonSx = {
    boxShadow: "0 0 0 1px rgba(0,0,0,0.25), 0 2px 3px rgba(0,0,0,0.2)",
    bgcolor: "rgb(255,218,185)",
    color: "#000",
    borderBottom: "2px solid rgb(129,77,35)",
    opacity: 1,
    transition: "opacity 0.2s ease-in-out",
    "&:hover": { bgcolor: "rgb(255,218,185)", color: "#000", opacity: 0.75 },
    "&.Mui-disabled": { bgcolor: "rgb(255,218,185)", color: "#000", opacity: 0.75, cursor: "not-allowed" },
};

export default function ArticlesButton({ variant, sx, ...props }) {
    const gameVariant = variant === "four-frogs-primary";

    return (
        <DevBoxButton
            {...props}
            variant={gameVariant ? "articles" : variant}
            sx={[
                ...(gameVariant ? [gameButtonSx] : []),
                ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
            ]}
        />
    );
}
