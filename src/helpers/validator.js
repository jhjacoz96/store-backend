const {users} = require('../models/index');
const { check, validationResult } = require('express-validator');

module.exports = {
    
    validateEmail: check('email')
  
        // To delete leading and triling space 
        .trim() 
  
        // Normalizing the email address 
        .normalizeEmail() 
  
        // Checking if follow the email  
        // address formet or not 
        .isEmail() 
  
        // Custom message 
        .withMessage('El email no es válido') 
  
        // Custom validation 
        // Validate email in use or not 
        .custom(async (email) => { 
            const existingUser =  
                await users.findOne({
                    where: {
                        email
                    }
                });

            if (existingUser) { 
                throw new Error('Este email ya esta siendo usado') 
            } 
        })
} 