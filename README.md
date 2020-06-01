# next-draggable

let @spritejs/next can draggable，让 sprite 对象拥有 draggable 的能力

### 运行 demo

```
npm install

npm start
```

通过浏览器访问可以查看具体 demo

![next-draggable](/next-draggable.png)

### 安装 next-draggable 依赖

```
  npm install next-draggable --save
```

### 作为 spritejs 插件使用

```javascript

  // draggable与droppable方法注册到Node上
  import { install } from 'next-draggable'
  install(spritejs);
  …

  let group = new Group();
  group.draggable();
  // group.draggable(false); group.draggable({destroy,true}) 取消注册drag

  group.droppable()//注册drop事件

  // group.droppable(false) ;group.droppable({destroy:true}) 取消注册drop

  group.addEventListener('drag', (evt) => {
    console.log('drag')
  });

  group.addEventListener('drop', (evt) => {
    console.log('drop')
  });

  group.addEventListener('dragenter', (evt) => {
    console.log('dragenter')
  });

  group.addEventListener('dragleave', (evt) => {
    console.log('dragleave')
  });

  group.addEventListener('dragover', (evt) => {
    console.log('dragover')
  });

  let sprite = new Sprite();
  //表示在 [0,0] 与 [300,300] 这两点矩形之间拖动 [xmin,ymin,xmax,ymax]，不设置表示不控制拖动范围
  sprite.draggable({dragRect:[0,0,300,300]})

  // 取消设置dragRect方法
  //sprite.draggable({dragRect:[0,0,300,300]})

  //表示拖动的范围大于坐标[0,0]
  //sprite.draggable({dragRect:[0,0]});

  /**拖动过程中，有三个事件 dragstart、drag、dragend**/
  sprite.addEventListener('dragstart',function(event){
    console.log('dragstart');
  });

  sprite.addEventListener('drag',function(event){
    console.log('drag');
  });

  sprite.addEventListener('dragend',function(event){
    console.log('dragend');
  });


  //取消元素拖动
  sprite.draggable(false);

```

### 作为方法使用

```javascript

  import { draggable, droppable } from 'next-draggable'

  …

  let group = draggable(new Group());

  // draggable(group,false); draggable(group,{destroy,true}) 取消注册drag

  droppable(group) //注册drop事件

  // droppable(group,false) ;droppable(group,{destroy:true}) 取消注册drop

  group.addEventListener('drag', (evt) => {
    console.log('drag')
  });

  group.addEventListener('drop', (evt) => {
    console.log('drop')
  });

  group.addEventListener('dragenter', (evt) => {
    console.log('dragenter')
  });

  group.addEventListener('dragleave', (evt) => {
    console.log('dragleave')
  });

  group.addEventListener('dragover', (evt) => {
    console.log('dragover')
  });

  let sprite = draggable(new Sprite());

  //表示在 [0,0] 与 [300,300] 这两点矩形之间拖动 [xmin,ymin,xmax,ymax]，不设置表示不控制拖动范围
  draggable(sprite,{dragRect:[0,0,300,300]});
  //draggable(sprite,{dragRect:[]});

  //表示拖动的范围大于坐标[0,0]
  //draggable(sprite,{dragRect:[0,0]});

  /**拖动过程中，有三个事件 dragstart、drag、dragend**/
  sprite.addEventListener('dragstart',function(event){
    console.log('dragstart');
  });

  sprite.addEventListener('drag',function(event){
    console.log('drag');
  });

  sprite.addEventListener('dragend',function(event){
    console.log('dragend');
  });


  //取消元素拖动
  draggable(sprite,false);

```

### 事件列表：

| 事件      | 描述                                             | 其它                                                           |
| --------- | ------------------------------------------------ | -------------------------------------------------------------- |
| dragstart | 开始拖动对象                                     |                                                                |
| drag      | 正在拖动对象                                     |                                                                |
| dragend   | 停止拖动对象                                     |                                                                |
| dragover  | 一个 draggable 对象在另一个 droppable 对象上拖动 |                                                                |
| dragenter | 一个 draggable 对象在进入一个 droppable 对象上   | draggable 进入 droppable 判断点为 draggable 对象最小矩形的中心 |
| dragleave | 一个 draggable 对象离开一个 droppable 对象上     |                                                                |
| drop      | 一个 draggable 对象放在一个 droppable 对象上     |                                                                |
