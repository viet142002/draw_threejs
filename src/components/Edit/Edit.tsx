import { FormEvent, memo, useEffect, useState } from "react";
import { useSelectStore } from "../../stores/select";
import { useDrawWallStore, useDrawWindowStore } from "../../stores";

function Edit() {
    const { selected, setSelected } = useSelectStore(state => state);
    const { updateWall, removeWall } = useDrawWallStore(state => state);
    const { removeWindow, updateWindow } = useDrawWindowStore(state => state);
    const [height, setHeight] = useState(0);

    const [width, setWidth] = useState(0);
    const [depth, setDepth] = useState(0);

    useEffect(() => {
        if (!selected) return;
        if (selected.type === 'wall') setHeight(selected.height);
        if (selected.type === 'window') {
            setHeight(selected.height);
            setWidth(selected.width);
            setDepth(selected.depth);
        }
    }, [selected]);

    const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selected) return;
        if (selected.type === 'window') {
            updateWindow(selected.id, { height, width, depth });
        }
        if (selected.type === 'wall') {
            updateWall(selected.id, { height });
        }
        setSelected(null);
    }

    const handleRemove = () => {
        if (!selected) return;
        if (selected.type === 'window') {
            removeWindow(selected.id);
        }
        if (selected.type === 'wall') {
            removeWall(selected.id);
        }
        setSelected(null);
    }

    const handleCancel = () => {
        setSelected(null);
    }

    return (
        <>
            {selected && <div className="fixed z-30 bottom-5 right-5 bg-white shadow-md p-2 rounded-md space-y-2">
                <h4 className="text-lg font-semibold">
                    Selected: {selected.id}
                </h4>
                <form className="space-y-2" onSubmit={handleUpdate}>

                    {selected.type === 'wall' && <input
                        type="number"
                        name="height"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="py-1 px-2 bg-gray-200 rounded-md w-full"
                        step={0.1}
                    />}

                    {selected.type === 'window' && (
                        <>
                            <div className="flex gap-1 items-center">
                                <label htmlFor="width">Width</label>
                                <input
                                    type="number"
                                    name="width"
                                    value={width}
                                    onChange={(e) => setWidth(Number(e.target.value))}
                                    className="py-1 px-2 bg-gray-200 rounded-md w-full"
                                    step={0.1}
                                />
                            </div>
                            <div className="flex gap-1 items-center">
                                <label htmlFor="height">Height</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={height}
                                    onChange={(e) => setHeight(Number(e.target.value))}
                                    className="py-1 px-2 bg-gray-200 rounded-md w-full"
                                    step={0.1}
                                />
                            </div>
                            <div className="flex gap-1 items-center">
                                <label htmlFor="depth">Depth</label>
                                <input
                                    type="number"
                                    name="depth"
                                    value={depth}
                                    onChange={(e) => setDepth(Number(e.target.value))}
                                    className="py-1 px-2 bg-gray-200 rounded-md w-full"
                                    step={0.1}
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-1">
                        <div>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-2 py-1 rounded-md w-full"
                            >
                                Update
                            </button>
                        </div>
                        <div className="flex">
                            <button
                                type="button"
                                className="bg-red-500 text-white px-2 py-1 rounded-md flex-1"
                                onClick={handleRemove}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 rounded-md"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form >
            </div >}
        </>
    )
}

export default memo(Edit);