console.log('\x1Bc');

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'hitesh',
    password : 'password',
    database : 'face-recognition'
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

const old_db = {
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
    email === old_db.users[0].email &&
    password === old_db.users[0].password
  ) {

    const user = old_db.users[0];
    delete user.password;

    res.json({'signedIn': true, user})
  } else {
    res.status(400).json('error logging in')
  }

});

app.post('/register', (req, res) => {

  const {name, email, password} = req.body;

  const newUser = {
    // id: old_db.users.length + 1,
    // entries: 0,
    joined: new Date(),
    email,
    // password,
    name
  }

  // db.users.push(newUser)
  db('users').insert(newUser).then(res => {
    console.log('saveddd', res)
    res.json(res)
  }).catch(err => {
    res.status(500).json(err);
  });

  // res.json(newUser)

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

  old_db.users.forEach(user => {
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
