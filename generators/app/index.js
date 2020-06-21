const Generator = require( 'yeoman-generator' )
const yosay = require( 'yosay' );
const glob = require( 'glob' );
const cucumber = require( 'cucumber' );
const EventEmitter = require( 'events' );
const { IdGenerator } = require( 'cucumber-messages' );

const promptFor = require( './helpers/prompts' );
const ai = require( './helpers/ai' );

module.exports = class cucumberStepDefinitions extends Generator {
    /**
     * Cucumber Step Definitions
     *
     * Yeoman generator that outputs Cucumber steps when given Gherkin .feature
     * files.
     *
     * Unlike other Cucumber generators, this generator uses cucumber-js to
     * handle parsing and processing of gherkin syntax. We repurpose the
     * snippetsFormatter that comes with cucumber-js, allowing us to write
     * JS snippets to disk next to .feature files.
     *
     * Use this generator to quickly create .js transformations of .feature
     * files.
     */
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

        this.props = await this.prompt( promptFor.features )
    }

    async writing() {
        // User input
        const { featureSearch } = this.props;

        // Cucumber guff
        const eventBroadcaster = new EventEmitter();
        const eventDataCollector = new cucumber.formatterHelpers
            .EventDataCollector( eventBroadcaster );

        // Using glob to locate files from the user input
        const featurePaths = await new Promise( ( resolve, reject ) => {
            glob( featureSearch, ( error, matches ) => {
                if( error ) reject( error );
                resolve( matches )
            } )
        } );

        // Grab the test cases from the files and push through cucumber's
        // eventBroadcaster
        const testCases = await cucumber.getTestCasesFromFilesystem( {
            cwd: process.cwd(),
            eventBroadcaster,
            featurePaths: featurePaths,
            order: 'defined',
            pickleFilter: new cucumber.PickleFilter( {} ),
        } );

        cucumber.supportCodeLibraryBuilder.reset( '' );
        const supportCodeLibrary = await cucumber.supportCodeLibraryBuilder.finalize();

        // Build our custom formatter with the formatter options
        const formatterOptions = {
            colorsEnabled: false,
            cwd: process.cwd(),
            eventBroadcaster,
            eventDataCollector,
            log: this.output.bind( this ),
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

    /**
     * Output
     *
     * Take snippetData and output it to the filesystem
     */
    output( snippetData ) {
        if( typeof snippetData === 'undefined' ) return;

        const snippetsByFile = snippetData.reduce( ( acc, cur ) => {
            const uri = cur.sourceLocation.uri;
            if( typeof acc[ uri ] === 'undefined' ) acc[ uri ] = [];

            acc[ uri ].push( cur );
            return acc;
        }, {} );

        for( const file in snippetsByFile ) {
            this.fs.copyTpl(
                this.templatePath( 'template.js' ),
                this.destinationPath( file.replace(/.feature$/, '.js') ),
                { steps: snippetsByFile[ file ] }
            );
        }
    }
}
