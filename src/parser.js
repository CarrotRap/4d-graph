import * as math from 'mathjs';
import AlgebraLatex from 'algebra-latex';

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

function extractInfo(latex) {
    return {
        name: latex.split('(')[0],
        num: math.complex(latex.split('(')[1].split(')')[0])
    }
}


function parse(latex) {
    if(latex.indexOf('=') === -1) return;

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

    console.log(mathExpr)

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
    return str.replace('\\left', '').replace('\\right', '')
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