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
  
    // Set actual drawing dimensions to match CSS size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
  }, []);  
  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    roughCanvas.ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, { stroke: element.stroke || "black" });
      }
    });
  }, [elements]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: "black"
        }
      ]);
    }

    setIsdrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || elements.length === 0) return;

    const { offsetX, offsetY } = e.nativeEvent;

    const lastElement = elements[elements.length - 1];
    if (!lastElement || !lastElement.path) return;

    const { path } = lastElement;
    const newPath = [...path, [offsetX, offsetY]];

    if (tool === "pencil") {
      setElements((prevElements) =>
        prevElements.map((ele, index) => {
          if (index === elements.length - 1) {
            return {
              ...ele,
              path: newPath
            };
          } else {
            return ele;
          }
        })
      );
    }
  };

  const handleMouseUp = () => {
    setIsdrawing(false);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border border-dark border-2 h-100 w-100"
      ></canvas>
    </>
  );
};

export default WhiteBoard;
