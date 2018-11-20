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
    'BlockStatement': body_iter,
    'AssignmentExpression': assignment_handle,
    //'UnaryExpression': unary_handle,
    'BinaryExpression': binary_handle,
    'UpdateExpression': update_handle,
    'MemberExpression': member_handle,
    'Identifier': identifier_handle,
    //  'VariableDeclarator': var_dec_handle
    'Literal': literal_handle
};

function create_objects(parseCode) {
    window.alert('a');
    if (parseCode.type.valueOf() === 'Program') {
        program_handle(parseCode);
    }
    else{
        window.alert('not a program');
    }
}
export {create_objects};

function program_handle(program) {
    window.alert('aa');
    body_iter(program.body);
}

function function_handle(func) {
    let func_name = func[func.id.type](func.id);
    statements.push({line: func.loc.start.line, type: func.type, name: func_name, condition: undefined, value: undefined});
    for (let i =0; i<func.params.length;++i) {
        window.alert('aaa');
        let param_name = func[func.params[i].type](func.params[i]);
        statements.push({line: func.params[i].loc.start.line, type: func.params[i].type, name: param_name, condition: undefined, value: undefined});
    }
    func[func.body.type](func.body);
}

function variable_handle(obj) {
    window.alert('b');
    for (let i=0; i<obj.declarations.length; ++i) {
        let dec = obj.declarations[i];
        //let name = expressions[obj.declarations[i].type](obj.declarations[i]);
        //let name = dec.id.name;
        statements.push({line: obj.loc.start.line, type: obj.type, name: dec.id.name, condition: undefined, value: undefined});
    }
}

function assignment_handle(exp){
    let name = func[exp.left.type](exp.left);
    let value = func[exp.right.type](exp.right);
    statements.push({line: exp.loc.start.line, type: exp.type, name: name, condition: undefined, value: value});

}
function while_handle(exp) {
    let condition = func[exp.test.type](exp.test);
    statements.push({line: exp.loc.start.line, type: exp.type, name: name, condition: condition, value: undefined});
    func[exp.body.type](exp.body);
}

function return_handle(statement){
    let value = func[statement.argument.type](statement.argument);
    statements.push({line: statement.loc.start.line, type: statement.type, name: undefined, condition: undefined, value: value});
}

function body_iter(statement){
    window.alert('b');
    let body = statement.body;
    for(let i=0;i<body.length;++i){
        func[body[i].type](body[i]);
    }
}

function if_handle(exp){
    window.alert('b');
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

function binary_handle(exp){
    // let one,two,three,four;
    // one = ''; two = ''; three = ''; four = '';
    // if(exp.left.type === 'Binart'){
    //
    // }
    let left = func[exp.left.type](exp.left);
    let right = func[exp.right.type](exp.right);
    let operator = exp.operator;
    return left+operator+right;
}

function update_handle(exp){
    let name = func[exp.argument.type](exp.argument);
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
    func[exp.expression.type](exp.expression);
}