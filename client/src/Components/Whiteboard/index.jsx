import { useEffect, useState, useLayoutEffect } from "react";
import rough from "roughjs";

const roughGenerator = rough.generator();

const WhiteBoard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool
}) => {
  const [isDrawing, setIsdrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
  }, []);

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    roughCanvas.ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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
      stroke: "black"
    };

    if (tool === "pencil") {
      setElements((prev) => [
        ...prev,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: "black"
        }
      ]);
    } else if (tool === "line") {
      setElements((prev) => [...prev, { ...baseElement, type: "line" }]);
    } else if (tool === "rect") {
      setElements((prev) => [...prev, { ...baseElement, type: "rect" }]);
    } else if (tool === "circle") {
      setElements((prev) => [...prev, { ...baseElement, type: "circle" }]);
    }

    setIsdrawing(true);
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
    } else if (["line", "rect", "circle"].includes(tool)) {
      setElements((prev) =>
        prev.map((el, index) =>
          index === lastIndex ? { ...el, width: offsetX, height: offsetY } : el
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsdrawing(false);
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
