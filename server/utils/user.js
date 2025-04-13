let users = [];

// Join user to room
function userJoin(id, username, room, host, presenter) {
  const user = { id, username, room, host, presenter };
  users.push(user);
  return user;
}

// Get all users in a room
function getUsers(room) {
  return users.filter((user) => user.room === room);
}

// User leaves a room
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = { userJoin, getUsers, userLeave };
