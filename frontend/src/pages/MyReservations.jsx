import { useEffect, useState } from "react";
import api from "../api";

/*
  Faqja: Rezervimet e mia

  Cka duhet bere:
  - Merr rezervimet e mia: GET /api/reservations/mine
  - Trego per secilin: vendin, oren nga-deri, cmimin dhe statusin
  - Nese eshte active, shto buton "Anulo": PUT /api/reservations/:id/cancel
  - Nese s'ka rezervime, trego nje mesazh

  Shiko Dashboard.jsx si shembull.
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
