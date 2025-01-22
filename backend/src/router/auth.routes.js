const { Router } = require("express");

const { body } = require("express-validator");

const {
  registerUser,
  loginUser,
  logOutUser,
  updateProfile,
  refreshUserData,
  refreshUserToken,
} = require("../controllers/auth.Controller.js");
const upload = require("../middlewares/multer.middleware.js");
const verifyJWT = require("../middlewares/auth.middleware.js");
const User = require("../models/user.model.js");

const router = Router();

// router.route("/register").post( registerUser )

// router.route("/login").post(loginUser)

router.post(
  "/register",
  [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  registerUser
);

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").exists().withMessage("Password is required"),
  ],
  loginUser
);

router.post("/logout", verifyJWT, logOutUser);

// Update user profile
router.post(
  "/update-profile/:id",
  upload.single("profilePicture"),
  updateProfile
);
router.get("/refresh-user", verifyJWT, refreshUserData);
router.get("/refresh-token", refreshUserToken);

// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

module.exports = router;
