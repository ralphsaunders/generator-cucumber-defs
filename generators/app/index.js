import Generator from 'yeoman-generator'

module.exports = class CucumberStepDefinitions extends Generator {
    constructor( args, opts ) {
        super( args, opts );
        console.log( 'hello world' );
    }
}
