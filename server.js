const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

const db = {
  users: [
    {
      id:1,
      name:'alice',
      email:'alice@mail.com',
      password:'ALICE',
      entries: 0,
      joined: new Date()
    },
    {
      id:2,
      name:'bob',
      email:'bob@mail.com',
      password:'BOB',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.use(bodyParser.json())

app.get('/', (req, res) => res.send(db.users));

app.post('/signin', (req, res) => {

  const {email, password} = req.body;

  if(
    email === db.users[0].email &&
    password === db.users[0].password
  ) {
    res.json({'signedIn': true})
  } else {
    res.status(400).json('error logging in')
  }

});

app.post('/register', (req, res) => {

  const {name, email, password} = req.body;

  const newUser = {
    id:3,
    entries: 0,
    joined: new Date(),
    name,
    email,
    password
  }

  db.users.push(newUser)

  res.json(newUser)

});

app.listen(PORT, () => console.log(`Server Running - port:${PORT}`))
