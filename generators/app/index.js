const Generator = require( 'yeoman-generator' )
const yosay = require( 'yosay' );
const glob = require( 'glob' );
const prompts = require( './prompts' );
const ai = require( './ai' );

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

        glob( featurePaths, function( error, files ) {
            if( error ) {
                throw new Error( error )
            }

            console.log( files );

            console.log( 'end' );
        } );
    }
}
