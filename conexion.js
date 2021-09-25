const { Pool } = require("pg");

const pool = new Pool({
  user: "mario",
  host: "localhost",
  password: "1234",
  database: "elecciones",
  port: 5432,
});

async function guardarCandidato(candidato) {
  const values = Object.values(candidato);
  const consulta = {
    text: "INSERT INTO candidatos (nombre, foto, color, votos) values ( $1,$2, $3, 0)",
    values,
  };
  try {
    const result = await pool.query(consulta);
    return result;
  } catch (e) {
    return e;
  }
}

async function getCandidatos() {
  try {
    const result = await pool.query(`SELECT * FROM candidatos`);
    return result.rows;
  } catch (e) {
    return e;
  }
}

async function eliminarCandidato(id) {
  try {
    const result = await pool.query(`DELETE FROM candidatos WHERE id =
    ${id}`);
    return result.rows;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function editCandidato(candidato) {
  const values = Object.values(candidato);
  const consulta = {
    text: "UPDATE candidatos SET nombre = $1, foto = $2 WHERE id = $3 RETURNING *",
    values,
  };
  try {
    const res = await pool.query(consulta);
    return res.rows;
  } catch (e) {
    console.log(e);
  }
}

async function registrarVotos(voto) {
  const values = Object.values(voto);
  const registrarVotoHistorial = {
    text: "INSERT INTO historial (estado, votos, ganador) values ( $1,$2, $3)",
    values,
  };
  const registrarVotoCandidato = {
    text: "UPDATE candidatos SET votos = votos + $1 WHERE nombre = $2",
    values: [Number(values[1]), values[2]],
  };
  try {
    await pool.query("BEGIN");
    await pool.query(registrarVotoHistorial);
    await pool.query(registrarVotoCandidato);
    await pool.query("COMMIT");
    return true;
  } catch (e) {
    await pool.query("ROLLBACK");
    return false;
  }
}

async function getHistorial() {
  try {
    const consulta = {
      text: `SELECT * FROM historial`,
      rowMode: "array",
    };
    const result = await pool.query(consulta);
    return result.rows;
  } catch (e) {
    return e;
  }
}
module.exports = { guardarCandidato, getCandidatos, eliminarCandidato, editCandidato, registrarVotos, getHistorial };
