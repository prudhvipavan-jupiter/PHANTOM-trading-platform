// P.H.A.N.T.O.M Trading Platform 404 Handler
 
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}; 