/*!
The template library
====================

The **template** library is an utility to fill HTML fragments in order to
display models. There are severals libraries to this end out there, most of
them use precompiled versions of the templates (see [Handlebars](http://handlebarsjs.com/))
for performance reasons.

This one is based on a non-very-famous technique called [_template animation_](http://www.workingsoftware.com.au/page/Your_templating_engine_sucks_and_everything_you_have_ever_written_is_spaghetti_code_yes_you).
Although it can loose on performance, this technique is a quite good
decission for didactical purposes as it requires several DOM manipulation.
*/

var template = {};
