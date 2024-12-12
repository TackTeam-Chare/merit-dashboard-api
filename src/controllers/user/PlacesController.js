import pool from '../../config/db.js';

const saveReview = async (req, res) => {
  try {
    const { lineUserId, displayName } = req.body;

    if (!lineUserId || !displayName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    const [existingUser] = await pool.query(
      "SELECT * FROM usersdatabase WHERE UserID = ?",
      [lineUserId]
    );

    let user;

    if (existingUser.length > 0) {
      user = existingUser[0];
    } else {
      // Insert new user if not exists
      await pool.query(
        "INSERT INTO usersdatabase (UserID, Nickname, MeritPoint, MeritStatus, ConcentrationPoints, ConcentrationStatus) VALUES (?, ?, ?, ?, ?, ?)",
        [lineUserId, displayName, 0, "Beginner", 0, "Beginner"]
      );

      // Retrieve the newly created user
      const [newUser] = await pool.query(
        "SELECT * FROM usersdatabase WHERE UserID = ?",
        [lineUserId]
      );
      user = newUser[0];
    }

    // Fetch user activities
    const [activities] = await pool.query(
      "SELECT * FROM activities WHERE ActiveUser = ?",
      [lineUserId]
    );

    // Respond with user data and activities
    res.status(200).json({
      user,
      activities,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export default {
  saveReview
};