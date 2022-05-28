import * as math from 'mathjs';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const hslRange = 0.8

export default class Scene {
    constructor(domElement) {
        this.domElement = domElement

        this.range = 10
        this.precision = 10

        this.setSize()

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        this.axesFunctions = new THREE.Group()
        this.axesFunctions.rotation.x = Math.PI / -2
        this.scene.add(this.axesFunctions)

        this.functionsGroup = new THREE.Group()
        this.axesFunctions.add(this.functionsGroup);

        this.functions = []

        this.setCamera()

        this.addDefaultsObjects()

        this.setRenderer()

        this.setEvents()
    } 

    /* ALL SETTER */
    setSize() {
        this.width = window.innerWidth * 0.8
        this.height = window.innerHeight
    }

    setEvents() {
        window.addEventListener('resize', () => { 
            this.setSize() 

            this.camera.aspect = this.width / this.height
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(this.width, this.height)
        })
    }

    setCamera() {
        this.camera = new THREE.PerspectiveCamera(75, this.width/this.height,0.1,1000)
        this.camera.position.z = 10;
        this.camera.lookAt(new THREE.Vector3())
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({canvas: this.domElement});
        this.renderer.setSize(this.width, this.height)
        //this.renderer.setClearColor(0xFCFFE7)

        this.renderer.setAnimationLoop(() => { this.loop() });
    }
    /* END OF SETTER */

    addDefaultsObjects() {
        this.controls = new OrbitControls(this.camera, this.domElement);

        this.axes = new THREE.AxesHelper()
        this.axesFunctions.add(this.axes)
    }

    reloadFunction() {
        for (var i = this.functionsGroup.children.length - 1; i >= 0; i--) {
            this.functionsGroup.remove(this.functionsGroup.children[i]);
        }
        for(var func of this.functions) {
            this.addIN3D(func.jsFunc)
        }
    }

    updateFunction(functions) {
        this.functions = functions

        this.reloadFunction()
    }
 
    addIN3D(func) {
        const geometry = new THREE.PlaneGeometry(this.range, this.range, this.range * this.precision, this.range * this.precision);
        geometry.computeBoundingBox()
        geometry.computeBoundingSphere()

        const points = []
        
        let wMax = 0
        let wMin = 0
        const position = geometry.getAttribute('position');
        for(let i = 0; i < position.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(position, i)
            const z = func(math.complex(vertex.x, vertex.y))

            if(z.im > wMax) wMax = z.im;
            if(z.im < wMin) wMin = z.im

            points.push(z)
        }

        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(position.count * 3), 3))
        const colors = geometry.attributes.color;

        const wRange = math.abs(wMax - wMin)
        for(let i = 0; i < position.count; i++) {
            const vertex = new THREE.Vector3().fromBufferAttribute(position, i)

            const result = points[i];
            vertex.z = result.re

            const color = new THREE.Color(0xffffff).setHSL(hslRange - ((result.im + math.abs(wMin))/wRange*hslRange), 1, 0.5)
            colors.setXYZ(i, color.r, color.g, color.b);

            position.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: true, wireframe: true });

        const mesh = new THREE.Mesh(geometry, material);
        this.functionsGroup.add(mesh);
    }

    loop() {
        this.renderer.render(this.scene, this.camera)
    }
}