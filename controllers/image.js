const handleImage = (req, res, db) => {

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


}

module.exports = {
  handleImage
}
