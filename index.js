import express from "express";
import dbPool from "./db/dbConnection.js";

const app = express();
const port = process.env.PORT || 8000;

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
    const { rows } = await dbPool.query("SELECT * FROM movies");
    console.log(rows);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server up on port ${port}`));
