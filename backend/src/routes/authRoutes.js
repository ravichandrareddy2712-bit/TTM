const express = require("express");
const { signup, login, me, signupValidation, loginValidation } = require("../controllers/authController");
const { handleValidation } = require("../middleware/validateMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signupValidation, handleValidation, signup);
router.post("/login", loginValidation, handleValidation, login);
router.get("/me", protect, me);

module.exports = router;
