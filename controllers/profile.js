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

module.exports = {
  handleProfile_GET
}
