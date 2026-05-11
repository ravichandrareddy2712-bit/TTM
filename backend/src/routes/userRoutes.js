const express = require("express");
const { getUsers, getMyAssignedTasks } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getUsers);
router.get("/me/tasks", getMyAssignedTasks);

module.exports = router;
