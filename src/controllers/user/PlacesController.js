import pool from '../../config/db.js';

const saveReview = async (req, res) => {
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
};

export default {
  saveReview
};