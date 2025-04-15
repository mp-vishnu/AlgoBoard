import { useState } from "react";
import {useNavigate} from "react-router-dom";
const CreateRoomForm = ({uuid,socket,setUser}) => {
  const[roomId,setRoomId]=useState(uuid());
  const[name,setName]=useState("");

  const navigate=useNavigate();

  const handleCreateRoom=(e)=>{
    e.preventDefault();
    // name,roomId,useId, host, presenter
    const roomData={
      name,roomId,
      useId:uuid(),
      host:true,
      presenter:true
    }
   setUser(roomData);
   navigate(`/${roomId}`);
   console.log(roomData);
  socket.emit("userJoined",roomData);
  }
    return (
      <form className="w-100 mt-4">
        <div className="form-group mb-3">
          {/* <label className="form-label">Your Name</label> */}
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </div>
  
        <div className="form-group mb-3">
          {/* <label className="form-label">Room Code</label> */}
          <div className="input-group">
            <input
              type="text"
              value={roomId}
              className="form-control"
              placeholder="Generate room code"
              disabled
            />
            <button className="btn btn-outline-primary" onClick={()=>setRoomId(uuid())} type="button">
              Generate
            </button>
            <button className="btn btn-outline-secondary" type="button">
              Copy
            </button>
          </div>
        </div>
  
        <button type="submit" onClick={handleCreateRoom} className="btn btn-primary w-100 mt-3">
          Create Room
        </button>
      </form>
    );
  };
  
  export default CreateRoomForm;
  