import { FormEvent, memo, useEffect, useState } from "react";
import { useSelectStore } from "../../stores/select";
import { useDrawStore } from "../../stores/draw";

function Edit() {
  const { selected, setSelected } = useSelectStore(state => state);
  const { updateWall, removeWall } = useDrawStore(state => state);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!selected) return;
    setHeight(selected.height);
  }, [selected]);

  const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    updateWall(selected.id, { height });
    setSelected(null);
  }

  const handleRemove = () => {
    if (!selected) return;
    removeWall(selected.id);
    setSelected(null);
  }

  return (
    <>
      {selected && <div className="fixed z-30 bottom-5 right-5 bg-white shadow-md p-2 rounded-md space-y-2">
        <h4 className="text-lg font-semibold">
          Selected: {selected.type} {selected.id}
        </h4>
        <form className="space-x-2" onSubmit={handleUpdate}>
          <input
            type="number"
            name="height"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="py-1 px-2 bg-gray-200 rounded-md"
            step={0.1}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 rounded-md"
          >
            Update
          </button>
        </form>
        <div>
          <button className="bg-red-500 text-white px-2 py-1 rounded-md"
            onClick={handleRemove}
          >Delete</button>
        </div>
      </div>}
    </>
  )
}

export default memo(Edit);