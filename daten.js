// Gemeinsame Einstellungen für die Seite (index.html) und den Admin-Bereich (admin.html).
// Kontaktdaten und Ort hier eintragen – leere Felder werden auf der Seite ausgeblendet.

const SB_URL = "https://owbbsnujnkhyyqvagtai.supabase.co";
const SB_KEY = "sb_publishable_29TK9hJ-e8e4eW9rp_eA8A__EHL2Kga";
const FOTO_URL = SB_URL + "/storage/v1/object/public/fewo/";

const KONTAKT = {
  name: "Familie Fichter",
  telefon: "",          // z. B. "+49 123 456789"
  email: "",            // z. B. "ferienwohnung@beispiel.de"
  adresse: "",          // z. B. "Musterstraße 1, 12345 Musterort"
  karte: ""             // Link zu OpenStreetMap oder Google Maps
};

// Ausstattung: Schlüssel → Text in jeder Sprache. Im Admin-Bereich per Häkchen wählbar.
const AUSSTATTUNG = {
  wlan:          { de: "WLAN", en: "Wi-Fi", fr: "Wi-Fi" },
  kueche:        { de: "Voll ausgestattete Küche", en: "Fully equipped kitchen", fr: "Cuisine équipée" },
  spuelmaschine: { de: "Spülmaschine", en: "Dishwasher", fr: "Lave-vaisselle" },
  waschmaschine: { de: "Waschmaschine", en: "Washing machine", fr: "Lave-linge" },
  tv:            { de: "Fernseher", en: "TV", fr: "Télévision" },
  balkon:        { de: "Balkon", en: "Balcony", fr: "Balcon" },
  terrasse:      { de: "Terrasse", en: "Terrace", fr: "Terrasse" },
  garten:        { de: "Garten", en: "Garden", fr: "Jardin" },
  grill:         { de: "Grill", en: "Barbecue", fr: "Barbecue" },
  parkplatz:     { de: "Parkplatz", en: "Parking", fr: "Parking" },
  bettwaesche:   { de: "Bettwäsche & Handtücher", en: "Bed linen & towels", fr: "Draps & serviettes" },
  kinderbett:    { de: "Kinderbett auf Anfrage", en: "Baby cot on request", fr: "Lit bébé sur demande" },
  haustiere:     { de: "Haustiere erlaubt", en: "Pets allowed", fr: "Animaux acceptés" },
  nichtraucher:  { de: "Nichtraucher", en: "Non-smoking", fr: "Non-fumeur" }
};

// Wird gezeigt, solange die Datenbank noch leer oder nicht erreichbar ist.
const STANDARD_WOHNUNGEN = [
  {
    id: "wohnung-1", sort: 1,
    name_de: "Wohnung 1", name_en: "Apartment 1", name_fr: "Appartement 1",
    text_de: "Hier steht bald die Beschreibung der ersten Wohnung.",
    text_en: "A description of the first apartment will follow soon.",
    text_fr: "La description du premier appartement suivra bientôt.",
    gaeste: null, schlafzimmer: null, qm: null, preis_ab: null, mindest_naechte: null,
    ausstattung: [], fewo_url: null, fotos: []
  },
  {
    id: "wohnung-2", sort: 2,
    name_de: "Wohnung 2", name_en: "Apartment 2", name_fr: "Appartement 2",
    text_de: "Hier steht bald die Beschreibung der zweiten Wohnung.",
    text_en: "A description of the second apartment will follow soon.",
    text_fr: "La description du deuxième appartement suivra bientôt.",
    gaeste: null, schlafzimmer: null, qm: null, preis_ab: null, mindest_naechte: null,
    ausstattung: [], fewo_url: null, fotos: []
  }
];
