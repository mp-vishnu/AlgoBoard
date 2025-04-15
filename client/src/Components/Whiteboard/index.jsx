import { useEffect, useState, useLayoutEffect } from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

const WhiteBoard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  history,
  setHistory
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext("2d");
      ctxRef.current = ctx;
    }
  }, []);

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);

    // Ensure ctxRef.current is not null before clearing and redrawing
    if (ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    elements.forEach((element) => {
      const stroke = element.stroke || "black";

      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, { stroke });
      } else if (element.type === "line") {
        roughCanvas.line(element.offsetX, element.offsetY, element.width, element.height, { stroke });
      } else if (element.type === "rect") {
        const x = Math.min(element.offsetX, element.width);
        const y = Math.min(element.offsetY, element.height);
        const width = Math.abs(element.width - element.offsetX);
        const height = Math.abs(element.height - element.offsetY);
        roughCanvas.rectangle(x, y, width, height, { stroke });
      } else if (element.type === "circle") {
        const radius = Math.sqrt(
          Math.pow(element.width - element.offsetX, 2) + Math.pow(element.height - element.offsetY, 2)
        );
        roughCanvas.circle(element.offsetX, element.offsetY, radius * 2, { stroke });
      }
    });
  }, [elements]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    const baseElement = {
      offsetX,
      offsetY,
      width: offsetX,
      height: offsetY,
      stroke: color
    };

    let newElement;
    if (tool === "pencil") {
      newElement = {
        type: "pencil",
        offsetX,
        offsetY,
        path: [[offsetX, offsetY]],
        stroke: color
      };
    } else {
      newElement = { ...baseElement, type: tool };
    }

    setElements((prev) => [...prev, newElement]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || elements.length === 0) return;

    const { offsetX, offsetY } = e.nativeEvent;
    const lastIndex = elements.length - 1;

    if (tool === "pencil") {
      const { path } = elements[lastIndex];
      const newPath = [...path, [offsetX, offsetY]];

      setElements((prev) =>
        prev.map((el, index) =>
          index === lastIndex ? { ...el, path: newPath } : el
        )
      );
    } else {
      setElements((prev) =>
        prev.map((el, index) =>
          index === lastIndex ? { ...el, width: offsetX, height: offsetY } : el
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setHistory([]); // Clear redo history when new element is added
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="border border-dark border-2 h-100 w-100"
    ></canvas>
  );
};

export default WhiteBoard;
