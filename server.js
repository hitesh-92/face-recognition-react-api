//console.log('\x1Bc');

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
const redis = require('redis');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./middleware/authorisation')

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const redisClient = redis.createClient(process.env.REDIS_URI);
redisClient.on('error', (err) => console.log('REDIS ERR => ', err) )

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'))

app.get('/', (req, res) => res.send('Face Recognition API!!'));

app.post('/signin', signin.signInAuthentication(db, bcrypt, redisClient) );

app.post('/register', (req, res) =>  { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', auth.requireAuth(redisClient), (req, res) => { profile.handleProfile_GET(req, res, db) });
app.post('/profile/:id', auth.requireAuth(redisClient), (req, res) => { profile.handleProfileUpdate(req, res, db) });

app.put('/image', auth.requireAuth(redisClient), (req, res) => { image.handleImage(req, res, db) });

app.post('/imageurl', auth.requireAuth(redisClient), (req, res) => { image.handleApiCall(req, res) });

app.listen(PORT, () => console.log(`Server Running - port:${PORT}`));
