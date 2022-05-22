import * as THREE from 'three';

export default class Scene {
    constructor(domElement) {
        this.domElement = domElement

        this.setSize()

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        this.setCamera()

        this.setRenderer()

        this.setEvents()
    } 

    /* ALL SETTER */
    setSize() {
        this.width = window.innerWidth * 0.7
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
        this.camera.z = 10;
        this.camera.lookAt(new THREE.Vector3())
    }

    setRenderer() {
        this.renderer = new THREE.WebGLRenderer({canvas: this.domElement})
        this.renderer.setAnimationLoop(() => { this.loop() });
        this.renderer.setSize(this.width, this.height)
        this.renderer.setClearColor(0xFCFFE7)
    }
    /* END OF SETTER */

    loop() {
        this.renderer.render(this.scene, this.camera);
    }
}