import React, { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Quaternion } from 'babylonjs';
import 'babylonjs-loaders';

const BabylonScene: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            console.error("Couldn't find a canvas. Aborting the demo");
            return;
        }

        const engine = new Engine(canvas, true, {});
        const scene = new Scene(engine);

        function prepareScene() {
            // Camera
            const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 4, new Vector3(0, 0, 0), scene);
            camera.attachControl(canvas, true);

            // Light
            new HemisphericLight("light", new Vector3(0.5, 1, 0.8).normalize(), scene);

            // Objects
            const plane = MeshBuilder.CreateBox("Plane", {}, scene);
            plane.rotationQuaternion = Quaternion.FromEulerAngles(0, Math.PI, 0);

            const icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", {}, scene);
            icosphere.position.set(-2, 0, 0);

            const cylinder = MeshBuilder.CreateCylinder("Cylinder", {}, scene);
            cylinder.position.set(2, 0, 0);
        }

        prepareScene();

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });

        return () => {
            // Cleanup Babylon.js resources if needed
            engine.dispose();
        };
    }, []); // Empty dependency array ensures this effect runs once after the initial render

    return <canvas id="canvas" ref={canvasRef} />;
};

export default BabylonScene;
