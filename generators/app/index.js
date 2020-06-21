const Generator = require( 'yeoman-generator' )
const yosay = require( 'yosay' );
const glob = require( 'glob' );
const prompts = require( './prompts' );
const ai = require( './ai' );
const Cli = require( 'cucumber' ).Cli

module.exports = class CucumberStepDefinitions extends Generator {
    constructor( args, opts ) {
        super( args, opts );
    }

    async prompting() {
        this.log( yosay(
            ai[ Math.floor( Math.random() * ai.length ) ]
        ) );

        this.props = await this.prompt( prompts )
    }

    writing() {
        const { featurePaths } = this.props;

        glob( featurePaths, ( error, files ) => {
            if( error ) throw new Error( error );

            files.forEach( path => {
                fs.readFile( path, 'utf8', this.parseFeature );
            } );
        } );
    }

    parseFeature( error, data ) {
        if( error ) throw new Error( error );
    }
}
