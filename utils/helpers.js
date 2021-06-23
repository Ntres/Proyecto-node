const hbs = require('hbs');

const createHbsHelpers = () => {
    hbs.registerHelper('gte', (age, minAge, opts) => {
        if (age >= minAge) {
            /**
             * Esto devuelve true
             */
            return opts.fn(this);
        } else {
            /**
             * Esto devuelve false
             */
            return opts.inverse(this);
        }
    });

    hbs.registerHelper('uppercase', (str) => {
        return str.toUpperCase();
    });
}

module.exports = {
    createHbsHelpers
};