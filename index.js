import Scene from "./src/scene";
import FunctionGui from "./src/function-gui";

const canvas    = document.querySelector('canvas');

const scene = new Scene(canvas)

const functionGui = new FunctionGui((functions) => {
    scene.updateFunction(functions)
})