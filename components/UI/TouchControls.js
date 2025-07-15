import { memo, useEffect, useState } from "react";

import ArticlesButton from "@/components/UI/Button"
// import { useControlsStore, useGameStore } from "../hooks/useGameStore"
import { useTouchControlsStore } from "@/hooks/useTouchControlsStore";

const arePropsEqual = (prevProps, nextProps) => {
    // Compare all props for equality
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};

function TouchControlsBase(props) {

    const {
        touchControlsEnabled,
    } = props;

    const [nippleCreated, setNippleCreated] = useState(false)

    const [nStart, setnStart] = useState(false)
    const [nDirection, setnDirection] = useState(false)

    const {
        touchControls, setTouchControls
    } = useTouchControlsStore()

    function startNipple() {

        // console.log("n", nipplejs)

        // return

        var options = {
            zone: document.getElementById('zone_joystick'),
            // lockX: true,
        };

        // var manager = nipplejs.create(options);
        var manager = require('nipplejs').create(options);

        setNippleCreated(true)

        manager.on('start end', function (evt, data) {
            // dump(evt.type);
            // debug(data);
            console.log("1", evt.type)

            if (evt.type == 'start') {
                setnStart(true)
            } else if (evt.type == 'end') {
                setnStart(false)
                setnDirection(false)
                setTouchControls({
                    ...touchControls,
                    left: false,
                    right: false
                })
            }

        }).on('move', function (evt, data) {

            // debug(data);
            // console.log("2", data)

        }).on('dir:up plain:up dir:left plain:left dir:down ' +
            'plain:down dir:right plain:right',
            function (evt, data) {
                // dump(evt.type);
                console.log("3", evt.type)

                if (evt.type == 'dir:left') {
                    setnDirection('left')
                    setTouchControls({
                        ...touchControls,
                        left: true,
                        right: false
                    })
                }

                if (evt.type == 'dir:right') {
                    setnDirection('right')
                    setTouchControls({
                        ...touchControls,
                        left: false,
                        right: true
                    })
                }

            }
        ).on('pressure', function (evt, data) {
            // debug({
            //   pressure: data
            // });
        });
    }

    useEffect(() => {

        if (!nippleCreated) {
            console.log("Load nipple")
            startNipple()
        }

    }, []);

    return (
        <div className={`touch-controls-area ${!touchControlsEnabled && 'd-none'}`}>

            <div className='d-flex'>

                <div>
                    {/* <ArticlesButton
                    onClick={() => {
                        setTouchControls({
                            left: true
                        })
                    }}
                >
                    Left
                </ArticlesButton>
                <ArticlesButton
                    onClick={() => {
                        setTouchControls({
                            right: true
                        })
                    }}
                >
                    Right
                </ArticlesButton> */}
                    <div style={{
                        position: 'relative',
                        width: '100px',
                        height: '100px',
                        backgroundColor: 'black'
                    }} id="zone_joystick"></div>
                </div>

                <div className='ms-2 d-none d-lg-block'>
                    <div>Active: {nStart ? 'True' : 'False'}</div>
                    <div>Direction: {nDirection ? nDirection : 'None'}</div>
                    <div>Touch: {JSON.stringify(touchControls)}</div>
                </div>

            </div>

            <ArticlesButton
                onClick={() => {
                    console.log("Jump!")
                    setTouchControls({
                        ...touchControls,
                        jump: true
                    })
                }}
            >
                Drop
            </ArticlesButton>

        </div>
    )
}

const TouchControls = memo(TouchControlsBase, arePropsEqual);

export default TouchControls