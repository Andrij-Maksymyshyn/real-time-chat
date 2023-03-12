const { trimStr } = require("../utils/utils");

let users = [];

const addUser = user => {
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  const isUserExist = users.find(
    u => trimStr(u.name) === userName && trimStr(u.room) === userRoom
  );

  if (!isUserExist) {
    users.push(user);
  }

  // !isUserExist && users.push(user);

  const currentUser = isUserExist || user;

  return { ...isUserExist, user: currentUser };
};

module.exports = { addUser };
