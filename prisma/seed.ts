import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function main() {
  // Clean up existing data (order matters for foreign keys)
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.helpRequest.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const anna = await prisma.user.create({
    data: {
      id: "u1",
      name: "Anna Kowalska",
      phoneNumber: "+48600100100",
      password: hashPassword("Haslo123"),
      email: "anna.kowalska@example.com",
      role: "VOLUNTEER",
      avatarUrl: "https://ui-avatars.com/api/?name=Anna+Kowalska&background=random",
    },
  });

  const maria = await prisma.user.create({
    data: {
      id: "u3",
      name: "Pani Maria",
      phoneNumber: "+48600300300",
      password: hashPassword("Haslo123"),
      email: "maria@example.com",
      role: "SEEKER",
      avatarUrl: "https://ui-avatars.com/api/?name=Pani+Maria&background=random",
    },
  });

  const halina = await prisma.user.create({
    data: {
      id: "u2",
      name: "Pani Halina",
      phoneNumber: "+48600200200",
      password: hashPassword("Haslo123"),
      email: "halina@example.com",
      role: "SEEKER",
      avatarUrl: null,
    },
  });

  const jan = await prisma.user.create({
    data: {
      id: "u4",
      name: "Pan Janusz",
      phoneNumber: "+48600400400",
      password: hashPassword("Haslo123"),
      email: "janusz@example.com",
      role: "VOLUNTEER",
      avatarUrl: null,
    },
  });

  // Create help requests:

  // Request 1 (Seeker Needs Help): IN_PROGRESS (anna volunteered for maria's request)
  const request1 = await prisma.helpRequest.create({
    data: {
      id: "r1",
      title: "Zakupy spożywcze i wniesienie na 3. piętro",
      description:
        "Szukam kogoś, kto mógłby pomóc mi z większymi zakupami w najbliższy czwartek. Mieszkam na trzecim piętrze bez windy.",
      type: "IN_PERSON",
      status: "IN_PROGRESS",
      address: "ul. Kwiatowa 12, Kraków",
      latitude: 50.0647,
      longitude: 19.945,
      authorId: maria.id,
      volunteerId: anna.id,
    },
  });

  // Request 2 (Seeker Needs Help): OPEN 
  const request2 = await prisma.helpRequest.create({
    data: {
      id: "r2",
      title: "Pomoc przy wniesieniu leków z apteki",
      description:
        "Dzień dobry, potrzebuję kogoś, kto odbierze moje leki z apteki na ul. Długiej i przyniesie je do domu. Mam problemy z chodzeniem.",
      type: "IN_PERSON",
      status: "OPEN",
      address: "ul. Słoneczna 5, Kraków",
      latitude: 50.0614,
      longitude: 19.937,
      authorId: halina.id,
    },
  });

  // Request 3 (Seeker Needs Help): OPEN
  const request3 = await prisma.helpRequest.create({
    data: {
      id: "r3",
      title: "Rozmowa telefoniczna — samotna seniorka",
      description:
        "Szukam kogoś do codziennej rozmowy telefonicznej. Mieszkam sama i brakuje mi kontaktu z ludźmi.",
      type: "REMOTE",
      status: "OPEN",
      address: null,
      authorId: maria.id,
    },
  });

  // Request 4 (Volunteer Offering Help): OPEN
  const request4 = await prisma.helpRequest.create({
    data: {
      id: "r4",
      title: "[OFERTA POMOCY] Zawieźć do lekarza na terenie Krakowa",
      description:
        "Oferuję pomoc w transporcie do przychodni lub lekarza. Mam własny samochód i jestem dostępny codziennie po 16:00.",
      type: "IN_PERSON",
      status: "OPEN",
      address: "Kraków i okolice",
      authorId: jan.id,
    },
  });

  // Request 5 (Volunteer Offering Help): IN_PROGRESS (halina accepted jan's offer)
  const request5 = await prisma.helpRequest.create({
    data: {
      id: "r5",
      title: "[OFERTA POMOCY] Pomoc w obsłudze komputera / internetu",
      description:
        "Jeżeli ktoś potrzebuje pomocy np. przy założeniu maila, zakupach internetowych albo e-Receptach - oferuję pomoc zdalną przez telefon.",
      type: "REMOTE",
      status: "IN_PROGRESS",
      address: null,
      authorId: jan.id,
      volunteerId: halina.id, // Halina accepted the offer and is treating this as the "volunteer" role architecturally
    },
  });

  // Create initial messages for the IN_PROGRESS requests
  const now = new Date();
  
  // Chat for r1 (Maria needs help, Anna is volunteer)
  const conv1 = await prisma.conversation.create({
    data: {
      id: "c1",
      requestId: request1.id,
      volunteerId: anna.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        id: "m1",
        body: "Dzień dobry! Dziękuję za zgłoszenie. Czy moglibyśmy się umówić na jutro około godziny 10:00?",
        senderId: anna.id,
        conversationId: conv1.id,
        createdAt: new Date(now.getTime() - 3600_000), // 1 hour ago
      },
      {
        id: "m2",
        body: "Oczywiście, godzina 10:00 bardzo mi odpowiada. Gdzie dokładnie mam podejść?",
        senderId: maria.id,
        conversationId: conv1.id,
        createdAt: new Date(now.getTime() - 3000_000), // 50 min ago
      },
    ],
  });

  // Chat for r5 (Jan offers help, Halina accepted)
  const conv5 = await prisma.conversation.create({
    data: {
      id: "c5",
      requestId: request5.id,
      volunteerId: halina.id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        id: "m3",
        body: "Panie Janie, ja bym bardzo chciała, żeby mi pan pokazał, jak odebrać e-Receptę na telefonie.",
        senderId: halina.id,
        conversationId: conv5.id,
        createdAt: new Date(now.getTime() - 7200_000), // 2 hours ago
      },
      {
        id: "m4",
        body: "Dzień dobry Pani Halino! Jasne. Możemy się zdzwonić dzisiaj wieczorem i spróbuję to krok po kroku wytłumaczyć.",
        senderId: jan.id,
        conversationId: conv5.id,
        createdAt: new Date(now.getTime() - 6500_000), // ~110 min ago
      },
    ],
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
