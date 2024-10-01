import { Dispatch, SetStateAction, useState } from "react";
import Container2DViewer from "../Container2DViewer/Container2DViewer";
import Container3DViewer from "../Container3DViewer/Container3DViewer";
import LeftControls from "../LeftControls/LeftControls";

function MainContent() {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');


  return <div>
    <LeftControls />
    <ChangeViewButton mode={mode} setMode={setMode} />
    <Container2DViewer
      className={mode === '2d' ? '' : 'invisible'}
    /> 
    <Container3DViewer 
      className={mode === '3d' ? '' : 'invisible'}
    />
   
  </div>
}

export default MainContent;

interface ChangeViewButtonProps {
  mode: '2d' | '3d';
  setMode: Dispatch<SetStateAction<'2d' | '3d'>>;
}

const ChangeViewButton = ({ mode, setMode }: ChangeViewButtonProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 rounded-md overflow-hidden z-30">
      <button className={`px-4 py-1 ${mode === '2d' ? 'bg-slate-200' : 'bg-slate-100 '}`} onClick={() => setMode('2d')}>2D</button>
      <button className={`px-4 py-1 ${mode === '3d' ? 'bg-slate-200' : 'bg-slate-100 '}`} onClick={() => setMode('3d')}>3D</button>
    </div>
)}