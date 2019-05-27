console.log('\x1Bc');

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

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

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send(db.users));

app.post('/signin', (req, res) => {

  // bcrypt.compare("CLAIRE", '$2a$10$C/2gQOixcFmN/fIhH63erukGn9dctQt7aSuq1BCcT9dSjh7/ES2ju')
  // .then((res) => {
  //   console.log('SIGNIN claire-- ', res)
  // });

  const { email, password } = req.body;

  console.log(`email:${email}\npasswrd:${password}`)

  if (
    email === db.users[0].email &&
    password === db.users[0].password
  ) {

    const user = db.users[0];
    delete user.password;

    res.json({'signedIn': true, user})
  } else {
    res.status(400).json('error logging in')
  }

});

app.post('/register', (req, res) => {

  const {name, email, password} = req.body;

  const newUser = {
    id: db.users.length + 1,
    entries: 0,
    joined: new Date(),
    email,
    password,
    name
  }

  db.users.push(newUser)

  res.json(newUser)

});

app.get('/profile/:id', (req, res) => {

  const { id } = req.params;

  db.users.forEach(user => {
    if(user.id == id) return res.json(user);
  });

  res.send(404).json({'err':'user not found'})

});

app.put('/image', (req, res) => {

  const { id } = req.body;

  console.log('\n-----\nUSER ID:: ', id)

  let found = false;
  let userEntries = null;

  db.users.forEach(user => {
    if(user.id == id) {
      found = true;
      user.entries++;
      // return res.json(user.entries);
      userEntries = user.entries;
    }
  });


  if (found) return res.json(userEntries);
  else res.send(404).json({'err':'user not found'})

});

app.listen(PORT, () => console.log(`Server Running - port:${PORT}`));
