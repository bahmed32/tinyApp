
const getUserByEmail = (email, users) => {
  for (const id in users) {
    const dbUser = users[id];
    if (email === dbUser.email) {
      return dbUser;
    }
  }
  return; // Return null if the user is not found
};


// this function generates a random sting based on a url 
function generateRandomString(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let results = '';


  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    results += charset[randomIndex];
  }
  return results;
};



// helperfunction that compares urls to the database

const getUsersUrls = (userid) => {
  const userUrls = {};
  for (const url in urlDatabase) {
    const urlObject = urlDatabase[url];
    if (userid === urlObject.userId) {
      userUrls[url] = urlObject;
    }
  }
  return userUrls;

};

//this is our current data base of key-value pairs stored in an object
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userId: "aJ48lW"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "aJ48lW",
  },

};



module.exports = { getUserByEmail, generateRandomString, getUsersUrls, urlDatabase };