import * as math from 'mathjs';
import zeta from './zeta';

export default {
    parse, extractInfo
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
    let jsFunc;
    if(str === 'zeta') {
        jsFunc = (n) => {
            return zeta(n)
        }
    } else {
        jsFunc = (n) => {
            const constants = {}
            constants[variable] = n
            return math.evaluate(str, constants)
        }  
    }

    return jsFunc
}

console.log(zeta(math.complex(0.5,14.134)))