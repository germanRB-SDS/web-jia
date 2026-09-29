import type { Person } from "./types";

const POSTERS = "assets/cep/talleres-carteles";
const CUBE = "assets/cube-staff-final";
const CARDS_2026_09_29 = "assets/whatsapp/item-cubo";

/**
 * PEOPLE. Names are transcribed from the printed assets; nobody was identified
 * by face. Poster 3 prints "FRRANCISCO" (typo on the asset); recorded here as
 * "Francisco" and flagged. Card ↔ tallerista links are name matches, flagged
 * provisional until the organisation confirms them.
 */
export const people: readonly Person[] = [
  // ---- Talleristas (from workshop posters) ---------------------------------
  { id: "p-manuel-salmeron", name: "Manuel Salmerón Águila", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "cubo-40", status: "confirmed", provenance: { source: `${POSTERS}/1.png` } },
  { id: "p-christian-padial", name: "Christian Padial Barcina", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "cubo-37", status: "confirmed", provenance: { source: `${POSTERS}/2.png` } },
  { id: "p-francisco-bello", name: "Francisco J. Bello Plaza", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "cubo-38", status: "provisional", provenance: { source: `${POSTERS}/3.png`, note: "El cartel imprime «FRRANCISCO»; se asume errata. Confirmar." } },
  { id: "p-ismael-navarro", name: "Ismael Navarro Membrilla", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "cubo-34", status: "confirmed", provenance: { source: `${POSTERS}/4.png` } },
  { id: "p-araceli-merino", name: "Araceli Merino Chacón", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "cubo-33", status: "confirmed", provenance: { source: `${POSTERS}/5.png` } },
  { id: "p-inmaculada-contreras", name: "Inmaculada Contreras Sedes", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "cubo-35", status: "provisional", provenance: { source: `${POSTERS}/6.png`, note: "Tarjeta 35 del cubo («Inma Contreras · Tallerista»), asociada por coincidencia de nombre y rol." } },
  { id: "p-amina-pallares", name: "Ámina Pallarés Calvi", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "cubo-41", status: "provisional", provenance: { source: `${POSTERS}/7.png`, note: "Tarjeta 41 del cubo («Ámina Pallarés · Tallerista»), asociada por coincidencia de nombre y rol." } },
  { id: "p-mariola-martin", name: "Mariola Martín Sáez", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "cubo-39", status: "confirmed", provenance: { source: `${POSTERS}/8.png` } },
  { id: "p-jose-carlos-hernandez", name: "José Carlos Hernández Jiménez", role: "tallerista", cardRoleLabel: "Tallerista", cardMediaId: "cubo-36", status: "confirmed", provenance: { source: `${POSTERS}/9.png` } },

  // ---- Team cube cards (assets/cube-staff-final, [59-0]). The cube shows everyone with a card, by card number. ----
  { id: "p-jose-luis-herrador", name: "José Luis Herrador", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "cubo-10", status: "confirmed", provenance: { source: `${CUBE}/10.png` } },
  { id: "p-irene-castaneda", name: "Irene Castañeda", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-11", status: "confirmed", provenance: { source: `${CUBE}/11.png` } },
  { id: "p-antonio-orellana", name: "Antonio Orellana", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "cubo-12", status: "confirmed", provenance: { source: `${CUBE}/12.png` } },
  { id: "p-yajaira-grao", name: "Yajaira Grao", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-13", status: "confirmed", provenance: { source: `${CUBE}/13.png` } },
  { id: "p-jacinto-barragan", name: "Jacinto Barragán", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "cubo-14", status: "confirmed", provenance: { source: `${CUBE}/14.png` } },
  { id: "p-juan-carlos-munoz", name: "Juan Carlos Muñoz", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "cubo-15", status: "confirmed", provenance: { source: `${CUBE}/15.png` } },
  { id: "p-enrique-brotons", name: "Enrique Brotons", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "cubo-16", status: "confirmed", provenance: { source: `${CUBE}/16.png` } },
  { id: "p-maria-jesus-lopez", name: "Mª Jesús López", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-17", status: "confirmed", provenance: { source: `${CUBE}/17.png` } },
  { id: "p-julieta-perez-ruiz", name: "Julieta Pérez-Ruiz", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-18", status: "confirmed", provenance: { source: `${CUBE}/18.png` } },
  { id: "p-clara-martinez", name: "Clara Martínez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-19", status: "confirmed", provenance: { source: `${CUBE}/19.png` } },
  { id: "p-maria-toledo", name: "María Toledo", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-20", status: "confirmed", provenance: { source: `${CUBE}/20.png` } },
  { id: "p-juan-rubi", name: "Juan Rubí", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "cubo-21", status: "confirmed", provenance: { source: `${CUBE}/21.png` } },
  { id: "p-casi-lopez", name: "Casi López", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-22", status: "confirmed", provenance: { source: `${CUBE}/22.png` } },
  { id: "p-manuel-rubia", name: "Manuel Rubia", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "cubo-23", status: "confirmed", provenance: { source: `${CUBE}/23.png` } },
  { id: "p-maria-sanchez", name: "María Sánchez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-24", status: "confirmed", provenance: { source: `${CUBE}/24.png` } },
  { id: "p-paqui-rodriguez", name: "Paqui Rodríguez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-25", status: "confirmed", provenance: { source: `${CUBE}/25.png` } },
  { id: "p-isa-rodriguez", name: "Isa Rodríguez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-26", status: "confirmed", provenance: { source: `${CUBE}/26.png` } },
  { id: "p-inma-carrillo", name: "Inma Carrillo", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-27", status: "confirmed", provenance: { source: `${CUBE}/27.png` } },
  { id: "p-pedro-l-sanchez", name: "Pedro L. Sánchez", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "cubo-28", status: "confirmed", provenance: { source: `${CUBE}/28.png` } },
  { id: "p-jose-manuel-alonso", name: "José Manuel Alonso", role: "asesoria-cep", cardRoleLabel: "Asesor CEP", cardMediaId: "cubo-29", status: "confirmed", provenance: { source: `${CUBE}/29.png` } },
  { id: "p-susana-castillo", name: "Susana Castillo", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-30", status: "confirmed", provenance: { source: `${CUBE}/30.png` } },
  { id: "p-adela-perez", name: "Adela Pérez", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-31", status: "confirmed", provenance: { source: `${CUBE}/31.png` } },
  { id: "p-silvia-cruz", name: "Silvia Cruz", role: "asesoria-cep", cardRoleLabel: "Asesora CEP", cardMediaId: "cubo-32", status: "confirmed", provenance: { source: `${CUBE}/32.png` } },
  { id: "p-alberto-romero", name: "Alberto Romero", role: "coordinacion", cardRoleLabel: "Coordinación", cardMediaId: "cubo-43", status: "confirmed", provenance: { source: `${CUBE}/43.png` } },
  { id: "p-adolfo-arino", name: "Adolfo Ariño", role: "coordinacion", cardRoleLabel: "Coordinación", cardMediaId: "cubo-44", status: "confirmed", provenance: { source: `${CUBE}/44.png` } },
  { id: "p-ruben-rubio", name: "Rubén Rubio Troyano", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-45", status: "confirmed", provenance: { source: `${CUBE}/45.png` } },
  { id: "p-raul-torres", name: "Raúl Torres Gordon", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-46", status: "confirmed", provenance: { source: `${CUBE}/46.png` } },
  { id: "p-maria-hernandez", name: "María Hernández", role: "colaboracion", cardRoleLabel: "Colaboradora", cardMediaId: "cubo-47", status: "confirmed", provenance: { source: `${CUBE}/47.png` } },
  { id: "p-almudena-bernal", name: "Almudena Bernal", role: "coordinacion-cep", cardRoleLabel: "Coordinación CEP", cardMediaId: "cubo-58", status: "confirmed", provenance: { source: `${CUBE}/58.png` } },

  // ---- «Experiencia de éxito» (JIA [55-0]). Their cards are not in the final set of [59-0]: no card in the cube. ----
  { id: "p-gabi-moral", name: "Gabi Moral", role: "experiencia-exito", cardRoleLabel: "Experiencia de éxito", cardMediaId: null, status: "confirmed", provenance: { source: `${CARDS_2026_09_29}/59.png` } },
  { id: "p-ruben-lopez", name: "Rubén López", role: "experiencia-exito", cardRoleLabel: "Experiencia de éxito", cardMediaId: null, status: "confirmed", provenance: { source: `${CARDS_2026_09_29}/60.png` } },
  { id: "p-gonzalo-carretero", name: "Gonzalo Carretero", role: "experiencia-exito", cardRoleLabel: "Experiencia de éxito", cardMediaId: null, status: "confirmed", provenance: { source: `${CARDS_2026_09_29}/61.png` } },
  { id: "p-maria-lopez", name: "María López", role: "experiencia-exito", cardRoleLabel: "Experiencia de éxito", cardMediaId: null, status: "confirmed", provenance: { source: `${CARDS_2026_09_29}/62.png` } },
  { id: "p-pilar-diaz", name: "Pilar Díaz", role: "experiencia-exito", cardRoleLabel: "Experiencia de éxito", cardMediaId: null, status: "confirmed", provenance: { source: `${CARDS_2026_09_29}/65.png` } },
  { id: "p-toni-navarro", name: "Toni Navarro", role: "experiencia-exito", cardRoleLabel: "Experiencia de éxito", cardMediaId: null, status: "confirmed", provenance: { source: `${CARDS_2026_09_29}/66.png` } },
  { id: "p-cristina-robles-leon", name: "Cristina Robles / León", role: "experiencia-exito", cardRoleLabel: "Experiencia de éxito", cardMediaId: null, status: "provisional", provenance: { source: `${CARDS_2026_09_29}/67.png`, note: "La tarjeta muestra a dos personas y rotula «CRISTINA ROBLES/ LEÓN». Confirmar cómo se nombran." } },

  // ---- People who first appear on the final cube cards ([59-0]); name and role as printed on the card. ----
  { id: "p-rafa-fortis", name: "Rafa Fortis", role: "conferenciante", cardRoleLabel: "Conferenciante", cardMediaId: "cubo-42", status: "confirmed", provenance: { source: `${CUBE}/42.png` } },
  { id: "p-javier-montoya", name: "Javier Montoya", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-48", status: "confirmed", provenance: { source: `${CUBE}/48.png` } },
  { id: "p-nerea-mazuecos", name: "Nerea Mazuecos", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-49", status: "provisional", provenance: { source: `${CUBE}/49.png`, note: "La tarjeta imprime «Colaborador»; se transcribe tal cual. Confirmar si debe ser «Colaboradora»." } },
  { id: "p-german-roche", name: "Germán Roche", role: "creacion-web", cardRoleLabel: "Web Creator", cardMediaId: "cubo-50", status: "confirmed", provenance: { source: `${CUBE}/50.png` } },
  { id: "p-belen-gonzalez", name: "Belén González", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-51", status: "provisional", provenance: { source: `${CUBE}/51.png`, note: "La tarjeta imprime «Colaborador»; se transcribe tal cual." } },
  { id: "p-natalia-oller", name: "Natalia Oller", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-52", status: "provisional", provenance: { source: `${CUBE}/52.png`, note: "La tarjeta imprime «Colaborador»; se transcribe tal cual." } },
  { id: "p-antonio-garcia", name: "Antonio García", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-53", status: "confirmed", provenance: { source: `${CUBE}/53.png` } },
  { id: "p-andres-garcia", name: "Andrés García", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-54", status: "confirmed", provenance: { source: `${CUBE}/54.png` } },
  { id: "p-lucia-lopez", name: "Lucía López", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-55", status: "provisional", provenance: { source: `${CUBE}/55.png`, note: "La tarjeta imprime «Colaborador»; se transcribe tal cual." } },
  { id: "p-emna-lafront", name: "Emna Lafront", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-56", status: "provisional", provenance: { source: `${CUBE}/56.png`, note: "La tarjeta imprime «Colaborador»; se transcribe tal cual." } },
  { id: "p-marina-heredia", name: "Marina Heredia", role: "colaboracion", cardRoleLabel: "Colaborador", cardMediaId: "cubo-57", status: "provisional", provenance: { source: `${CUBE}/57.png`, note: "La tarjeta imprime «Colaborador»; se transcribe tal cual." } },
];

