const express = require("express");
const app = express();
const PORT = 8080; // which is the default port 

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL
  const shortURL = generateRandomString(5);
  console.log(`The short URL: ${shortURL}`);  // Log the POST request body to the console
  res.send("OK"); //responds with ok 

});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});


app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello, World!" };
  res.render("hello_world", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");

});
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });
app.get("/ali", (req, res) => {
  res.send("Hello Ali Maydhane !");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});