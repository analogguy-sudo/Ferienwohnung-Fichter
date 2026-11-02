// Öffentliche Seite: Texte in drei Sprachen, Wohnungen und Belegung aus Supabase.

const TEXTE = {
  de: {
    nav_wohnungen: "Wohnungen", nav_lage: "Lage", nav_kontakt: "Kontakt",
    hero_kicker: "Dahner Felsenland · Pfälzerwald",
    hero_titel: "Ankommen. Durchatmen. Urlaub.",
    hero_text: "Zwei gemütliche Ferienwohnungen zwischen Wald und roten Sandsteinfelsen – ideal zum Wandern, Klettern und Durchatmen.",
    hero_knopf: "Wohnungen ansehen", hero_frei: "Freie Termine",
    fakt_1: "2 Ferienwohnungen", fakt_2: "Freie Termine auf einen Blick", fakt_3: "Sicher buchen über FeWo-direkt",
    kicker_wohnungen: "Unsere Wohnungen", titel_wohnungen: "Zwei Wohnungen, ein Zuhause auf Zeit",
    titel_lage: "So finden Sie uns", titel_kontakt: "Fragen? Wir helfen gern.",
    nur_deutsch: "",
    ausstattung: "Ausstattung", belegung: "Belegung", frei: "frei", belegt: "belegt",
    buchen: "Bei FeWo-direkt buchen", anfragen: "Anfragen",
    gaeste: n => n + (n == 1 ? " Gast" : " Gäste"),
    schlafzimmer: n => n + " Schlafzimmer",
    qm: n => n + " m²",
    preis_ab: "ab", pro_nacht: "/ Nacht", preis_anfrage: "Preis auf Anfrage",
    mindest: n => "Mindestaufenthalt " + n + (n == 1 ? " Nacht" : " Nächte"),
    keine_fotos: "Fotos folgen",
    lage_text: "Die Wohnungen liegen im Dahner Felsenland im südlichen Pfälzerwald (Wasgau) – einer Landschaft aus Wald, Burgruinen und roten Sandsteinfelsen. Genaue Adresse und Anfahrt folgen.",
    karte: "Auf der Karte ansehen",
    kontakt_text: "Am einfachsten buchen Sie direkt über FeWo-direkt. Bei Fragen erreichen Sie uns so:",
    kontakt_folgt: "Kontaktdaten folgen.",
    details: "Details & freie Termine",
    impressum: "Impressum & Datenschutz"
  },
  en: {
    nav_wohnungen: "Apartments", nav_lage: "Location", nav_kontakt: "Contact",
    hero_kicker: "Dahner Felsenland · Palatinate Forest",
    hero_titel: "Arrive. Unwind. Holiday.",
    hero_text: "Two cosy holiday apartments between forest and red sandstone rocks – perfect for hiking, climbing and unwinding.",
    hero_knopf: "See the apartments", hero_frei: "Availability",
    fakt_1: "2 holiday apartments", fakt_2: "Availability at a glance", fakt_3: "Secure booking via FeWo-direkt",
    kicker_wohnungen: "Our apartments", titel_wohnungen: "Two apartments, your home away from home",
    titel_lage: "How to find us", titel_kontakt: "Questions? We're happy to help.",
    nur_deutsch: "Please note: the host only speaks German. Booking via FeWo-direkt is the easiest way.",
    ausstattung: "Amenities", belegung: "Availability", frei: "available", belegt: "booked",
    buchen: "Book on FeWo-direkt", anfragen: "Enquire",
    gaeste: n => n + (n == 1 ? " guest" : " guests"),
    schlafzimmer: n => n + (n == 1 ? " bedroom" : " bedrooms"),
    qm: n => n + " m²",
    preis_ab: "from", pro_nacht: "/ night", preis_anfrage: "Price on request",
    mindest: n => "Minimum stay " + n + (n == 1 ? " night" : " nights"),
    keine_fotos: "Photos coming soon",
    lage_text: "The apartments are in the Dahner Felsenland in the southern Palatinate Forest (Wasgau) – a landscape of forest, castle ruins and red sandstone rocks. Exact address and directions will follow.",
    karte: "View on map",
    kontakt_text: "The easiest way to book is directly via FeWo-direkt. For questions you can reach us here:",
    kontakt_folgt: "Contact details will follow.",
    details: "Details & availability",
    impressum: "Legal notice & privacy"
  },
  fr: {
    nav_wohnungen: "Appartements", nav_lage: "Situation", nav_kontakt: "Contact",
    hero_kicker: "Dahner Felsenland · Forêt du Palatinat",
    hero_titel: "Arriver. Respirer. Profiter.",
    hero_text: "Deux appartements de vacances confortables entre forêt et rochers de grès rouge – idéal pour la randonnée, l'escalade et la détente.",
    hero_knopf: "Voir les appartements", hero_frei: "Disponibilités",
    fakt_1: "2 appartements de vacances", fakt_2: "Disponibilités en un coup d'œil", fakt_3: "Réservation sécurisée via FeWo-direkt",
    kicker_wohnungen: "Nos appartements", titel_wohnungen: "Deux appartements, un chez-soi le temps des vacances",
    titel_lage: "Comment nous trouver", titel_kontakt: "Des questions ? Nous sommes là.",
    nur_deutsch: "Attention : le propriétaire ne parle qu'allemand. Le plus simple est de réserver via FeWo-direkt.",
    ausstattung: "Équipements", belegung: "Disponibilités", frei: "libre", belegt: "réservé",
    buchen: "Réserver sur FeWo-direkt", anfragen: "Demander",
    gaeste: n => n + (n == 1 ? " personne" : " personnes"),
    schlafzimmer: n => n + (n == 1 ? " chambre" : " chambres"),
    qm: n => n + " m²",
    preis_ab: "à partir de", pro_nacht: "/ nuit", preis_anfrage: "Prix sur demande",
    mindest: n => "Séjour minimum " + n + (n == 1 ? " nuit" : " nuits"),
    keine_fotos: "Photos à venir",
    lage_text: "Les appartements se trouvent dans le Dahner Felsenland, au sud de la forêt du Palatinat (Wasgau) – un paysage de forêts, de châteaux en ruine et de rochers de grès rouge. L'adresse exacte et l'accès suivront.",
    karte: "Voir sur la carte",
    kontakt_text: "Le plus simple est de réserver directement sur FeWo-direkt. Pour toute question :",
    kontakt_folgt: "Coordonnées à venir.",
    details: "Détails & disponibilités",
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

function icon(name) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "ic");
  const use = document.createElementNS(ns, "use");
  use.setAttribute("href", "#i-" + name);
  svg.append(use);
  return svg;
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
  document.querySelectorAll("[data-t]").forEach(el => el.textContent = t(el.dataset.t));
  document.querySelectorAll(".hinweis-sprache, .hinweis-klein").forEach(el => el.hidden = !t("nur_deutsch"));

  const uebersicht = $("#uebersicht");
  uebersicht.textContent = "";
  wohnungen.forEach(w => uebersicht.append(baueKarte(w)));

  const liste = $("#liste");
  liste.textContent = "";
  wohnungen.forEach(w => liste.append(baueWohnung(w)));

  $("#adresse").hidden = !KONTAKT.adresse;
  $("#adresse span").textContent = KONTAKT.adresse;
  $("#karte").hidden = !KONTAKT.karte;
  if (KONTAKT.karte) $("#karte").href = KONTAKT.karte;

  const kl = $("#kontaktliste");
  kl.textContent = "";
  const eintrag = (ic, text, href) => {
    const li = document.createElement("li");
    li.append(icon(ic));
    const el = document.createElement(href ? "a" : "span");
    if (href) el.href = href;
    el.textContent = text;
    li.append(el); kl.append(li);
  };
  if (KONTAKT.telefon) eintrag("telefon", KONTAKT.telefon, "tel:" + KONTAKT.telefon.replace(/[^+\d]/g, ""));
  if (KONTAKT.email) eintrag("mail", KONTAKT.email, "mailto:" + KONTAKT.email);
  if (KONTAKT.adresse) eintrag("ort", KONTAKT.adresse);
  if (!kl.children.length) eintrag("mail", t("kontakt_folgt"));
}

// Kleine Karte für die Übersicht oben, springt zur ausführlichen Wohnung.
function baueKarte(w) {
  const a = document.createElement("a");
  a.className = "karte-w";
  a.href = "#" + w.id;
  const bild = document.createElement("div");
  bild.className = "karte-bild";
  const foto = (w.fotos || [])[0];
  if (foto) bild.style.backgroundImage = "url('" + FOTO_URL + encodeURI(foto) + "')";
  else { bild.classList.add("leer"); bild.append(icon("haus")); }

  const text = document.createElement("div");
  text.className = "karte-text";
  const h = document.createElement("h3");
  h.textContent = feld(w, "name");
  const klein = document.createElement("p");
  klein.className = "klein";
  klein.textContent = [["gaeste", w.gaeste], ["schlafzimmer", w.schlafzimmer], ["qm", w.qm]].filter(([, v]) => v).map(([k, v]) => t(k, v)).join(" · ");

  const fuss = document.createElement("div");
  fuss.className = "karte-fuss";
  const preis = document.createElement("p");
  preis.style.margin = "0";
  if (w.preis_ab) {
    const b = document.createElement("strong");
    b.textContent = Number(w.preis_ab).toLocaleString(sprache) + " €";
    const n = document.createElement("span");
    n.textContent = " " + t("pro_nacht");
    preis.append(t("preis_ab") + " ", b, n);
  } else preis.textContent = t("preis_anfrage");
  const mehr = document.createElement("span");
  mehr.className = "mehr-link";
  mehr.append(t("details"), icon("pfeil"));
  fuss.append(preis, mehr);

  text.append(h, klein, fuss);
  a.append(bild, text);
  return a;
}

function baueWohnung(w) {
  const el = $("#vorlage-wohnung").content.firstElementChild.cloneNode(true);
  el.id = w.id;
  el.querySelectorAll("[data-t]").forEach(x => x.textContent = t(x.dataset.t));
  el.querySelector(".name").textContent = feld(w, "name");
  el.querySelector(".text").textContent = feld(w, "text");

  const eck = el.querySelector(".eckdaten");
  [["gaeste", "gast", w.gaeste], ["schlafzimmer", "bett", w.schlafzimmer], ["qm", "flaeche", w.qm]].forEach(([k, ic, v]) => {
    if (!v) return;
    const li = document.createElement("li");
    li.append(icon(ic), t(k, v));
    eck.append(li);
  });

  const aus = el.querySelector(".ausstattung");
  (w.ausstattung || []).forEach(k => {
    if (!AUSSTATTUNG[k]) return;
    const li = document.createElement("li");
    li.append(icon("haken"), AUSSTATTUNG[k][sprache]);
    aus.append(li);
  });
  if (!aus.children.length) { aus.previousElementSibling.remove(); aus.remove(); }

  if (w.preis_ab) {
    el.querySelector(".preis-ab").textContent = t("preis_ab");
    el.querySelector(".preis-betrag").textContent = Number(w.preis_ab).toLocaleString(sprache) + " €";
    el.querySelector(".preis-nacht").textContent = t("pro_nacht");
  } else {
    el.querySelector(".preis-ab").textContent = t("preis_anfrage");
  }
  el.querySelector(".mindest").textContent = w.mindest_naechte ? t("mindest", w.mindest_naechte) : "";

  const buchen = el.querySelector(".buchen");
  if (w.fewo_url) buchen.href = w.fewo_url;
  else if (KONTAKT.email) {
    buchen.href = "mailto:" + KONTAKT.email + "?subject=" + encodeURIComponent(feld(w, "name"));
    buchen.removeAttribute("target");
    buchen.querySelector("span").textContent = t("anfragen");
  } else buchen.remove();

  el.querySelector(".kalender-box").id = "kalender-" + w.id;
  el.querySelector(".frei-link").href = "#kalender-" + w.id;

  baueFotos(el.querySelector(".fotos"), w);
  baueKalender(el, w.id);
  return el;
}

function baueFotos(box, w) {
  const fotos = w.fotos || [];
  if (!fotos.length) {
    box.classList.add("leer");
    const p = document.createElement("span");
    p.textContent = t("keine_fotos");
    box.append(icon("haus"), p);
    return;
  }
  fotos.slice(0, 5).forEach((f, i) => {
    const b = document.createElement("button");
    b.type = "button";
    if (i === 0) b.className = "gross";
    const img = document.createElement("img");
    img.src = FOTO_URL + encodeURI(f);
    img.alt = feld(w, "name") + " – Foto " + (i + 1);
    img.loading = i === 0 ? "eager" : "lazy";
    b.append(img);
    b.onclick = () => oeffneGalerie(fotos, i);
    box.append(b);
  });
  if (fotos.length > 1) {
    const mehr = document.createElement("span");
    mehr.className = "mehr";
    mehr.textContent = "1 / " + fotos.length;
    box.firstElementChild.append(mehr);
  }
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

function monateSichtbar() {
  return window.innerWidth <= 760 ? 1 : window.innerWidth <= 1000 ? 2 : 3;
}

function baueKalender(el, wohnung) {
  const box = el.querySelector(".kalender");
  let versatz = 0;
  const maxVersatz = 11;
  const zeichne = () => {
    box.textContent = "";
    for (let m = 0; m < monateSichtbar(); m++) box.append(baueMonat(wohnung, versatz + m));
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

let spalten = monateSichtbar();
window.addEventListener("resize", () => {
  if (monateSichtbar() !== spalten) { spalten = monateSichtbar(); zeige(); }
});

start();
