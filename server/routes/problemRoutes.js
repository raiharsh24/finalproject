const express = require("express");

const router = express.Router();

const problemCtrl = require(
  "../controllers/problemController"
);

/* ---------------- READ ---------------- */

// GET all problems
router.get("/", problemCtrl.getAll);

// GET single problem
router.get("/:id", problemCtrl.getOne);

/* ---------------- CREATE ---------------- */

// CREATE new problem
router.post("/", problemCtrl.create);

/* ---------------- UPDATE ---------------- */

// UPDATE problem
router.put("/:id", problemCtrl.update);

/* ---------------- DELETE ---------------- */

// DELETE problem
router.delete("/:id", problemCtrl.remove);

module.exports = router;