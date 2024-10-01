import { useEffect } from "react";
import { useDrawStore } from "../../stores/draw";
import { TypeDraw } from "../../types";

function LeftControls() {
  const { isDrawDoor, isDrawWindow, setDraw, isDrawWall, resetStore } = useDrawStore(state => state);

  const handleSetDraw = (type: TypeDraw) => {
    setDraw(type);
  };

  useEffect(() => {
    if (!isDrawDoor && !isDrawWall && !isDrawWindow) return;

    const handleKeyDown = (e: MouseEvent) => {
      e.preventDefault();
      resetStore();
    };
    window.addEventListener('contextmenu', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleKeyDown);
    }
  }, [isDrawDoor, isDrawWall, isDrawWindow, resetStore]);

  return (
    <aside className="fixed top-1/2 -translate-y-1/2 left-0 z-40">
      <ul>
        <li
          className={`px-4 py-1 cursor-pointer ${isDrawWall ? 'bg-slate-200' : 'bg-slate-100'}`}
          onClick={() => handleSetDraw('wall')}
        >
          Wall
        </li>
        <li
          className={`px-4 py-1 cursor-pointer ${isDrawDoor ? 'bg-slate-200' : 'bg-slate-100'}`}
          onClick={() => handleSetDraw('door')}
        >
          Door
        </li>
        <li
          className={`px-4 py-1 cursor-pointer ${isDrawWindow ? 'bg-slate-200' : 'bg-slate-100'}`}
          onClick={() => handleSetDraw('window')}
        >
          Window
        </li>
      </ul>
    </aside>
  );
}

export default LeftControls;