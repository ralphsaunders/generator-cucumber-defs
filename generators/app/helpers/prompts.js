const chalk = require( 'chalk' );

const promptFor = {
    features: {
        type: 'input',
        name: 'featureSearch',
        message: `${chalk.bold('Please')} give me a path or glob to your feature file(s).\n${chalk.gray('I will search all directories ignoring node_modules by default.')}\n`,
        default: '{*.feature,!(node_modules)/**/*.feature}',
        required: true

    }
};

module.exports = promptFor;
