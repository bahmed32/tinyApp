// Required imports 
const { getUserByEmail } = require('./helpers.js');
const express = require("express");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

const app = express();
const PORT = 8080;


// middleware 
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["WelcometomyTinyApp"]
}));



// this function generates a random sting based on a url 
function generateRandomString(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let results = '';
  let counter = 0;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    results += charset[randomIndex];
  }
  return results;
}

//this is out current data base of key-value pairs stored in an object
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

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "abc",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "456",
  },

};

// hrlperfunction that compares urls to the database

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




//this response to a get request from the browser when route path is /urls
// and directs us the content on the url_index page 

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  let user = users[userId];

  // check if user is not logged in
  if (!userId || !user) {
    res.status(403).send("Please log in <a href='/login'>here</a> ");
  }

  const templateVars = { urls: getUsersUrls(user.id), user };
  res.render("urls_index", templateVars);
});


// this directs us to the urls/new page where we can implement new urls to be logged/ 
//its content is stored on the url new page 
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  let userExists = false;
  let user = null;

  for (const id in users) {
    const dbUser = users[id];
    if (userId === dbUser.id) {
      userExists = true;
      user = dbUser;
    }
  }
  if (!userExists) {
    res.redirect("/login");
    return;
  }

  const templateVars = { user: user };
  res.render("urls_new", templateVars);

});

//created login page

app.get('/login', (req, res) => {

  const userId = req.session.user_id;
  let userExists = false;
  for (const id in users) {
    const dbUser = users[id];
    if (userId === dbUser.id) {
      userExists = true;
    }
  }

  if (userExists) {
    res.redirect("/urls");
  } else {
    // show login page
    res.render("urls_login", { user: null });
  }

});


//Created registration page 
app.get('/register', (req, res) => {
  const userId = req.session.user_id;
  let userExists = false;
  for (const id in users) {
    const dbUser = users[id];
    if (userId === dbUser.id) {
      userExists = true;
    }
  }

  if (userExists) {
    res.redirect("/urls");
  } else {
    res.render("urls_register", { user: null });
  }
});




//After registration form is submitted
app.post('/register', (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  // return 404 if the e-mail or password are empty string
  if (email === "" || password === "") {
    res.status(404).end('<p>Please ensure both email and password are filled in!</p>');
    return;
  };

  //check if user already exsists
  if (getUserByEmail(email)) {
    res.status(403).end('<p>Email already in use, please register another email.</p>');
    return;
  };

  const uniqueId = `user${generateRandomString(5)}RandomID`;//creates random id

  // generate the hash
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  //add new users to datbase 
  const newUser = {
    id: uniqueId,
    email: email,
    password: hash,

  };
  users[uniqueId] = newUser;
  req.session.user_id = uniqueId;


  //redirect to sign-in page 
  res.redirect("urls");
});



// this post the new short url into our database and redirects it to the page we generated the short url for 
app.post("/urls", (req, res) => {
  //checking is user is logged in

  const userId = req.session.user_id;
  let userExists = false;
  for (const id in users) {
    const dbUser = users[id];
    if (userId === dbUser.id) {
      userExists = true;
    }
  }
  // if user is not logged in tell them they need to log in 
  if (!userExists) {
    res.status(403).end('<p>You need to be logged in to shorten urls!</p>');
    return;
  }

  //create shorten urls 
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(5);

  urlDatabase[shortURL] = { longURL: longURL, userId: userId };

  res.redirect(`urls/${shortURL}`);
  console.log(`The short URL: ${shortURL}`);  // Log the POST request body to the console

});


app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const newLongURL = req.body.longURL;
  console.log("id:", id);
  console.log("urlDatabase[id]:", urlDatabase[id]);

  urlDatabase[id].longURL = newLongURL;
  res.redirect("/urls");

});



//Added POST route for /login 
app.post("/login", (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = String(body.password);
  let userId = null;


  //check if user already exsists
  const user = getUserByEmail(email, users);
  if (!user) {
    res.status(403).end("<p>User does not exist. Register new account <a href='/register'>here</a></p>");
    return;
  };

  const result = bcrypt.compareSync(password, user.password);
  if (!result) {
    res.status(403).end('<p>Password is not the same</p>');
    return;
  }

  userId = user.id;
  req.session.user_id = userId;
  res.redirect("/urls");

});


//  logout button 
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  req.session = null;
  res.redirect("/login");
});



//added a submit, redirects to url page.

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const url = urlDatabase[id];

  if (!url) {
    res.status(404).send("Page Not Found");
    return;
  }
  const longURL = url.longURL;
  if (!longURL) {
    res.status(404).send("Page Not Found");
    return;
  }


  const userId = url.userId || null;
  res.redirect(longURL);
});



//links short url to corresponding long url page
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const url = urlDatabase[id];
  const userId = req.session.user_id;
  const user = users[userId];

  if (!user) {
    res.status(403).send("Can't access page if not logged in, please log in <a href='/login'>here</a>  ");
  }
  if (url.userId !== user.id) {
    res.status(403).send("Can't access page if not your account, switch accounts? <a href='/login'>here</a>  ");
  }

  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: user };
  res.render("urls_show", templateVars);
});

//if user goes to /
app.get("/", (req, res) => {
  res.send("Hello! and Welcome to tinyApp");
});

// Created functional delete button  
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const url = urlDatabase[id];

  const userId = req.session.user_id;
  const user = users[userId];

  // then check if user is even logged in to delete things 
  if (!user) {
    res.status(403).send("Can't delete page if not logged in, please log in <a href='/login'>here</a>  ");
    return;
  }

  // check if the url with this id even exsits
  if (!url) {
    res.status(404).send("This id does not exist doesn't exist. <a href='/login'>here</a>  ");
    return;
  }

  // check if user even owns the url to delete it 
  if (url.userId !== user.id) {
    res.status(403).send("Can't delete url if not your account, switch accounts? <a href='/login'>here</a>  ");
    return;
  }

  delete urlDatabase[id];
  res.redirect("/urls");
});


//app is listening on port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});