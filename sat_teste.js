
function readClauses(text){
    let clauses = []
    let aux = []
    let lines = ""
    for(let i = 0; i < text.length; i++){
        if(text[i].charAt(0) != 'c' && text[i].charAt(0) != 'p' && text[i].charAt(0) != '\r'){
            lines += " " + text[i]
        }
    }
    lines = lines.split(" ")
    for(let i = 0; i < lines.length; i++){
        if(lines[i].charAt(0) != "" && lines[i].charAt(0) != '0'){
            aux.push(lines[i])
        }
        if(lines[i].charAt(0) == '0' && aux.length > 0){
            clauses.push(aux)
            aux = []
        }
    }
    return clauses
}
function readVariables(clauses){
    let variables = []
    let biggestValue = 0
    
    for (let i = 0; i < clauses.length; i++) {
        for (let j = 0; j < clauses[i].length; j++){
            if(Math.abs(clauses[i][j] > biggestValue)) {
                biggestValue = Math.abs(clauses[i][j])
            }
        }
    }

    for(let i = 0; i < biggestValue; i++){
        variables.push(0)
    }
    return variables
}
function checkProblemSpecification(text, clauses, variables){
    let clausesLength
    let variablesLength
    let noSpecification = true
    for(let i = 0; i < text.length; i++){
        let lineText = text[i]
        if(lineText.charAt(0) == 'p'){
            noSpecification = false
            variablesLength = lineText.split(" ")[2]
            clausesLength = lineText.split(" ")[3]              
        }
    }
    if((variables.length == variablesLength && clauses.length == clausesLength) || noSpecification){
        return true
    } else {
        return false
    }
}

function readFormula(fileName) {
    // To read the file, it is possible to use the 'fs' module. 
    // Use function readFileSync and not readFile. 
    // First read the lines of text of the file and only afterward use the auxiliary functions.
    var fs = require('fs')
    let text = fs.readFileSync(fileName, 'utf-8').split("\n") // = ...  //  an array containing lines of text extracted from the file.
    let clauses = readClauses(text)
    let variables = readVariables(clauses)
    
    // In the following line, text is passed as an argument so that the function
    // is able to extract the problem specification.
    let specOk = checkProblemSpecification(text, clauses, variables)
    console.log(specOk)
  
    let result = { 'clauses': [], 'variables': [] }
    if (specOk) {
      result.clauses = clauses
      result.variables = variables
    }
    return result
  }

function nextAssignment(currentAssignment) {
    let stop = false
    for(i = currentAssignment.length - 1; i >= 0 && !stop ; i--){
        if(!currentAssignment[i]){
            currentAssignment[i] = true
            stop = true
        } else {
            currentAssignment[i] = false
        }
    }
    newAssignment = currentAssignment
    return newAssignment
}


function doSolve(clauses, assignment) {
    let isSat = false
    let last = Math.pow(2, assignment.length)
    let counter = 0;
    let fim = Math.pow(2, assignment.length)
    while ((!isSat) && last > 0) {
        //console.log("Analisando atribuição "+assignment.toString().replace(/,/g," ")+"\n"+(counter)+" de "+fim)
        counter++
        let soma = 0
        let thisClause = true
        for(i = 0; i < clauses.length && thisClause; i++){
            let clause = clauses[i]
            let clauseSat = false
            for(j = 0; j < clause.length && !clauseSat; j++){
                if(parseInt(clause[j]) < 0){
                    if(assignment[Math.abs(parseInt(clause[j]))-1] == 0){
                        clauseSat = true
                    }
                }else{
                    if(assignment[Math.abs(parseInt(clause[j]))-1] == 1){
                        clauseSat = true
                    }
                }
            }
            if(clauseSat){
                soma++
            }else{
                thisClause = false
            }
        }
        if (soma == clauses.length) {
            isSat = true
        } else {
            assignment = nextAssignment(assignment)
            last = last - 1
        }
    }
    let result = {'isSat': isSat, satisfyingAssignment: null}
    if (isSat) {
        result.satisfyingAssignment = assignment
    }
    return result
}
// const {performance} = require('perf_hooks')
// t0 = performance.now()
// isso = doSolve(formula.clauses, formula.variables)
// t1 = performance.now()
// console.log("Execution time: "+(t1-t0)+"ms.")

// console.log(isso)

result = readFormula('./tests/simple0.cnf')


function unitVar(clauses, assignment){
    let vars = []
    let unique = []
    for(i = 0; i < clauses.length; i++){
        vars = vars.concat(clauses[i])
    }
    vars = [...new Set(vars)]
    for(i = 0; i < vars.length; i++){
        let found = false
        for(j = 0; j < vars.length && !found; j++){
            if(vars[i] == -vars[j]){
                found = true
            }
        }
        if(!found){
            unique.push(vars[i])
        }
    }
    for(i = 0; i < unique.length; i++){
        for(j = 0; j < clauses.length; j++){
            for(k = 0; k < clauses[j].length; k++){
                if(unique[i] == clauses[j][k]){
                    k = 0
                    j = 0
                    clauses[j] = clauses[clauses.length-1]
                    clauses.pop()
                }
            }
        }
    }
    return clauses
}
const {performance} = require('perf_hooks')
t0 = performance.now()
unitVar(result.clauses, result.variables.length).forEach(item => {
    console.log(item)
})
t1 = performance.now()
console.log("Execution time: "+(t1-t0)+"ms.")
console.log()


// let a = 1
// isso.satisfyingAssignment.forEach(item =>{
//     console.log(a + " = " + item)
//     a++
// })

// isLast(assignment){
//     let soma = 0
//     assignment.forEach(item => {
//         soma += item
//     })
//     if(soma == assignment.length){
//         return true
//     }else{
//         return false
//     }
// }

// doSolveRecursive(clauses, assignment) {
//     let isSat = false

//     while ((!isSat) && !isLast(assignment)) {
//         for(i = 0; i < clauses.length; i++){
//             let clause = clauses[i]
//             let clauseSat = false
//             for(j = 0; j < clause.length && !clauseSat; j++){
//                 if(parseInt(clause[j]) < 0){
//                     if(assignment[Math.abs(parseInt(clause[j]))-1] == 0){
//                         clauseSat = true
//                     }
//                 }else{
//                     if(assignment[Math.abs(parseInt(clause[j]))-1] == 1){
//                         clauseSat = true
//                     }
//                 }
//             }
//         }
//         assignment = nextAssignment(assignment)
//         last = last - 1
//     }
//     let result = {'isSat': isSat, satisfyingAssignment: null}
//     if (isSat) {
//         result.satisfyingAssignment = assignment
//     }
//     return result
// }

