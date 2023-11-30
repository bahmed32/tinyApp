const express = require("express");
const app = express();
const PORT = 8080; // which is the default port 

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
  // input is a url 
  //shpuld pass in the url as a parameter, so can be changed
  //apply a random genrator to string
  //output is a string 
}

//this is out current data base of key-value pairs stored in an object
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca" },
  "9sm5xK": { longURL: "http://www.google.com" }
};
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "456",
  },
};

//this respons to a get request from the browser when route path is /urls  and directs us the content on the url_index page 
app.get("/urls", (req, res) => {
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
  const templateVars = {
    urls: urlDatabase,
    user: user
  };
  res.render("urls_index", templateVars);
});
// this directs us to the urls/new page where we can implement new urls to be logged/ its content is stored on the url new page 
app.get("/urls/new", (req, res) => {
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

  const templateVars = { user: user };
  res.render("urls_new", templateVars);
  
});


//Make a new register page 
app.get('/register', (req, res) => {
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
  const templateVars = {
    user: user
  };
  res.render("urls_register", templateVars);

});

//have a place for it to go after it post on the register page
app.post('/register', (req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  //check if user already exsists
  let userExists = false; // if user doesnt exsist,
  for (const id in users) {
    const dbUser = users[id];
    if (email === dbUser.email) {
      userExists = true;// if the user already exists we cannot register
    } else {
      if (userExists) {
        res.status(404).end('<p>User already exists!</p>');
        return;
      };
    }
  }

  const uniqueId = `user${generateRandomString(5)}RandomID`;
  //add new users to datbase 

  const newUser = {
    id: uniqueId,
    email: email,
    password: password,

  };
  users[uniqueId] = newUser;
  res.cookie("user_id", uniqueId);
  console.log("users", users);
  //redirect to sign-in page 
  res.redirect("urls");
});

// this post the new short url into our database and redirects it to the page we generated the short url for 
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(5);

  urlDatabase[shortURL] = { longURL: longURL };

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
  const email = req.body.email;
  res.cookie("user_id", user);
  //generate random user id

  //set user_id cookie to contain newly genrated 

  //redirect to the url page 
  res.redirect("/urls");
});
// made logout button 
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/register");

});
//added a sumbit for that redirects to the url page after you enter a long url
//as long as route paramter is used within route then you can use any variable
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

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




// app.get("/hello", (req, res) => {
//   const templateVars = { greeting: "Hello, World!" };
//   res.render("hello_world", templateVars);
// });
// // takes us to a .json page that stores all the url information 
// app.get('/urls.json', (req, res) => {
//   res.json(urlDatabase);
// });



//app is listening on port 8080
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});






// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");

// });
// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// // });
// app.get("/ali", (req, res) => {
//   res.send("Hello Ali Maydhane !");
// });