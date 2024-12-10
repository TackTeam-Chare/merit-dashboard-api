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

// API to handle user login and retrieve or create user data
app.post("/api/user", async (req, res) => {
    const { lineUserId, displayName } = req.body;
  
    if (!lineUserId || !displayName) {
      return res.status(400).json({ error: "Missing required fields: lineUserId, displayName" });
    }
  
    try {
      console.log("Received data:", { lineUserId, displayName });
  
      // Check if user exists
      const [existingUser] = await pool.query(
        "SELECT * FROM usersdatabase WHERE UserID = ?",
        [lineUserId]
      );
  
      if (existingUser.length > 0) {
        console.log("User exists:", existingUser[0]);
        return res.json(existingUser[0]);
      }
  
      console.log("User does not exist. Creating new user...");
  
      // If user does not exist, insert new user with default data
      const [result] = await pool.query(
        "INSERT INTO usersdatabase (UserID, Nickname, MeritPoint, MeritStatus, ConcentrationPoints, ConcentrationStatus) VALUES (?, ?, ?, ?, ?, ?)",
        [lineUserId, displayName, 0, "Beginner", 0, "Beginner"]
      );
  
      console.log("New user created:", result);
  
      // Retrieve the newly inserted user
      const [newUser] = await pool.query(
        "SELECT * FROM usersdatabase WHERE UserID = ?",
        [lineUserId]
      );
  
      console.log("New user data:", newUser[0]);
      return res.json(newUser[0]);
    } catch (error) {
      console.error("Error handling user login:", error.message, error.stack);
      res.status(500).json({ error: "Internal server error." });
    }
  });
  

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
