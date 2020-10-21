import Sequelize from 'sequelize';
import {sequelize} from '../database/database';

const Apps_bought = sequelize.define('apps_bought', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    price: {
        type: Sequelize.VARCHAR
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    id_user: {
        type: Sequelize.INTEGER
    },
    id_app: {
        type: Sequelize.INTEGER
    }
});

export default  Apps_bought;