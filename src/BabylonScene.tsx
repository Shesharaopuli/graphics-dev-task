import React, { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, TransformNode, Animation } from 'babylonjs';
import 'babylonjs-loaders';
import { PLANE_DEFAULTS } from './PlaneInput';
import { ICO_SPHERE_DEFAULTS } from './IcoSphereInput';
import { CYLINDER_DEFAULTS } from './CylinderInput';

interface BabylonSceneProps {
    setObjectSelected: React.Dispatch<React.SetStateAction<null>>;
    animationAmplitude: number;
    animationDuration: number;
}

const BabylonScene: React.FC<BabylonSceneProps> = ({ setObjectSelected, animationAmplitude, animationDuration }) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentSelectedObject: any = useRef(null)
    const sceneRef: any = useRef(null)

    const applyBouncing = (node: TransformNode, amplitude: number, duration: number, iterations: number = 6) => {
        if (!sceneRef.current || !node) {
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

            const createPlane = () => {
                const { width, height, depth } = PLANE_DEFAULTS
                const plane = MeshBuilder.CreateBox("Plane", { height, width, depth }, scene);
                plane.position.set(0, 0, 0);
            };
            const createIcoSphere = () => {
                const { radius, subdivisions } = ICO_SPHERE_DEFAULTS
                const icosphere = MeshBuilder.CreateIcoSphere("IcoSphere", { radius, subdivisions }, scene);
                icosphere.position.set(-2, 0, 0);
            }
            const createCylinder = () => {
                const { diameter, height } = CYLINDER_DEFAULTS
                const cylinder = MeshBuilder.CreateCylinder("Cylinder", { diameter, height }, scene);
                cylinder.position.set(2, 0, 0);
            }

            // Objects
            createPlane()
            createIcoSphere()
            createCylinder()
        }

        prepareScene();

        engine.runRenderLoop(() => {
            scene.render();
        });

        // Enable picking for meshes
        scene.onPointerDown = (evt) => {
            const pickResult = scene.pick(scene.pointerX, scene.pointerY);
            if (pickResult && pickResult.hit && pickResult.pickedMesh) {
                document.dispatchEvent(new CustomEvent("objectSelected", { detail: { mesh: pickResult.pickedMesh } }));
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
                const { mesh } = customEvent.detail;
                currentSelectedObject.current = mesh;
                setObjectSelected(mesh)
                applyBouncing(mesh, animationAmplitude, animationDuration);
            }
        };
        const handleAnimateObjectSelected = () => {
            applyBouncing(currentSelectedObject.current, animationAmplitude, animationDuration);
        }

        document.addEventListener('objectSelected', handleObjectSelected);
        document.addEventListener('animateObjectSelected', handleAnimateObjectSelected);

        return () => {
            document.removeEventListener('objectSelected', handleObjectSelected);
            document.removeEventListener('animateObjectSelected', handleAnimateObjectSelected);
        };
    }, [animationAmplitude, animationDuration, setObjectSelected]);

    return <canvas id="canvas" ref={canvasRef} />;
};

export default BabylonScene;
