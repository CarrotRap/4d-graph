import * as math from 'mathjs';
import MathQuill from 'mathquill-node';

const MQ = MathQuill.getInterface(2)

export default class FunctionGui {
    constructor() {
        this.element = document.querySelector('.left');
        this.addBtn = this.element.querySelector('.addFunc')
    
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

        this.functions.push({
            id,
            element: funcDiv,
            mqIntance: MQ.MathField(fieldFunction)
        })
    }

    removeFunction(id) {
        const func = this.functions.find(a => a.id === id);

        this.element.removeChild(func.element)

        this.functions.splice(this.functions.indexOf(func), 1);

        console.log(this.functions)
    }

    getNewID() {
        let maxID = -1;
        this.functions.forEach(value => {
            if(value.id > maxID) { maxID = value.id; }
        })
        return maxID + 1;
    }
}