import {useEffect,useState,useLayoutEffect} from "react";
import rough from "roughjs";

const roughGenerator=rough.generator();

const WhiteBoard=({
  canvasRef,
  ctxRef,
  elements,
  setElements
}) =>{
  //to check drawing
  const [isDrawing,setIsdrawing]=useState(false);

  useEffect(()=>{
  const canvas=canvasRef.current;
  const ctx=canvas.getContext("2d");

  ctxRef.current=ctx;
  },[]);

  useLayoutEffect(()=>{
    const roughCanvas=rough.canvas(canvasRef.current);
    elements.forEach((element)=>{
      roughCanvas.linearPath(element.path);
    })
  },[elements])
  const handleMouseDown=(e)=>{
    const {offsetX,offsetY}=e.nativeEvent;
    setElements((prevElements)=>[
      ...prevElements,
      {
        type:"pencil",
        offsetX,
        offsetY,
        path:[[offsetX,offsetY]],
        stroke:"black",
      },
    ]);
    setIsdrawing(true);
  }
  const handleMouseMove=(e)=>{
    const {offsetX,offsetY}=e.nativeEvent;
    if(isDrawing){
      //pencil by default as static
      const {path}=elements[elements.length-1];
      const newPath=[...path,[offsetX,offsetY]]; 
     setElements((prevElements)=>
      prevElements.map((ele,index)=>{
        if(index==elements.length-1){
          return {
            ...ele,
            path:newPath
          }
        }
        else{
          return 
        }
      })
     ) 
    }
  }
  const handleMouseUp=(e)=>{
   setIsdrawing(false);
  }
  return (
    <>
    {/* {JSON.stringify(elements)} */}
     <canvas 
    ref={canvasRef}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    className="border border-dark border-2 h-100 w-100"></canvas>
    </>
  )
}

export default WhiteBoard