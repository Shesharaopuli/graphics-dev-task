import React, { useCallback, useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, TransformNode, Animation } from 'babylonjs';
import 'babylonjs-loaders';

const BabylonScene: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentSelectedObject: any = useRef(null)
    const sceneRef: any = useRef(null)

    const applyBouncing = (node: TransformNode, amplitude: number, duration: number, iterations: number = 6) => {
        if (!sceneRef.current) {
            return
        }
        const bounceAnimation = new Animation("bouncingAnimation", "position.y", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        // Animation keys
        const keys = [];
        let currentAmplitude = amplitude;

        for (let i = 0; i <= iterations; i++) {
            keys.push({
                frame: i * duration / iterations,
                value: node.position.y + currentAmplitude,
                easing: new BABYLON.QuadraticEase()
            });

            keys.push({
                frame: (i + 0.5) * duration / iterations,
                value: node.position.y,
                easing: new BABYLON.QuadraticEase()
            });

            currentAmplitude /= 1.6; // Decrease amplitude for the next iteration
        }
        // Set keys
        bounceAnimation.setKeys(keys);
        // Attach animation to the mesh
        node.animations.push(bounceAnimation);
        // Run the animation
        sceneRef.current.beginWeightedAnimation(node, 0, duration, 10, true);
    }
    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            console.error("Couldn't find a canvas. Aborting the demo");
            return;
        }

        const engine = new Engine(canvas, true, {});
        const scene = new Scene(engine);
        sceneRef.current = scene

        const prepareScene = () => {
            // Camera
            const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 4, new Vector3(0, 0, 0), scene);
            camera.attachControl(canvas, true);

            // Light
            new HemisphericLight("light", new Vector3(0.5, 1, 0.8).normalize(), scene);
            // Objects
            const icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", { radius: 0.5 }, scene);
            icosphere.position.set(-2, 0, 0);

            const plane = MeshBuilder.CreateBox("Plane", { height: 0.5, width: 0.5, depth: 0.5 }, scene);
            plane.position.set(0, 0, 0);

            const cylinder = MeshBuilder.CreateCylinder("Cylinder", { diameter: 0.5, height: 1 }, scene);
            cylinder.position.set(2, 0, 0);
        }

        prepareScene();

        engine.runRenderLoop(() => {
            scene.render();
        });

        // Enable picking for meshes
        scene.onPointerDown = (evt) => {
            const pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult && pickResult.hit && pickResult.pickedMesh) {
                currentSelectedObject.current = pickResult.pickedMesh;
                document.dispatchEvent(new CustomEvent("objectSelected", { detail: { amplitude: 2, duration: 200 } }));
            }
        };

        window.addEventListener("resize", () => {
            engine.resize();
        });
        return () => {
            // Cleanup Babylon.js resources if needed
            engine.dispose();

        };
    }, []); // Empty dependency array ensures this effect runs once after the initial render

    useEffect(() => {
        const handleObjectSelected = (event: Event) => {
            // Access Babylon.js objects from the event details
            const customEvent = event as CustomEvent;
            if (customEvent.detail) {
                if (!currentSelectedObject.current) {
                    return
                }
                const { amplitude, duration } = customEvent.detail;
                applyBouncing(currentSelectedObject.current, amplitude, duration);
            }
        };

        document.addEventListener('objectSelected', handleObjectSelected);

        return () => {
            document.removeEventListener('objectSelected', handleObjectSelected);
        };
    }, []);

    return <canvas id="canvas" ref={canvasRef} />;
};

export default BabylonScene;
