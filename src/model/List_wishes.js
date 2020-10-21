import Sequelize from 'sequelize';
import {sequelize} from '../database/database';

const List_wishes = sequelize.define('list_wishes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    id_user: {
        type: Sequelize.INTEGER
    },
    id_app: {
        type: Sequelize.INTEGER
    }
},{
    timestamps: false
});

export default List_wishes;