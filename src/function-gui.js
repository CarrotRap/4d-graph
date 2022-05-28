import * as math from 'mathjs';
import parser from './parser';

const MQ = MathQuill.getInterface(2)

export default class FunctionGui {
    constructor(send) {
        this.element = document.querySelector('.left');
        this.addBtn = this.element.querySelector('.addFunc')

        this.send = send;
    
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

        const mathInput = document.createElement('input');
        mathInput.addEventListener('input', (e) => {
            const info = parser.extractInfo(e.target.value)

            this.updateMath(id, (math) => {
                math.content = e.target.value

                switch(info.type) {
                    case 'notvalid':
                        math.state = 'notvalid';
                        break;

                    case 'number':
                        math.name = info.name;
                        math.number = info.number;
                        math.state = 'get';

                        const parentMath = this.getParentFunction(math.name);

                        if(parentMath && e.target.value.indexOf('=') !== -1) {
                            mathInput.value += parentMath.jsFunc(math.number).format(5)
                        }

                        break;

                    case 'var':
                        math.name = info.name;
                        math.var = info.var
                        math.state = 'new';

                        if(info.function === '') {
                            math.function = math.var
                        } else {
                            math.function = info.function
                        }

                        math.jsFunc = parser.parse(math.function, math.var);
                        break;
                }

                return math;
            })
        })
        mathDiv.appendChild(mathInput);

        const remove = document.createElement('span');
        remove.className = 'remove'
        remove.addEventListener('click', () => {
            this.removeMath(id)
        })
        mathDiv.appendChild(remove)

        this.element.appendChild(mathDiv)

        this.maths.push({
            id,
            el: mathDiv,
            content: '',
        })
    }

    getMath(id) {
        return this.maths.find(a => a.id === id);
    }

    getParentFunction(name) {
        return this.maths.find(a => (a.name === name && a.state === 'new'));
    }

    updateMath(id, callback) {
        const math = this.getMath(id);
        
        this.maths[this.maths.indexOf(math)] = callback(math)

        this.updateRenderer()
    }

    removeMath(id) {
        const math = this.maths.find(a => a.id === id);

        this.element.removeChild(math.el)

        this.maths.splice(this.maths.indexOf(math), 1);

        this.updateRenderer()
    }

    getNewID() {
        let maxID = -1;
        this.maths.forEach(value => {
            if(value.id > maxID) { maxID = value.id; }
        })
        return maxID + 1;
    }

    updateRenderer() {
        this.send(this.maths.filter(a => a.state === 'new'))
    }
}