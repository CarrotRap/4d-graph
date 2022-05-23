import * as math from 'mathjs';
import parser from './parser';
import MathQuill from 'mathquill-node';

const MQ = MathQuill.getInterface(2)

export default class FunctionGui {
    constructor(sendToRender) {
        this.element = document.querySelector('.left');
        this.addBtn = this.element.querySelector('.addFunc')

        this.sendToRender = sendToRender;
    
        this.maths = []

        this.setEvents()

        this.addMath()
    }

    setEvents() {
        this.addBtn.addEventListener('click', () => this.addMath())
    }

    addMath() {
        const id = this.getNewID()

        const mathDiv = document.createElement('div')
        mathDiv.className = 'math'
        const field = document.createElement('span');
        field.className = 'field'
        mathDiv.appendChild(field)

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove'
        removeBtn.addEventListener('click', () => { this.removeMath(id) })

        mathDiv.appendChild(removeBtn)

        this.element.appendChild(mathDiv)

        const mqIntance = MQ.MathField(field)

        mathDiv.addEventListener('keyup', () => {
            /* Parse function, verif if function is OK and send all functions to 3D render */
            
            const latex = parser.removeUseless(mqIntance.latex());

            const type = parser.typeOfEnter(latex)
            
            if(type) {
                if(type.type === 'newFunction') {
                    const mathFunc = parser.parse(mqIntance.latex())
    
                    if(mathFunc) {
                        const funcInfo = this.getMath(id)
                        funcInfo['name'] = mathFunc.name;
                        funcInfo['func'] = mathFunc.func;
                        funcInfo['variable'] = mathFunc.variable
                        this.updateMaths(id, funcInfo)
    
                        this.sendToRender(this.maths)
                    }
                } else if(type.type === 'getFunction') {
                    const funcInfo = parser.extractInfo(latex)
                    const func = this.getMathFunction(funcInfo.name);
    
                    if(func) {
                        const res = func.func(funcInfo.num)
    
                        console.log(latex, type)
                        if(latex === type.match) {
                            mqIntance.latex(type.match + res.format(5))
                        }
                    }
                }
            }
        })


        this.maths.push({
            id,
            element: mathDiv,
            mqIntance,
        })
    }

    getMath(id) {
        return this.maths[id]
    }

    getMathFunction(name) {
        return this.maths.find(a => a.name === name);
    }

    updateMaths(id, newMath) {
        this.maths[id] = newMath
    }

    removeMath(id) {
        const func = this.maths.find(a => a.id === id);

        this.element.removeChild(func.element)

        this.maths.splice(this.maths.indexOf(func), 1);

        this.sendToRender(this.maths)
    }

    getNewID() {
        let maxID = -1;
        this.maths.forEach(value => {
            if(value.id > maxID) { maxID = value.id; }
        })
        return maxID + 1;
    }
}