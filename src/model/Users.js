import Sequelize from 'sequelize';
import {sequelize} from '../database/database';

const Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    username: {
        type: Sequelize.VARCHAR
    },
    email: {
        type: Sequelize.VARCHAR
    },
    password: {
        type: Sequelize.VARCHAR 
    },
    id_rol: {
        type: Sequelize.INTEGER
    }
},{
    timestamps: false
});

export default Users;