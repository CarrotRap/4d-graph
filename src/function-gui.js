import * as math from 'mathjs';
import parse from './parser';
import MathQuill from 'mathquill-node';

const MQ = MathQuill.getInterface(2)

export default class FunctionGui {
    constructor(sendToRender) {
        this.element = document.querySelector('.left');
        this.addBtn = this.element.querySelector('.addFunc')

        this.sendToRender = sendToRender;
    
        this.functions = []

        this.setEvents()

        this.addFunction()
    }

    setEvents() {
        this.addBtn.addEventListener('click', () => this.addFunction())
    }

    addFunction() {
        const id = this.getNewID()

        const funcDiv = document.createElement('div')
        funcDiv.className = 'function item';

        const fieldFunction = document.createElement('span');
        fieldFunction.className = 'fieldFunction'
        funcDiv.appendChild(fieldFunction)

        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove'
        removeBtn.addEventListener('click', () => { this.removeFunction(id) })

        funcDiv.appendChild(removeBtn)

        this.element.appendChild(funcDiv)

        const mqIntance = MQ.MathField(fieldFunction)

        funcDiv.addEventListener('keyup', () => {
            /* Parse function, verif if function is OK and send all functions to 3D render */
            const mathFunc = parse(mqIntance.latex())
            
            if(mathFunc) {
                const funcInfo = this.getFunction(id)
                funcInfo['name'] = mathFunc.name;
                funcInfo['func'] = mathFunc.func;
                funcInfo['variable'] = mathFunc.variable
                this.updateFunction(id, funcInfo)

                this.sendToRender(this.functions)
            }
        })


        this.functions.push({
            id,
            element: funcDiv,
            mqIntance,
        })
    }

    getFunction(id) {
        return this.functions[id]
    }

    updateFunction(id, newFunc) {
        this.functions[id] = newFunc
    }

    removeFunction(id) {
        const func = this.functions.find(a => a.id === id);

        this.element.removeChild(func.element)

        this.functions.splice(this.functions.indexOf(func), 1);

        this.sendToRender(this.functions)
    }

    getNewID() {
        let maxID = -1;
        this.functions.forEach(value => {
            if(value.id > maxID) { maxID = value.id; }
        })
        return maxID + 1;
    }
}