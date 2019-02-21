const express = require('express');
const path = require('path');
const flash = require('req-flash');
const app = express();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require("body-parser");
const User = require("./db/models").User;
const userQueries = require("./db/queries.users.js");
const itemQueries = require("./db/queries.items.js");
const listQueries = require("./db/queries.lists.js");

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Setup for express-session
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
  /*
// pg heroku code suite
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
// end pg heroku 
*/
// Suite for passport-local.js
app.use(cookieParser());
app.use(session({
  secret: "cats",
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 60000}
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	console.log("called serializeUser");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	console.log("called deserealizeUser");
  User.findByPk(id)
		.then((user, err) => {
    done(user, err);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("called passport.use(new LocalStrategy)");
    User.findOne({where: { username: username }})
      .then((user, err) =>  {
      if(err) { return done(err); }
      console.log("passed without err")
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
        console.log("passed username")
      if (password !== user.dataValues.password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("passed password, exiting passport.use(newLocalStrategy)")
      return done(null, user);
    });
  }
));

app.post('/login', function(req, res){
  passport.authenticate("local")(req, res, function () {
        if(!req.user){
          res.redirect("/");
        } else {
          console.log("you've successfully signed in")
          res.redirect("/");
        }
  })
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
// end passport-local.js

// suite for user routes
app.post('/api/login', (req, res) => {
  res.redirect(303, "/")
})

app.get(`/api/users/:username`, (req, res) => {
  User.findOne({where: {username: req.params.username}})
    .then(user => res.send({userId: user.id, userName: user.username}))
    .catch(err => console.log(err))
});

app.post('/api/users/create', (req, res) => {
  // capture information from request's body to make new user object
  let newUser = {
    username: req.body.username,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation
  };
  // use object as parameter for createUser query
  userQueries.createUser(newUser, (err, user) => {
    if(err){
      res.send("error: " + err);
      } else {
  // if everything goes well, send message that everything is fine.
      res.redirect(303, "/")
    }
  })
});

app.post(`/api/users/:userId`, (req, res) => {
  userQueries.deleteUser(req.params.userId, (err, deletedRecordsCount) => {
		if(err){
			res.redirect(500, `/`)
    } else {
      res.redirect(303, `/`)
    }
  })
});

// end user suite

// suite for item routes
app.get(`/api/items`, (req, res) => {
  itemQueries.getItems((err, items) => {
    if(err){
      console.log(err);
    } else {
      res.send(items)
    }
  })
})
app.get(`/api/lists/:listId/items/create/:name`, (req, res) => {
  let newItem = {
    name: req.params.name,
    purchased: false,
    listId: req.params.listId,
  };
  itemQueries.addItem(newItem, (err, list) => {
    if(err){
      console.log(err)
    } else {
      res.redirect(303, `/`)
    }
  });
});

app.get(`/api/lists/:listId/items/:itemId/destroy`, (req, res) => {
  itemQueries.deleteItem(req.params.itemId, (err, deletedRecordsCount) => {
    if(err){
      res.redirect(500, `/`)
    } else {
      res.redirect(303, `/`)
    }
  })
});

app.post(`/api/lists/:listId/items/:itemId/update`, (req, res) => {
  itemQueries.updateItem(req.params.id, req.body, (err, item) => {
    if(err || item == null){
      console.log(err)
    } else {
      res.redirect(`/`)
    }
  })
})

app.get(`/api/lists/:listId/items/:itemId/purchase`, (req, res) => {
  itemQueries.updateItem(req.params.itemId, {purchased: true}, (err, item) => {
    if(err || item == null){
      console.log(err)
    } else {
      res.redirect(303, `/`)
    }
  })
})

app.get(`/api/lists/:listId/items/:itemId/cancel`, (req, res) => {
  itemQueries.updateItem(req.params.itemId, {purchased: false}, (err, item) => {
    if(err || item == null){
      console.log(err)
    } else {
      res.redirect(303, `/`)
    }
  })
})

// end item suite

// begin lists suite

app.get("/api/lists", (req, res) => {
  listQueries.getAllLists((err, lists) => {
    if(err){
      console.log(err);
    } else {
      res.send(lists);
    }
  })
});

app.get(`/api/lists/user/:id`, (req, res) => {
	listQueries.getListsByUser((err, lists) => {
	});
});

app.get(`/api/lists/:id`, (req, res) => {
  // Call getList with the id pulled from the GET request.
	listQueries.getList(req.params.id, (err, list) => {
    if(err){
      res.redirect(500, "/");
    } else {
      res.send(list)
    }
	})
});

app.get(`/api/lists/create/:name`, (req, res) => {
  let newList = {
    name: req.params.name,
  };
  listQueries.addList(newList, (err, list) => {
    if(err){
      console.log(err);
    } else {
      res.redirect(303, `/`)
    }
  });
});

app.get(`/api/lists/:id/destroy`, (req, res) => {
  listQueries.deleteList(req.params.id, (err, list) => {
    if(err){
      res.redirect(500, "/");
    } else {
      res.redirect(303, "/")
    }
  })
});

app.post(`/api/lists/:id/update`, (req, res) => {
  listQueries.updateList(req.params.id, req.body, (err, list) => {
    if(err || list == null){
      res.redirect(404, `/lists/${req.params.id}/update`)
    } else {
      res.redirect(`/api/lists/${list.id}`)
    }
  })
});

// end lists suite

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
/*
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/public/index.html'));
});
*/
const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
