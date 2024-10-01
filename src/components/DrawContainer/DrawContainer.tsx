import { useDrawStore } from "../../stores/draw";
import DrawWall from "../Wall/DrawWall/DrawWall";
import DrawWallHelper from "../Wall/DrawWallHelper/DrawWallHelper";

function DrawContainer() {
  const { isDrawWall } = useDrawStore(state => state);
  return <>
    {isDrawWall && 
    <>
      <DrawWall />
      <DrawWallHelper />
    </>}
  </>
}

export default DrawContainer;