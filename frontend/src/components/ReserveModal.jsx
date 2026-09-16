import { useState } from "react";
import api from "../api";

function toLocalInput(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function ReserveModal({ spot, onClose, onDone }) {
  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);
  const [startTime, setStartTime] = useState(toLocalInput(now));
  const [endTime, setEndTime] = useState(toLocalInput(later));
  const [plate, setPlate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const hours = Math.max(0, (new Date(endTime) - new Date(startTime)) / 3600000);
  const price = Math.round(hours * spot.pricePerHour * 100) / 100;

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/reservations", { spot: spot._id, startTime, endTime, plate });
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || "Rezervimi deshtoi");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>Rezervo vendin {spot.code}</h3>
        <p className="muted">
          Zona {spot.zone} · Kati {spot.floor} · {spot.pricePerHour}€/ore
        </p>
        {error && <div className="alert">{error}</div>}
        <label>Fillimi</label>
        <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <label>Mbarimi</label>
        <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        <label>Targa</label>
        <input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="01-ABC-234" />
        <div className="price-row">
          <span>Cmimi total</span>
          <strong>{price}€</strong>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Anulo
          </button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Duke ruajtur..." : "Rezervo"}
          </button>
        </div>
      </form>
    </div>
  );
}
