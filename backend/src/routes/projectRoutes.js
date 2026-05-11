const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  updateMembers,
  deleteProject,
  objectIdValidation,
  createProjectValidation,
  updateMembersValidation,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { handleValidation } = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").post(allowRoles("admin"), createProjectValidation, handleValidation, createProject).get(getProjects);
router
  .route("/:id")
  .get(objectIdValidation, handleValidation, getProjectById)
  .patch(allowRoles("admin"), objectIdValidation, handleValidation, updateProject)
  .delete(allowRoles("admin"), objectIdValidation, handleValidation, deleteProject);
router.patch("/:id/members", allowRoles("admin"), updateMembersValidation, handleValidation, updateMembers);

module.exports = router;
