const {
  register,
  login,
  setAvatar,
  getAllUsers,
  addContact,
  getContacts,
} = require("../controllers/userControllers");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/setAvatar/:id", setAvatar);
router.get("/allusers/:id", getAllUsers);
router.patch("/addContact/:id", addContact);
router.get("/getContacts/:id", getContacts);

module.exports = router;
