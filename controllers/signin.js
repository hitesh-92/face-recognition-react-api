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

const getAuthTokenId = (req, res) => {
  const { authorisation } = req.headers;
  return redisClient.get(authorisation, (err, reply) => {
    if(err || !reply) return res.stats(400).json('Unauthorised');
    res.json({id: reply});
  })
}

const signToken = email => {
  const jwtPayload = {email};

  return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'});
}

const setToken = (token, id) =>
  Promise.resolve(redisClient.set(token, id));


const createSessions = user => {
  const { id, email } = user;
  const token = signToken(email);
  return setToken(token, id)
  .then(() => ({'success':true, id, token}))
  .catch(err => console.log('createSessoion Error => ', err))
}

const signInAuthentication = (db, bcrypt) => (req, res) => {
  console.log(req.body)
  const { authorisation } = req.headers;
  return authorisation ? getAuthTokenId(req, res) :
    handleSignIn(req, res, db, bcrypt)
    .then(user => {
      console.log('user =>', user)
      return user.id && user.email ?
      createSessions(user) :
      Promise.reject('error logging in', user)
    })
    .then(session => {
      console.log('session => ', session)
      res.status(200).json(session)
    })
    .catch(err => {
      console.log('catch err => ', err)
      res.status(400).json({from:'signInAuthentication', error: err})
    })
}

module.exports = {
  handleSignIn,
  signInAuthentication
}
