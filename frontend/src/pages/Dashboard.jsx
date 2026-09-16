import { useEffect, useState } from "react";
import api from "../api";
import ReserveModal from "../components/ReserveModal.jsx";

const statusLabel = {
  free: "I lire",
  reserved: "I rezervuar",
  occupied: "I zene",
};

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
  const [stats, setStats] = useState(null);
  const [zone, setZone] = useState("");
  const [status, setStatus] = useState("");
  const [zones, setZones] = useState([]);
  const [selected, setSelected] = useState(null);

  async function load() {
    const params = {};
    if (zone) params.zone = zone;
    if (status) params.status = status;
    const [spotsRes, statsRes] = await Promise.all([
      api.get("/spots", { params }),
      api.get("/spots/stats"),
    ]);
    setSpots(spotsRes.data);
    setStats(statsRes.data);
  }

  useEffect(() => {
    load();
  }, [zone, status]);

  useEffect(() => {
    api.get("/spots").then((res) => {
      setZones([...new Set(res.data.map((s) => s.zone))].sort());
    });
  }, []);

  return (
    <div className="container">
      <h1>Vendet e parkingut</h1>

      {stats && (
        <div className="stats">
          <div className="stat">
            <span className="stat-num">{stats.total}</span>
            <span>Gjithsej</span>
          </div>
          <div className="stat free">
            <span className="stat-num">{stats.free}</span>
            <span>Te lira</span>
          </div>
          <div className="stat reserved">
            <span className="stat-num">{stats.reserved}</span>
            <span>Te rezervuara</span>
          </div>
          <div className="stat occupied">
            <span className="stat-num">{stats.occupied}</span>
            <span>Te zena</span>
          </div>
        </div>
      )}

      <div className="filters">
        <select value={zone} onChange={(e) => setZone(e.target.value)}>
          <option value="">Te gjitha zonat</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              Zona {z}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Te gjitha statuset</option>
          <option value="free">Te lira</option>
          <option value="reserved">Te rezervuara</option>
          <option value="occupied">Te zena</option>
        </select>
      </div>

      <div className="grid">
        {spots.map((spot) => (
          <button
            key={spot._id}
            className={`spot ${spot.status}`}
            disabled={spot.status !== "free"}
            onClick={() => setSelected(spot)}
          >
            <span className="spot-code">{spot.code}</span>
            <span className="spot-type">{spot.type}</span>
            <span className="spot-status">{statusLabel[spot.status]}</span>
            <span className="spot-price">{spot.pricePerHour}€/h</span>
          </button>
        ))}
      </div>

      {selected && (
        <ReserveModal
          spot={selected}
          onClose={() => setSelected(null)}
          onDone={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </div>
  );
}
