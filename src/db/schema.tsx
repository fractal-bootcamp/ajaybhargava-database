import { relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	varchar,
	text,
	serial,
	date,
	primaryKey,
} from "drizzle-orm/pg-core";

//
// pgTable Definition
//

// Books
export const books = pgTable("book", {
	id: serial("id").primaryKey(),
	title: varchar({ length: 255 }).notNull(),
	isbn: varchar("isbn", { length: 13 }),
});

// Authors
export const authors = pgTable("author", {
	id: serial("id").primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	biography: text(),
});

// Genres
export const genres = pgTable("genre", {
	id: serial("id").primaryKey(),
	name: varchar({ length: 255 }).notNull(),
});

// Members
export const members = pgTable("member", {
	id: serial("id").primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }),
	address: varchar({ length: 255 }),
});

// Rentals
export const rentals = pgTable("rental", {
	id: serial("id").primaryKey(),
	memberId: integer(),
	bookId: integer(),
	rentedAt: date().notNull(),
	returnedAt: date(),
});

//
// Relation Definition
//

// Books can have many Genres / Authors
export const bookRelations = relations(books, ({ many }) => ({
	BooksToGenres: many(BooksToGenres),
	BooksToAuthors: many(BooksToAuthors),
}));

// Books can have many Genres (Genre Perspective)
export const genreRelations = relations(genres, ({ many }) => ({
	BooksToGenres: many(BooksToGenres),
}));

// Books can have many Authors (Authors Perspective)
export const authorRelations = relations(authors, ({ many }) => ({
	BooksToAuthors: many(BooksToAuthors),
}));

// One member can Rent
export const memberRentalRelation = relations(rentals, ({ one }) => ({
	RentalMember: one(members, {
		fields: [rentals.memberId],
		references: [members.id],
	}),
}));

// One Book can be Rented
export const bookRentalRelation = relations(rentals, ({ one }) => ({
	BookRented: one(books, {
		fields: [rentals.bookId],
		references: [books.id],
	}),
}));

//
// Many to Many Tables
//

// Many to Many Relationships for Authors and Books Table
export const BooksToAuthors = pgTable(
	"books_to_authors",
	{
		bookId: integer("book_id")
			.notNull()
			.references(() => books.id),
		authorId: integer("author_id")
			.notNull()
			.references(() => authors.id),
	},
	(t) => [primaryKey({ columns: [t.bookId, t.authorId] })],
);

// Many to Many Relationship for Books and Genres Table
export const BooksToGenres = pgTable(
	"books_to_genres",
	{
		bookId: integer("book_id")
			.notNull()
			.references(() => books.id),
		genreId: integer("genre_id")
			.notNull()
			.references(() => genres.id),
	},
	(t) => [primaryKey({ columns: [t.bookId, t.genreId] })],
);

//
// Relationships
//

// Many to Many Relationship for Books and Genres Relationships
export const BooksToGenreRelations = relations(BooksToGenres, ({ one }) => ({
	genre: one(genres, {
		fields: [BooksToGenres.genreId],
		references: [genres.id],
	}),
	book: one(books, {
		fields: [BooksToGenres.bookId],
		references: [books.id],
	}),
}));

// Many to Many Relationship for Books and Authors
export const BooksToAuthorRelations = relations(BooksToAuthors, ({ one }) => ({
	author: one(authors, {
		fields: [BooksToAuthors.authorId],
		references: [authors.id],
	}),
	book: one(books, {
		fields: [BooksToAuthors.bookId],
		references: [books.id],
	}),
}));
