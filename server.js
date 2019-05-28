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
    joined: new Date(),
    email,
    name
  }

  const hash = bcrypt.hashSync(password, 8);

  db.transaction(tr => {
    tr
    .insert({ hash, email })
    .into('login')
    .returning('email')
    .then(function saveNewUser (login_email){
      return tr('users')
        .returning('*')
        .insert(newUser)
        // .then(user => res.json(user[0]))
    })
    .then(() => {
      tr.commit()
      res.json('added')
    })
    .catch(() => {
      tr.rollback()
      res.status(400).json('register failed')
    })

  })

  // res.json(hashedPassword || 'err');

  //  -----------

  // db.users.push(newUser)
  // db('users')
  // .returning('*')
  // .insert(newUser)
  // .then(user => {
  //   console.log('saveddd', user[0])
  //   res.json(user[0])
  // }).catch(err => {
  //   res.status(500).json('Error: unable to register new user');
  // });


});

app.get('/profile/:id', (req, res) => {

  const { id } = req.params;

  db
  .select('*')
  .from('users')
  .where({id})
  .then(user => {
    // console.log('found user', user[0])

    if (user.length) res.json(user[0])
    else res.status(404).josn('Not found')
  })
  .catch(err => {
    console.log('err finding user', err)
    res.status(400).json('Error finding user')
  });

});

app.put('/image', (req, res) => {

  const { id } = req.body;

  db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    console.log(entries)
    if(entries.length) res.json(entries)
    else res.status(404).json('Unable to update')
  })
  .catch(err => {
    console.log('Error /image')
    res.json('error updating /image')
  })


});

app.listen(PORT, () => console.log(`Server Running - port:${PORT}`));
