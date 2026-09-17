import type { Person } from "./types";

const POSTERS = "assets/cep/talleres-carteles";
const CARDS = "assets/images-staff";

/**
 * PEOPLE. Names are transcribed from the printed assets; nobody was identified
 * by face. Poster 3 prints "FRRANCISCO" (typo on the asset); recorded here as
 * "Francisco" and flagged. Card ↔ tallerista links are name matches, flagged
 * provisional until the organisation confirms them.
 */
export const people: readonly Person[] = [
  // ---- Talleristas (from workshop posters) ---------------------------------
  { id: "p-manuel-salmeron", name: "Manuel Salmerón Águila", role: "tallerista", cardRoleLabel: null, cardMediaId: null, status: "confirmed", provenance: { source: `${POSTERS}/1.png` } },
  { id: "p-christian-padial", name: "Christian Padial Barcina", role: "tallerista", cardRoleLabel: null, cardMediaId: null, status: "confirmed", provenance: { source: `${POSTERS}/2.png` } },
  { id: "p-francisco-bello", name: "Francisco J. Bello Plaza", role: "tallerista", cardRoleLabel: null, cardMediaId: null, status: "provisional", provenance: { source: `${POSTERS}/3.png`, note: "El cartel imprime «FRRANCISCO»; se asume errata. Confirmar." } },
  { id: "p-ismael-navarro", name: "Ismael Navarro Membrilla", role: "tallerista", cardRoleLabel: null, cardMediaId: null, status: "confirmed", provenance: { source: `${POSTERS}/4.png` } },
  { id: "p-araceli-merino", name: "Araceli Merino Chacón", role: "tallerista", cardRoleLabel: null, cardMediaId: null, status: "confirmed", provenance: { source: `${POSTERS}/5.png` } },
  { id: "p-inmaculada-contreras", name: "Inmaculada Contreras Sedes", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "card-31", status: "provisional", provenance: { source: `${POSTERS}/6.png`, note: "Tarjeta 31 («Inma Contreras · Tallerista») asociada por coincidencia de nombre y rol. Confirmar." } },
  { id: "p-amina-pallares", name: "Ámina Pallarés Calvi", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "card-37", status: "provisional", provenance: { source: `${POSTERS}/7.png`, note: "Tarjeta 37 («Ámina Pallarés · Tallerista») asociada por coincidencia de nombre y rol. Confirmar." } },
  { id: "p-mariola-martin", name: "Mariola Martín Sáez", role: "tallerista", cardRoleLabel: null, cardMediaId: null, status: "confirmed", provenance: { source: `${POSTERS}/8.png` } },
  { id: "p-jose-carlos-hernandez", name: "José Carlos Hernández Jiménez", role: "tallerista", cardRoleLabel: null, cardMediaId: null, status: "confirmed", provenance: { source: `${POSTERS}/9.png` } },

  // ---- Team cards (assets/images-staff). Order = file number. ---------------
  { id: "p-jose-luis-herrador", name: "José Luis Herrador", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "card-6", status: "confirmed", provenance: { source: `${CARDS}/6.png` } },
  { id: "p-irene-castaneda", name: "Irene Castañeda", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-7", status: "confirmed", provenance: { source: `${CARDS}/7.png` } },
  { id: "p-antonio-orellana", name: "Antonio Orellana", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "card-8", status: "confirmed", provenance: { source: `${CARDS}/8.png` } },
  { id: "p-yajaira-grao", name: "Yajaira Grao", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-9", status: "confirmed", provenance: { source: `${CARDS}/9.png` } },
  { id: "p-jacinto-barragan", name: "Jacinto Barragán", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "card-10", status: "confirmed", provenance: { source: `${CARDS}/10.png` } },
  { id: "p-juan-carlos-munoz", name: "Juan Carlos Muñoz", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "card-11", status: "confirmed", provenance: { source: `${CARDS}/11.png` } },
  { id: "p-enrique-brotons", name: "Enrique Brotons", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "card-12", status: "confirmed", provenance: { source: `${CARDS}/12.png` } },
  { id: "p-maria-jesus-lopez", name: "Mª Jesús López", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-13", status: "confirmed", provenance: { source: `${CARDS}/13.png` } },
  { id: "p-julieta-perez-ruiz", name: "Julieta Pérez-Ruiz", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-14", status: "confirmed", provenance: { source: `${CARDS}/14.png` } },
  { id: "p-clara-martinez", name: "Clara Martínez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-15", status: "confirmed", provenance: { source: `${CARDS}/15.png` } },
  { id: "p-maria-toledo", name: "María Toledo", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-16", status: "confirmed", provenance: { source: `${CARDS}/16.png` } },
  { id: "p-juan-rubi", name: "Juan Rubí", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "card-17", status: "confirmed", provenance: { source: `${CARDS}/17.png` } },
  { id: "p-casi-lopez", name: "Casi López", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-18", status: "confirmed", provenance: { source: `${CARDS}/18.png` } },
  { id: "p-manuel-rubia", name: "Manuel Rubia", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "card-19", status: "confirmed", provenance: { source: `${CARDS}/19.png` } },
  { id: "p-maria-sanchez", name: "María Sánchez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-20", status: "confirmed", provenance: { source: `${CARDS}/20.png` } },
  { id: "p-paqui-rodriguez", name: "Paqui Rodríguez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-21", status: "confirmed", provenance: { source: `${CARDS}/21.png` } },
  { id: "p-isa-rodriguez", name: "Isa Rodríguez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-22", status: "confirmed", provenance: { source: `${CARDS}/22.png` } },
  { id: "p-inma-carrillo", name: "Inma Carrillo", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-23", status: "confirmed", provenance: { source: `${CARDS}/23.png` } },
  { id: "p-pedro-l-sanchez", name: "Pedro L. Sánchez", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "card-24", status: "confirmed", provenance: { source: `${CARDS}/24.png` } },
  { id: "p-jose-manuel-alonso", name: "José Manuel Alonso", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "card-25", status: "confirmed", provenance: { source: `${CARDS}/25.png` } },
  { id: "p-susana-castillo", name: "Susana Castillo", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-26", status: "confirmed", provenance: { source: `${CARDS}/26.png` } },
  { id: "p-adela-perez", name: "Adela Pérez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-27", status: "confirmed", provenance: { source: `${CARDS}/27.png` } },
  { id: "p-silvia-cruz", name: "Silvia Cruz", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "card-28", status: "confirmed", provenance: { source: `${CARDS}/28.png` } },
  { id: "p-alberto-romero", name: "Alberto Romero", role: "coordinacion", cardRoleLabel: "Coordinación", cardMediaId: "card-39", status: "confirmed", provenance: { source: `${CARDS}/39.png` } },
  { id: "p-adolfo-arino", name: "Adolfo Ariño", role: "coordinacion", cardRoleLabel: "Coordinación", cardMediaId: "card-40", status: "confirmed", provenance: { source: `${CARDS}/40.png` } },
  { id: "p-ruben-rubio", name: "Rubén Rubio Troyano", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "card-41", status: "confirmed", provenance: { source: `${CARDS}/41.png` } },
  { id: "p-raul-torres", name: "Raúl Torres Gordon", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "card-42", status: "confirmed", provenance: { source: `${CARDS}/42.png` } },
  { id: "p-maria-hernandez", name: "María Hernández", role: "colaboracion", cardRoleLabel: "Colaboradora", cardMediaId: "card-43", status: "confirmed", provenance: { source: `${CARDS}/43.png` } },
  { id: "p-almudena-bernal", name: "Almudena Bernal", role: "coordinacion-cep", cardRoleLabel: "Coordinación CEP", cardMediaId: "card-46", status: "confirmed", provenance: { source: `${CARDS}/46.png` } },
];

/** Order in which the team strip shows people: coordination first, then advisers, then collaborators. */
export const TEAM_ROLE_ORDER: readonly Person["role"][] = [
  "coordinacion-cep",
  "coordinacion",
  "asesoria-cep",
  "colaboracion",
];
