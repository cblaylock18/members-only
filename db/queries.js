const db = require("./pool");
const sql = require("sql-template-strings");

async function isUsernameFreeQuery(email) {
    const SQL = sql`
    select distinct username
    from users
    where username ilike $1; 
    `;

    const { rows } = await db.query(SQL, [email]);

    return rows.length === 0;
}

async function insertUser(
    firstname,
    lastname,
    username,
    password,
    member = false,
    admin = false
) {
    const SQL = sql`
    insert into users
        (firstname, lastname, username, password, member, admin)
        values ($1, $2, $3, $4, $5, $6)
    `;

    await db.query(SQL, [
        firstname,
        lastname,
        username,
        password,
        member,
        admin,
    ]);
}

async function selectUser(username) {
    const SQL = sql`
    select *
    from users
    where username = $1
    `;

    const { rows } = await db.query(SQL, [username]);
    const user = rows[0];

    return user;
}

async function selectUserWithId(id) {
    const SQL = sql`
    select *
    from users
    where id = $1
    `;

    const { rows } = await db.query(SQL, [id]);
    const user = rows[0];

    return user;
}

async function giveUserMembership(id) {
    const SQL = sql`
    update users
    set member = true
    where id = $1
    returning *;
    `;
    await db.query(SQL, [id]);
}

module.exports = {
    isUsernameFreeQuery,
    insertUser,
    selectUser,
    selectUserWithId,
    giveUserMembership,
};
