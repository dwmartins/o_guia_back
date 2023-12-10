const db = require("../../config/dbConnection");
const logger = require("../../config/logger");

//Table "users";
class User {

    id;
    name;
    lastName;
    email;
    password;
    token;
    active;
    user_type;
    photo_url;
    createdAt;
    updateAt;

    field;
    values;

    save = async (user, action) => {

        if(action === "insert") {
            this.field = ["name", "lastName", "email", "password", "token", "user_type", "photo_url"];
            this.values = [user.name, user.lastName, user.email, user.password, user.token, user.user_type, user.photo_url];

        } else if(action === "update"){
            this.field = ["name", "lastName", "email", "password", "user_type", "photo_url"];
            this.values = [user.name, user.lastName, user.email, user.password, user.user_type, user.photo_url, user.user_id];

        } else if(action === "delete") {
            this.field = ["id"];
            this.values = [user.id];

        } else if(action === "disable") {
            this.field = ["active"];
            this.values = [user.action , user.id];
        }

        return await db.CustomQuery('users', action, this.field, this.values);
    }

    fetchUserToken = async (id) => {
        try {
            let sql = `SELECT token FROM users WHERE id = ?`;

            const value = [
                id
            ]
            const data = await db.pool.query(sql, value);
            return data[0][0];
        } catch (error) {
            logger.log(`error`, `Erro ao buscar o token do usuário: ${error}`);
            return {error: error};
        }
    }

    existingEmail = async (email, id) => {
        try {
            let sql = `SELECT email FROM users WHERE email = ?`;

            if(id) {
                sql += ` AND id != ?`;
            }
            const value = [email, id]

            const result = await db.pool.query(sql, value);
            return result[0];
        } catch (error) {
            logger.log(`error`, `Erro ao verificar se o e-mail é existente: ${error}`);
            return {error: error};
        }
    }

    searchUserByEmail = async (email) => {
        try {
            let sql = `SELECT * FROM users WHERE email = ?`;

            const value = [email];

            const result = await db.pool.query(sql, value);
            return result[0];
        } catch (error) {
            logger.log(`error`, `Erro ao verificar se o e-mail é existente: ${error}`);
            return {error: error};
        }
    }
}

module.exports = new User;