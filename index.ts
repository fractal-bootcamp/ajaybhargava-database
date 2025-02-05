console.log("Hello via Bun!");
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js'
import { books, authors, genres, BooksToAuthors, BooksToGenres, rentals } from './src/db/schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }



const db = drizzle(process.env.DATABASE_URL)

async function main() {
    await db.insert(rentals).values({
        memberId: 1,
        bookId: 1,
        rentedAt: new Date().toISOString(),
    })

    console.log('Database seeding completed successfully!');
    process.exit(0);
}

main().catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
});

    