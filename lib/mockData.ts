import type { HelpRequest, User, Message } from "@/types";

export const currentUser: User = {
  id: "u1",
  name: "Anna Kowalska",
  location: "Gmina Pcim",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCQolfvzpDWhawKkem9SnuFbqGFR9PLEaRMo2oQmBNkkW3QZreaPnjt4zAg_nlRbCdPYad-KZbaECwrstkVeEAlFyBkkT6DTiH393C-sCi4dtZxy4tDKdRRaenV5QWMgjh304nVWzlpX8knBZslgGuiI9YGFGvumyCt7GrZ41iMEnOngQzaAFB0LHgGem3aDCutoEO6A90mJn178xa1ImrxFuEbTxwPeLIGtGRcYiOmIXHakXNUD_up-wKx9mgSNriV1pnLRtg5TUmF",
  trustScore: 98,
  helpGiven: 24,
  helpReceived: 8,
  endorsements: 12,
};

export const mockRequests: HelpRequest[] = [
  {
    id: "r1",
    title: "Zakupy spożywcze dla seniorki",
    description:
      "Potrzebuję pomocy w przyniesieniu kilku podstawowych produktów ze sklepu...",
    category: "shopping",
    type: "in-person",
    author: {
      id: "u2",
      name: "Anna Nowak",
    },
    distanceKm: 1.2,
    createdAt: new Date(),
    status: "open",
  },
  {
    id: "r2",
    title: "Zakupy spożywcze i wniesienie na 3. piętro",
    description:
      "Szukam kogoś, kto mógłby pomóc mi z większymi zakupami w najbliższy czwartek...",
    category: "shopping",
    type: "in-person",
    author: {
      id: "u3",
      name: "Pani Halina",
    },
    distanceKm: 0.5,
    createdAt: new Date(),
    status: "open",
  },
];

export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "u3",
    text: "Dzień dobry! Dziękuję za zgłoszenie. Czy moglibyśmy się umówić na jutro około godziny 10:00?",
    sentAt: new Date(),
  },
  {
    id: "m2",
    senderId: "u1",
    text: "Oczywiście, godzina 10:00 bardzo mi odpowiada. Gdzie dokładnie mam podejść?",
    sentAt: new Date(),
  },
];

export const chatPartner: User = {
  id: "u3",
  name: "Pani Maria",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCbALnmldPjrYF8c3Cf8EhTa1F_8YRcosFojK9_fyTEs3FoSpbslEW0gSZ0tCa_HOw3INoWgC2y1WZQBG510DRWZgGYZXro6QKQiZZkLYOtOcgQSZdWK2U5CyhT60pN2XmvWUzG-TVqDpZirvKmFAJgqvfi2qbfqRmVBUJdfaetTasehjuhG7UnUGOEnJZ4So1lE8CzMcsp1iGLJCyoElzHn_4htbUo7eZftMMrNUYVrXGk_iiYQcgdhmxhsYtAy13kh_9H4eA78wfg",
  trustScore: 98,
};
