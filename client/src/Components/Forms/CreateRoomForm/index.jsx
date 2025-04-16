import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoomForm = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
  
    const userData = {
      name,
      roomId,
      presenter: true,
    };
  
    setUser(userData); // update the user state
    socket.emit("createRoom", userData); // emit to server
    navigate(`/${roomId}`); // navigate to room page
  };
  

  const handleGenerate = () => {
    const newId = uuid();
    setRoomId(newId);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <form onSubmit={handleCreateRoom}>
      <div className="mb-3">
        <label className="form-label">Your Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Room ID</label>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={roomId}
            readOnly
          />
          <button type="button" className="btn btn-outline-secondary" onClick={handleGenerate}>
            Generate
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <button className="btn btn-primary w-100" type="submit">
        Create & Join
      </button>
    </form>
  );
};

export default CreateRoomForm;
