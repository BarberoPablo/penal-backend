import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const civilizations = [
  { id: "franks", name: "Franks", imageUrl: "https://i.postimg.cc/XJzDL7cR/menu-techtree-franks.webp", cost: 240 },
  { id: "britons", name: "Britons", imageUrl: "https://i.postimg.cc/pT61CXYq/menu-techtree-britons.webp", cost: 220 },
  { id: "byzantines", name: "Byzantines", imageUrl: "https://i.postimg.cc/G25SKhJf/menu-techtree-byzantines.webp", cost: 200 },
  { id: "vikings", name: "Vikings", imageUrl: "https://i.postimg.cc/5jcKc7r6/menu-techtree-vikings-convertido-de-png.webp", cost: 190 },
  { id: "japanese", name: "Japanese", imageUrl: "https://i.postimg.cc/Y0LDsKbV/menu-techtree-japanese.webp", cost: 180 },
  { id: "chinese", name: "Chinese", imageUrl: "https://i.postimg.cc/C1Q67LHt/menu-techtree-chinese.webp", cost: 170 },
  { id: "persians", name: "Persians", imageUrl: "https://i.postimg.cc/MHf3F29G/menu-techtree-persians-convertido-de-png.webp", cost: 160 },
  { id: "incas", name: "Incas", imageUrl: "https://i.postimg.cc/3N0fc5nf/menu-techtree-inca.webp", cost: 100 },
  { id: "goths", name: "Goths", imageUrl: "https://i.postimg.cc/yx3pb4vL/menu-techtree-goths.webp", cost: 120 },
  { id: "bulgarians", name: "Bulgarians", imageUrl: "https://i.postimg.cc/MTFr5Kb9/menu-techtree-bulgarians.webp", cost: 90 },
  { id: "cumans", name: "Cumans", imageUrl: "https://i.postimg.cc/vBNShHLk/menu-techtree-cumans.webp", cost: 80 },
  { id: "armenians", name: "Armenians", imageUrl: "https://i.postimg.cc/d1xS6tmm/menu-techtree-armenians.webp", cost: 140 },
  { id: "aztecs", name: "Aztecs", imageUrl: "https://i.postimg.cc/hj53sPbs/menu-techtree-aztecs.webp", cost: 280 },
  { id: "bengalis", name: "Bengalis", imageUrl: "https://i.postimg.cc/qR5ZwMXG/menu-techtree-bengalis.webp", cost: 130 },
  { id: "berbers", name: "Berbers", imageUrl: "https://i.postimg.cc/rmPYjFCJ/menu-techtree-berber.webp", cost: 150 },
  { id: "bohemians", name: "Bohemians", imageUrl: "https://i.postimg.cc/xC4F5Ty3/menu-techtree-bohemians.webp", cost: 140 },
  { id: "burgundians", name: "Burgundians", imageUrl: "https://i.postimg.cc/ydbrjYXf/menu-techtree-burgundians.webp", cost: 150 },
  { id: "burmese", name: "Burmese", imageUrl: "https://i.postimg.cc/nzPw2cYR/menu-techtree-burmese.webp", cost: 130 },
  { id: "celts", name: "Celts", imageUrl: "https://i.postimg.cc/pT61CXY6/menu-techtree-celts.webp", cost: 160 },
  { id: "dravidians", name: "Dravidians", imageUrl: "https://i.postimg.cc/Y9syRqfT/menu-techtree-dravidians.webp", cost: 130 },
  { id: "ethiopians", name: "Ethiopians", imageUrl: "https://i.postimg.cc/FRBnpsg2/menu-techtree-ethiopians.webp", cost: 150 },
  { id: "georgians", name: "Georgians", imageUrl: "https://i.postimg.cc/0jKXBRcc/menu-techtree-georgians.webp", cost: 140 },
  { id: "gurjaras", name: "Gurjaras", imageUrl: "https://i.postimg.cc/zvH2cZ0d/menu-techtree-gurjaras.webp", cost: 160 },
  { id: "hindustanis", name: "Hindustanis", imageUrl: "https://i.postimg.cc/2yL9KR2t/menu-techtree-indians.webp", cost: 280 },
  { id: "huns", name: "Huns", imageUrl: "https://i.postimg.cc/PJvVRs23/menu-techtree-huns.webp", cost: 170 },
  { id: "italians", name: "Italians", imageUrl: "https://i.postimg.cc/d3ZNxP4S/menu-techtree-italians.webp", cost: 150 },
  { id: "jurchens", name: "Jurchens", imageUrl: "https://i.postimg.cc/BbP7V9Mk/menu-techtree-jurchens.webp", cost: 140 },
  { id: "khitans", name: "Khitans", imageUrl: "https://i.postimg.cc/4yH2SkBr/menu-techtree-khitans.webp", cost: 140 },
  { id: "khmer", name: "Khmer", imageUrl: "https://i.postimg.cc/qq6D5VjP/menu-techtree-khmer.webp", cost: 160 },
  { id: "koreans", name: "Koreans", imageUrl: "https://i.postimg.cc/brSVBcmX/menu-techtree-koreans.webp", cost: 150 },
  { id: "lithuanians", name: "Lithuanians", imageUrl: "https://i.postimg.cc/FzkCB5T5/menu-techtree-lithuanians.webp", cost: 170 },
  { id: "magyars", name: "Magyars", imageUrl: "https://i.postimg.cc/PJvVRsSk/menu-techtree-magyars.webp", cost: 160 },
  { id: "malay", name: "Malay", imageUrl: "https://i.postimg.cc/FzkCB5T4/menu-techtree-malay.webp", cost: 140 },
  { id: "malians", name: "Malians", imageUrl: "https://i.postimg.cc/J0HY2Vp8/menu-techtree-malians.webp", cost: 160 },
  { id: "mapuche", name: "Mapuche", imageUrl: "https://i.postimg.cc/7hJtW8Kw/menu-techtree-mapuche.webp", cost: 130 },
  { id: "mayans", name: "Mayans", imageUrl: "https://i.postimg.cc/cCtkbyFs/menu-techtree-mayans-convertido-de-png.webp", cost: 300 },
  { id: "mongols", name: "Mongols", imageUrl: "https://i.postimg.cc/90wgn5Lm/menu-techtree-mongols-convertido-de-png.webp", cost: 250 },
  { id: "muisca", name: "Muisca", imageUrl: "https://i.postimg.cc/Kj3pHS08/menu-techtree-muisca-convertido-de-png.webp", cost: 130 },
  { id: "poles", name: "Poles", imageUrl: "https://i.postimg.cc/RhJpD5gq/menu-techtree-poles-convertido-de-png.webp", cost: 150 },
  { id: "portuguese", name: "Portuguese", imageUrl: "https://i.postimg.cc/yx3pb4Lk/menu-techtree-portuguese-convertido-de-png.webp", cost: 160 },
  { id: "romans", name: "Romans", imageUrl: "https://i.postimg.cc/8cfX0QZ7/menu-techtree-romans-convertido-de-png.webp", cost: 180 },
  { id: "saracens", name: "Saracens", imageUrl: "https://i.postimg.cc/MXk3kPLq/menu-techtree-saracens-convertido-de-png.webp", cost: 150 },
  { id: "shu", name: "Shu", imageUrl: "https://i.postimg.cc/YjcDcnPt/menu-techtree-shu-convertido-de-png.webp", cost: 140 },
  { id: "sicilians", name: "Sicilians", imageUrl: "https://i.postimg.cc/G90g07fc/menu-techtree-sicilians-convertido-de-png.webp", cost: 130 },
  { id: "slavs", name: "Slavs", imageUrl: "https://i.postimg.cc/9z3g38km/menu-techtree-slavs-convertido-de-png.webp", cost: 140 },
  { id: "spanish", name: "Spanish", imageUrl: "https://i.postimg.cc/9z3g38kF/menu-techtree-spanish-convertido-de-png.webp", cost: 170 },
  { id: "tatars", name: "Tatars", imageUrl: "https://i.postimg.cc/MXk3kPLp/menu-techtree-tatars-convertido-de-png.webp", cost: 150 },
  { id: "teutons", name: "Teutons", imageUrl: "https://i.postimg.cc/mhxpxXnr/menu-techtree-teutons-convertido-de-png.webp", cost: 160 },
  { id: "tupi", name: "Tupi", imageUrl: "https://i.postimg.cc/XXM1MHPJ/menu-techtree-tupi-convertido-de-png.webp", cost: 130 },
  { id: "turks", name: "Turks", imageUrl: "https://i.postimg.cc/YjcDcnP0/menu-techtree-turks-convertido-de-png.webp", cost: 150 },
  { id: "vietnamese", name: "Vietnamese", imageUrl: "https://i.postimg.cc/F1tCtW61/menu-techtree-vietnamese-convertido-de-png.webp", cost: 140 },
  { id: "wei", name: "Wei", imageUrl: "https://i.postimg.cc/t70v0Scs/menu-techtree-wei-convertido-de-png.webp", cost: 140 },
  { id: "wu", name: "Wu", imageUrl: "https://i.postimg.cc/6TsbsjP7/menu-techtree-wu-convertido-de-png.webp", cost: 140 },
];

const leagues = [
  { id: "league-i", name: "League I", eloMin: 2000, eloMax: null, imageUrl: "https://i.postimg.cc/qMt2y2nJ/liga-I.webp" },
  { id: "league-ii", name: "League II", eloMin: 1800, eloMax: 1999, imageUrl: "https://i.postimg.cc/CLZbkbDn/liga-II.webp" },
  { id: "league-iii", name: "League III", eloMin: 1500, eloMax: 1799, imageUrl: "https://i.postimg.cc/Yq4QYQg4/liga-III.webp" },
  { id: "league-iv", name: "League IV", eloMin: 1200, eloMax: 1499, imageUrl: "https://i.postimg.cc/4dkX2kFY/liga-IV.webp" },
  { id: "league-v", name: "League V", eloMin: 0, eloMax: 1199, imageUrl: "https://i.postimg.cc/V6QzZQHS/liga-V.webp" },
];

const usersByLeague: Record<string, { displayName: string; elo: number }[]> = {
  "league-i": [
    { displayName: "Pablo", elo: 2150 },
    { displayName: "TheViper", elo: 2120 },
    { displayName: "Hera", elo: 2100 },
    { displayName: "Liereyy", elo: 2080 },
    { displayName: "Yo", elo: 2060 },
    { displayName: "MbL", elo: 2040 },
    { displayName: "Villese", elo: 2020 },
    { displayName: "Dogao", elo: 2000 },
  ],
  "league-ii": [
    { displayName: "Carlos", elo: 1980 },
    { displayName: "Jorge", elo: 1940 },
    { displayName: "María", elo: 1960 },
    { displayName: "Lucía", elo: 1920 },
    { displayName: "Diego", elo: 1900 },
    { displayName: "Ana", elo: 1880 },
    { displayName: "Santiago", elo: 1860 },
    { displayName: "Valentina", elo: 1840 },
  ],
  "league-iii": [
    { displayName: "Miguel", elo: 1780 },
    { displayName: "Sofía", elo: 1760 },
    { displayName: "Alejandro", elo: 1740 },
    { displayName: "Camila", elo: 1720 },
    { displayName: "Fernando", elo: 1700 },
    { displayName: "Isabella", elo: 1680 },
    { displayName: "Ricardo", elo: 1660 },
    { displayName: "Gabriela", elo: 1640 },
    { displayName: "Hugo", elo: 1620 },
    { displayName: "Daniela", elo: 1600 },
  ],
  "league-iv": [
    { displayName: "Martín", elo: 1480 },
    { displayName: "Agustina", elo: 1440 },
    { displayName: "Lautaro", elo: 1460 },
    { displayName: "Thiago", elo: 1420 },
    { displayName: "Malena", elo: 1400 },
    { displayName: "Facundo", elo: 1380 },
    { displayName: "Catalina", elo: 1360 },
  ],
  "league-v": [
    { displayName: "Benjamín", elo: 1180 },
    { displayName: "Emilia", elo: 1160 },
    { displayName: "Nicolás", elo: 1140 },
    { displayName: "Julieta", elo: 1120 },
    { displayName: "Matías", elo: 1100 },
    { displayName: "Renata", elo: 1080 },
    { displayName: "Bruno", elo: 1060 },
    { displayName: "Florencia", elo: 1040 },
    { displayName: "Tomás", elo: 1020 },
    { displayName: "Lara", elo: 1000 },
  ],
};

async function seed() {
  console.log("Seeding civilizations...");
  for (const civ of civilizations) {
    await prisma.civilization.upsert({
      where: { id: civ.id },
      update: civ,
      create: civ,
    });
  }

  console.log("Seeding leagues...");
  for (const league of leagues) {
    await prisma.league.upsert({
      where: { id: league.id },
      update: league,
      create: league,
    });
  }

  console.log("Seeding users...");
  for (const [leagueId, users] of Object.entries(usersByLeague)) {
    for (const user of users) {
      await prisma.user.create({
        data: {
          displayName: user.displayName,
          elo: user.elo,
          leagueId,
        },
      });
    }
  }

  console.log("Seed completed!");
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
