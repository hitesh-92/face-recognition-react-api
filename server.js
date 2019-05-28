console.log('\x1Bc');

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');

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

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send(db.users));

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });

app.post('/register', (req, res) =>  { register.handleRegister(req, res, db, bcrypt) });

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
