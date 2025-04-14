const CreateRoomForm = () => {
    return (
      <form className="w-100 mt-4">
        <div className="form-group mb-3">
          {/* <label className="form-label">Your Name</label> */}
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
          />
        </div>
  
        <div className="form-group mb-3">
          {/* <label className="form-label">Room Code</label> */}
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Generate room code"
              disabled
            />
            <button className="btn btn-outline-primary" type="button">
              Generate
            </button>
            <button className="btn btn-outline-secondary" type="button">
              Copy
            </button>
          </div>
        </div>
  
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Create Room
        </button>
      </form>
    );
  };
  
  export default CreateRoomForm;
  