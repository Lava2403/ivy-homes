import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("demo1@ivy.homes");
  const [password, setPassword] = useState("d37e9c8256");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(email, password);

      navigate("/listings");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Ivy Homes</h1>
        <p>Explore Bangalore properties smarter.</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <label>Password</label>

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          {error && <p className="error">{error}</p>}

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <small>
          Demo accounts: demo1, demo2, demo3 @ivy.homes
        </small>
      </div>
    </div>
  );
}