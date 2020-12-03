// pulling from node_modules library
const express = require('express');
const db = require('./database');
const server = express();

// some middleware that helps express parse incoming request bodies into a json object
server.use(express.json());

server.get('/api/users', (req, res) => {
    const users = db.getUsers();
    res.json(users);
});

// Creating a New User
server.post('/api/users', (req, res) => {
    if (req.body.name && req.body.bio) {
        const user = db.createUser({
            name: req.body.name,
            bio: req.body.bio,
        });
        res.status(201).json(user);

    } else {
        res
            .status(404)
            .json({ errorMessage: 'Please provide name and bio for this user.'});
    }
});

// Get users Info from database.js
server.get('/api/users/:id', (req, res) => {
    const user = db.getUserById(req.params.id);

    if (user) {
        res.json(user);
    } else {
        res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist.'});
    }
});

// delete User by ID
server.delete("/api/users/:id", (req, res) => {
    // make sure the user exists before trying to update it
    const user = db.getUserById(req.params.id)

    if (user) {
      db.deleteUser(user.id)
      
      //send back an "empty" successful response
      res.status(204).end()

      // or a success message like below
        // res.json({
        //   message: "User deleted",
        // })
    } else {
      res.status(404).json({
        message: 'The user with the specified ID does not exist.'
      })
    }
})

// In case only provide "name", asking for required "bio" as well
server.put('/api/users/:id', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        res
            .status(400)
            .json({ errorMessage: 'Please provide name and bio for this user.'})
    }

    const user = db.updateUser(req.params.id, req.body);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json(
            { message: 'The user with the specified ID does not exist.'}
        )
    }
})

server.listen(8080, () => {
    console.log('server started')
})


