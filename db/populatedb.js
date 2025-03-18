require("dotenv").config();
const { Client } = require("pg");
const sql = require("sql-template-strings");

const connectionString = process.env.DATABASE_URL || null;

if (!connectionString) {
    throw new Error("❌ DATABASE_URL is missing! Check your .env file.");
}

const SQL = sql`
set timezone = 'America/New_York';

create table if not exists users (
    id integer primary key generated always as identity,
    firstname varchar(30),
    lastname varchar(40),
    username varchar(255) unique,
    password varchar(255),
    member boolean,
    admin boolean
);

create table if not exists messages (
    id integer primary key generated always as identity,
    userid integer references users(id) on delete cascade,
    title varchar(255),
    text varchar(1000),
    created_at timestamp with time zone default current_timestamp
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`;

async function populateDatabase() {
    console.log("seeding...");
    const client = new Client({ connectionString: connectionString });
    try {
        await client.connect();
        await client.query(SQL);
        console.log("Database populated successfully.");
    } catch (err) {
        console.error("Error populating database:", err);
    } finally {
        await client.end();
    }
}

populateDatabase();
