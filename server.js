console.log('\x1Bc');

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

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

  bcrypt.compare("CLAIRE", '$2a$10$C/2gQOixcFmN/fIhH63erukGn9dctQt7aSuq1BCcT9dSjh7/ES2ju').then((res) => {
    console.log('SIGNIN claire-- ', res)
  });

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

  encryptPassword(password).then(r => console.log('DONEEEEEE'))
  // .then(saveUser)
  // .then(() => {
  //   console.log('--- USER SAVED')
  //   res.json('User Saved')
  // })
  // .catch(err => console.log('Big Error'));

  async function encryptPassword(password){

    return await bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        console.log(hash)
        return hash;
      });
    });

  }
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

  db.users.forEach(user => {
    if(user.id == id) {
      user.entries++;
      return res.json(user.entries);
    }
  });

  res.send(404).json({'err':'user not found'})

});

app.listen(PORT, () => console.log(`Server Running - port:${PORT}`));

//ENCRYPT USER PASSWORDS 4.
