const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const supabase = require("../config/supabase");
const generateToken = require("../utils/generateToken");
const { normalizeUser } = require("../utils/formatters");

const signupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { data: exists, error: existsError } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
    if (existsError) throw existsError;
    if (exists) return res.status(400).json({ success: false, message: "Email already exists" });

    const { count, error: countError } = await supabase.from("users").select("id", { count: "exact", head: true });
    if (countError) throw countError;

    const passwordHash = await bcrypt.hash(password, 10);
    const role = (count || 0) === 0 || email === "admin@ttm.com" ? "admin" : "member";

    const { data: user, error } = await supabase
      .from("users")
      .insert({ name, email, password_hash: passwordHash, role })
      .select("id, name, email, role, created_at")
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token: generateToken(user.id),
      user: normalizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role, password_hash, created_at")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({
      success: true,
      message: "Login successful",
      token: generateToken(user.id),
      user: normalizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { signup, login, me, signupValidation, loginValidation };
