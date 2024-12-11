const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);

const corsOptions = {
  origin: "https://dashboard-accumulation.vercel.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));


// API to handle user login and retrieve or create user data
app.post("/api/user", async (req, res) => {
  try {
    const { lineUserId, displayName } = req.body;
    if (!lineUserId || !displayName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [existingUser] = await pool.query(
      "SELECT * FROM usersdatabase WHERE UserID = ?",
      [lineUserId]
    );

    if (existingUser.length > 0) {
      return res.status(200).json(existingUser[0]);
    }

    await pool.query(
      "INSERT INTO usersdatabase (UserID, Nickname, MeritPoint, MeritStatus, ConcentrationPoints, ConcentrationStatus) VALUES (?, ?, ?, ?, ?, ?)",
      [lineUserId, displayName, 0, "Beginner", 0, "Beginner"]
    );

    const [newUser] = await pool.query(
      "SELECT * FROM usersdatabase WHERE UserID = ?",
      [lineUserId]
    );
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});