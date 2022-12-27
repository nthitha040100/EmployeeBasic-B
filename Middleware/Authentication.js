const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.headers.authorization != null) {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_PRIVATE_KEY, (err, decoded) => {
      if (!err) {
        // res.status(200).json({message: "Authenticated"})
        next();
      } else {
        console.log(err);
        res.status(403).json({ message: "You are unauthorized" });
      }
    });
  }else{
    res.status(404).json({message: "Token not entered"});
  }
};
