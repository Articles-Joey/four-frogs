import ArticlesButton from "@/components/UI/Button";
import IsDev from "@/components/UI/IsDev";

// import ROUTES from 'components/constants/routes';
import ViewUserModal from "@/components/UI/ViewUserModal";
import { useSocketStore } from "@/hooks/useSocketStore";
import dynamic from "next/dynamic";
import { useState } from "react";
// import { useSelector } from "react-redux";
import { useParams } from "next/navigation";

const InviteModal = dynamic(
    () => import('@/components/UI/InviteModal'),
    { ssr: false }
)

const RightPanelContent = (props) => {

    const {
        gameState,
        players,
        bugs,
        debugTab,
        setDebugTab,
        devDebugPanel,
        setDevDebugPanel
    } = props;

    const {
        socket,
    } = useSocketStore(state => ({
        socket: state.socket,
    }));

    const [showInviteModal, setShowInviteModal] = useState(false)

    // const userReduxState = useSelector((state) => state.auth.user_details)
    const userReduxState = false

    const params = useParams()
    const room = params?.room

    return (
        <div>

            {showInviteModal &&
                <InviteModal
                    show={showInviteModal}
                    setShow={setShowInviteModal}
                />
            }

            <div className="players-info-wrap">
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

                    let player_lookup = players.find(player => player.fourFrogs.homeZone == item.player_key.toLowerCase())

                    const numberOfIcons = Math.ceil(player_lookup?.fourFrogs?.health / 20);

                    let numberOfBugIcons

                    if (gameState?.insectTrack?.length > 0) numberOfBugIcons = gameState?.insectTrack[player_index].length;

                    return (
                        <div
                            key={item.player_key}
                            className="panel-content-group mb-0"
                        >

                            <h5
                                className="mb-0 me-2"
                                onClick={() => {
                                    console.log(player_lookup)
                                }}
                            >
                                {item.player_key}
                            </h5>

                            {player_lookup ?
                                <div className='mb-1 d-flex flex-column'>

                                    <div className="d-flex align-items-center">
                                        <span className="border rounded-1">
                                            <ViewUserModal
                                                user_id={player_lookup.user_id}
                                                dangerousPopulate={true}
                                            />
                                        </span>
                                        <ArticlesButton
                                            small
                                            onClick={() => {

                                            }}
                                            variant='danger'
                                            disabled={userReduxState?._id == player_lookup.user_id}
                                        >
                                            <i className="fad fa-times me-0"></i>
                                        </ArticlesButton>
                                    </div>
                                </div>
                                :
                                <div>
                                    <ArticlesButton
                                        small
                                        onClick={() => {
                                            setShowInviteModal({
                                                type: 'Game',
                                                game_name: 'Four Frogs',
                                                server_id: room
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
                                </div>
                            }

                            <div>

                                {numberOfIcons > 0 && [...Array(numberOfIcons)].map((bug_type, i) => {
                                    return (
                                        <i key={i} className="fas fa-heart heart-icon enabled"></i>
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
                                        <i key={i} className="fal fa-heart"></i>
                                    )
                                })}

                                {/* <i className="fas fa-heart heart-icon enabled"></i>
                            <i className="fas fa-heart heart-icon enabled"></i>
                            <i className="fal fa-heart"></i>
                            <i className="fal fa-heart"></i>
                            <i className="fal fa-heart"></i> */}

                            </div>

                            <div>

                                {gameState?.insectTrack?.length > 0 && gameState.insectTrack[player_index].map((bug_type, i) => {
                                    return (
                                        <i key={i} className="fas fa-bug bug-icon enabled"></i>
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
                                        <i key={i} className="fal fa-bug"></i>
                                    )
                                })}

                                {/* <i className="fas fa-bug bug-icon enabled"></i>
                            <i className="fas fa-bug bug-icon enabled"></i>
                            <i className="fas fa-bug bug-icon enabled"></i> */}
                                {/* <i className="fal fa-bug"></i>
                            <i className="fal fa-bug"></i> */}
                            </div>

                        </div>
                    )
                })}
            </div>

            <div
                className="debug-stuff panel-content-group p-0"
            >

                <div className="debug-tabs-wrap border-bottom border-dark d-flex justify-content-between">

                    <div className='d-flex'>
                        {['Players', 'Bugs', 'Powerups'].map(item =>
                            <ArticlesButton
                                key={item}
                                small
                                className={``}
                                active={item == debugTab}
                                onClick={() => {
                                    setDebugTab(item)
                                }}
                            >
                                {item}
                            </ArticlesButton>
                        )}
                    </div>

                    <div>
                        <ArticlesButton
                            small
                            active={devDebugPanel}
                            onClick={() => {
                                setDevDebugPanel(prev => !prev)
                            }}
                        >
                            {devDebugPanel ?
                                <i className="fad fa-eye-slash me-0"></i>
                                :
                                <i className="fad fa-eye me-0"></i>
                            }
                        </ArticlesButton>
                    </div>

                </div>

                <IsDev>
                    {devDebugPanel &&
                        <div
                            className='p-2'
                            style={{ maxHeight: '400px', 'overflowY': 'auto' }}
                        >
                            {
                                debugTab == 'Players' &&
                                <div className='small'>
                                    <pre>
                                        {JSON.stringify(players, null, 2)}
                                    </pre>
                                </div>
                            }

                            {
                                debugTab == 'Bugs' &&
                                <div className='small'>
                                    <pre>
                                        {JSON.stringify(bugs, null, 2)}
                                    </pre>
                                </div>
                            }

                            {
                                debugTab == 'Powerups' &&
                                <div className='small'>
                                    <pre>
                                        {JSON.stringify(gameState.powerups, null, 2)}
                                    </pre>
                                </div>
                            }
                        </div>
                    }
                </IsDev>

            </div>

        </div>
    )
}

export default RightPanelContent