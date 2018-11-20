import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc: true});
};

export {parseCode};

let statements = [];

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
    //  'VariableDeclarator': var_dec_handle
};

const keys = ['Line','Type','Name','Condition', 'Value'];
//const fields = ['line','type','name','condition','value'];

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
    statements.push({line: statement.loc.start.line, type: statement.type, name: statement.left.name, condition: condition, value: undefined});
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
    statements.push({line: exp.loc.start.line, type: exp.type, name: name, condition: undefined, value: operator+name});
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
    let tbl  = document.createElement('myTable');
    tbl.style.width  = '100px';
    tbl.style.border = '1px solid black';
    let header = tbl.createTHead();
    let row = header.insertRow(0);
    // insert columns
    for (let i = 0, l = keys.length; i < l; i ++) {
        let cell = row.insertCell(i);
        // cell.innerHTML = '<b>'+keys[i]+'</b>';
        cell.innerHTML = keys[i];
    }
    add_rows();
    body.appendChild(tbl);
}

export {table_create};

function add_rows() {
    let table = document.getElementById('myTable');
    for (let i = 0; i < statements.length; i++) {
        let newRow = table.insertRow(table.length);
        let j = 0;
        for (let x in statements[i]) {
            let cell = newRow.insertCell(j);
            if(statements[i].hasOwnProperty(x)){
                cell.innerHTML = statements[i][x];
            }
            else
                cell.innerHTML = 'a';
        }
    }
    document.getElementById('myTable').style.visibility = 'visible';
}