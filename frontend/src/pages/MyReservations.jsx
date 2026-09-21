// import { useEffect, useState } from "react";
// import api from "../api";

// /*
//   Faqja: Rezervimet e mia

//   Cka duhet bere:
//   - Merr rezervimet e mia: GET /api/reservations/mine
//   - Trego per secilin: vendin, oren nga-deri, cmimin dhe statusin
//   - Nese eshte active, shto buton "Anulo": PUT /api/reservations/:id/cancel
//   - Nese s'ka rezervime, trego nje mesazh


// /
//   Shiko Dashboard.jsx si shembull.3***
// */

// export default function MyReservations() {
//   const [reservations, setReservations] = useState([]);

//   useEffect(() => {
//     // TODO: ngarko rezervimet nga /api/reservations/mine
//   }, []);

//   return (
//     <div className="container">
//       <h1>Rezervimet e mia</h1>
//       {/* TODO: shfaq listen e rezervimeve ketu */}
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import api from "../api";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    try {
      const response = await api.get("/reservations/mine");

      const now = new Date();

      // Shfaq vetëm rezervimet që ende nuk kanë përfunduar
      const activeReservations = response.data.filter(
        (reservation) => {
          const endTime = new Date(reservation.endTime);

          return (
            endTime > now &&
            reservation.status === "active"
          );
        }
      );

      setReservations(activeReservations);
    } catch (error) {
      console.error(
        "Gabim gjatë ngarkimit të rezervimeve:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const cancelReservation = async (id) => {
    try {
      await api.put(`/reservations/${id}/cancel`);

      await loadReservations();
    } catch (error) {
      console.error(
        "Gabim gjatë anulimit:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Rezervimet e mia</h1>
        <p>Duke u ngarkuar...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Rezervimet e mia</h1>

      {reservations.length === 0 ? (
        <p>Nuk ke asnjë rezervim aktiv.</p>
      ) : (
        reservations.map((reservation) => (
          <div
            key={reservation._id}
            className="reservation-card"
          >
            <h2>
              Vendi:{" "}
              {reservation.spot?.code ||
                reservation.spot?._id ||
                "Pa emër"}
            </h2>

            <p>
              <strong>Zona:</strong>{" "}
              {reservation.spot?.zone || "-"}
            </p>

            <p>
              <strong>Kati:</strong>{" "}
              {reservation.spot?.floor ?? "-"}
            </p>

            <p>
              <strong>Nga:</strong>{" "}
              {new Date(
                reservation.startTime
              ).toLocaleString()}
            </p>

            <p>
              <strong>Deri:</strong>{" "}
              {new Date(
                reservation.endTime
              ).toLocaleString()}
            </p>

            <p>
              <strong>Çmimi:</strong>{" "}
              {reservation.totalPrice} €
            </p>

            <p>
              <strong>Targa:</strong>{" "}
              {reservation.plate || "-"}
            </p>

            <p>
              <strong>Statusi:</strong>{" "}
              {reservation.status}
            </p>

            <button
              onClick={() =>
                cancelReservation(reservation._id)
              }
            >
              Anulo rezervimin
            </button>
          </div>
        ))
      )}
    </div>
  );
}

