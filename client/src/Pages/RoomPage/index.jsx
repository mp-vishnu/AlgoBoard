import { useState } from "react";
import "./index.css";
import WhiteBoard from "../../Components/Whiteboard";

const RoomPage = () => {
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");

  return (
    <div className="container">
      <div className="text-center pt-4 py-4 fs-1">AlgoCanvas{" "}
      <span className="text-primary">[Users Online : 0]</span></div>
      <div className="row align-items-center justify-content-center gap-3 mb-5">
        {/* Tools */}
        <div className="d-flex gap-3 flex-wrap col-auto">
          {["pencil", "line", "rect", "circle"].map((t) => (
            <div className="form-check d-flex align-items-center gap-1" key={t}>
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
          <label htmlFor="color" className="mb-0">Select Color:</label>
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
          <button className="btn btn-primary">Undo</button>
          <button className="btn btn-outline-primary">Redo</button>
        </div>

        {/* Clear Canvas */}
        <div className="col-auto">
          <button className="btn btn-danger">Clear Canvas</button>
        </div>
      </div>
      <div className="col-md-10 mx-auto mt-4 canvas-box">
        <WhiteBoard/>
      </div>
    </div>
  );
};

export default RoomPage;
