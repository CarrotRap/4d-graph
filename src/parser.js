import * as math from 'mathjs';

export default {
    typeOfEnter, parse, removeUseless, extractInfo
}

function typeOfEnter(latex) {
    if(latex.match(/([a-z])(\()([a-z])(\)=)/g)) {
        return {
            type: 'newFunction'
        }
    }

    let match = latex.match(/([a-z])(\()(([\d]+)|((?:[\-]?)([\d]+)([\+|\-])([\d]+)[\i]))(\)=)/g);
    if(match) {
        return {
            type: 'getFunction',
            match: match[0]
        }
    }

    console.log(latex)
}

function extractInfo(str) {
    let name = ''
    try {
        name = str.split('(')[0]
        if(name.length !== 1) return null;

        const center = str.split('(')[1].split(')')[0]

        if(center.match(/((?:(-)?)(\d+)(\+|\-)(\d+)(i))|((?:(-)?)(\d+))/g)) {
            return {
                name,
                type: 'number',
                number: math.complex(center)
            }        
        } else {
            let second = str.substring(str.indexOf('=') + 1, str.length);
            
            if(str.indexOf('=') === -1) second = ''

            return {
                name,
                type: 'var',
                var: center,
                function: second,
            }
        }
    } catch (error) {
        return {
            name,
            type: 'notvalid'
        }
    }
    return {type: 'notvalid'}
}

function parse(str, variable) {
    const jsFunc = (n) => {
        const constants = {}
        constants[variable] = n
        return math.evaluate(str, constants)
    }  

    return jsFunc
}






function parseA(latex) {
    if(latex.indexOf('=') === -1) return;
console.log(latex)
    let first = latex.match(/(.+)(\()(.+)(\))/g);
    if(!first) return;

    first = removeUseless(first[0])

    const name = first.split('(')[0]
    const arg = first.split('(')[1].charAt(0) 

    if(name === '' || arg === '') return;

    const expr = removeUseless(latex.substring(latex.indexOf('=') + 1,latex.length));

    let mathExpr = null
    try {
        mathExpr = normalizeMathExpr(new AlgebraLatex().parseLatex(expr).toMath());
    } catch (error) {console.error(error)}

    const func = (n) => {
        const args = {}
        args[arg] = n;

        try {
            return math.evaluate(mathExpr, args);   
        } catch (error) {
            return null;
        }
    }

    if(makeTest(func)) {
        return {
            name,
            variable: arg,
            func,
        }
    } else {
        return null;
    }
} 

function removeUseless(str) {
    return str.replaceAll('\\left', '').replaceAll('\\right', '')
}

function normalizeMathExpr(str) {
    str = str.replace('π','pi')
    return str;
}

function makeTest(func) {
    if(func(Math.random()) && func(-Math.random())) {
        return true;
    }
    return false;
}

function getHook(str) {
    str = Array.from(str)

    const result = []

    let count = 0
    let start = -1
    for(let i = 0; i < str.length; i++) {
        if(count === 0) {
            if(start === -1) {
                if(str[i] === '{') {
                    count = 1;
                    start = i;
                }
            }
        } else {
            if(str[i] === '{') {
                count+=1;
            } else if(str[i] === '}') {
                count-=1
            }
            console.log(count, i)
        } 
        
        if(start !== -1 && count === 0) {
            result.push(str.slice(start + 1, i).join(''))
            start = -1
        }
    }   
    console.log(result)
}