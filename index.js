const express = require("express");
const app = express();
const pool = require("./database");

// Middleware para procesar JSON en el cuerpo de la solicitud
app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const conn = await pool.getConnection();

    // Crear una consulta
    const query = "SELECT * FROM products";

    // Ejecutar la consulta
    const rows = await conn.query(query);

    // Convertir BigInt a String en los resultados (si hay BigInt en la respuesta)
    const formattedRows = rows.map((row) => {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => [
          key,
          typeof value === "bigint" ? value.toString() : value,
        ])
      );
    });

    // Responder con los datos obtenidos
    res.status(200).json(formattedRows);
  } catch (error) {
    console.log("Error al obtener productos:", error);
    res.status(500).send("Error al obtener productos.");
  }
});

app.post("/newproducts", async (req, res) => {
  try {
    const conn = await pool.getConnection();

    // Obtener el nombre del producto desde el cuerpo de la solicitud
    const { name } = req.body;

    // Verificar si el nombre fue proporcionado
    if (!name) {
      return res
        .status(400)
        .json({ message: "El campo 'name' es obligatorio." });
    }

    // Crear la consulta de inserción
    const query = "INSERT INTO products (name) VALUES (?)";

    // Ejecutar la consulta con el valor del nombre proporcionado
    const result = await conn.query(query, [name]);

    // Convertir el ID insertado (si es BigInt) a String
    const formattedResult = {
      ...result,
      insertId:
        typeof result.insertId === "bigint"
          ? result.insertId.toString()
          : result.insertId,
    };

    // Responder con el resultado de la consulta
    res
      .status(201)
      .json({
        message: "Producto insertado correctamente.",
        result: formattedResult,
      });
  } catch (error) {
    console.log("Error al insertar nuevo producto:", error);
    res.status(500).send("Error al insertar nuevo producto.");
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
