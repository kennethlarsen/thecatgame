import Phaser from 'phaser';

function makeDraggable({ item, onDrag, onMove, onDrop, dropAction }) {
  function handleMove(obj, pointer, x, y, snapPoint, isFirstUpdate) {
    if (item.forEach) {
      item.forEach((child) => {
        if (child !== obj) {
          child.x = child.origin.x - obj.origin.x + x;
          child.y = child.origin.y - obj.origin.y + y;
        }
      });
    }

    if (onMove) {
      onMove(obj, pointer, x, y, snapPoint, isFirstUpdate);
    }
  }

  function handleDrop(obj, pointer, x, y, snapPoint, isFirstUpdate) {
    if (!item.forEach) {
      return;
    }

    item.forEach((child) => {
      if (onDrop) {
        onDrop(child, pointer, x, y, snapPoint, isFirstUpdate);
      }
    });

    if (dropAction) {
      dropAction(obj, pointer, x, y, snapPoint, isFirstUpdate);
    }
  }

  function makeDraggableObject(obj) {
    if (obj.forEach) {
      obj.forEach(makeDraggableObject);
      return;
    }

    obj.inputEnabled = true;
    obj.input.enableDrag();
    obj.origin = new Phaser.Point(obj.x, obj.y);

    const callback = item.forEach ? handleMove : onMove;

    if (callback) {
      obj.events.onDragUpdate.add(callback);
    }

    if (onDrag) {
      obj.events.onDragStart.add(onDrag);
    }

    if (onDrop) {
      obj.events.onDragStop.add(handleDrop);
    }
  }

  if (item.forEach) {
    item.forEach(makeDraggableObject);
  } else {
    makeDraggableObject(item);
  }
}

export default makeDraggable;
