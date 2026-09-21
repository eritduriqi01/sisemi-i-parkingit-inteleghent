// import { useEffect, useState } from "react";
// import api from "../api";

// /*
//   Faqja: Paneli i adminit (hapet vetem per admin)

//   Cka duhet bere:

//   Vendet:
//   - Ngarko vendet: GET /api/spots
//   - Formular per te shtuar vend: POST /api/spots
//     (code, zone, floor, type, pricePerHour)
//   - Ndrysho statusin: PUT /api/spots/:id  (free/reserved/occupied)
//   - Fshi vendin: DELETE /api/spots/:id
//   - Trego vendet ne nje tabele

//   Rezervimet:
//   - Ngarko te gjitha: GET /api/reservations
//   - Trego ne tabele: vendi, perdoruesi, nga, deri, cmimi, statusi

//   Shiko Dashboard.jsx si shembull.
// */

// export default function Admin() {
//   const [spots, setSpots] = useState([]);
//   const [reservations, setReservations] = useState([]);

//   useEffect(() => {
//     // TODO: ngarko vendet dhe rezervimet
//   }, []);

//   return (
//     <div className="container">
//       <h1>Paneli i adminit</h1>

//       <div className="card">
//         <h3>Shto vend te ri</h3>
//         {/* TODO: formular per shtimin e nje vendi (POST /api/spots) */}
//       </div>

//       <div className="card">
//         <h3>Vendet</h3>
//         {/* TODO: tabela e vendeve me ndryshim statusi dhe fshirje */}
//       </div>

//       <div className="card">
//         <h3>Rezervimet</h3>
//         {/* TODO: tabela e te gjitha rezervimeve */}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import api from "../api";

export default function Admin() {
  const [spots, setSpots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    code: "",
    zone: "A",
    floor: 0,
    type: "standard",
    pricePerHour: 1,
  });

  // =========================
  // NGARKO TE DHENAT
  // =========================
  const loadData = async () => {
    try {
      setLoading(true);

      const spotsResponse = await api.get("/spots");
      const reservationsResponse = await api.get(
        "/reservations"
      );

      setSpots(spotsResponse.data);
      setReservations(reservationsResponse.data);
    } catch (error) {
      console.error(
        "Gabim gjatë ngarkimit të të dhënave:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // NDRYSHO FORMULARIN
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // SHTO VEND
  // =========================
  const addSpot = async (e) => {
    e.preventDefault();

    if (!form.code.trim()) {
      alert("Shkruaj kodin e vendit.");
      return;
    }

    if (Number(form.pricePerHour) < 0) {
      alert("Çmimi nuk mund të jetë negativ.");
      return;
    }

    try {
      await api.post("/spots", {
        code: form.code.trim(),
        zone: form.zone,
        floor: Number(form.floor),
        type: form.type,
        pricePerHour: Number(form.pricePerHour),
      });

      alert("Vendi u shtua me sukses!");

      setForm({
        code: "",
        zone: "A",
        floor: 0,
        type: "standard",
        pricePerHour: 1,
      });

      await loadData();
    } catch (error) {
      console.error("Gabim gjatë shtimit:", error);

      alert(
        error.response?.data?.message ||
          "Vendi nuk u shtua."
      );
    }
  };

  // =========================
  // NDRYSHO STATUSIN
  // =========================
  const changeStatus = async (id, status) => {
    try {
      await api.put(`/spots/${id}`, {
        status,
      });

      await loadData();
    } catch (error) {
      console.error(
        "Gabim gjatë ndryshimit të statusit:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Statusi nuk u ndryshua."
      );
    }
  };

  // =========================
  // FSHI VENDIN
  // =========================
  const deleteSpot = async (id) => {
    const confirmed = window.confirm(
      "A je i sigurt që dëshiron ta fshish këtë vend?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/spots/${id}`);

      alert("Vendi u fshi me sukses!");

      await loadData();
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error);

      alert(
        error.response?.data?.message ||
          "Vendi nuk u fshi."
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="container">
        <h1>Paneli i adminit</h1>
        <p>Duke ngarkuar të dhënat...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Paneli i adminit</h1>

      {/* =========================
          SHTO VEND
      ========================== */}
      <div className="card">
        <h3>Shto vend të ri</h3>

        <form onSubmit={addSpot}>
          <div>
            <label>Kodi i vendit</label>

            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="P.sh. A11"
              required
            />
          </div>

          <div>
            <label>Zona</label>

            <select
              name="zone"
              value={form.zone}
              onChange={handleChange}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>

          <div>
            <label>Kati</label>

            <input
              type="number"
              name="floor"
              value={form.floor}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div>
            <label>Lloji</label>

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="standard">
                Standard
              </option>

              <option value="disabled">
                Për persona me aftësi të kufizuara
              </option>

              <option value="electric">
                Elektrik
              </option>
            </select>
          </div>

          <div>
            <label>Çmimi për orë (€)</label>

            <input
              type="number"
              name="pricePerHour"
              value={form.pricePerHour}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <button type="submit">
            Shto vendin
          </button>
        </form>
      </div>

      {/* =========================
          VENDET
      ========================== */}
      <div className="card">
        <h3>
          Vendet ({spots.length})
        </h3>

        {spots.length === 0 ? (
          <p>Nuk ka vende parkingu.</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Kodi</th>
                  <th>Zona</th>
                  <th>Kati</th>
                  <th>Lloji</th>
                  <th>Çmimi/orë</th>
                  <th>Statusi</th>
                  <th>Veprime</th>
                </tr>
              </thead>

              <tbody>
                {spots.map((spot) => (
                  <tr key={spot._id}>
                    <td>
                      {spot.code || spot._id}
                    </td>

                    <td>
                      {spot.zone || "-"}
                    </td>

                    <td>
                      {spot.floor ?? "-"}
                    </td>

                    <td>
                      {spot.type || "-"}
                    </td>

                    <td>
                      {spot.pricePerHour ?? 0} €
                    </td>

                    <td>
                      <select
                        value={
                          spot.status || "free"
                        }
                        onChange={(e) =>
                          changeStatus(
                            spot._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="free">
                          I lirë
                        </option>

                        <option value="reserved">
                          I rezervuar
                        </option>

                        <option value="occupied">
                          I zënë
                        </option>
                      </select>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          deleteSpot(spot._id)
                        }
                      >
                        Fshi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================
          REZERVIMET
      ========================== */}
      <div className="card">
        <h3>
          Rezervimet ({reservations.length})
        </h3>

        {reservations.length === 0 ? (
          <p>Nuk ka rezervime.</p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Vendi</th>
                  <th>Përdoruesi</th>
                  <th>Email</th>
                  <th>Targa</th>
                  <th>Nga</th>
                  <th>Deri</th>
                  <th>Çmimi</th>
                  <th>Statusi</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map(
                  (reservation) => (
                    <tr key={reservation._id}>
                      <td>
                        {reservation.spot?.code ||
                          reservation.spot?._id ||
                          "-"}
                      </td>

                      <td>
                        {reservation.user?.name ||
                          "-"}
                      </td>

                      <td>
                        {reservation.user?.email ||
                          "-"}
                      </td>

                      <td>
                        {reservation.plate || "-"}
                      </td>

                      <td>
                        {reservation.startTime
                          ? new Date(
                              reservation.startTime
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        {reservation.endTime
                          ? new Date(
                              reservation.endTime
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td>
                        {reservation.totalPrice ??
                          0}{" "}
                        €
                      </td>

                      <td>
                        {reservation.status ===
                        "active"
                          ? "Aktiv"
                          : reservation.status ===
                            "cancelled"
                          ? "Anuluar"
                          : reservation.status ||
                            "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

