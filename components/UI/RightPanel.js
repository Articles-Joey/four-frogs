"use client";
import Box from "@mui/material/Box";
import { panelContentSx } from "@/components/UI/panelStyles";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BugReportIcon from "@mui/icons-material/BugReport";
import BugReportOutlinedIcon from "@mui/icons-material/BugReportOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArticlesButton from "@/components/UI/Button";

// import ROUTES from 'components/constants/routes';
import ViewUserModal from "@/components/UI/ViewUserModal";
import { useSocketStore } from "@/hooks/useSocketStore";
import { memo } from "react";
// import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
// import powerups from "../powerups";
import { useStore } from "@/hooks/useStore";
import { useGameStore } from "@/hooks/useGameStore";

// const InviteModal = dynamic(
//     () => import('@/components/UI/InviteModal'),
//     { ssr: false }
// )

const RightPanelContent = ({ mobile = false }) => {

    const searchParams = useSearchParams()
    const searchParamsObject = Object.fromEntries(searchParams.entries());
    const { server, server_type } = searchParamsObject

    // const {
    //     gameState,
    //     players,
    //     bugs,
    //     debugTab,
    //     setDebugTab,
    //     devDebugPanel,
    //     setDevDebugPanel
    // } = props;

    const gameState = useGameStore((state) => state.gameState);
    const players = useGameStore((state) => state.gameState.players);
    const bugs = useGameStore((state) => state.gameState.bugs);

    // const {
    //     // gameState,
    //     // players,
    //     // bugs,
    //     // debugTab,
    //     // setDebugTab,
    //     // devDebugPanel,
    //     // setDevDebugPanel
    // } = {
    //     gameState: {
    //         status: null,
    //         insectTrack: [],
    //         powerups: [],
    //     },
    //     bugs: [],
    //     players: [],
    //     // debugTab: 'Players',
    // };

    const debug = useStore((state) => state.debug);
    const debugTab = useStore((state) => state.debugTab);
    const setDebugTab = useStore((state) => state.setDebugTab);
    const devDebugPanel = useStore((state) => state.devDebugPanel);
    const setDevDebugPanel = useStore((state) => state.setDevDebugPanel);

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    // const [showInviteModal, setShowInviteModal] = useState(false)
    // const showInfoModal = useStore((state) => state.showInfoModal);

    const showInviteModal = useStore((state) => state.showInviteModal);
    const setShowInviteModal = useStore((state) => state.setShowInviteModal);

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false

    // const params = useParams()
    // const room = params?.room

    if (!debug && process.env.NODE_ENV !== 'development') return null;

    return (
        <Box>

            

            <Box sx={mobile ? { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "5px", fontSize: "0.75rem" } : {}}>
                {[
                    {
                        player_key: 'Red',
                    },
                    {
                        player_key: 'Blue',
                    },
                    {
                        player_key: 'Green',
                    },
                    {
                        player_key: 'Yellow',
                    }
                ].map((item, player_index) => {

                    let player_lookup = players?.find(player => player.fourFrogs.homeZone == item.player_key.toLowerCase())

                    const numberOfIcons = Math.ceil(player_lookup?.fourFrogs?.health / 20);

                    let numberOfBugIcons

                    if (gameState?.insectTrack?.length > 0) numberOfBugIcons = gameState?.insectTrack[player_index].length;

                    return (
                        <Box
                            key={item.player_key}
                            sx={{ ...panelContentSx, mb: "0" }}
                        >

                            <Box component="h5"
                                sx={{ mt: 0, mb: 0, mr: "0.5rem", fontSize: "1.25rem", fontWeight: 500, lineHeight: 1.2 }}
                                onClick={() => {
                                    console.log(player_lookup)
                                }}
                            >
                                {item.player_key}
                            </Box>

                            {player_lookup ?
                                <Box sx={{ mb: "0.25rem", display: "flex", flexDirection: "column" }}>

                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Box component="span" sx={{ border: "1px solid #000", borderRadius: "0.25rem" }}>
                                            <ViewUserModal
                                                user_id={player_lookup.user_id}
                                                dangerousPopulate={true}
                                            />
                                        </Box>
                                        <ArticlesButton
                                            small
                                            onClick={() => {

                                            }}
                                            variant='danger'
                                            disabled={userReduxState?._id == player_lookup.user_id}
                                        >
                                            <CloseIcon  sx={{ fontSize: "1em", mr: "0", verticalAlign: "middle" }} />
                                        </ArticlesButton>
                                    </Box>
                                </Box>
                                :
                                <Box>
                                    <ArticlesButton
                                        small
                                        onClick={() => {
                                            setShowInviteModal({
                                                type: 'Game',
                                                game_name: 'Four Frogs',
                                                server_id: server
                                            })
                                        }}
                                    >
                                        Invite Player
                                    </ArticlesButton>
                                    <ArticlesButton
                                        small
                                        onClick={() => {
                                            socket.emit('game:four-frogs:add-bot', {
                                                server: 1,
                                                player_key: item.player_key
                                            });
                                        }}
                                    >
                                        Add Bot
                                    </ArticlesButton>
                                </Box>
                            }

                            <Box>

                                {numberOfIcons > 0 && [...Array(numberOfIcons)].map((bug_type, i) => {
                                    return (
                                        <FavoriteIcon key={i}  sx={{ fontSize: "1em", mr: "0.2rem", verticalAlign: "middle", color: "red" }} />
                                    )
                                })
                                }

                                {gameState?.insectTrack?.length && [
                                    ...Array(
                                        5
                                        -
                                        (numberOfIcons || 0)
                                    )
                                ].map((bug_type, i) => {
                                    return (
                                        <FavoriteBorderIcon key={i}  sx={{ fontSize: "1em", mr: "0.2rem", verticalAlign: "middle" }} />
                                    )
                                })}

                                

                            </Box>

                            <Box>

                                {gameState?.insectTrack?.length > 0 && gameState.insectTrack[player_index].map((bug_type, i) => {
                                    return (
                                        <BugReportIcon key={i}  sx={{ fontSize: "1em", mr: "0.2rem", verticalAlign: "middle", color: "green" }} />
                                    )
                                })}

                                {(numberOfBugIcons < 3) && [
                                    ...Array(
                                        3
                                        -
                                        numberOfBugIcons || 0
                                    )
                                ].map((bug_type, i) => {
                                    return (
                                        <BugReportOutlinedIcon key={i}  sx={{ fontSize: "1em", mr: "0.2rem", verticalAlign: "middle" }} />
                                    )
                                })}

                                
                                
                            </Box>

                        </Box>
                    )
                })}
            </Box>

            <Box
                sx={{ ...panelContentSx, p: 0, display: mobile ? "none" : "block" }}
            >

                <Box sx={{ borderBottom: "1px solid #212529", display: "flex", justifyContent: "space-between" }}>

                    <Box sx={{ display: "flex" }}>
                        {['Players', 'Bugs', 'Powerups'].map(item =>
                            <ArticlesButton
                                key={item}
                                small
                                active={item == debugTab}
                                onClick={() => {
                                    setDebugTab(item)
                                }}
                            >
                                {item}
                            </ArticlesButton>
                        )}
                    </Box>

                    <Box>
                        <ArticlesButton
                            small
                            active={devDebugPanel}
                            onClick={() => {
                                setDevDebugPanel(!devDebugPanel)
                            }}
                        >
                            {devDebugPanel ?
                                <VisibilityOffIcon  sx={{ fontSize: "1em", mr: "0", verticalAlign: "middle" }} />
                                :
                                <VisibilityIcon  sx={{ fontSize: "1em", mr: "0", verticalAlign: "middle" }} />
                            }
                        </ArticlesButton>
                    </Box>

                </Box>

                <Box>
                    {devDebugPanel &&
                        <Box
                            sx={{ p: "0.5rem", maxHeight: "400px", overflowY: "auto" }}
                        >
                            {
                                debugTab == 'Players' &&
                                <Box sx={{ fontSize: "0.875em" }}>
                                    <pre>
                                        {JSON.stringify(players, null, 2)}
                                    </pre>
                                </Box>
                            }

                            {
                                debugTab == 'Bugs' &&
                                <Box sx={{ fontSize: "0.875em" }}>
                                    <pre>
                                        {JSON.stringify(bugs, null, 2)}
                                    </pre>
                                </Box>
                            }

                            {
                                debugTab == 'Powerups' &&
                                <Box sx={{ fontSize: "0.875em" }}>
                                    <pre>
                                        {JSON.stringify(gameState.powerups, null, 2)}
                                    </pre>
                                </Box>
                            }
                        </Box>
                    }
                </Box>

            </Box>

        </Box>
    )
}

export default memo(RightPanelContent)
