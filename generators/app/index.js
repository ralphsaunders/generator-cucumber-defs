const Generator = require( 'yeoman-generator' )
const yosay = require( 'yosay' );
const glob = require( 'glob' );
const cucumber = require( 'cucumber' );
const EventEmitter = require( 'events' );
const { IdGenerator } = require( 'cucumber-messages' );

const prompts = require( './prompts' );
const ai = require( './ai' );

module.exports = class cucumberStepDefinitions extends Generator {
    constructor( args, opts ) {
        super( args, opts );
        const { uuid } = IdGenerator;
        this.uuid = uuid;
        this.dataLog = [];
    }

    async prompting() {
        this.log( yosay(
            ai[ Math.floor( Math.random() * ai.length ) ]
        ) );

        this.props = await this.prompt( prompts )
    }

    async writing() {
        const { featureSearch } = this.props;

        const eventBroadcaster = new EventEmitter();
        const eventDataCollector = new cucumber.formatterHelpers
            .EventDataCollector( eventBroadcaster );

        const featurePaths = await new Promise( ( resolve, reject ) => {
            glob( featureSearch, ( error, matches ) => {
                if( error ) reject( error );
                resolve( matches )
            } )
        } );

        const testCases = await cucumber.getTestCasesFromFilesystem( {
            cwd: process.cwd(),
            eventBroadcaster,
            featurePaths: featurePaths,
            order: 'defined',
            pickleFilter: new cucumber.PickleFilter( {} ),
        } );

        cucumber.supportCodeLibraryBuilder.reset( '' );
        const supportCodeLibrary = await cucumber.supportCodeLibraryBuilder.finalize();

        const formatterOptions = {
            colorsEnabled: false,
            cwd: process.cwd(),
            eventBroadcaster,
            eventDataCollector,
            log: this.output( data ).bind( this ),
            supportCodeLibrary
        };

        cucumber.FormatterBuilder.build( './generators/app/extendedSnippetsFormatter', formatterOptions )
        const runtime = new cucumber.Runtime({
            eventBroadcaster,
            options: {},
            testCases,
            supportCodeLibrary,
        } );

        runtime.start().then( () => {
        } ).catch( error => {
            throw error;
        } );
    }

    output( snippetData ) {
        if( typeof snippetData === 'undefined' ) return;

        const snippetsByFile = snippetData.reduce( ( acc, cur ) => {
            const uri = cur.sourceLocation.uri;
            if( typeof acc[ uri ] === 'undefined' ) acc[ uri ] = [];

            acc[ uri ].push( cur );
            return acc;
        }, {} );

        debugger;
    }
}
