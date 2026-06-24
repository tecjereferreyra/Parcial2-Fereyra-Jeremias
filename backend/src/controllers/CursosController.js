const { sql, getConnection } = require("../config/db");
async function probarConexion(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().query("SELECT 1 AS ok");
    res.json({ ok: true, mensaje: "Conexión correcta con SQL Server", resultado: resultado.recordset });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "No se pudo conectar con SQL Server", error: error.message });
  }
}
async function obtenerCursos(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().query(`
      SELECT Id AS id, Nombre AS nombre, Categoria AS categoria, Duracion AS duracion, CuposDisponibles AS cuposdisponibles, Activo AS activo
      FROM Cursos
      ORDER BY Id DESC
    `);
    res.json(resultado.recordset);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener cursos", error: error.message });
  }
}
async function crearCurso(req, res) {
  try {
    const { nombre, categoria, duracion, cuposdisponibles, activo } = req.body;
    if (!nombre || !categoria || !duracion || cuposdisponibles === undefined || activo === undefined) {
      return res.status(400).json({ mensaje: "Debe completar todos los datos" });
    }
    const pool = await getConnection();
    const resultado = await pool.request()
      .input("nombre", sql.NVarChar(100), nombre)
      .input("categoria", sql.NVarChar(50), categoria)
      .input("duracion", sql.Int, Number(duracion))
      .input("cuposdisponibles", sql.Int, Number(cuposdisponibles))
      .input("activo", sql.Bit, activo === true || activo === "true")
      .query(`
        INSERT INTO Cursos (Nombre, Categoria, Duracion, CuposDisponibles, Activo)
        OUTPUT INSERTED.Id AS id, INSERTED.Nombre AS nombre, INSERTED.Categoria AS categoria,
               INSERTED.Duracion AS duracion, INSERTED.CuposDisponibles AS cuposdisponibles, INSERTED.Activo AS activo
        VALUES (@nombre, @categoria, @duracion, @cuposdisponibles, @activo)
      `);
    res.status(201).json({ mensaje: "Curso guardado correctamente", curso: resultado.recordset[0] });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar curso", error: error.message });
  }
}
async function eliminarCurso(req, res) {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const resultado = await pool.request()
      .input("id", sql.Int, Number(id))
      .query("DELETE FROM Cursos WHERE Id = @id");
    if (resultado.rowsAffected[0] === 0) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }
    res.json({ mensaje: "Curso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar curso", error: error.message });
  }
}

async function obtenerCursosporId(req, res) {
  try {
    const { id } = req.params;
    const pool = await getConnection();
    const resultado = await pool.request()
      .input("id", sql.Int, Number(id))
        .query(`
        SELECT Id AS id, Nombre AS nombre, Categoria AS categoria, Duracion AS duracion, CuposDisponibles AS cuposdisponibles, Activo AS activo
        FROM Cursos
        WHERE Id = @id
      `);
    if (resultado.recordset.length === 0) {
        return res.status(404).json({ mensaje: "Curso no encontrado" });
    }
    res.json(resultado.recordset[0]);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener curso por ID", error: error.message });
  }
    
module.exports = { probarConexion, obtenerCursos, crearCurso, eliminarCurso, obtenerCursosporId }};