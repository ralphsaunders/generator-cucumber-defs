const { Given, When, Then } = require( 'cucumber' );

<% steps.forEach( step => { -%>
<%- step.snippet %>

<% } ); %>
