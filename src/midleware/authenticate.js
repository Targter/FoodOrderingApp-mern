const jwtProvider = require("../config/jwtProvider");
const userService = require("../services/user.service");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ message: "Authorization header missing or invalid" });
    }
    // Extract token from 'Bearer <token>'
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(404).send({ message: "token not found" });
    }

    const userId = jwtProvider.getUserIdFromToken(token);
    const user = await userService.findUserById(userId);

    req.user = user;
  } catch (error) {
    return res.status(500).send({ message: "AuthenticationProblem" });
  }
  console.log("suces");
  next();
};

module.exports = authenticate;
