import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import gsap from "gsap"

// Debug UI
const gui = new dat.GUI()

const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, duration: 1 })
  },
}

// Cursor
const cursor = { x: 0, y: 0 }

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5
  cursor.y = (e.clientY / sizes.height - 0.5) * -1
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl")

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", (e) => {
  // update size
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix() //recalculate objects based on the new aspect ratio

  // update renderer
  renderer.setSize(sizes.width, sizes.height)
  // improve perfomance on devices with high pixel ratios
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
})

// Scene
const scene = new THREE.Scene()

// Custom object

// const positions = new Float32Array([0, 0, 0, 1, 0, 0, 0, 1, 0])
// const attribute = new THREE.BufferAttribute(positions, 3)
const count = 50
const positions = new Float32Array(count * 3 * 3).map(
  () => (Math.random() - 0.5) * 2
)
const attribute = new THREE.BufferAttribute(positions, 3)
const geometry = new THREE.BufferGeometry()
geometry.setAttribute("position", attribute)

const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
  // geometry,
  new THREE.MeshBasicMaterial({ color: parameters.color })
)
scene.add(mesh)

// debug
gui.add(mesh.position, "y").min(-2).max(2).step(0.01).name("Elevation")
gui.add(mesh, "visible")
gui.add(mesh.material, "wireframe")
gui.addColor(parameters, "color").onChange(() => {
  mesh.material.color.set(parameters.color)
})
gui.add(parameters, "spin")

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)

// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// )

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
// improve perfomance on devices with high pixel ratios
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  //   mesh.rotation.y = elapsedTime

  // update camera
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  //   camera.position.y = cursor.y * 3
  //   camera.lookAt(mesh.position)

  // update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
