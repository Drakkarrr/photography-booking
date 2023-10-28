////Phân quyền giứa user, admin
const AuthPage = (permission) => {
  return (req, res, next) => {
    const { roles } = req.query;
    if (!roles) {
      return res.sendStatus(403).json("you need sign in!!");
    }
    if (!permission.includes(roles)) {
      console.log("you dont have permission");
      return res.sendStatus(401).json("you dont have permission");
    }
    next();
  };
};

module.exports = { AuthPage };
