import express from 'express';
const config = require('./server/config');
const {sequelize} = require('./models/index');

const app =config(express()); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log(`Example app listening on http://localhost:${PORT}!`);

    sequelize.authenticate().then(() => {
        console.log('Nos hemos conectado a la base de batos')
    })
})
