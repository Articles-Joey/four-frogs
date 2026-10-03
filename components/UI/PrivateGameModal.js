"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import powerups from "@/components/constants/powerups";
import ArticlesModal from "./ArticlesModal";
import ArticlesSwitch from "./ArticlesSwitch";
import ArticlesButton from "./Button";

export default function PrivateGameModal({ show, setShow }) {
    const [action, setAction] = useState("");
    const [room, setRoom] = useState("");
    const [powerupSettings, setPowerupSettings] = useState(() => powerups.map((powerup) => ({ ...powerup, enabled: true })));

    return (
        <ArticlesModal
            title="Private Game Settings"
            show={show}
            setShow={setShow}
            footerOverride={(setOpen) => (
                <>
                    <ArticlesButton variant="outline-dark" onClick={() => setOpen(false)}>Close</ArticlesButton>
                    <ArticlesButton variant="success" onClick={() => {}} disabled={room.length < 3}>Join</ArticlesButton>
                </>
            )}
        >
            <Box sx={{ display: "flex" }}>
                <ArticlesButton sx={{ width: "50%" }} active={action === "Join"} onClick={() => setAction("Join")}>
                    Join Private Game
                </ArticlesButton>
                <ArticlesButton sx={{ width: "50%" }} active={action === "Start"} onClick={() => setAction("Start")}>
                    Start Private Game
                </ArticlesButton>
            </Box>
            {action && (
                <Box sx={{ mt: "0.5rem" }}>
                    <Divider sx={{ my: "1rem" }} />
                    <Typography sx={{ mb: "0.5rem" }}>{action} Options</Typography>
                    <TextField
                        id="room-code"
                        label="Room Code"
                        fullWidth
                        size="small"
                        value={room}
                        onChange={(event) => setRoom(event.target.value)}
                        helperText="At least 3 characters. Only letters, numbers, underscores (_), and dashes (-) can be used"
                    />
                </Box>
            )}
            {action === "Start" && (
                <Box sx={{ mt: "0.5rem" }}>
                    <Typography sx={{ mb: "0.5rem" }}>Powerups</Typography>
                    {powerupSettings.map((powerup) => (
                        <Box
                            key={powerup.title}
                            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: "0.5rem", pb: "0.5rem", borderBottom: 1, borderColor: "divider" }}
                        >
                            <Box sx={{ display: "flex" }}>
                                <Box sx={{ position: "relative", width: "30px", height: "30px", aspectRatio: "1", bgcolor: "#212529", flexShrink: 0 }} />
                                <Box sx={{ fontSize: "0.875em", ml: "0.5rem", lineHeight: 1.25 }}>
                                    <Box>{powerup.title}</Box>
                                    <Box sx={{ fontSize: "0.875em" }}>{powerup.description}</Box>
                                </Box>
                            </Box>
                            <ArticlesSwitch
                                slotProps={{ input: { "aria-label": powerup.title } }}
                                checked={powerup.enabled}
                                setChecked={(enabled) => setPowerupSettings((previous) => previous.map((item) => item.title === powerup.title ? { ...item, enabled } : item))}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </ArticlesModal>
    );
}
