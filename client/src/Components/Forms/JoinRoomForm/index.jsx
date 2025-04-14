const JoinRoomForm=()=>{
    return (<form className="w-100 mt-4">
    <div className="form-group mb-3">
      <label className="form-label">Your Name</label>
      <input
        type="text"
        className="form-control"
        placeholder="Enter your name"
      />
    </div>
  
    <div className="form-group mb-3">
      <label className="form-label">Room Code</label>
      <input
        type="text"
        className="form-control"
        placeholder="Enter your room code"
      />
    </div>
  
    <button type="submit" className="btn btn-primary w-100 mt-3">
          Join Room
        </button>
  </form>
  )
}
export default JoinRoomForm;