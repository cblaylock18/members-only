require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || null;

if (!connectionString) {
    throw new Error("❌ DATABASE_URL is missing! Check your .env file.");
}

module.exports = new Pool({
    connectionString: connectionString,
});

console.log(`✅ Connected to DB`);
