const chalk = require( 'chalk' );

const prompts = [
    {
        type: 'input',
        name: 'featurePaths',
        message: `${chalk.bold('Please')} give me a path to your feature file(s).\n${chalk.gray('I will search all directories ignoring node_modules by default.')}\n`,
        default: '{*.feature,!(node_modules)/**/*.feature}',
        required: true

    }
];

module.exports = prompts;
