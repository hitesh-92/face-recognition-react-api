const jwt  = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URI);

redisClient.on('error', (err) => console.log('REDIS ERR => ', err) )

const handleSignIn = (req, res, db, bcrypt) => {

  const { email, password } = req.body;

  if (
    email.length < 4 ||
    password.length < 4
  ) return Promise.reject('Invalid form data');

  return db
  .select('email', 'hash')
  .from('login')
  .where('email', '=', email)
  .then( ([ user ]) => {
    const { hash } = user;
    const validPassword = bcrypt.compareSync(password, hash);

    if (validPassword){
      return db
      .select('*')
      .from('users')
      .where('email', '=', email)
      .then( ([user]) => user)
      .catch(err => Promise.reject('unable to get user') )
    } else {
      Promise.reject('invalid credentials')
    }
  })
  .catch(err => Promise.reject('wrong credentials') )


};

const signToken = email => {
  const jwtPayload = {email};
  return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const createSessions = user => {
  const { id, email } = user;
  const token = signToken(email);
  return {'succes':'true', id, token}
}

const signInAuthentication = (db, bcrypt) => (req, res) => {
  console.log(req.body)
  const { authorisation } = req.headers;
  return authorisation ? getAuthToken() :
    handleSignIn(req, res, db, bcrypt)
    .then(user => {
      console.log('user =>', user)
      return user.id && user.email ?
      createSessions(user) :
      Promise.reject('error logging in', user)
    })
    .then(session => {
      console.log('session => ', session)
      res.json(session)
    })
    .catch(err => {
      console.log('catch err => ', err)
      res.status(400).json(err)
    })
}

module.exports = {
  handleSignIn,
  signInAuthentication
}
