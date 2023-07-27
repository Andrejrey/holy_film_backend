import express from "express";
import dbPool from "./db/dbConnection.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const { getTime } = await dbPool.query("SELECT NOW();");
    res.send(getTime.rows);
  } catch (error) {
    return res.status(500).send("Could not get the time");
  }
});

app.route("/movies").get(async (req, res) => {
  try {
    const { rows } = await dbPool.query(
      `SELECT movies.*, array_agg(DISTINCT categories.name) as category, (SELECT json_object_agg(name, price) as cinemas FROM movies_cinemas JOIN cinemas ON movies_cinemas.cinemaId = cinemas.id WHERE movieId = movies.id GROUP BY movieId ORDER BY movieId) FROM movies
      LEFT join movies_categories on movies_categories.movieId = movies.id
      LEFT join categories on categories.id = movies_categories.categoryId
      LEFT join movies_cinemas on movies_cinemas.movieId = movies.id
      LEFT join cinemas on cinemas.id = movies_cinemas.cinemaId
      GROUP BY movies.id`
    );
    console.log(rows);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.route("/categories").get(async (req, res) => {
  try {
    const { rows } = await dbPool.query("SELECT * FROM categories");
    console.log(rows);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.route("/cinemas").get(async (req, res) => {
  try {
    const { rows } = await dbPool.query("SELECT * FROM cinemas");
    console.log(rows);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.route("/movies_cinemas").get(async (req, res) => {
  try {
    const { rows } = await dbPool.query("SELECT * FROM movies_cinemas");
    console.log(rows);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server up on port ${port}`));
