import "dotenv/config";
import { randomUUID } from "crypto";
import { prisma } from "./db";

const eventsData = [
    {
        title: "Soirée Jazz au Caveau de la Huchette",
        description:
            "Une soirée exceptionnelle avec le trio de Benjamin Moussay et des invités surprises. Ambiance mythique du club le plus ancien de Paris.",
        startDate: new Date("2026-02-14T21:00:00+01:00"),
        venueId: "venue_paris_1",
        capacity: 120,
        price: 28,
        organizerId: "org_jazzlive_001",
        categoryId: "cat_jazz_01",
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
    },
    {
        title: "Exposition immersive Van Gogh",
        description:
            "Plongez au cœur des œuvres de Van Gogh grâce à une projection 360° monumentale et une bande-son originale.",
        startDate: new Date("2026-03-05T18:30:00+01:00"),
        venueId: "venue_paris_atrium",
        capacity: 450,
        price: 32,
        organizerId: "org_culturexp_003",
        categoryId: "cat_expo_02",
        imageUrl: "https://images.unsplash.com/photo-1577720111095-90b3c3941ec9?w=800",
    },
    {
        title: "Afterwork DJ Set – Rooftop Panorama",
        description:
            "DJ set electro-house avec vue imprenable sur Paris. Open bar inclus pour les 100 premières places réservées.",
        startDate: new Date("2026-02-20T19:00:00+01:00"),
        venueId: "venue_rooftop_12",
        capacity: 180,
        price: 18,
        organizerId: "org_nightlife_007",
        categoryId: "cat_party_05",
        // imageUrl optionnel
    },
    {
        title: "Conférence IA & Créativité 2026",
        description:
            "Les plus grands noms de l'IA générative et du design discutent de l'avenir de la création à l'ère des modèles multimodaux.",
        startDate: new Date("2026-04-10T09:00:00+02:00"),
        venueId: "venue_studio_tech",
        capacity: 320,
        price: 85,
        organizerId: "org_techconf_015",
        categoryId: "cat_conference_03",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
    },
    {
        title: "Atelier Pâtisserie avec Pierre Hermé",
        description:
            "Masterclass exclusive : réalisation du célèbre Ispahan et de la nouvelle création printemps 2026.",
        startDate: new Date("2026-03-28T14:30:00+01:00"),
        venueId: "venue_atelier_gourmet",
        capacity: 16,
        price: 190,
        organizerId: "org_gourmet_022",
        categoryId: "cat_workshop_04",
    },
    {
        title: "Concert électro – Tale of Us",
        description: "Retour très attendu du duo italien dans une configuration live inédite.",
        startDate: new Date("2026-05-02T23:00:00+02:00"),
        venueId: "venue_warehouse_09",
        capacity: 850,
        price: 45,
        organizerId: "org_techno_018",
        categoryId: "cat_concert_01",
        imageUrl: "https://images.unsplash.com/photo-1505373877291-93597ec69e07?w=800",
    },
];

async function main() {
    console.log("Début du seeding des événements...");

    for (const event of eventsData) {
        try {
            const createdEvent = await prisma.event.upsert({
                where: {
                    title_startDate: {
                        title: event.title,
                        startDate: event.startDate,
                    },
                },
                update: {},
                create: {
                    id: randomUUID(),
                    title: event.title,
                    description: event.description,
                    startDate: event.startDate,
                    venueId: event.venueId,
                    capacity: event.capacity,
                    price: event.price,
                    organizerId: event.organizerId,
                    categoryId: event.categoryId,
                    imageUrl: event.imageUrl,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            console.log(`Événement créé ou déjà existant : ${createdEvent.title}`);
        } catch (error) {
            console.error(`Erreur lors de la création de "${event.title}":`, error);
        }
    }

    console.log("Seeding terminé !");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });