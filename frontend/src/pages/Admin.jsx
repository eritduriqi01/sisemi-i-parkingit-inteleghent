import { useEffect, useState } from "react";
import api from "../api";

/*
  DETYRA: Paneli i adminit

  Kjo faqe hapet vetem per perdoruesit me rol "admin" (shiko App.jsx -> Protected adminOnly).

  Kerkesat:

  A) Menaxhimi i vendeve
     1. Ngarko te gjitha vendet:            GET /api/spots
     2. Formular per te shtuar vend te ri:  POST /api/spots
        fushat: code, zone, floor (number), type (standard|disabled|electric), pricePerHour (number)
     3. Ndrysho statusin e nje vendi:       PUT /api/spots/:id   body: { status }
        (free | reserved | occupied)  -> mund te perdoret nje <select> ne cdo rresht
     4. Fshi nje vend:                      DELETE /api/spots/:id
     Shfaqi vendet ne nje tabele.

  B) Rezervimet
     5. Ngarko te gjitha rezervimet:        GET /api/reservations   (vetem admin)
        Shfaqi ne nje tabele: vendi, perdoruesi (r.user.name), nga, deri, cmimi, statusi.

  Shenim: te gjitha keto endpoint-e per admin kerkojne token admin, i cili shtohet
  automatikisht nga src/api.js. Nese therrasesh me nje llogari user, backend-i kthen 403.

  Perdor klasat ekzistuese: .container, .card, .inline-form, table/th/td, .btn, .btn-ghost
  Shiko Dashboard.jsx si model per api.get / api.post / api.put / api.delete.
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
