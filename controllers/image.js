var Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
 apiKey: 'f22f7817782c4db1b5c24c1cc1b71e6f'
});

const handleApiCall = (req, res) => {

  const { input } = req.body;

  clarifai.models.predict(
    Clarifai.FACE_DETECT_MODEL, input
  )
  .then(extractBoxData)
  .then(function handle_Clarifai_Api_Response(box){
    res.status(200).json(box)
  })
  .catch(function clarifai_API_Error(err){
      console.log('error: ', err)
      res.status(400).json('unable to consume api', err)
  });



  function extractBoxData(data){

    const {
      top_row: top,
      left_col: left,
      bottom_row: bottom,
      right_col: right
    } = data.outputs[0].data.regions[0].region_info.bounding_box;

    return {top, left, bottom, right};
  };

}

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
  handleImage,
  handleApiCall
}
