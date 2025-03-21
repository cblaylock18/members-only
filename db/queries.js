const db = require("./pool");
const sql = require("sql-template-strings");

class Users {
    isUsernameFreeQuery = async (email) => {
        const SQL = sql`
        select distinct username
        from users
        where username ilike $1; 
        `;

        const { rows } = await db.query(SQL, [email]);

        return rows.length === 0;
    };

    insertUser = async (
        firstname,
        lastname,
        username,
        password,
        member = false,
        admin = false
    ) => {
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
    };

    selectUser = async (username) => {
        const SQL = sql`
        select *
        from users
        where username = $1
        `;

        const { rows } = await db.query(SQL, [username]);
        const user = rows[0];

        return user;
    };

    selectUserWithId = async (id) => {
        const SQL = sql`
        select *
        from users
        where id = $1
        `;

        const { rows } = await db.query(SQL, [id]);
        const user = rows[0];

        return user;
    };

    giveUserMembership = async (id) => {
        const SQL = sql`
        update users
        set member = true
        where id = $1;
        `;
        await db.query(SQL, [id]);
    };

    giveUserAdmin = async (id) => {
        const SQL = sql`
        update users
        set "admin" = true
        where id = $1;
        `;
        await db.query(SQL, [id]);
    };
}

class Messages {
    insertMessage = async (userid, title, text) => {
        const SQL = sql`
        insert into messages
            (userid, title, "text")
            values (
                $1, $2, $3
            );
        `;
        await db.query(SQL, [userid, title, text]);
    };

    getMessages = async () => {
        const SQL = sql`
        select
            messages.id,
            concat(firstname,' ',lastname) as author,
            title,
            "text",
            created_at
        from messages
        left join users on users.id = messages.userid
        order by created_at desc
        ;`;

        const { rows } = await db.query(SQL);
        return rows;
    };

    deleteMessage = async (id) => {
        const SQL = sql`
        delete from messages
        where id = $1
        ;`;

        await db.query(SQL, [id]);
    };
}

const users = new Users();
const messages = new Messages();

module.exports = {
    users,
    messages,
};
