import { useAuth } from "../../context/AuthContext";

const RoleGate = ({ role, children, fallback = null }) => {
  const { user } = useAuth();
  if (!user || user.role !== role) return fallback;
  return children;
};

export default RoleGate;
