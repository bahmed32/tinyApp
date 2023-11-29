const express = require("express");
const app = express();
const PORT = 8080; // which is the default port 

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
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
  "b2xVn2": {longURL:"http://www.lighthouselabs.ca"},
  "9sm5xK": {longURL:"http://www.google.com"}
};

//this respons to a get request from the browser when route path is /urls  and directs us the content on the url_index page 
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
// this directs us to the urls/new page where we can implement new urls to be logged/ its content is stored on the url new page 
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// this post the new short url into our database and redirects it to the page we generated the short url for 
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(5);

  urlDatabase[shortURL] = { longURL: longURL };

  res.redirect(`urls/${shortURL}`);
  console.log(`The short URL: ${shortURL}`);  // Log the POST request body to the console

});
//added a sumbit for that redirects to the url page after you enter a long url
app.post("/urls/:id", (req, res) => {
  const id = req.params.id
  const newLongURL = req.body.longURL;
  urlDatabase[id].longURL = newLongURL
  res.redirect("/urls");
})
//as long as route paramter is used within route then you can use any variable
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// this takes us to the link generated page for the short url with the corresponding long url 
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL };
  res.render("urls_show", templateVars);
});


app.get("/", (req, res) => {
  res.send("Hello! and Welcome to tin");
});

// gave power to our delete buttons to actually dlwete urls

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id
  console.log("id", id)
  console.log("urlDatabase before delete", urlDatabase);
  delete urlDatabase[id]
  console.log("urlDatabase after delete ", urlDatabase);
  res.redirect("/urls")

  
})



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