import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};

export {parseCode};

let statements = [];

const func = {
    'FunctionDeclaration': function_handle,
    'VariableDeclaration': variable_handle,
    'ExpressionStatement': expression_handle,
    'WhileStatement': while_handle,
    'IfStatement': if_handle,
    'ReturnStatement': return_handle,
    'ForStatement': for_handle,
    'BlockStatement': body_iter
};

const expressions = {
    'AssignmentExpression': assignment_handle,
    'UnaryExpression': unary_handle,
    'BinaryExpression': binary_handle,
    'UpdateExpression': update_handle,
    'MemberExpression': member_handle,
    'Identifier': identifier_handle,
    //  'VariableDeclarator': var_dec_handle
    'Literal': literal_handle
};

const args = {
    'Identifier': identifier_handle,
    'BinaryExpression': binary_handle,
    //  'VariableDeclarator': var_dec_handle
    'Literal': literal_handle
};


function create_objects(parseCode) {
    if (parseCode.type.valueOf() === 'Program') {
        program_handle(parseCode);
    }
    else{
        window.alert('not a program');
    }
}
export {create_objects};

function program_handle(program) {
    body_iter(program.body);
}

function function_handle(func) {
    let func_name = expressions[func.id.type](func.id);
    statements.push({line: func.loc.start.line, type: func.type, name: func_name, condition: undefined, value: undefined});
    for (let i =0; i<func.params.length;++i) {
        let param_name = expressions[func.params[i].type](func.params[i]);
        statements.push({line: func.params[i].loc.start.line, type: func.params[i].type, name: param_name, condition: undefined, value: undefined});
    }
    func[func.body.type](func.body);
}

function variable_handle(obj) {
    for (let i=0; i<obj.declarations.length; ++i) {
        let dec = obj.declarations[i];
        //let name = expressions[obj.declarations[i].type](obj.declarations[i]);
        //let name = dec.id.name;
        statements.push({line: obj.loc.start.line, type: obj.type, name: dec.id.name, condition: undefined, value: undefined});
    }
}

function assignment_handle(exp){
    let name = expressions[exp.left.type](exp.left);
    let value = expressions[exp.right.type](exp.right);
    statements.push({line: exp.loc.start.line, type: exp.type, name: name, condition: undefined, value: value});

}
function while_handle(exp) {
    let condition = expressions[exp.test.type](exp.test);
    statements.push({line: exp.loc.start.line, type: exp.type, name: name, condition: condition, value: undefined});
    func[exp.body.type](exp.body);
    // let left,right;
    // if(exp.left.hasOwnProperty('object'))
    //     left = array_handle(exp.left.object);
    // else
    //     left = left.name;
    // if(exp.right.hasOwnProperty('object')){
    //     right = array_handle(exp.left.object);
    // }
    //
    // let condition = left + exp.test.operator+ right;//exp.test.left.name + exp.test.operator + exp.test.right.name;
    // statements.push({line: exp.loc.start, type: exp.type, name: left, condition: condition, value: exp.right.value});
    // let body = exp.body.body;
    // body_iter(body);
}

function return_handle(statement){
    let value = func[statement.argument.type](statement.argument);
    statements.push({line: statement.loc.start.line, type: statement.type, name: undefined, condition: undefined, value: value});
}

function body_iter(statement){
    let body = statement.body;
    for(let i=0;i<body.length;++i){
        func[body[i].type](body[i]);
    }
}

function if_handle(exp){
    let condition = func[exp.test.type](exp.test);
    statements.push({line: exp.loc.start.line, type: exp.type, name: exp.left.name, condition: condition, value: exp.right.value});
    func[exp.consequent.type](exp.consequent);
    func[exp.alternate.type](exp.alternate);
}




function for_handle(statement){
    let condition = func[statement.test.type](statement.test);
    statements.push({line: statement.loc.start.line, type: statement.type, name: statement.left.name, condition: condition, value: undefined});
    func[statement.init.type](statement.init);
    func[statement.update.type](statement.update);
    func[statement.body.type](statement.body);
}

function unary_handle(statement){

}

function binary_handle(exp){
    // let one,two,three,four;
    // one = ''; two = ''; three = ''; four = '';
    // if(exp.left.type === 'Binart'){
    //
    // }
    let left = expressions[exp.left.type](exp.left);
    let right = expressions[exp.right.type](exp.right);
    let operator = exp.operator;
    return left+operator+right;
}

function update_handle(exp){
    let name = expressions[exp.argument.type](exp.argument);
    let operator = exp.operator;
    statements.push({line: exp.loc.start.line, type: exp.type, name: name, condition: undefined, value: operator+name});
}

function identifier_handle(identifier){
    return identifier.name;
}

function literal_handle(literal){
    return literal.raw;
}

function member_handle(exp) {
    let obj = func[exp.object.type](exp.object);
    let property = func[exp.property.type](exp.property);
    return obj+'['+property+']';
}

function expression_handle(exp){
    expressions[exp.expression.type](exp.expression);
}


// function var_dec_handle(vardec){
//     return vardec.id.name;
// }



function push_element(element){
    statements.push({line: exp.loc.sta, type: exp.type, name: exp.left.name, condition: condition, value: exp.right.value});
}
// function choose(statement){
//     switch (statement.type) {
//     case 'BlockStatement':
//         body_iter(statement.body);
//         break;
//     case 'ExpressionStatement':
//         expression_handle(statement);
//         break;
//     case 'WhileStatement':
//         while_handle(statement);
//         break;
//     case 'IfStatement':
//         if_handle(statement);
//         break;
//     case 'ReturnStatement':
//         return_handle(statement);
//         break;
//     case 'ForStatement':
//         for_handle(statement);
//         break;
//     case 'VariableDeclaration':
//         variable_handle(statement);
//         break;
//     }
// }







// function kindof(){
//     switch () {
//     case 'Identifier':
//         break;
//     case 'MemberExpression':
//
//         break
//
//
//     }
// }

// switch (body[i].type) {
// case 'BlockStatement':
//     block_statement_handle();
//     break;
// case 'ExpressionStatement':
//     expression_handle();
//     break;
// case 'WhileStatement':
//     while_handle();
//     break;
// case 'IfStatement':
//     if_handle();
// // case 'ReturnStatement':
// //     return_handle();
// //     break;
// }

// function block_statement_handle(block) {
//     for (let obj in block.body) {
//         switch (obj.type) {
//         case 'VariableDeclaration':
//             variable_handle(obj);
//             break;
//         case 'ExpressionStatement':
//             expression_handle(obj);
//             break;
//         case 'WhileStatement':
//             while_handle();
//             break;
//         }
//     }
// }

// for (let i =0; i<func.body.length;++i) {
//     switch (func.body[i].type) {
//     case 'BlockStatement':
//         block_statement_handle();
//         break;
//     }
// }

// case 'FunctionDeclaration':
//     function_handle(program.body[i]);
//     break;
// }

// for (let i=0; i<program.body.length ;++i) {
//     func[program.body[i].type](program.body[i]);
// }