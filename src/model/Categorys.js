import Sequelize from 'sequelize';
import {sequelize} from '../database/database';

const Categorys = sequelize.define('categorys', {
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

export default  Categorys;