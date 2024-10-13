import { useDrawStore } from "../../stores";
import DrawWall from "../Wall/DrawWall/DrawWall";
import DrawWallHelper from "../Wall/DrawWallHelper/DrawWallHelper";
import DrawWindow from "../Window/DrawWindow";

function DrawContainer() {
    const { isDrawWall, isDrawWindow } = useDrawStore(state => state);
    return <>
        {isDrawWall &&
            <>
                <DrawWall />
                <DrawWallHelper />
            </>
        }
        {isDrawWindow && <DrawWindow />}
    </>
}

export default DrawContainer;