import { Matrix } from 'sprite-math'
let $drag = null
let dropList = []
const _mouseDown = Symbol('mouseDown')
const _mouseMove = Symbol('mouseMove')
const _mouseUp = Symbol('mouseUp')
const _isDraggable = Symbol('isDraggable')
const _isDroppable = Symbol('isDroppable')
const _isDragenter = Symbol('isDragenter')
const _dragRect = Symbol('dragRect')

export function draggable(sprite, option) {
  if (option && option.dragRect !== undefined) {
    // 拖动范围设置
    sprite[_dragRect] = option.dragRect
  }
  if ((option && option.destroy) || option === false) {
    //销毁draggable
    if (!sprite[_isDraggable]) return sprite
    delete sprite[_isDraggable]
    return sprite.removeEventListener('mousedown', sprite[_mouseDown], false).removeEventListener('mousemove', sprite[_mouseMove], false).removeEventListener('mouseup', sprite[_mouseUp], false)
  } else {
    if (!sprite[_isDraggable]) {
      sprite[_isDraggable] = true
      sprite[_mouseDown] = mouseDown
      sprite[_mouseMove] = mouseMove
      sprite[_mouseUp] = mouseUp
      return sprite.addEventListener('mousedown', sprite[_mouseDown], false).addEventListener('mousemove', sprite[_mouseMove], false).addEventListener('mouseup', sprite[_mouseUp], false)
    }
  }
  function mouseDown(evt) {
    if (evt.originalEvent && evt.originalEvent.which === 3) {
      return
    }
    evt.stopPropagation()
    $drag = getDragTarget(evt.target)
    if ($drag !== sprite) return
    const [offsetX, offsetY] = sprite.getOffsetPosition(evt.x, evt.y)
    $drag.x0_ = offsetX
    $drag.y0_ = offsetY
    $drag._dragStartPoint = [evt.x, evt.y]
    $drag.dispatchEvent('dragstart', transEvent(evt), true, true)
    $drag.setMouseCapture()
    $drag._isDragging = false
  }

  function mouseMove(evt) {
    if ($drag && $drag === sprite && $drag.x0_ != null) {
      const [offsetX, offsetY] = sprite.getOffsetPosition(evt.x, evt.y)
      let [dragStartX, dragStartY] = sprite._dragStartPoint
      //添加容差处理，如果拖动小于2，默认不处理
      if (Math.sqrt(Math.pow(evt.x - dragStartX, 2) + Math.pow(evt.y - dragStartY, 2)) < 2) {
        return
      }
      let dx = offsetX - sprite.x0_
      let dy = offsetY - sprite.y0_
      const [cx, cy] = sprite.attr('pos')
      const m = new Matrix(sprite.transformMatrix)
      ;[dx, dy] = m.transformPoint(dx, dy)
      let [minX, minY, maxX, maxY] = sprite[_dragRect] || [] //
      let tarX = cx + dx
      let tarY = cy + dy
      if (minX !== undefined) {
        tarX = Math.max(minX, tarX)
      }
      if (maxX !== undefined) {
        tarX = Math.min(maxX, tarX)
      }
      if (minY !== undefined) {
        tarY = Math.max(minY, tarY)
      }
      if (maxY !== undefined) {
        tarY = Math.min(maxY, tarY)
      }
      sprite.attr({ x: tarX, y: tarY })
      $drag.dispatchEvent('drag', transEvent(evt), true, true)
      checkDragmove(evt, sprite)
      sprite._isDragging = true
    }
  }

  function mouseUp(evt) {
    if ($drag && $drag.x0_ != null) {
      $drag.releaseMouseCapture()
      delete $drag.x0_
      delete $drag.y0_
      if ($drag._isDragging) {
        $drag.dispatchEvent('dragend', transEvent(evt), true, true)
        checkDragUp(evt, sprite)
        delete $drag._isDragging
      }
    }
    $drag = null
  }
}

export function droppable(sprite, option) {
  if ((option && option.destroy) || option === false) {
    //销毁drop
    if (sprite[_isDroppable]) {
      delete sprite[_isDroppable]
      const spriteIndex = dropList.indexOf(sprite)
      if (spriteIndex !== -1) {
        dropList.splice(spriteIndex, 1)
      }
    }
  } else {
    if (!sprite[_isDroppable]) {
      dropList.push(sprite)
      sprite[_isDroppable] = true
    }
  }
  return sprite
}

function transEvent(evt) {
  return { detail: evt }
}

function checkDragmove(evt, sprite) {
  evt.dragItem = sprite
  dropList.forEach(dropSprite => {
    if (sprite !== dropSprite) {
      let collision = rectCollision(sprite, dropSprite)
      if (collision && !dropSprite[_isDragenter]) {
        dropSprite[_isDragenter] = true
        dropSprite.dispatchEvent('dragenter', transEvent(evt), true, true)
      } else if (!collision && dropSprite[_isDragenter]) {
        delete dropSprite[_isDragenter]
        dropSprite.dispatchEvent('dragleave', transEvent(evt), true, true)
      } else if (collision && dropSprite[_isDragenter]) {
        dropSprite.dispatchEvent('dragover', transEvent(evt), true, true)
      }
    }
  })
}

function checkDragUp(evt, sprite) {
  evt.dragItem = sprite
  dropList.forEach(dropSprite => {
    let collision = rectCollision(sprite, dropSprite)
    if (collision && dropSprite[_isDragenter]) {
      delete dropSprite[_isDragenter]
      dropSprite.dispatchEvent('drop', transEvent(evt), true, true)
    }
  })
}
function rectCollision(sprite, bgRect) {
  //判断 moveRect的centerPoint是否在bgRect中
  let { top, left, width, height } = sprite.getBoundingClientRect()
  let dPos = [left + width / 2, top + height / 2]
  return bgRect.isPointCollision(dPos[0], dPos[1])
}
function getDragTarget(dom) {
  if (dom[_isDraggable]) {
    return dom
  }
  if (dom.tarName === 'layer') {
    return null
  }
  if (dom.parent) {
    return getDragTarget(dom.parent)
  }
  return null
}
