import "dotenv/config";
import { PrismaClient, Genre, SeatType } from '../generated/prisma/client.js';
import * as bcrypt from 'bcryptjs';
import { PrismaPg } from "@prisma/adapter-pg";

const rawDatabaseUrl = process.env.DATABASE_URL;

if (!rawDatabaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const dbUrl = new URL(rawDatabaseUrl);
const sslMode = dbUrl.searchParams.get("sslmode");

// Keep current strict TLS behavior explicit to avoid pg v9 semantic changes.
if (!sslMode || sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
  dbUrl.searchParams.set("sslmode", "verify-full");
}

const connectionString = dbUrl.toString();

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Clearing database...');
  await prisma.seatLock.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.theater.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding data...');

  // 1. Create 5 Users in Bulk
  const hashedPassword = await bcrypt.hash('pass@123', 10);
  const userNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];

  await prisma.user.createMany({
    data: userNames.map((name) => ({
      firstName: name,
      lastName: 'User',
      email: `${name.toLowerCase()}@example.com`,
      password: hashedPassword,
      isVerified: true,
    })),
  });

  // 2. Create 10 Movies in Bulk
  const movieData = [
    { title: 'Inception', genre: Genre.ACTION, duration: 148 },
    { title: 'The Hangover', genre: Genre.COMEDY, duration: 100 },
    { title: 'The Conjuring', genre: Genre.HORROR, duration: 112 },
    { title: 'Interstellar', genre: Genre.OTHERS, duration: 169 },
    { title: 'Toy Story', genre: Genre.ANIMATED, duration: 81 },
    { title: 'The Godfather', genre: Genre.DRAMA, duration: 175 },
    { title: 'Se7en', genre: Genre.THRILLER, duration: 127 },
    { title: 'Avengers: Endgame', genre: Genre.ACTION, duration: 181 },
    { title: 'Parasite', genre: Genre.THRILLER, duration: 132 },
    { title: 'Super Mario Bros', genre: Genre.ANIMATED, duration: 92 },
  ];

  await prisma.movie.createMany({ data: movieData });
  const movies = await prisma.movie.findMany();

  // 3. Create 10 Theaters, 5 Screens each (50 total), and 100 Seats per screen
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  for (let i = 1; i <= 10; i++) {
    const theater = await prisma.theater.create({
      data: {
        name: `Cineplex ${i}`,
        location: `City Center, Zone ${i}`,
      },
    });

    for (let j = 1; j <= 5; j++) {
      const screen = await prisma.screen.create({
        data: {
          name: `Screen ${j}`,
          theaterId: theater.id,
        },
      });

      // Prepare seats array for bulk insertion (100 seats per screen)
      const seatsToInsert: Array<{
        row: string;
        number: number;
        type: SeatType;
        screenId: string;
      }> = [];

      for (const row of rows) {
        // Assign SeatType Enum instead of plain string
        let seatType: SeatType = SeatType.SILVER;

        if (['A', 'B', 'C'].includes(row)) {
          seatType = SeatType.PLATINUM; 
        } else if (['D', 'E', 'F', 'G'].includes(row)) {
          seatType = SeatType.GOLD;
        }

        for (let seatNum = 1; seatNum <= 10; seatNum++) {
          seatsToInsert.push({
            row,
            number: seatNum,
            type: seatType,
            screenId: screen.id,
          });
        }
      }

      // ⚡ Single SQL INSERT query for all 100 seats
      await prisma.seat.createMany({
        data: seatsToInsert,
      });

      // 4. Create a Showtime for each screen
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      await prisma.showtime.create({
        data: {
          startTime: new Date(Date.now() + i * j * 3600000), // Spread out times
          basePrice: 12.00,
          movieId: randomMovie.id,
          screenId: screen.id,
        },
      });
    }
  }

  console.log('Seeding completed successfully! 🍿');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });