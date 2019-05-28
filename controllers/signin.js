const handleSignIn = (req, res, db, bcrypt) => {

  const { email, password } = req.body;

  db
  .select('email', 'hash')
  .from('login')
  .where('email', '=', email)
  .then( ([{ hash }]) => {
    const validPassword = bcrypt.compareSync(password, hash);

    if (validPassword){
      return db
      .select('*')
      .from('users')
      .where('email', '=', email)
      .then( ([user]) => {
        res.json(user)
      })
      .catch(err => res.status(400).json('unable to get user') )
    } else {
      res.status(400).json('invalid credentials')
    }
  })
  .catch(err => res.status(400).json('wrong credentials') )


};


module.exports = {
  handleSignIn
}
