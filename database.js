const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "127.0.0.1", // IP de MariaDB (localhost si está fuera del contenedor)
  port: 3307, // Puerto donde expusiste MariaDB
  user: "root", // Usuario de MariaDB
  password: "mypassword", // Contraseña configurada
  database: "mydatabase", // Nombre de la base de datos
  connectionLimit: 5, // Límite de conexiones simultáneas
});

async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.log("Error al conectarse a la base de datos:", error);
    throw error;
  }
}

module.exports = { getConnection };
