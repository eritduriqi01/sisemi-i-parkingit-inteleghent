const USERS = "parking_users";
const SPOTS = "parking_spots";
const RES = "parking_reservations";

function seed() {
  if (!localStorage.getItem(USERS)) {
    localStorage.setItem(
      USERS,
      JSON.stringify([
        { _id: "u1", name: "Admin", email: "erit@gmail.com", password: "123456", role: "admin", plate: "01-ADM" },
        { _id: "u2", name: "Perdorues Test", email: "user@parking.com", password: "user123", role: "user", plate: "02-USR" },
      ])
    );
  }
  if (!localStorage.getItem(SPOTS)) {
    const zones = ["A", "B", "C"];
    const spots = [];
    zones.forEach((zone) => {
      for (let i = 1; i <= 10; i++) {
        const num = String(i).padStart(2, "0");
        let type = "standard";
        if (i === 1) type = "disabled";
        if (i === 2) type = "electric";
        spots.push({
          _id: `${zone}${num}`,
          code: `${zone}${num}`,
          zone,
          floor: zone === "C" ? 1 : 0,
          type,
          pricePerHour: type === "electric" ? 2 : 1,
          status: "free",
        });
      }
    });
    localStorage.setItem(SPOTS, JSON.stringify(spots));
  }
  if (!localStorage.getItem(RES)) {
    localStorage.setItem(RES, JSON.stringify([]));
  }
}

seed();

const lexo = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const ruaj = (key, val) => localStorage.setItem(key, JSON.stringify(val));

function gabim(message) {
  const e = new Error(message);
  e.response = { data: { message } };
  return e;
}

function perdoruesiAktual() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const id = token.replace("tok-", "");
  return lexo(USERS).find((u) => u._id === id) || null;
}

function pastroFjalekalimin(u) {
  if (!u) return null;
  const { password, ...pjesa } = u;
  return pjesa;
}

async function get(url, config = {}) {
  const params = config.params || {};

  if (url === "/auth/me") {
    const u = perdoruesiAktual();
    if (!u) throw gabim("Nuk je i kycur");
    return { data: pastroFjalekalimin(u) };
  }

  if (url === "/spots/stats") {
    const spots = lexo(SPOTS);
    return {
      data: {
        total: spots.length,
        free: spots.filter((s) => s.status === "free").length,
        reserved: spots.filter((s) => s.status === "reserved").length,
        occupied: spots.filter((s) => s.status === "occupied").length,
      },
    };
  }

  if (url === "/spots") {
    let spots = lexo(SPOTS);
    if (params.zone) spots = spots.filter((s) => s.zone === params.zone);
    if (params.status) spots = spots.filter((s) => s.status === params.status);
    return { data: spots };
  }

  if (url === "/reservations/mine") {
    const u = perdoruesiAktual();
    if (!u) throw gabim("Nuk je i kycur");
    return { data: lexo(RES).filter((r) => r.user._id === u._id) };
  }

  if (url === "/reservations") {
    return { data: lexo(RES) };
  }

  throw gabim("Rruga nuk u gjet: " + url);
}

async function post(url, body = {}) {
  if (url === "/auth/login") {
    const u = lexo(USERS).find((x) => x.email === body.email && x.password === body.password);
    if (!u) throw gabim("Email ose fjalekalim i gabuar");
    localStorage.setItem("token", "tok-" + u._id);
    return { data: { token: "tok-" + u._id, ...pastroFjalekalimin(u) } };
  }

  if (url === "/auth/register") {
    const users = lexo(USERS);
    if (users.find((x) => x.email === body.email)) throw gabim("Ky email eshte i regjistruar");
    const u = {
      _id: "u" + Date.now(),
      name: body.name,
      email: body.email,
      password: body.password,
      role: "user",
      plate: body.plate || "",
    };
    users.push(u);
    ruaj(USERS, users);
    localStorage.setItem("token", "tok-" + u._id);
    return { data: { token: "tok-" + u._id, ...pastroFjalekalimin(u) } };
  }

  if (url === "/spots") {
    const spots = lexo(SPOTS);
    const spot = {
      _id: "s" + Date.now(),
      code: body.code,
      zone: body.zone,
      floor: Number(body.floor) || 0,
      type: body.type || "standard",
      pricePerHour: Number(body.pricePerHour) || 1,
      status: "free",
    };
    spots.push(spot);
    ruaj(SPOTS, spots);
    return { data: spot };
  }

  if (url === "/reservations") {
    const u = perdoruesiAktual();
    if (!u) throw gabim("Nuk je i kycur");
    const spots = lexo(SPOTS);
    const spot = spots.find((s) => s._id === body.spot);
    if (!spot) throw gabim("Vendi nuk u gjet");
    if (spot.status !== "free") throw gabim("Vendi nuk eshte i lire");

    const ore = Math.max(0, (new Date(body.endTime) - new Date(body.startTime)) / 3600000);
    const rezervim = {
      _id: "r" + Date.now(),
      spot: { ...spot },
      user: { _id: u._id, name: u.name, email: u.email },
      startTime: body.startTime,
      endTime: body.endTime,
      plate: body.plate || u.plate,
      totalPrice: Math.round(ore * spot.pricePerHour * 100) / 100,
      status: "active",
    };

    spot.status = "reserved";
    ruaj(SPOTS, spots);
    const res = lexo(RES);
    res.push(rezervim);
    ruaj(RES, res);
    return { data: rezervim };
  }

  throw gabim("Rruga nuk u gjet: " + url);
}

async function put(url, body = {}) {
  const spotMatch = url.match(/^\/spots\/(.+)$/);
  if (spotMatch) {
    const spots = lexo(SPOTS);
    const spot = spots.find((s) => s._id === spotMatch[1]);
    if (!spot) throw gabim("Vendi nuk u gjet");
    Object.assign(spot, body);
    ruaj(SPOTS, spots);
    return { data: spot };
  }

  const cancelMatch = url.match(/^\/reservations\/(.+)\/cancel$/);
  if (cancelMatch) {
    const res = lexo(RES);
    const rezervim = res.find((r) => r._id === cancelMatch[1]);
    if (!rezervim) throw gabim("Rezervimi nuk u gjet");
    rezervim.status = "cancelled";
    ruaj(RES, res);

    const spots = lexo(SPOTS);
    const spot = spots.find((s) => s._id === rezervim.spot._id);
    if (spot) {
      spot.status = "free";
      ruaj(SPOTS, spots);
    }
    return { data: rezervim };
  }

  throw gabim("Rruga nuk u gjet: " + url);
}

async function del(url) {
  const spotMatch = url.match(/^\/spots\/(.+)$/);
  if (spotMatch) {
    const spots = lexo(SPOTS).filter((s) => s._id !== spotMatch[1]);
    ruaj(SPOTS, spots);
    return { data: { message: "U fshi" } };
  }
  throw gabim("Rruga nuk u gjet: " + url);
}

const api = { get, post, put, delete: del };

export default api;
