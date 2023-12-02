
const getUserByEmail = (email, users) => {
  for (const id in users) {
    const dbUser = users[id];
    if (email === dbUser.email) {
      return dbUser;
    }
  }
  return; // Return null if the user is not found
};



module.exports = { getUserByEmail };