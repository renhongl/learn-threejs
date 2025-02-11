


(function () {

    function init() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        const renderer = new THREE.WebGLRenderer();
        const light = new THREE.AmbientLight(0xffffff);
        const directionLight = new THREE.DirectionalLight(0xffffff, 3);

        // set size
        renderer.setSize(window.innerWidth, window.innerHeight);
        // set background
        renderer.setClearColor(0x62aaf2);
        // show shadow
        renderer.shadowMap.enabled = true;
        // render on dom
        document.body.appendChild(renderer.domElement);
        // set position for camera
        camera.position.set(-50, 30, 100);
        // set camera to look at this scene
        camera.lookAt(scene.position);
        // add ambient light
        scene.add(light);
        scene.add(directionLight);

        return {
            scene,
            camera,
            renderer,
        }
    }

    function createSpotLight(plane) {
        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.angle = 1;
        spotLight.distance = 2000;
        spotLight.intensity = 0.5;
        spotLight.position.set(1000, 1000, 20);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 4048;
        spotLight.shadow.mapSize.height = 4048;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 1000;
        spotLight.shadow.camera.fov = 30;
        spotLight.target = plane;
        const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        spotLight.name = 'globalLight';
        return {
            spotLight,
            spotLightHelper,
        };
    }

    function createOrbitControls(camera, renderer) {
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        // camera.position.set(0, 20, 100);
        controls.update();
        return controls;
    }

    function trackballControls(camera, renderer) {
        const trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
        return trackballControls;
    }

    function createStats(type) {
        const paneType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
        const stats = new Stats();
        stats.showPanel(paneType);
        document.body.appendChild(stats.dom);
        return stats;
    }

    function createDatGUI(scene) {
        const guiControl = {
        }
        const gui = new dat.GUI();
        return guiControl;
    }

    function createSnow(scene, type, size) {
        const loader = new THREE.TextureLoader();
        const s = loader.load('../textures/sprites/snowflake' + type + '.png');
        const geo = new THREE.Geometry();
        const mat = new THREE.PointsMaterial({
            size: size,
            map: s,
            blending: THREE.AdditiveBlending,
            color: 0xffffff,
            transparent: true,
            vertexColors: true
        });
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * 2000 - 1000;
            const y = Math.random() * 2000 - 1000;
            const z = Math.random() * 2000 - 1000;
            geo.vertices.push(new THREE.Vector3(x, y, z));
            geo.colors.push(new THREE.Color(0xffffff));
        }
        const sprite = new THREE.Points(geo, mat);
        sprite.name = 'snow';
        scene.add(sprite);
    }

    function createCloud(scene, size) {
        const loader = new THREE.TextureLoader();
        const s = loader.load('../textures/lava/cloud.png');
        const geo = new THREE.Geometry();
        const mat = new THREE.PointsMaterial({
            size: size,
            map: s,
            blending: THREE.AdditiveBlending,
            color: 0x62aaf2,
            transparent: true,
            vertexColors: true
        });
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * 2000 - 1000;
            const y = 100;
            const z = Math.random() * 2000 - 1000;
            geo.vertices.push(new THREE.Vector3(x, y, z));
            geo.colors.push(new THREE.Color(0xffffff));
        }
        const sprite = new THREE.Points(geo, mat);
        scene.add(sprite);
    }

    function clear(scene) {
        scene.children.forEach(function (child) {
            if (child instanceof THREE.Points) {
                scene.remove(child);
            }
        });
    }

    let n = 1;

    function update(scene) {
        scene.children.forEach(function (child) {
            if (child.name && child.name === 'snow') {
                const vertices = child.geometry.vertices;
                // child.rotation.x += 0.04;
                vertices.forEach(function (v) {
                    if (v.y < -500) {
                        v.y = Math.random() * 1000 + 1000;
                    } else {
                        v.y = v.y - 7;
                    }
                });
                child.geometry.verticesNeedUpdate = true;
            }
            if (child instanceof THREE.Sprite) {
                if (n > 4) {
                    n = 1;
                }
                child.material.map.offset.set(1 / 4 * n++, 0);
                child.material.needsUpdate = true;
            }
            if (child instanceof THREE.PointLight) {
                const now = Date.now() * 0.0005;;
                child.position.x = Math.sin(now * 0.7) * 100;
                child.position.z = Math.sin(now * 0.5) * 100;
            }
            if (child.name && child.name === 'convex') {
                child.rotation.x += 0.008;
                child.rotation.z += 0.008;
            }
            if (child.name && child.name === 'globalLight') {
                // if (child.intensity > 50) {
                //     child.intensity -= 1;
                // } else {
                //     child.intensity += 1;
                // }
            }
        })
    }

    function createPlane() {
        const loader = new THREE.TextureLoader();
        const t = loader.load('../textures/minecraft/grass.png');
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(100, 100);
        const geo = new THREE.PlaneGeometry(1000, 1000);
        const mat = new THREE.MeshPhongMaterial({
            color: 0x1e1e1e,
            transparent: true,
            map: t,
        });
        const plane = new THREE.Mesh(geo, mat);
        plane.position.y = -20;
        plane.rotation.x = -Math.PI * 0.5;
        plane.receiveShadow = true;
        return plane;
    }

    function createWood() {
        const loader = new THREE.TextureLoader();
        const s = loader.load('../textures/hardwood2_diffuse.jpg');
        const geo = new THREE.BoxGeometry(5, 10, 5);
        const mat = new THREE.MeshLambertMaterial({
            map: s,
        });
        const wood = new THREE.Mesh(geo, mat);
        wood.position.set(-30, -17.5, 0);
        wood.rotation.x = - Math.PI * 0.5;
        wood.castShadow = true;
        return wood;
    }

    function createTree(scene) {
        const group = new THREE.Object3D();
        const loader = new THREE.TextureLoader();
        const leaf = loader.load('../textures/minecraft/grass.png');
        const root = loader.load('../textures/minecraft/dirt.png');
        leaf.wrapS = THREE.RepeatWrapping;
        leaf.wrapT = THREE.RepeatWrapping;
        leaf.repeat.set(10, 10);
        root.wrapS = THREE.RepeatWrapping;
        root.wrapT = THREE.RepeatWrapping;
        root.repeat.set(10, 10);
        const leafGeo = new THREE.SphereGeometry(15, 8, 8);
        const leafMat = new THREE.MeshLambertMaterial({
            transparent: true,
            map: leaf,
        });
        const leafObj = new THREE.Mesh(leafGeo, leafMat);
        leafObj.position.set(0, 30, 0);
        const rootGeo = new THREE.CylinderGeometry(3, 3, 40);
        const rootMat = new THREE.MeshLambertMaterial({
            transparent: true,
            map: root
        });
        const rootObj = new THREE.Mesh(rootGeo, rootMat);
        group.add(leafObj);
        group.add(rootObj);
        group.castShadow = true;
        leafObj.castShadow = true;
        rootObj.castShadow = true;
        group.scale.y = Math.random() * 2 + 0.5;
        group.position.set(Math.random() * 1000 - 500, 0, Math.random() * 1000 - 500);
        return group;
    }

    function createTemp(scene) {
        const loader = new THREE.OBJLoader();
        loader.load('../objects/tree.obj', function (obj) {
            // obj.material.color.setHex(0x666666);
            scene.add(obj);
        });
    }

    function createTestAnim(scene, n) {
        const loader = new THREE.TextureLoader();
        const s = loader.load('../images/rect.jpg');
        const mat = new THREE.SpriteMaterial({
            transparent: true,
            color: 0xffffff,
            map: s,
        });
        mat.map.offset = new THREE.Vector2(0, 0);
        mat.map.repeat = new THREE.Vector2(1 / 4, 1 / 4);
        mat.deepthTest = false;
        const sprite = new THREE.Sprite(mat);
        scene.add(sprite);
        // const annie = new THREE.TextureAnimator(s, 4, 4, 16, 150);
        // scene.add(annie);
    }

    function createPointLight() {
        const light = new THREE.PointLight(0xf7c242, 10, 100);
        light.position.set(50, 50, 50);
        light.add(new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshPhongMaterial({ color: 0xf7c242 })));
        return light;
    }

    function createRoadLight() {
        const group = new THREE.Group();
        const geo = new THREE.CylinderGeometry(1, 1, 30, 32, 32);
        const mat = new THREE.MeshLambertMaterial({
            color: 0x4a4a4a,
        });
        const obj = new THREE.Mesh(geo, mat);
        obj.position.set(50, -5, 50);
        group.add(obj);
        const light = new THREE.SpotLight(0xf7c242, 10, 100, Math.PI * 0.7);
        light.position.set(49, 9, 51);
        light.add(new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshPhongMaterial({ color: 0xf7c242 })));
        group.add(light);
        group.position.set(0, 0, -100);
        return group;
    }

    function createStone() {
        let points = [];
        for (let i = 0; i < 10; i++) {
            points.push(new THREE.Vector3(Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25));
        }
        const mat = new THREE.MeshLambertMaterial({
            color: 0xff0000,
            transparent: false,
        });
        const convexGeo = new THREE.ConvexGeometry(points);
        convexGeo.computeVertexNormals();
        convexGeo.computeFaceNormals();
        convexGeo.normalsNeedUpdate = true;
        const convexObj = new THREE.Mesh(convexGeo, mat);
        convexObj.name = 'convex';
        convexObj.position.set(0, 20, -150);
        return convexObj;
    }

    function createTree1(scene) {
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('../objects/tree/Tree.mtl', function (materials) {
            materials.preload();
            const mats = materials.materials;
            for (let key in mats) {
                mats[key].transparent = true;
                mats[key].color = new THREE.Color(0x61f048);
            }
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('../objects/tree/tree.obj', function (object) {
                object.castShadow = true;
                object.children.forEach(function(child) {
                    child.castShadow = true;
                });
                object.scale.set(30, 30, 30);
                for (let i = 0; i < 10; i++) {
                    const temp = object.clone(true);
                    temp.position.set(Math.random() * 1000 - 500, -20, Math.random() * 1000 - 500);
                    scene.add(temp);
                }
            }, null, null);
        });
    }

    function createGrass(scene) {
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('../objects/grass/grass.mtl', function (materials) {
            materials.preload();
            const mats = materials.materials;
            for (let key in mats) {
                mats[key].transparent = true;
            }
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('../objects/grass/grass.obj', function (object) {
                object.castShadow = true;
                object.children.forEach(function(child) {
                    child.castShadow = true;
                });
                object.scale.set(1, 1, 1);
                for (let i = 0; i < 10; i++) {
                    const temp = object.clone(true);
                    temp.position.set(Math.random() * 1000 - 500, -20, Math.random() * 1000 - 500);
                    scene.add(temp);
                }
            }, null, null);
        });
    }

    function createTree2(scene) {
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('../objects/tree2/plants6.mtl', function (materials) {
            materials.preload();
            const mats = materials.materials;
            for (let key in mats) {
                mats[key].transparent = true;
            }
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('../objects/tree2/plants6.obj', function (object) {
                object.castShadow = true;
                object.children.forEach(function(child) {
                    child.castShadow = true;
                });
                object.scale.set(0.05, 0.05, 0.05);
                for (let i = 0; i < 10; i++) {
                    const temp = object.clone(true);
                    temp.position.set(Math.random() * 1000 - 500, -20, Math.random() * 1000 - 500);
                    scene.add(temp);
                }
            }, null, null);
        });
    }

    function createMushroom(scene) {
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('../objects/mushroom/mushroom.mtl', function (materials) {
            materials.preload();
            const mats = materials.materials;
            for (let key in mats) {
                mats[key].transparent = true;
                mats[key].color = new THREE.Color(0x7e7218);
            }
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('../objects/mushroom/mushroom.obj', function (object) {
                object.castShadow = true;
                object.children.forEach(function(child) {
                    child.castShadow = true;
                });
                object.scale.set(1, 1, 1);
                for (let i = 0; i < 500; i++) {
                    const temp = object.clone(true);
                    temp.position.set(Math.random() * 1000 - 500, -20, Math.random() * 1000 - 500);
                    temp.rotation.x = -Math.PI * 0.5;
                    scene.add(temp);
                }
            }, null, null);
        });
    }

    function createCar(scene) {
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('../objects/bmw_x5/BMW X5 4.mtl', function (materials) {
            materials.preload();
            const mats = materials.materials;
            for (let key in mats) {
                mats[key].transparent = true;
                // mats[key].color = new THREE.Color(0x7e7218);
            }
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('../objects/bmw_x5/BMW X5 4.obj', function (object) {
                object.castShadow = true;
                object.children.forEach(function(child) {
                    child.castShadow = true;
                });
                object.scale.set(0.2, 0.2, 0.2);
                for (let i = 0; i < 1; i++) {
                    const temp = object.clone(true);
                    temp.position.set(100, -20, 0);
                    scene.add(temp);
                }
            }, null, null);
        });
    }

    function createDog(scene) {
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('../objects/dog/dog.mtl', function (materials) {
            materials.preload();
            const mats = materials.materials;
            for (let key in mats) {
                mats[key].transparent = true;
                // mats[key].color = new THREE.Color(0x7e7218);
            }
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('../objects/dog/dog.obj', function (object) {
                object.castShadow = true;
                object.children.forEach(function(child) {
                    child.castShadow = true;
                });
                object.scale.set(0.2, 0.2, 0.2);
                for (let i = 0; i < 1; i++) {
                    const temp = object.clone(true);
                    temp.position.set(150, -20, 0);
                    temp.rotation.x = -Math.PI * 0.5;
                    scene.add(temp);
                }
            }, null, null);
        });
    }

    function renderScene(scene, camera, renderer, controls, stats, guiControl) {
        stats.begin();
        controls.update();
        update(scene);
        renderer.render(scene, camera);
        stats.end();
        requestAnimationFrame(function () {
            renderScene(scene, camera, renderer, controls, stats, guiControl);
        });
    }

    function main() {
        const { scene, camera, renderer } = init();
        const controls = createOrbitControls(camera, renderer);
        const guiControl = createDatGUI(scene, createSnow);
        const stats = createStats(0);
        const plane = createPlane();
        const { spotLight, spotLightHelper } = createSpotLight(plane);
        const wood = createWood();
        const pointLight = createPointLight();
        // const stone = createStone();
        const roadLight = createRoadLight();
        // for (let i = 0; i < 50; i++) {
        //     const tree = createTree();
        //     scene.add(tree);
        // }
        scene.add(roadLight);
        // scene.add(stone);
        // scene.add(pointLight);
        scene.add(wood);
        createSnow(scene, '1', 20);
        createSnow(scene, '2', 30);
        createSnow(scene, '3', 30);
        createSnow(scene, '4', 20);
        createSnow(scene, '5', 10);
        createCloud(scene, 10);
        createCloud(scene, 20);
        createTree1(scene);
        createGrass(scene);
        createCar(scene);
        createDog(scene);
        createMushroom(scene);
        createTree2(scene);
        scene.add(plane);
        scene.add(spotLight);
        // createTemp(scene);
        // scene.add(spotLightHelper);
        requestAnimationFrame(function () {
            renderScene(scene, camera, renderer, controls, stats, guiControl);
        });
    }

    main();


}());