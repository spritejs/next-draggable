import { install } from '../src/index'
import { ResizeBlock } from './ResizeBlock'
const { Scene, Sprite, Group } = spritejs
const [w, h] = [window.innerWidth, window.innerHeight]
install(spritejs) //安装插件
let container = document.querySelector('#canvas-wrap')
const scene = new Scene({ container, displayRatio: window.devicePixelRatio })

//scene.delegateEvent('mousewheel', document) //sprite 元素侦听mousewheel事件
window.scene = scene
const layer = scene.layer()

let spriteRed = new Sprite() //
spriteRed.draggable({ dragRect: [0, 0, 300, 300] })
let spriteGreen = new Sprite()
let spriteScale = new ResizeBlock({ size: [100, 30], backgroundColor: '#eee', dragRect: [0, 0] })

spriteRed.attr({ size: [100, 30], bgcolor: '#f00', pos: [200, 200] })
spriteRed.addEventListener('click', e => {
  e.stopPropagation()
  console.log('sprite-click')
})
spriteGreen.attr({ size: [100, 30], pos: [150, 300], bgcolor: 'rgba(0,255,0,0.5)', zIndex: 1 })

spriteGreen.addEventListener('dblclick', evt => {
  group.droppable(false)
})
let nGroup = new Group()
nGroup.draggable()
nGroup.attr({ pos: [300, 300], clipOverflow: false, bgcolor: '#0ff' })
nGroup.append(spriteGreen)
nGroup.addEventListener('click', function (e) {
  e.stopPropagation()
  console.log('aaaa-click')
})
layer.append(spriteGreen)

let group = new Group()
//设置group可以拖动
group.draggable()
group.droppable()
group.append(spriteRed)
group.addEventListener('drag', evt => {
  console.log('drag')
})
window.group = group
group.addEventListener('drop', evt => {
  console.log('drop')
})

group.addEventListener('dragenter', evt => {
  console.log('dragenter')
})
group.addEventListener('dragend', evt => {
  console.log('dragend')
})
group.addEventListener('dragleave', evt => {
  console.log('dragleave')
})

group.addEventListener('dragover', evt => {
  console.log('dragover')
})

group.attr({ size: [w / 2, h / 2], bgcolor: '#ff0', rotate: 0, pos: [w / 4, h / 4] })
group.append(spriteScale)
group.append(spriteRed)
let newGroup = new Group()
newGroup.append(group)
layer.append(newGroup)
layer.append(nGroup)
layer.addEventListener('click', e => {
  console.log('layer-click')
})
layer.addEventListener('dblclick', function () {
  spriteRed.draggable(false)
  spriteGreen.draggable({ dragRect: [200, 240] })
})

document.querySelector('#rotate').addEventListener('click', function () {
  let rotate = group.attr('rotate')
  group.attr({ rotate: rotate + 15 })
})
document.querySelector('#large').addEventListener('click', function () {
  let scale = group.attr('scale')
  group.attr({ scale: [scale[0] + 0.05, scale[1] + 0.05] })
})
document.querySelector('#small').addEventListener('click', function () {
  let scale = group.attr('scale')
  group.attr({ scale: [scale[0] - 0.05, scale[1] - 0.05] })
})
