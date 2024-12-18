import pool from '../../config/db.js';

const saveReview = async (req, res) => {
  try {
    const { lineUserId, displayName } = req.body;

    console.log("Request received for saveReview");
    console.log("Request body:", req.body);

    if (!lineUserId || !displayName) {
      console.log("Validation error: Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user exists
    console.log(`Checking if user exists with UserID: ${lineUserId}`);
    const [existingUser] = await pool.query(
      "SELECT * FROM usersdatabase WHERE UserID = ?",
      [lineUserId]
    );

    console.log("Existing user query result:", existingUser);

    let user;

    if (existingUser.length > 0) {
      user = existingUser[0];
      console.log("User exists:", user);
    } else {
      console.log("User does not exist, inserting new user...");
      // Insert new user if not exists
      await pool.query(
        "INSERT INTO usersdatabase (UserID, Nickname, MeritPoint, MeritStatus, ConcentrationPoints, ConcentrationStatus) VALUES (?, ?, ?, ?, ?, ?)",
        [lineUserId, displayName, 0, "Beginner", 0, "Beginner"]
      );

      console.log("New user inserted successfully");

      // Retrieve the newly created user
      const [newUser] = await pool.query(
        "SELECT * FROM usersdatabase WHERE UserID = ?",
        [lineUserId]
      );

      console.log("New user query result:", newUser);

      user = newUser[0];
    }

    // Fetch user activities
    console.log(`Fetching activities for UserID: ${lineUserId}`);
    const [activities] = await pool.query(
      "SELECT * FROM activities WHERE ActiveUser = ?",
      [lineUserId]
    );

    console.log("Activities query result:", activities);

    // Respond with user data and activities
    console.log("Sending response with user data and activities");
    res.status(200).json({
      user,
      activities,
    });
  } catch (error) {
    console.error("Error in saveReview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const specialfeatures = async (req, res) => {
  try {
    console.log("Request received for specialfeatures");

    console.log("Fetching all special features...");
    const [rows] = await pool.query("SELECT * FROM specialfeatures");

    console.log("Special features query result:", rows);

    res.status(200).json(rows); // ส่งข้อมูลกลับไปที่ frontend
  } catch (error) {
    console.error("Error fetching special features:", error);
    res.status(500).json({ error: "Failed to fetch special features" });
  }
};



export default {
  saveReview,
  specialfeatures
};