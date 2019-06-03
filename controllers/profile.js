const handleProfile_GET = (req, res, db) => {

  const { id } = req.params;

  db
  .select('*')
  .from('users')
  .where({id})
  .then(user => {

    if (user.length) res.json(user[0])
    else res.status(404).josn('Not found')
  })
  .catch(err => {
    console.log('err finding user', err)
    res.status(400).json('Error finding user')
  });

};

const handleProfileUpdate = (req, res, db) => {

  const { id } = req.params;
  const {
    name, age
  } = req.body.formInput;

  db('users')
  .where({ id })
  .update({ name })
  .then(response => {
    if(response) res.json('success')
    else res.status(400).json('unable to update')
  })
  .catch(err => res.status(500).json('error') );

};

module.exports = {
  handleProfile_GET,
  handleProfileUpdate
}
