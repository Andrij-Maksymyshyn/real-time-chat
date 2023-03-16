const { trimStr } = require("../utils/utils");

let users = [];

const findUser = user => {
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  return users.find(
    u => trimStr(u.name) === userName && trimStr(u.room) === userRoom
  );
};

const addUser = user => {
  const isUserExist = findUser(user);
  // console.log("users", users);

  if (!isUserExist) {
    users.push(user);
  }
  // !isUserExist && users.push(user);

  const currentUser = isUserExist || user;

  return { isUserExist: !!isUserExist, user: currentUser };
};

const getRoomUsers = room => users.filter(u => u.room === room);

const removeUser = user => {
  const found = findUser(user);

  if (found) {
    users = users.filter(
      ({ room, name }) => room === found.room && name !== found.name
    );
  }

  return found;
};

module.exports = { addUser, findUser, getRoomUsers, removeUser };
