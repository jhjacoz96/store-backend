import Sequelize from 'sequelize';
import {sequelize} from '../database/database';
import Users from './Users'

const Rols = sequelize.define('rols', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.VARCHAR
    }
},{
    timestamps: false
});

Rols.hasMany(Users, {
    foreignKey: 'id_rol',
    sourceKey: 'id'
});

Users.belongsTo(Rols, {
    foreignKey: 'id_rol',
    sourceKey: 'id'
});

export default Rols;