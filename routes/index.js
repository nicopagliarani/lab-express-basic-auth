const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");



/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.exists({
      username: req.body.username,
    });
    if (userExists) {
      res.render("signup", { error: "Hey username already exists" });
      return;
    }
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  await User.create({username, password: hash});
res.redirect("/login")
} catch (err) {
  res.render("signup", { error: "Some kind of error happened" });
}
  //res.render("userProfile")
})
router.get("/login", (req, res, next) => {
  res.render("login");
});
router.post("/login", async (req,res,next)=>{
  try {
    console.log(req.body);
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    const hashFromDb = user.password;
    const passwordCorrect = await bcrypt.compare(req.body.password, hashFromDb);
    console.log(passwordCorrect);
    console.log(passwordCorrect ? "Yes" : "No");
    if (!passwordCorrect) {
      throw Error("Password incorrect");
    }
    req.session.currentUser = user;
    res.redirect("/userProfile");
    } catch (err) {
      console.log(err);
    res.render("login", { error: "Wrong username or password" });
  }
});
router.get("/userProfile", (req, res, next) => {
  res.render("userProfile");
});



module.exports = router;
