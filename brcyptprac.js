const bcrypt = require('bcryptjs');

const plainpassword = "angry";
const salt = bcrypt.genSaltSync(10);

console.log("salt", salt);

const hash = bcrypt.hashSync(plainpassword, salt)

console.log("hash", hash)

const storedHash = "$2a$10$QDxfwZxbKMCK7rXWnzwj1u/4Gnr7rVpTpR6fT3nsmgbVRH1D8vqUy"

const result = bcrypt.compareSync('angry', storedHash)
console.log("result", result);