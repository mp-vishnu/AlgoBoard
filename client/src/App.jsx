

import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";

import './App.css';
import Forms from './Components/Forms';
import RoomPage from './Pages/Room';
import Hello from "./Hello";
const server = "http://localhost:8000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 1000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
  const [user, setUser] = useState(null);
  const [users,setUsers]=useState([]);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userJoined",data.users);
        setUsers(data.users);
      } else {
        console.log("userJoined error");
      }
    });
  }, []);

  const uuid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  };

  return (
    <div className="Container">
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route path="/:roomId" element={<RoomPage user={user} socket={socket} users={users}/>} />
        <Route path="abcd" element={<Hello/>}/>
      </Routes>
    </div>
  );
};

export default App;
