import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Text, Html, Center, Environment, OrbitControls } from '@react-three/drei'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { gsap } from 'gsap';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import './scope.css'

THREE.DefaultLoadingManager.onLoad = () => {
    console.log('All assets loaded')

}

function Scope({ onLoaded }) {
    const { camera, gl } = useThree()
    const controlsRef = useRef()
    const modelRef = useRef()
    const spinRef = useRef()
    const pointerDownRef = useRef(null)
    const draggedRef = useRef(false)
    const idleSpinRef = useRef(0)
    const defaultCameraPosition = useRef(new THREE.Vector3())
    const defaultTarget = useRef(new THREE.Vector3())
    const { size, viewport } = useThree();

    const cssWidth = size.width / viewport.dpr;
    const currentRatio = size.width / size.height;
    const targetRatio = 16 / 9;

    let finalScale = 1;

    if (cssWidth > 768) {
        finalScale = 3.5 / 4;
    } else {
        finalScale = 1;
    }

    const basePose = useRef({
        rotation: new THREE.Euler(0, 0, 0),
        position: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1)
    })
    const lockedPose = useRef({
        rotation: new THREE.Euler(0, 0, 0),
        position: new THREE.Vector3(0.35, -0.2, 0),
        scale: new THREE.Vector3(1.4, 1.4, 1.4)
    })
    const lockedCameraPosition = useRef(new THREE.Vector3(0, 0.2, 4 * finalScale))
    const lockedTarget = useRef(new THREE.Vector3(0, 0, 0))

    const scope = useLoader(GLTFLoader, '/models/oscilloscope4.glb', (loader) => {
        const dracoLoader = new DRACOLoader(THREE.DefaultLoadingManager)
        dracoLoader.setDecoderPath('/draco/')
        loader.setDRACOLoader(dracoLoader)
    })

    const texture = useLoader(THREE.TextureLoader, '/textures/Bake6.webp')


    useEffect(() => {
        texture.flipY = false
        texture.colorSpace = THREE.SRGBColorSpace
        texture.needsUpdate = true

        scope.scene.traverse((child) => {
            if (child.isMesh) {
                if (child.name.includes('bnc')) {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0x000000,
                        roughness: 0.9,
                        metalness: 0.5
                    })
                }
                else {
                    child.material = new THREE.MeshBasicMaterial({ map: texture })
                }
                child.material.needsUpdate = true
            }
        })
    }, [scope, texture])

    const [hovered, setHovered] = useState(false)
    const [locked, setLocked] = useState(false)
    const [unlocking, setUnlocking] = useState(false)

    useEffect(() => {
        const controls = controlsRef.current

        if (!controls) return

        defaultCameraPosition.current.copy(camera.position)
        defaultTarget.current.copy(controls.target)
    }, [camera])

    useEffect(() => {
        const handleWindowPointerMove = (event) => {
            if (!locked || unlocking) return

            const rect = gl.domElement.getBoundingClientRect()
            const pointer = new THREE.Vector2(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1
            )

            const raycaster = new THREE.Raycaster()
            raycaster.setFromCamera(pointer, camera)

            if (!raycaster.intersectObject(scope.scene, true).length) {
                handleUnlock()
            }
        }

        window.addEventListener('pointermove', handleWindowPointerMove)

        return () => {
            window.removeEventListener('pointermove', handleWindowPointerMove)
        }
    }, [camera, gl, locked, unlocking, scope.scene])

    const handleLock = () => {
        const controls = controlsRef.current

        if (!controls || locked || unlocking) return

        idleSpinRef.current = 0
        if (spinRef.current) {
            spinRef.current.rotation.y = 0
        }

        setLocked(true)
        controls.enabled = false
        camera.position.copy(lockedCameraPosition.current)
        controls.target.copy(lockedTarget.current)
        camera.lookAt(controls.target)
        controls.update()
    }

    const handleUnlock = () => {
        const controls = controlsRef.current

        if (!controls || !locked || unlocking) return

        setUnlocking(true)
        controls.enabled = true
        controls.update()
    }

    const handlePointerDown = (event) => {
        pointerDownRef.current = {
            x: event.clientX,
            y: event.clientY
        }
        draggedRef.current = false
    }

    const handlePointerMove = (event) => {
        if (!pointerDownRef.current) return

        const deltaX = Math.abs(event.clientX - pointerDownRef.current.x)
        const deltaY = Math.abs(event.clientY - pointerDownRef.current.y)

        if (deltaX > 5 || deltaY > 5) {
            draggedRef.current = true
        }
    }

    const clearPointerState = () => {
        pointerDownRef.current = null
        draggedRef.current = false
    }

    const handlePointerUp = () => {
        if (pointerDownRef.current && !draggedRef.current) {
            handleLock()
        }

        clearPointerState()
    }

    useEffect(() => {
        const handleWindowPointerUp = () => {
            clearPointerState()
        }

        window.addEventListener('pointerup', handleWindowPointerUp)
        window.addEventListener('pointercancel', handleWindowPointerUp)

        return () => {
            window.removeEventListener('pointerup', handleWindowPointerUp)
            window.removeEventListener('pointercancel', handleWindowPointerUp)
        }
    }, [])

    useEffect(() => {
        const controls = controlsRef.current

        if (!controls) return

        controls.enabled = !(locked || unlocking)
    }, [locked, unlocking])

    useEffect(() => {
        document.body.style.cursor = hovered ? 'pointer' : 'auto'

        const targetScale = (hovered && !locked && !unlocking) ? 4.1 : 4

        gsap.to(scope.scene.scale, {
            x: targetScale,
            y: targetScale,
            z: targetScale,
            duration: 0.5,
            ease: 'power3.out',
        })
    }, [hovered, scope])

    useFrame((_, delta) => {
        const controls = controlsRef.current

        if (unlocking && controls) {
            const progress = 1 - Math.pow(0.0001, delta)

            camera.position.lerp(defaultCameraPosition.current, progress)
            controls.target.lerp(defaultTarget.current, progress)
            camera.lookAt(controls.target)
            controls.update()

            if (
                camera.position.distanceToSquared(defaultCameraPosition.current) < 0.0001 &&
                controls.target.distanceToSquared(defaultTarget.current) < 0.0001
            ) {
                camera.position.copy(defaultCameraPosition.current)
                controls.target.copy(defaultTarget.current)
                camera.lookAt(controls.target)
                controls.update()
                setUnlocking(false)
                setLocked(false)
            }
        }

        if (!modelRef.current) return

        const targetPose = locked ? lockedPose.current : basePose.current
        const transitionSpeed = locked ? 1 - Math.pow(0.03, delta) : 1 - Math.pow(0.004, delta)
        const idleSpinSpeed = 0.12

        if (!locked && !unlocking && !pointerDownRef.current) {
            idleSpinRef.current = THREE.MathUtils.euclideanModulo(
                idleSpinRef.current + delta * idleSpinSpeed,
                Math.PI * 2
            )
        }

        modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetPose.rotation.x, transitionSpeed)
        modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetPose.rotation.y, transitionSpeed)
        modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, targetPose.rotation.z, transitionSpeed)
        modelRef.current.position.lerp(targetPose.position, transitionSpeed)
        modelRef.current.scale.lerp(targetPose.scale, transitionSpeed)

        if (spinRef.current) {
            spinRef.current.rotation.y = idleSpinRef.current
        }
    })


    // Exit text
    const visible = locked && !unlocking
    const textRef = useRef()

    useEffect(() => {
        if (!textRef.current) return

        // Restart the fade whenever the text becomes visible
        textRef.current.material.opacity = 0
        textRef.current.material.transparent = true
    }, [visible])

    useFrame((state, delta) => {
        if (!visible || !textRef.current) return

        const material = textRef.current.material

        material.opacity = Math.min(
            material.opacity + delta * 0.5,
            1
        )
    })

    return (
        <>
            <Environment preset="apartment" />

            <OrbitControls
                ref={controlsRef}
                makeDefault
                enableZoom={false}
                minDistance={3}
                maxDistance={8}
            />

            <Center>
                <group
                    ref={modelRef}
                    onPointerDown={(event) => {
                        event.stopPropagation()
                        handlePointerDown(event)
                    }}
                    onPointerMove={(event) => {
                        event.stopPropagation()
                        handlePointerMove(event)
                    }}
                    onPointerUp={(event) => {
                        event.stopPropagation()
                        handlePointerUp()
                    }}
                    onPointerEnter={(event) => {
                        event.stopPropagation()
                        setHovered(true)
                    }}
                    onPointerLeave={(event) => {
                        event.stopPropagation()
                        setHovered(false)
                    }}
                >
                    <group ref={spinRef}>
                        <primitive object={scope.scene} scale={4} position={[0, 0, 0]}>
                            <Html fullscreen
                                wrapperClass="screen"
                                style={{ pointerEvents: locked && !unlocking ? 'auto' : 'none' }}
                                position={[-0.047, 0.108, 0.085
                                ]}
                                rotation={[0, 0, 0]}
                                transform
                                distanceFactor={0.1}
                                occlude
                            >
                                <iframe
                                    className="screen-iframe"
                                    scrolling="no"
                                    src="https://scope-screen.vercel.app/"
                                    //src="http://localhost:5175/"
                                    style={{ pointerEvents: locked && !unlocking ? 'auto' : 'none' }}
                                />
                            </Html>
                        </primitive>


                    </group>
                </group>
            </Center>
            <Text
                ref={textRef}
                visible={visible}
                position={[-0.55, 0.06, 1]}
                fontSize={0.03}
                color="#c9b8ab"
                anchorX="center"
                anchorY="middle"
                rotation={[0, 0, Math.PI / 2]}
            >
                Exit
            </Text>
        </>
    )
}

export default Scope