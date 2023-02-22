export const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  res.status(500).json({ msg: 'Oh shit Son! We have a problem!' });
};
