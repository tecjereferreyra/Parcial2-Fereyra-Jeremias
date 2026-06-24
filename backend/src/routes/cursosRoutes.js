const express = require("express");
const router = express.Router();
const { obtenerCursos,obtenerCursosporId, crearCurso, eliminarCurso } = require("../controllers/CursosController");
router.get("/", obtenerCursos);
router.post("/", crearCurso);
router.delete("/:id", eliminarCurso);
router.get("/:id", obtenerCursosporId);
module.exports = router;