const express = require("express");
const router = express.Router();

const {
  createPaste,
  getPaste,
  viewPaste,
} = require("../controllers/paste.controller");

router.post("/", createPaste);
router.get("/:id", getPaste);
router.get("/view/:id", viewPaste);

module.exports = router;
