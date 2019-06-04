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

const signInAuthentication = (db, bcrypt) => (req, res) => {
  console.log(req.body)
  const { authorisation } = req.headers;
  return authorisation ? getAuthToken() :
    handleSignIn(req, res, db, bcrypt)
    .then(resp => res.json(resp))
    .catch(err => res.status(400).json(err))
}

module.exports = {
  handleSignIn,
  signInAuthentication
}
