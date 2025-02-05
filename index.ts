console.log("Hello via Bun!");
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js'
import { books, authors, genres, BooksToAuthors, BooksToGenres } from './src/db/schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

const db = drizzle(process.env.DATABASE_URL)

async function main() {
    const bookInsertion = await db.insert(books).values({
        title: 'Welcome to Dead House',
        isbn: '0590453653'
    }).returning({ id: books.id });

    const authorInsertion = await db.insert(authors).values({
        name: 'R.L. Stine',
        biography: 'Author of Goosebumps series'
    }).returning({ id: authors.id });

    const genreInsertion = await db.insert(genres).values({
        name: 'Horror'
    }).returning({ id: genres.id });

    // Seed the many to many relationship
    await db.insert(BooksToAuthors).values({
        bookId: bookInsertion[0].id,
        authorId: authorInsertion[0].id
    });

    await db.insert(BooksToGenres).values({
        bookId: bookInsertion[0].id,
        genreId: genreInsertion[0].id
    });

    console.log('Database seeding completed successfully!');
    process.exit(0);
}

main().catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
});

    