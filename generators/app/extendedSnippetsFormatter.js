const cucumber = require( 'cucumber' );

module.exports.default = class ExtendedSnippetsFormatter extends cucumber.SnippetsFormatter {
    /**
     * Extended Snippets Formatter
     *
     * Logs snippet objects with context, not just strings.
     */
    constructor( options ) {
        super( options );
    }

    logSnippets() {
        const snippets = [];

        this.eventDataCollector.getTestCaseAttempts().map( testCaseAttempt => {
            const parsed = cucumber.formatterHelpers.parseTestCaseAttempt( {
                cwd: this.cwd,
                snippetBuilder: this.snippetBuilder,
                supportCodeLibrary: this.supportCodeLibrary,
                testCaseAttempt,
            } )
            parsed.testSteps.forEach( testStep => {
                if ( testStep.result.status === cucumber.Status.UNDEFINED ) {
                    snippets.push( testStep )
                }
            } )
        } )

        this.log( snippets );
    }
}
