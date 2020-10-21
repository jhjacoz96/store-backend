import Sequelize from 'sequelize';
import {sequelize} from '../database/database';

const Prices = sequelize.define('prices', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    price: {
        type: Sequelize.DECIMAL
    },
    date: {
        type: Sequielize.DATE,
        defaultValue: Sequelize.NOW
    },
    id_app: {
        type: Sequielize.INTEGER
    }
},{
    timestamps: false
});

export default Rols;