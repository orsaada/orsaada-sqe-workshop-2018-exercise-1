import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {create_objects} from './code-analyzer';
import {table_create} from './code-analyzer';
import {statements} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        create_objects(parsedCode);
        table_create();
        //console.log(`is8 ${JSON.stringify(statements)}`);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
});