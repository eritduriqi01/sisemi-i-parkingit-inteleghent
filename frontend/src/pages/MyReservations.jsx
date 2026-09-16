import { useEffect, useState } from "react";
import api from "../api";

/*
  DETYRA: Faqja "Rezervimet e mia"

  Kerkesat:
  1. Merr rezervimet e perdoruesit te kycur nga API:
       GET /api/reservations/mine
     (tokeni shtohet automatikisht nga src/api.js)

  2. Shfaqi rezervimet ne nje liste. Per secilin trego:
       - kodin dhe zonen e vendit  (r.spot.code, r.spot.zone)
       - intervalin kohor          (r.startTime, r.endTime)  -> formatoji me toLocaleString("sq-AL")
       - cmimin total              (r.totalPrice)
       - statusin                  (r.status: "active" | "finished" | "cancelled")

  3. Nese rezervimi eshte "active", shto nje buton "Anulo" qe therret:
       PUT /api/reservations/:id/cancel
     dhe pastaj ringarkon listen.

  4. Nese perdoruesi s'ka rezervime, shfaq nje mesazh bosh.

  Perdor klasat ekzistuese te CSS: .container, .card, .row-card, .badge, .btn-ghost, .muted
  Shiko Dashboard.jsx si shembull per menyren si merren te dhenat me api.get.
*/

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // TODO: ngarko rezervimet nga /api/reservations/mine
  }, []);

  return (
    <div className="container">
      <h1>Rezervimet e mia</h1>
      {/* TODO: shfaq listen e rezervimeve ketu */}
    </div>
  );
}
