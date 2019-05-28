const handleRegister = (req, res, db, bcrypt) => {

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
    })
    .then(([user]) => {
      tr.commit()
      res.json(user)
    })
    .catch(() => {
      tr.rollback()
      res.status(400).json('register failed')
    })

  })

}

module.exports = {
  handleRegister
}
