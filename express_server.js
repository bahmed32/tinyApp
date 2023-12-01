// things we need to import 

const express = require("express");
const app = express();
const PORT = 8080; // which is the default port 


// middleware 
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


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
///////////////
// */
// //output: 123
// urlDatabase.longURL;

// //output: http://www.lighthouselabs.ca
// urlDatabase.b2xVn2.longURL

// //If you want to make the key dynamic then use a a sqaure bracket 
// const x = "b2xVn2"
// urlDatabase[x].longURL

//////////////////////
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

const doesUserExists = (email) => {
  for (const id in users) {
    const dbUser = users[id];
console.log(email, "email")
console.log(dbUser, "dbUser")
    if (email === dbUser.email) {
      return true;// if the user already exists we cannot register
    } 
    
  };
  return false;

  };

// const personLoggedIn = function(cookies) {
//   for (let user in users) {
//     if (user === cookies.user_id) {
//       return true;
//     };
//   }
//   return false;
// };
//this response to a get request from the browser when route path is /urls  and directs us the content on the url_index page 
app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  let user = users[userId];

  // check if user is not logged in

  // if (!personLoggedIn(user)) {
  //   res.status(403).send("Please log in");
  // }



  const templateVars = { urls: urlDatabase, user };

  res.render("urls_index", templateVars);
});


// this directs us to the urls/new page where we can implement new urls to be logged/ its content is stored on the url new page 
app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  let userExists = false;
  let user = null;

  for (const id in users) {
    const dbUser = users[id];
    if (userId === dbUser.id) {
      userExists = true;
      user = dbUser;
    }
  }
  if (userExists) {
    res.redirect("/login");
    return;
  }

  const templateVars = { user: user };
  res.render("urls_new", templateVars);

});

///// added  a login function that has a link at the top of the page.

// Get would be for viewing a page or viewing something
// Post would be used for login the user into the system - username and password 

app.get('/login', (req, res) => {

  /*
    check if user already logged in - look at the cookie and compare it with the db
  
    1. if user logged in reroute to urls route (urls routes)
    2. else render urls_login page (login page)
  */
  const userId = req.cookies["user_id"];
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


//Make a new register page 
app.get('/register', (req, res) => {
  const userId = req.cookies["user_id"];
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




//have a place for it to go after it post on the register page
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
  if (doesUserExists(email)) {
    res.status(403).end('<p>Email already in use, please register another email.</p>');
    return;
  };

  const uniqueId = `user${generateRandomString(5)}RandomID`;
  //add new users to datbase 

  const newUser = {
    id: uniqueId,
    email: email,
    password: password,

  };
  users[uniqueId] = newUser;
  res.cookie("user_id", uniqueId);
  //redirect to sign-in page 
  res.redirect("urls");
});

// this post the new short url into our database and redirects it to the page we generated the short url for 
app.post("/urls", (req, res) => {


  //checking is user is logged in
  const userId = req.cookies["user_id"];
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


  //create shorten urls /////////////////////////////////
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



//Add POST route for /login to expressserver.js
//Redirect browser back to /urls page after successful login
app.post("/login", (req, res) => {
console.log(users, "users")
const body = req.body;
const email = body.email;
console.log(email, "email")
  const password = String(body.password);
  let userId = null;
  //check if user already exsists
  if (!doesUserExists(email)) {
    res.status(403).end('<p>User does not exist register new account </p>');
    return;
  };
  //looping through users. Checking user exist based on email gotten from request, checking passwords are the same 
  //if not return error code.
  for (const id in users) {
    const dbUser = users[id];
    if (email === dbUser.email) {
      if (password !== dbUser.password) {
        res.status(403).end('<p>Password is not the same</p>');
        return;
      }
      console.log("dbUser[id]", dbUser["id"], "dbUser.id", dbUser.id);
      userId = dbUser.id;
    }



  }

  //1) we register new users
  //2) we log the new user in the database with cookies
  //3) sign in with the email we've registered 

  res.cookie("user_id", userId);
  res.redirect("/urls");

});





// made logout button 
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//added a sumbit for that redirects to the url page after you enter a long url
//as long as route paramter is used within route then you can use any variable
app.get("/u/:id", (req, res) => {
  const shortID = req.params.id;
  const longURL = urlDatabase[shortID].longURL;
  if (!longURL) {
    res.status(404).send("Page Not Found");
    return;
  }
  res.redirect(longURL);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// this takes us to the link generated page for the short url with the corresponding long url 
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  let user = {

  };
  let userExists = false; // if user doesnt exsist,
  for (const id in users) {
    const dbUser = users[id];
    if (id === dbUser.id) {
      user = dbUser;
    }

  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: user };
  res.render("urls_show", templateVars);
});


app.get("/", (req, res) => {
  res.send("Hello! and Welcome to tinyApp");
});

// gave power to our delete buttons to actually dlwete urls

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");


});



//app is listening on port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});