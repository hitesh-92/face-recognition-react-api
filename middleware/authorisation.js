const requireAuth = (redisClient) => (req, res, next) => {
  const { authorisation } = req.headers;

  if (!authorisation) return res.status(401).json('Unauthorised');
  else return redisClient.get(authorisation, handleRedisReply);

  function handleRedisReply(error, reply){
    if(error) return res.status(401).json('Unauthorised');
    console.log('Authorised User -->')
    return next();
  }

}

module.exports = {
  requireAuth
};
