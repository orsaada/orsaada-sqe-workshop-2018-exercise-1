import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc: true});
};

export {parseCode};

let statements = [];

export  {statements};

const func = {
    'FunctionDeclaration': function_handle,
    'VariableDeclaration': variable_handle,
    'Identifier': identifier_handle,
    'ExpressionStatement': expression_handle,
    'WhileStatement': while_handle,
    'IfStatement': if_handle,
    'ReturnStatement': return_handle,
    'ForStatement': for_handle,
    'BlockStatement': body_iter,
    'AssignmentExpression': assignment_handle,
    'BinaryExpression': binary_handle,
    'UpdateExpression': update_handle,
    'MemberExpression': member_handle,
    'Literal': literal_handle,
    'UnaryExpression': unary_handle
    //logical expression
    //  'VariableDeclarator': var_dec_handle
};

const keys = ['Line','Type','Name','Condition', 'Value'];
const fields = ['line','type','name','condition','value'];

function identifier_handle(identifier){
    return identifier.name;
}

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
    body_iter(program);
}

function function_handle(exp) {
    let func_name = func[exp.id.type](exp.id);
    statements.push({line: exp.id.loc.start.line, type: exp.type, name: func_name, condition: undefined, value: undefined});
    for (let i =0; i<exp.params.length;i++) {
        let param_name = func[exp.params[i].type](exp.params[i]);
        statements.push({line: exp.params[i].loc.start.line, type: exp.params[i].type, name: param_name, condition: undefined, value: undefined});
    }
    func[exp.body.type](exp.body);
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
    let body = statement.body;
    for(let i=0;i<body.length;++i){
        func[body[i].type](body[i]);
    }
}

function if_handle(exp){
    let condition = func[exp.test.type](exp.test);
    statements.push({line: exp.loc.start.line, type: exp.type, name: undefined, condition: condition, value: undefined});
    func[exp.consequent.type](exp.consequent);
    func[exp.alternate.type](exp.alternate);
}




function for_handle(statement){
    let condition = func[statement.test.type](statement.test);
    statements.push({line: statement.loc.start.line, type: statement.type, name: undefined, condition: condition, value: undefined});
    func[statement.init.type](statement.init);
    func[statement.update.type](statement.update);
    func[statement.body.type](statement.body);
}

function binary_handle(exp){
    let left = func[exp.left.type](exp.left);
    let right = func[exp.right.type](exp.right);
    let operator = exp.operator;
    return left+operator+right;
}

function update_handle(exp){
    let name = func[exp.argument.type](exp.argument);
    let operator = exp.operator;
    let value = exp.prefix ? operator+name: name+operator;
    statements.push({line: exp.loc.start.line, type: exp.type, name: name, condition: undefined, value: value});
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

function unary_handle(exp){
    let argu = func[exp.argument.type](exp.argument);
    return exp.operator+argu;
}

function table_create(){
    let body = document.getElementsByTagName('body')[0];
    let x = document.createElement('TABLE');
    x.style.border = '1px solid black';
    body.appendChild(x);
    x.setAttribute('id', 'myTable');
    document.body.appendChild(x);

    let y = document.createElement('TR');
    y.setAttribute('id', 'myTr');
    document.getElementById('myTable').appendChild(y);

    for (let i = 0, l = keys.length; i < l; i ++) {
        let z = document.createElement('TD');
        let t = document.createTextNode(keys[i]);
        z.appendChild(t);
        document.getElementById('myTr').appendChild(z);
    }
    add_rows();
    window.alert(JSON.stringify(statements));
}

export {table_create};

function add_rows() {
    let tbl = document.getElementById('myTable');
    for (let i = 0; i < statements.length; i++) {
        let y = document.createElement('TR');
        y.setAttribute('id', 'myTr');
        tbl.appendChild(y);
        for(let j = 0;j<keys.length;j++){
            let z = document.createElement('TD');
            let t = document.createTextNode(statements[i][fields[j]]);
            z.appendChild(t);
            y.appendChild(z);
        }
    }
}