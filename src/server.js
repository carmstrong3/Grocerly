const express = require('express');
const path = require('path');
const flash = require('req-flash');
const app = express();
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require("body-parser");
const User = require("./db/models").User;
const userQueries = require("./db/queries.users.js");
const itemQueries = require("./db/queries.items.js");
const listQueries = require("./db/queries.lists.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', 1)
app.use(session({
  secret: "cats",
  resave: false, /* set to true if using passport */
  saveUninitialized: false,
  cookie: { httpOnly: false, secure: false, maxAge: 600000}
}));

app.use((req, res, next) => {
    if (req.cookies && req.cookies.connect.sid && !req.session.user) {
        res.clearCookie('connect.sid');
    }
    next();
});


// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// custom authentication begin

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.

// middleware function to check for logged-in users
let sessionChecker = (req, res, next) => {
    if (req.session && req.session.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

// route for user Login
app.route('/api/login')
  .get(sessionChecker, (req, res) => {
    res.redirect('/login');
  })
  .post((req, res) => {
    var username = req.body.username,
        password = req.body.password;

    User.findOne({ where: { username: username } }).then(function (user) {
      if (!user) {
        console.log("user does not exist")
        res.redirect('/login');
      } else if (!user.validPassword(password)) {
        res.redirect('/login');
      } else {
        req.session.user = user.dataValues;
        res.redirect('/api/dashboard');
      }
    });
  });

// route for user signup
app.route('/api/signup')
  .get(sessionChecker, (req, res) => {
    res.redirect('/signup');
  })
  .post((req, res) => {
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
        res.redirect(303, "/login")
      }
    })
  });

// route for user's dashboard
app.get('/api/dashboard', (req, res) => {
    if (req.session && req.session.user) {
      let username = req.session.user.username;
      User.findOne({ where: { username: username}})
        .then(function (user) {
          if (!user) {
          // if the user isn't found in the DB, reset the session info and
          // redirect the user to the login page
          console.log("no user, resetting session")
          req.session.reset();
          res.redirect('/login');
        } else {
          // render the dashboard page
          res.redirect('/dashboard')
        }
      });
    } else {
      console.log("no session user");
        res.redirect('/login');
    }
});
// route for user logout
app.get('/logout', (req, res) => {
    if (req.session && req.session.user) {
        res.clearCookie('connect.sid');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});

// end custom authentication

// suite for user routes
app.get(`/api/users/:username`, (req, res) => {
  User.findOne({where: {username: req.params.username}})
    .then(user => res.send({userId: user.id, userName: user.username}))
    .catch(err => console.log(err))
});

app.get('/api/getUser', (req, res) => {
  if(req.session && req.session.user) {
    console.log("sending")
    res.send({username: req.session.user.username, id: req.session.user.id})
  } else {
    console.log("no user")
    res.redirect("/login")
  }
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

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
