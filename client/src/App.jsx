import {Route , Routes} from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import './App.css';
import Forms from './Components/Forms';
import RoomPage from './Pages/RoomPage';

const server="http://localhost:8000";
const connectionOptions={
  "force new connection":true,
  reconnectionAttempts:"Infinity",
  timeout:1000,
  transports:["websocket"],
};

const socket=io(server,connectionOptions);

const App=()=> {
  const [user,setUser]=useState(null);

  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        console.log("userJoined");
      }else{
        console.log("userJoined error");
      }
    })
  },[])

  const uuid = () => {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +  
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };
  
  return (
    <>
    <div className="Container">
     <Routes>
      <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser}/>}/>
      <Route path="/:roomId" element={<RoomPage/>}/>
     </Routes>
    </div>
    </>
  )
}

export default App
