import Sequelize from 'sequelize';
import {sequelize} from '../database/database';

const Apps = sequelize.define('apps', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.VARCHAR
    },
    price: {
        type: Sequelize.DECIMAL
    },
    description: {
        type: Sequelize.TEXT
    },
    date: {
        type: Sequelize.DATE,
        defautValue: Sequelize.NOW
    },
    id_user: {
        type: Sequelize.INTEGER
    },
    id_category: {
        type: Sequelize.INTEGER
    }
},{
    timestamps: false
});

export default Apps;