const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//function to generate a random six-character string
function generateRandomString() {
  const charPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const poolLength = charPool.length;

  let output = '';

  // take a random position from the charPool string and add to output (*6)
  for (let outputDigit = 0; outputDigit < 6; outputDigit++) {
    charIndex = Math.floor(Math.random() * poolLength)
    output += charPool[charIndex];
  }

  return output;

}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//function to chekck if user email already exists in the database
const getUserByEmail = function(email) {
  for (let key in users) {
    if (users[key].email === email) {
      return true;        //return true if match found
    }
  }

  return false;

};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
    };
  res.render("urls_new",templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    user: users[req.cookies["user_id"]],
    id: req.params.id, 
    longURL: urlDatabase[req.params.id] 
  };
  res.render("urls_show", templateVars);
});


app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
    };
  res.render("register",  templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("login", templateVars);
});


app.post("/urls", (req, res) => {
  const newID = generateRandomString();
  urlDatabase[newID] = req.body.longURL;
  //console.log(req.body); // Log the POST request body to the console
  res.redirect(`/url/${newID}`);
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
    const id = req.params.id;
    const newLongURL = req.body.longURL;

    if (urlDatabase[id]) {
      urlDatabase[id] = { longURL: newLongURL }; //overwrite any existing properties
    } else {
      urlDatabase[id] = { longURL: newLongURL }; // Create a new entry if it doesn't exist
    }
    res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email.length === 0 ||password.length === 0 || getUserByEmail(!email)) {
    res.statusCode = 400;
    res.send('400 Bad Request: Fields cannot be empty.');
  }

  if (getUserByEmail(!email)) {
    res.statusCode = 400;
    res.send('400 Bad Request: User does not exist.');
  }


  for (let key in users) {
    if (users[key].email === email) {
      if (users[key].password === password) {
        res.cookie('user_id', users[key].id);
        break;
      } else {
        res.statusCode = 403;
        res.send('403 Forbidden: Wrong password.');
        break;  
      }      
    }
  }

  if (res.statusCode === 200) {
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (email.length === 0 ||password.length === 0) {
    res.statusCode = 400;
    res.send('400 Bad Request: Fields cannot be empty.');
    return;
  }

  if (getUserByEmail(email)) {
    res.statusCode = 400;
    res.send('400 Bad Request: Email already in use.');
    return;
  }

  const user = {
    id: userID,
    email: email,
    password: password
  }

  users[userID] = user;
  console.log(user);

  res.cookie('user_id', userID);
  res.redirect("/urls");
});

