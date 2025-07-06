const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // SQLite db connection
const baseCookieOptions = require('../config/cookieConfig.js');


const JWT_SECRET = "ETRHSDFW43EQT7HDFA";


// SQLite wrapper functions
const runAsync = (query, params = []) => new Promise((resolve, reject) => {
  db.run(query, params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const getAsync = (query, params = []) => new Promise((resolve, reject) => {
  db.get(query, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

const registerUser = async (user) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    const values = [user.username, user.email, hashedPassword];

    await runAsync(query, values);
    return { success: true, message: "User Registered Successfully" };
  } catch (error) {
    return { success: false, message: "User Registration Failed", error: error };
  }
};

const loginUser = async (email, password, res, keepLoggedIn = false) => {
  try {
    const user = await getAsync(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!user) {
      return { success: false, message: "User Not Found" };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, message: "Invalid Password" };
    }

    const jwtexpiresIn = keepLoggedIn ? '7d' : '1h';
    const cookieMaxAge = keepLoggedIn ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: jwtexpiresIn }
    );

    return {
      success: true,
      message: "Login Successful",
      token,
      cookieOptions: {maxAge: cookieMaxAge}
    };

  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Login Failed", error: error };
  }
};

const getUserFromToken = async (token) => {
  try {
    const trimmedToken = token.trim();
    const decodedToken = jwt.verify(trimmedToken, JWT_SECRET);

    const user = await getAsync(
      `SELECT id, name, email FROM users WHERE email = ?`,
      [decodedToken.email]
    );
    if (!user) {
      return { success: false, message: "User Not Found" };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, message: "Invalid Token", error: error };
  }
};

const logoutUser = async (res) => {
  res.clearCookie('authToken', {
    ...baseCookieOptions,
    maxAge: 0,
  });
  return { success: true, message: "Logout Successful" };
};

module.exports = {
  registerUser,
  loginUser,
  getUserFromToken,
  logoutUser,
};
