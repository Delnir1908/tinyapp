const express = require("express");
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs");


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
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

//i understand that the hased passwords below should be stored w/o original
//but i will keep the original password so that i can test my pages
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
};

//function to chekck if user email already exists in the database
const getUserByEmail = function(email) {
  for (let key in users) {
    if (users[key].email === email) {
      return true;        //return true if match found
    }
  }

  return null;

};

const urlsForUser = function(id) {
  const userSpecificDatabase = {};

  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userSpecificDatabase[key] = urlDatabase[key]; 
    }
  }

  return userSpecificDatabase;
}


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
  const user_id = req.cookies["user_id"];

  if (!user_id) {
    return res.send(`Error 404: You must log in to use this service.`);
  }

const templateVars = {
    urls: urlsForUser(user_id),
    user: users[user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) {
    return res.redirect("/login");
  }

  const templateVars = {
    user: users[req.cookies["user_id"]]
    };
  res.render("urls_new",templateVars);
});

app.get("/urls/:id", (req, res) => {

  const url_id = req.params.id;

  if (!urlDatabase.hasOwnProperty(url_id)) {
    return res.status(404).send(`Error 404: ${url_id} does not exist.`);
  }

  const user_id = req.cookies["user_id"];

  if (!user_id) {
    return res.send(`Error 404: You must log in to use this service.`);
  }

  if (urlDatabase[url_id].userID !== user_id) {
    return res.send(`Error: you do not own this url.`);
  }

  const templateVars = {
    user: users[user_id],
    id: url_id, 
    longURL: urlDatabase[url_id].longURL 
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  if (!urlDatabase.hasOwnProperty(req.params.id)) {
    return res.status(404).send(`Error 404: ${req.params.id} does not exist.`);
  }
  res.redirect(urlDatabase[req.params.id].longURL);
});


app.get("/register", (req, res) => {
  if (req.cookies["user_id"]) {
    return res.redirect("/urls");
  }

  const templateVars = {
    user: users[req.cookies["user_id"]]
    };
  res.render("register",  templateVars);
});

app.get("/login", (req, res) => {
  if (req.cookies["user_id"]) {
    return res.redirect("/urls");
  }

  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("login", templateVars);
});


app.post("/urls", (req, res) => {
  
  const user_id = req.cookies["user_id"];

  if (!user_id) {
    return res.send("You must log in to use this service.");
  } 
  
  const newID = generateRandomString();
  urlDatabase[newID] = {
    longURL: req.body.longURL,
    userID: user_id
  }
  //console.log(req.body); // Log the POST request body to the console
  res.redirect(`/urls/${newID}`);
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)

});

app.post("/urls/:id/delete", (req, res) => {

  const url_id = req.params.id;
  const user_id = req.cookies["user_id"];

  if (!urlDatabase.hasOwnProperty(url_id)) {
    return res.send(`Error 404: ${url_id} does not exist.`);
  } 

  if (!user_id) {
    return res.send("You must log in to use this service.");
  } 

  if (urlDatabase[url_id].userID !== user_id) {
    return res.send(`Error: you do not own this url.`);
  }

  delete urlDatabase[url_id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {

  const url_id = req.params.id;
  const newLongURL = req.body.longURL;
  const user_id = req.cookies["user_id"];

  if (!urlDatabase.hasOwnProperty(url_id)) {
    return res.send(`Error 404: ${url_id} does not exist.`);
  } 

  if (!user_id) {
    return res.send("You must log in to use this service.");
  } 

  if (urlDatabase[url_id].userID !== user_id) {
    return res.send(`Error: you do not own this url.`);
  }
  
  urlDatabase[url_id] = {
    longURL: newLongURL,
    userID: user_id
    }; 

  res.redirect("/urls");  

});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    res.statusCode = 400;
    return res.send('400 Bad Request: Fields cannot be empty.');
  }

  if (!getUserByEmail(email)) {
    res.statusCode = 400;
    return res.send('400 Bad Request: User does not exist.');
  }


  for (let key in users) {
    if (users[key].email === email) {
      if (bcrypt.compareSync(password, users[key].password)) {
        return res.cookie('user_id', users[key].id).redirect("/urls");
      } else {
        return res.statusCode(403).send('403 Forbidden: Wrong password.'); 
      }      
    }
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
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    res.statusCode = 400;
    return res.send('400 Bad Request: Fields cannot be empty.');
  }

  if (getUserByEmail(email)) {
    res.statusCode = 400;
    return res.send('400 Bad Request: Email already in use.');
  }

  const user = {
    id: userID,
    email: email,
    password: hashedPassword
  }

  users[userID] = user;
  //console.log(user);

  res.cookie('user_id', userID);
  res.redirect("/urls");
});

