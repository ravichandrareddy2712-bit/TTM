const express = require("express");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  moveTask,
  taskValidation,
  updateTaskValidation,
  listValidation,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { handleValidation } = require("../middleware/validateMiddleware");
const { param, body } = require("express-validator");

const router = express.Router();

router.use(protect);
router.route("/").post(allowRoles("admin"), taskValidation, handleValidation, createTask).get(listValidation, handleValidation, getTasks);
router
  .route("/:id")
  .get(param("id").isUUID(), handleValidation, getTaskById)
  .patch(updateTaskValidation, handleValidation, updateTask)
  .delete(allowRoles("admin"), param("id").isUUID(), handleValidation, deleteTask);
router.patch("/:id/move", param("id").isUUID(), body("status").isString(), handleValidation, moveTask);

module.exports = router;
