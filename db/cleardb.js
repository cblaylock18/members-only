require("dotenv").config();
const { Client } = require("pg");
const sql = require("sql-template-strings");

const connectionString = process.env.DATABASE_URL || null;

if (!connectionString) {
    throw new Error("❌ DATABASE_URL is missing! Check your .env file.");
}

const SQL = sql`
drop table messages;

drop table users;

drop table "session";
`;

async function clearDatabase() {
    console.log("clearing...");
    const client = new Client({ connectionString: connectionString });
    try {
        await client.connect();
        await client.query(SQL);
        console.log("Database cleared successfully.");
    } catch (err) {
        console.error("Error clearing database:", err);
    } finally {
        await client.end();
    }
}

clearDatabase();
