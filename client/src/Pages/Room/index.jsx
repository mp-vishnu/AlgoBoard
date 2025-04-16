import { useState, useRef } from "react";
import "./index.css";
import WhiteBoard from "../../Components/Whiteboard";
import { useParams } from "react-router-dom";

const RoomPage = ({ user, socket }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);

  const { roomId } = useParams(); // 👈 Get roomId from URL

  const handleUndo = () => {
    if (elements.length === 0) return;
    const last = elements[elements.length - 1];
    setHistory((prev) => [...prev, last]);
    setElements((prev) => prev.slice(0, -1));
  };

  const handleRedo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setElements((prev) => [...prev, last]);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setElements([]);
    setHistory([]);
  };

  return (
    <div className="container">
      <div className="text-center pt-4 py-4 fs-1">
        AlgoCanvas <span className="text-primary">[Users Online : 0]</span>
      </div>

      {user?.presenter && (
        <div className="row align-items-center justify-content-center gap-3 mb-5">
          {/* Tools */}
          <div className="d-flex gap-3 flex-wrap col-auto">
            {["pencil", "line", "rect", "circle"].map((t) => (
              <div
                className="form-check d-flex align-items-center gap-1"
                key={t}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="tool"
                  id={t}
                  value={t}
                  checked={tool === t}
                  onChange={(e) => setTool(e.target.value)}
                />
                <label className="form-check-label text-capitalize" htmlFor={t}>
                  {t}
                </label>
              </div>
            ))}
          </div>

          {/* Color Picker */}
          <div className="d-flex align-items-center gap-2 col-auto">
            <label htmlFor="color" className="mb-0">
              Select Color:
            </label>
            <input
              type="color"
              id="color"
              value={color}
              className="form-control form-control-color"
              onChange={(e) => setColor(e.target.value)}
              title="Choose your color"
            />
          </div>

          {/* Undo/Redo */}
          <div className="d-flex gap-2 col-auto">
            <button className="btn btn-primary" onClick={handleUndo}>
              Undo
            </button>
            <button className="btn btn-outline-primary" onClick={handleRedo}>
              Redo
            </button>
          </div>

          {/* Clear Canvas */}
          <div className="col-auto">
            <button className="btn btn-danger" onClick={handleClear}>
              Clear Canvas
            </button>
          </div>
        </div>
      )}

      <div className="col-md-10 mx-auto mt-4 canvas-box">
        <WhiteBoard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          tool={tool}
          color={color}
          user={user}
          socket={socket}
          history={history}
          setHistory={setHistory}
          roomId={roomId} 
        />
      </div>
    </div>
  );
};

export default RoomPage;
