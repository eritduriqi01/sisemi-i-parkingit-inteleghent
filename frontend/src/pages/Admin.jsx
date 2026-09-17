import { useEffect, useState } from "react";
import api from "../api";

/*
  Faqja: Paneli i adminit (hapet vetem per admin)

  Cka duhet bere:

  Vendet:
  - Ngarko vendet: GET /api/spots
  - Formular per te shtuar vend: POST /api/spots
    (code, zone, floor, type, pricePerHour)
  - Ndrysho statusin: PUT /api/spots/:id  (free/reserved/occupied)
  - Fshi vendin: DELETE /api/spots/:id
  - Trego vendet ne nje tabele

  Rezervimet:
  - Ngarko te gjitha: GET /api/reservations
  - Trego ne tabele: vendi, perdoruesi, nga, deri, cmimi, statusi

  Shiko Dashboard.jsx si shembull.
*/

export default function Admin() {
  const [spots, setSpots] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // TODO: ngarko vendet dhe rezervimet
  }, []);

  return (
    <div className="container">
      <h1>Paneli i adminit</h1>

      <div className="card">
        <h3>Shto vend te ri</h3>
        {/* TODO: formular per shtimin e nje vendi (POST /api/spots) */}
      </div>

      <div className="card">
        <h3>Vendet</h3>
        {/* TODO: tabela e vendeve me ndryshim statusi dhe fshirje */}
      </div>

      <div className="card">
        <h3>Rezervimet</h3>
        {/* TODO: tabela e te gjitha rezervimeve */}
      </div>
    </div>
  );
}
