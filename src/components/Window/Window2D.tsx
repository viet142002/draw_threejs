import { Box } from "@react-three/drei";
import { useDrawWindowStore } from "../../stores";
import { useSelectStore } from "../../stores/select";
import { IWindow } from "../../types";
import { memo, useMemo } from "react";
import { decompose } from "../../utils/matrix";

function Window2D() {
    const windows = useDrawWindowStore(state => state.windows);
    return <>
        {
            windows.map(window => {
                return <InstanceWindow2D key={window.id} window={window} />
            })
        }
    </>
}

export default memo(Window2D);

const InstanceWindow2D = memo(({ window }: { window: IWindow }) => {
    const { setSelected } = useSelectStore(state => state);
    const handleClick = (e: any) => {
        if (e?.object) {
            setSelected({ type: 'window', ...e.object.userData });
        }
    }

    const props = useMemo(() => {
        const heightFromFloor = 0.5;
        const { position, rotation, scale } = decompose(window.matrix);
        position[1] = heightFromFloor + window.height / 2;
        return { position, rotation, scale };
    }, [window.height, window.matrix]);

    return <>
        <Box
            onClick={handleClick}
            args={[window.width, window.height, window.depth]}
            userData={window}
            {...props}
        />
    </>
})