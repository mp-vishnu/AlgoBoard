import CreateRoomForm from "./CreateRoomForm";
import JoinRoomForm from "./JoinRoomForm";
import "./index.css";

const Forms = () => {
  return (
    <div
      className="container d-flex align-items-start justify-content-center min-vh-100"
      style={{ marginTop: "18vh" }}
    >
      <div className="row w-100 justify-content-center gap-4">
        <div className="col-md-5 bg-white p-4 shadow rounded">
          <h2 className="text-center text-primary mb-4">Create Room</h2>
          <CreateRoomForm />
        </div>
        <div className="col-md-5 bg-white p-4 shadow rounded">
          <h2 className="text-center text-primary mb-4">Join Room</h2>
          <JoinRoomForm />
        </div>
      </div>
    </div>
  );
};

export default Forms;
