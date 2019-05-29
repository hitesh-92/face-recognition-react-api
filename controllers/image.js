var Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: 'f22f7817782c4db1b5c24c1cc1b71e6f'
});

const handleApiCall = (req, res) => {

  const { input } = req.body;
  console.log('input:::', input.length)

  clarifai.models
  .predict( Clarifai.FACE_DETECT_MODEL, input )
  .then(extractBoxesData)
  .then(function handle_Clarifai_Api_Response(facesBoxData){
    res.json(facesBoxData)
  })
  .catch(function clarifai_API_Error(err){
    console.log(err.status, err.statusText)
    res.status(400).json({msg:'unable to consume api', error:err})
  });

  function extractBoxesData(data){
    // const {
    //   top_row: top,
    //   left_col: left,
    //   bottom_row: bottom,
    //   right_col: right
    // } = data.outputs[0].data.regions[0].region_info.bounding_box;
    //
    // const facesDetected = data.outputs[0].data.regions.map(face => {
    //   const faceBoxData = face.region_info.bounding_box;
    // })

    // return {top, left, bottom, right};

    return data.outputs[0].data.regions;
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
