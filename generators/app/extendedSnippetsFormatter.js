const cucumber = require( 'cucumber' );

module.exports = class ExtendedSnippetsFormatter extends cucumber.SnippetsFormatter {
    /**
     * Extended Snippets Formatter
     *
     * Returns snippet strings rather than logging them for programmatic usage.
     *
     * Also bybasses eventsbus
     */
    constructor( options ) {
        super( options );
        // options.eventBroadcaster.on('envelope', envelope => {
        //     if ( typeof envelope.testRunFinished !== undefined && envelope.testRunFinished !== null ) {
        //         this.getSnippets();
        //     }
        // } );
    }

    getSnippets() {
        const snippets = [];

        this.eventDataCollector.getTestCaseAttempts().map( testCaseAttempt => {
            const parsed = cucumber.parseTestCaseAttempt( {
                cwd: this.cwd,
                snippetBuilder: this.snippetBuilder,
                supportCodeLibrary: this.supportCodeLibrary,
                testCaseAttempt,
            } )
            parsed.testSteps.forEach( testStep => {
                if ( testStep.result.status === cucumber.Status.UNDEFINED ) {
                    snippets.push( testStep.snippet )
                }
            } )
        } )

        return snippets;
    }
}
