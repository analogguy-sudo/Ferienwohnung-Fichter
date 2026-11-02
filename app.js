// Öffentliche Seite: Texte in drei Sprachen, Wohnungen und Belegung aus Supabase.

const TEXTE = {
  de: {
    nav_wohnungen: "Wohnungen", nav_lage: "Lage", nav_kontakt: "Kontakt",
    hero_titel: "Willkommen in der Ferienwohnung Fichter",
    hero_text: "Zwei gemütliche Ferienwohnungen für einen erholsamen Urlaub.",
    hero_knopf: "Wohnungen ansehen",
    nur_deutsch: "",
    ausstattung: "Ausstattung", belegung: "Belegung", frei: "frei", belegt: "belegt",
    buchen: "Bei FeWo-direkt buchen", anfragen: "Anfragen",
    gaeste: n => n + (n == 1 ? " Gast" : " Gäste"),
    schlafzimmer: n => n + (n == 1 ? " Schlafzimmer" : " Schlafzimmer"),
    qm: n => n + " m²",
    preis: p => "ab " + p + " € pro Nacht",
    mindest: n => "Mindestaufenthalt " + n + (n == 1 ? " Nacht" : " Nächte"),
    keine_fotos: "Fotos folgen",
    lage_text: "Beschreibung der Lage und Anfahrt folgt.",
    karte: "Auf der Karte ansehen",
    kontakt_text: "Am einfachsten buchen Sie direkt über FeWo-direkt. Bei Fragen erreichen Sie uns so:",
    kontakt_folgt: "Kontaktdaten folgen.",
    telefon: "Telefon", email: "E-Mail",
    impressum: "Impressum & Datenschutz"
  },
  en: {
    nav_wohnungen: "Apartments", nav_lage: "Location", nav_kontakt: "Contact",
    hero_titel: "Welcome to Ferienwohnung Fichter",
    hero_text: "Two cosy holiday apartments for a relaxing stay.",
    hero_knopf: "See the apartments",
    nur_deutsch: "Please note: the host only speaks German. Booking via FeWo-direkt is the easiest way.",
    ausstattung: "Amenities", belegung: "Availability", frei: "available", belegt: "booked",
    buchen: "Book on FeWo-direkt", anfragen: "Enquire",
    gaeste: n => n + (n == 1 ? " guest" : " guests"),
    schlafzimmer: n => n + (n == 1 ? " bedroom" : " bedrooms"),
    qm: n => n + " m²",
    preis: p => "from €" + p + " per night",
    mindest: n => "Minimum stay " + n + (n == 1 ? " night" : " nights"),
    keine_fotos: "Photos coming soon",
    lage_text: "A description of the location and directions will follow.",
    karte: "View on map",
    kontakt_text: "The easiest way to book is directly via FeWo-direkt. For questions you can reach us here:",
    kontakt_folgt: "Contact details will follow.",
    telefon: "Phone", email: "Email",
    impressum: "Legal notice & privacy"
  },
  fr: {
    nav_wohnungen: "Appartements", nav_lage: "Situation", nav_kontakt: "Contact",
    hero_titel: "Bienvenue à la Ferienwohnung Fichter",
    hero_text: "Deux appartements de vacances confortables pour un séjour reposant.",
    hero_knopf: "Voir les appartements",
    nur_deutsch: "Attention : le propriétaire ne parle qu'allemand. Le plus simple est de réserver via FeWo-direkt.",
    ausstattung: "Équipements", belegung: "Disponibilités", frei: "libre", belegt: "réservé",
    buchen: "Réserver sur FeWo-direkt", anfragen: "Demander",
    gaeste: n => n + (n == 1 ? " personne" : " personnes"),
    schlafzimmer: n => n + (n == 1 ? " chambre" : " chambres"),
    qm: n => n + " m²",
    preis: p => "à partir de " + p + " € la nuit",
    mindest: n => "Séjour minimum " + n + (n == 1 ? " nuit" : " nuits"),
    keine_fotos: "Photos à venir",
    lage_text: "La description de la situation et de l'accès suivra.",
    karte: "Voir sur la carte",
    kontakt_text: "Le plus simple est de réserver directement sur FeWo-direkt. Pour toute question :",
    kontakt_folgt: "Coordonnées à venir.",
    telefon: "Téléphone", email: "E-mail",
    impressum: "Mentions légales & confidentialité"
  }
};

const $ = s => document.querySelector(s);
let sprache = waehleSprache();
let wohnungen = STANDARD_WOHNUNGEN;
let belegt = [];

function waehleSprache() {
  const url = new URLSearchParams(location.search).get("lang");
  let gespeichert = null;
  try { gespeichert = localStorage.getItem("sprache"); } catch (e) {}
  const browser = (navigator.language || "de").slice(0, 2);
  return [url, gespeichert, browser].find(s => s in TEXTE) || "de";
}

function t(schluessel, wert) {
  const x = TEXTE[sprache][schluessel];
  return typeof x === "function" ? x(wert) : x;
}

function feld(w, name) {
  return w[name + "_" + sprache] || w[name + "_de"] || "";
}

async function lade(pfad) {
  const r = await fetch(SB_URL + "/rest/v1/" + pfad, { headers: { apikey: SB_KEY } });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

async function start() {
  $("#jahr").textContent = new Date().getFullYear();
  document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => {
    sprache = b.dataset.lang;
    try { localStorage.setItem("sprache", sprache); } catch (e) {}
    zeige();
  });
  zeige();
  try {
    const heute = new Date().toISOString().slice(0, 10);
    const [w, b] = await Promise.all([
      lade("fewo_wohnungen?select=*&order=sort"),
      lade("fewo_belegt?select=wohnung,von,bis&bis=gte." + heute)
    ]);
    if (w.length) wohnungen = w;
    belegt = b;
    zeige();
  } catch (e) {
    console.warn("Daten nicht geladen, zeige Platzhalter:", e);
  }
}

function zeige() {
  document.documentElement.lang = sprache;
  document.querySelectorAll("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === sprache));
  document.querySelectorAll("[data-t]").forEach(el => {
    const x = t(el.dataset.t);
    if (el.classList.contains("hinweis-sprache") || el.classList.contains("hinweis-klein")) el.hidden = !x;
    el.textContent = x;
  });

  const foto = wohnungen.flatMap(w => w.fotos || [])[0];
  $(".hero").style.backgroundImage = foto
    ? "linear-gradient(rgba(20,30,25,.35),rgba(20,30,25,.55)),url('" + FOTO_URL + encodeURI(foto) + "')"
    : "";

  const liste = $("#liste");
  liste.textContent = "";
  wohnungen.forEach(w => liste.append(baueWohnung(w)));

  $("#adresse").textContent = KONTAKT.adresse;
  $("#karte").hidden = !KONTAKT.karte;
  if (KONTAKT.karte) $("#karte").href = KONTAKT.karte;

  const kl = $("#kontaktliste");
  kl.textContent = "";
  const eintrag = (titel, text, href) => {
    const li = document.createElement("li");
    li.append(titel + ": ");
    const a = document.createElement("a");
    a.href = href; a.textContent = text;
    li.append(a); kl.append(li);
  };
  if (KONTAKT.telefon) eintrag(t("telefon"), KONTAKT.telefon, "tel:" + KONTAKT.telefon.replace(/[^+\d]/g, ""));
  if (KONTAKT.email) eintrag(t("email"), KONTAKT.email, "mailto:" + KONTAKT.email);
  if (!kl.children.length) { const li = document.createElement("li"); li.textContent = t("kontakt_folgt"); kl.append(li); }
  else { const li = document.createElement("li"); li.textContent = KONTAKT.name; kl.prepend(li); }
}

function baueWohnung(w) {
  const el = $("#vorlage-wohnung").content.firstElementChild.cloneNode(true);
  el.id = w.id;
  el.querySelectorAll("[data-t]").forEach(x => x.textContent = t(x.dataset.t));
  el.querySelector(".name").textContent = feld(w, "name");
  el.querySelector(".text").textContent = feld(w, "text");

  const eck = el.querySelector(".eckdaten");
  [["gaeste", w.gaeste], ["schlafzimmer", w.schlafzimmer], ["qm", w.qm]].forEach(([k, v]) => {
    if (v) { const li = document.createElement("li"); li.textContent = t(k, v); eck.append(li); }
  });

  const aus = el.querySelector(".ausstattung");
  (w.ausstattung || []).forEach(k => {
    if (!AUSSTATTUNG[k]) return;
    const li = document.createElement("li"); li.textContent = AUSSTATTUNG[k][sprache]; aus.append(li);
  });
  if (!aus.children.length) { aus.previousElementSibling.remove(); aus.remove(); }

  const preis = [];
  if (w.preis_ab) preis.push(t("preis", Number(w.preis_ab).toLocaleString(sprache)));
  if (w.mindest_naechte) preis.push(t("mindest", w.mindest_naechte));
  el.querySelector(".preis").textContent = preis.join(" · ");

  const buchen = el.querySelector(".buchen");
  if (w.fewo_url) buchen.href = w.fewo_url;
  else if (KONTAKT.email) { buchen.href = "mailto:" + KONTAKT.email + "?subject=" + encodeURIComponent(feld(w, "name")); buchen.textContent = t("anfragen"); }
  else buchen.remove();

  baueFotos(el.querySelector(".fotos"), w);
  baueKalender(el, w.id);
  return el;
}

function baueFotos(box, w) {
  const fotos = w.fotos || [];
  if (!fotos.length) {
    box.classList.add("leer");
    box.textContent = t("keine_fotos");
    return;
  }
  fotos.slice(0, 5).forEach((f, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = i === 0 ? "gross" : "";
    const img = document.createElement("img");
    img.src = FOTO_URL + encodeURI(f);
    img.alt = feld(w, "name") + " – Foto " + (i + 1);
    img.loading = "lazy";
    b.append(img);
    if (i === 4 && fotos.length > 5) {
      const mehr = document.createElement("span"); mehr.className = "mehr"; mehr.textContent = "+" + (fotos.length - 5); b.append(mehr);
    }
    b.onclick = () => oeffneGalerie(fotos, i);
    box.append(b);
  });
  box.dataset.anzahl = Math.min(fotos.length, 5);
}

// ---------- Galerie ----------
const galerie = { fotos: [], i: 0 };
function oeffneGalerie(fotos, i) {
  galerie.fotos = fotos; galerie.i = i;
  zeigeFoto();
  $("#galerie").showModal();
}
function zeigeFoto() {
  const d = $("#galerie");
  d.querySelector("img").src = FOTO_URL + encodeURI(galerie.fotos[galerie.i]);
  d.querySelector(".zaehler").textContent = (galerie.i + 1) + " / " + galerie.fotos.length;
}
function blaettern(s) {
  galerie.i = (galerie.i + s + galerie.fotos.length) % galerie.fotos.length;
  zeigeFoto();
}
$("#galerie .zu").onclick = () => $("#galerie").close();
$("#galerie .links").onclick = () => blaettern(-1);
$("#galerie .rechts").onclick = () => blaettern(1);
$("#galerie").addEventListener("click", e => { if (e.target.id === "galerie") e.target.close(); });
document.addEventListener("keydown", e => {
  if (!$("#galerie").open) return;
  if (e.key === "ArrowLeft") blaettern(-1);
  if (e.key === "ArrowRight") blaettern(1);
});

// ---------- Kalender ----------
// Ein Eintrag "von–bis" belegt die Nächte von der Anreise bis vor dem Abreisetag.
function istBelegt(wohnung, tag) {
  return belegt.some(b => b.wohnung === wohnung && b.von <= tag && tag < b.bis);
}

function iso(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function baueKalender(el, wohnung) {
  const box = el.querySelector(".kalender");
  let versatz = 0;
  const maxVersatz = 11;
  const zeichne = () => {
    box.textContent = "";
    const anzahl = window.matchMedia("(max-width: 700px)").matches ? 1 : 2;
    for (let m = 0; m < anzahl; m++) box.append(baueMonat(wohnung, versatz + m));
    el.querySelector(".zurueck").disabled = versatz === 0;
    el.querySelector(".vor").disabled = versatz >= maxVersatz;
  };
  el.querySelector(".zurueck").onclick = () => { versatz = Math.max(0, versatz - 1); zeichne(); };
  el.querySelector(".vor").onclick = () => { versatz = Math.min(maxVersatz, versatz + 1); zeichne(); };
  zeichne();
}

function baueMonat(wohnung, versatz) {
  const jetzt = new Date();
  const erster = new Date(jetzt.getFullYear(), jetzt.getMonth() + versatz, 1);
  const heute = iso(jetzt);
  const div = document.createElement("div");
  div.className = "monat";
  const titel = document.createElement("p");
  titel.className = "monat-name";
  titel.textContent = erster.toLocaleDateString(sprache, { month: "long", year: "numeric" });
  div.append(titel);

  const raster = document.createElement("div");
  raster.className = "tage";
  for (let i = 0; i < 7; i++) {
    const s = document.createElement("span");
    s.className = "wtag";
    s.textContent = new Date(2024, 0, 1 + i).toLocaleDateString(sprache, { weekday: "short" }).slice(0, 2);
    raster.append(s);
  }
  const leer = (erster.getDay() + 6) % 7;
  for (let i = 0; i < leer; i++) raster.append(document.createElement("span"));
  const tageImMonat = new Date(erster.getFullYear(), erster.getMonth() + 1, 0).getDate();
  for (let d = 1; d <= tageImMonat; d++) {
    const tag = iso(new Date(erster.getFullYear(), erster.getMonth(), d));
    const s = document.createElement("span");
    s.textContent = d;
    s.className = "tag " + (tag < heute ? "vorbei" : istBelegt(wohnung, tag) ? "belegt" : "frei");
    raster.append(s);
  }
  div.append(raster);
  return div;
}

let breite = window.innerWidth;
window.addEventListener("resize", () => {
  if ((breite > 700) !== (window.innerWidth > 700)) zeige();
  breite = window.innerWidth;
});

start();
