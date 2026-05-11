const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
const { normalizeUser } = require("../utils/formatters");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, role, created_at")
      .eq("id", decoded.userId)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = normalizeUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = { protect };
