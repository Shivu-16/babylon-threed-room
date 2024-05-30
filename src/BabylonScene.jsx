import React, { useRef, useEffect } from 'react';
import * as BABYLON from 'babylonjs';

const BabylonScene = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const engine = new BABYLON.Engine(canvas, true);

        const createScene = () => {
            const scene = new BABYLON.Scene(engine);

            const camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 70, -100), scene);
            camera.setTarget(new BABYLON.Vector3(0, 0, 0));
            camera.fov = BABYLON.Tools.ToRadians(60);

            const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
            light.intensity = 0.7;

            const roomSize = 100;
            const roomHeight = 25;

            const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: roomSize, height: roomSize }, scene);
            const walls = [];
            walls.push(BABYLON.MeshBuilder.CreateBox('wall1', { width: roomSize, height: roomHeight, depth: 1 }, scene));
            walls.push(BABYLON.MeshBuilder.CreateBox('wall2', { width: 1, height: roomHeight, depth: roomSize }, scene));
            walls.push(BABYLON.MeshBuilder.CreateBox('wall3', { width: roomSize, height: 2.5, depth: 1 }, scene));
            walls.push(BABYLON.MeshBuilder.CreateBox('wall4', { width: 1, height: roomHeight, depth: roomSize }, scene));

            walls[0].position.z = roomSize / 2;
            walls[1].position.x = roomSize / 2;
            walls[2].position.z = -roomSize / 2;
            walls[3].position.x = -roomSize / 2;

            const object = BABYLON.MeshBuilder.CreateBox('object', { size: 5 }, scene);
            object.position = new BABYLON.Vector3(0, 2.5, 0);

            const objectMaterial = new BABYLON.StandardMaterial('objectMaterial', scene);
            objectMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red color
            object.material = objectMaterial;

            let keys = {};
            window.addEventListener('keydown', function (event) {
                keys[event.key] = true;
            });

            window.addEventListener('keyup', function (event) {
                keys[event.key] = false;
            });

            scene.onBeforeRenderObservable.add(() => {
                let speed = 1;
                if (keys['ArrowUp']) {
                    object.position.z += speed;
                }
                if (keys['ArrowDown']) {
                    object.position.z -= speed;
                }
                if (keys['ArrowLeft']) {
                    object.position.x -= speed;
                }
                if (keys['ArrowRight']) {
                    object.position.x += speed;
                }

                object.position.x = Math.max(-roomSize / 2 + 2.5, Math.min(roomSize / 2 - 2.5, object.position.x));
                object.position.z = Math.max(-roomSize / 2 + 2.5, Math.min(roomSize / 2 - 2.5, object.position.z));
            });

            return scene;
        };

        const scene = createScene();

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });

        return () => {
            window.removeEventListener('resize', () => engine.resize());
            engine.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default BabylonScene;
