import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", plate: "" });
  const [error, setError] = useState("");

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Regjistrimi deshtoi");
    }
  }

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <h2>Krijo llogari</h2>
        {error && <div className="alert">{error}</div>}
        <label>Emri</label>
        <input name="name" value={form.name} onChange={change} required />
        <label>Email</label>
        <input name="email" value={form.email} onChange={change} type="email" required />
        <label>Fjalekalimi</label>
        <input
          name="password"
          value={form.password}
          onChange={change}
          type="password"
          minLength={6}
          required
        />
        <label>Targa (opsionale)</label>
        <input name="plate" value={form.plate} onChange={change} placeholder="01-ABC-234" />
        <button className="btn" type="submit">
          Regjistrohu
        </button>
        <p className="muted">
          Ke llogari? <Link to="/login">Hyr</Link>
        </p>
      </form>
    </div>
  );
}
