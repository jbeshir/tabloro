"use strict";function slice(e,t,n){switch(arguments.length){case 0:throw"no args";case 1:return slice(e,0,e.length);case 2:return slice(e,t,e.length);default:for(var o=Math.max(0,n-t),r=new Array(o),i=-1;++i<o;)r[i]=e[t+i];return r}}function random(e,t){if(void 0===t)throw new Error("random end must be defined");var n=Math.floor(Math.random()*(t-e+1));return n+=e}function isFunction(e){var t={};return e&&"[object Function]"===t.toString.call(e)}function maybeFun(e){return isFunction(e)?e():void 0}function maybe(e){return function(t){return t?e(t):!1}}function dynamicInvoke(e){return function(t){return t[e](t)}}function randomFrom(e){var t=random(0,e.length-1);return e[t]}function chance(e,t){random(0,100)<e&&t()}function double(e){return 2*e}function randomDirection(){var e=1===random(0,2)?"+":"-";return e}function numberWithCommas(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")}function preload(){chatInput=document.getElementById("chatInput"),Assets.preload(game)}function create(){setupStage(),setupTable(),setupAssets(assets),Controls.add(),UI.init(),setupPlayers(),Cursor.set(),"play"===mode&&Video.init(),H.init()}function setupStage(){var e=document.getElementById("please_wait");e&&e.remove(),game.stage.disableVisibilityChange=!0,game.scale.scaleMode=Phaser.ScaleManager.RESIZE,game.scale.setScreenSize(!0),game.scale.onResize=UI.update;var t=game.canvas;t.id="boardgame",game.canvas.oncontextmenu=function(e){e.preventDefault()},game.physics.startSystem(Phaser.Physics.ARCADE),game.world.setBounds(0,0,World.width,World.height)}function setupTable(){table=game.add.tileSprite(0,0,World.width,World.height,"table"),table.inputEnabled=!0,table.interactive=!0,table.buttonMode=!0,table.events.onInputDown.add(Controls.onStartSelection),table.events.onInputUp.add(Controls.onStopSelection)}function buildAssetArray(e,t){for(var n=[],o=0;t>o;o++)R.times(function(){n.push(o)})(e.counts[o]||1);return n}function setupAssets(e){var t=200,n=1;G.groups.add("tokens"),R.forEach(function(e){t+=150;var o=e.args[0];G.groups.add(o,0,Utils.deg2Rad(e.rotateBy),e.flipable,e.handable),"atlasJSONHash"===e.method&&(n=game.cache.getFrameCount(o),addCards(o,t,buildAssetArray(e,n),G.groups.get(o))),"image"===e.method&&addTokens(R.repeatN(o,e.counts||n),G.groups.get(o),100,t),"spritesheet"===e.method&&(n=e.args[4],e.isDice?R.times(function(){Dice.add(o,G.groups.get(o),n)})(e.counts[0]||1):addCards(o,t,buildAssetArray(e,n),G.groups.get(o)))})(e)}function addCards(e,t,n,o,r,i){i=i||1;var a,s=[],l=0,d=0;return R.forEach(function(n){n===a?(d+=S.offsetY,l+=S.offsetX):(l=0,d=0);var c=o.create(100+120*n+l,t+d,e,n);c.defaultFrame=n,r&&r.config.hidden&&T.hide(c),T.scale(i,c),R.compose(T.setId,Cursor.reset,T.networkAble,T.stackable,T.flipable(o.flipable),T.rotateable(o.rotateBy),T.handable(o.handable),T.draggable,T.centerAnchor)(c),s.push(c.id),Controls.target=c,a=n})(n),Controls.target}function addTokens(e,t,n,o,r){n=n||100,o=o||300,r=r||1,R.forEach.idx(function(e,i){var a=t.create(n+S.offsetX*i,o+S.offsetY*i,e);T.setId(a),T.scale(r,a),R.compose(Cursor.reset,T.networkAble,T.rotateable(t.rotateBy),T.handable(t.handable),T.draggable,T.centerAnchor)(a)})(e)}function setupPlayers(){UI.updateNames(),players=game.add.group(),players.z=17,player={cursor:cursorId,name:playerName}}function update(){if(Network.ready!==!1){G.update(),Controls.update(),H.update();var e={x:Math.floor(game.input.activePointer.worldX),y:Math.floor(game.input.activePointer.worldY)};if(game.input.keyboard.isDown(Phaser.Keyboard.UP))game.camera.y-=30;else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN))game.camera.y+=30;else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))game.camera.x-=30;else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))game.camera.x+=30;else if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)&&chatInput.value.length>0){var t=chatInput.value;chatInput.value="",Network.server.chat(t)}game.input.mouse.event&&(game.input.mouse.event.wheelDeltaX&&(game.camera.x-=game.input.mouse.event.wheelDeltaX),game.input.mouse.event.wheelDeltaY&&(game.camera.y-=game.input.mouse.event.wheelDeltaY)),player.lastPosition&&player.lastPosition.x==e.x&&player.lastPosition.y==e.y||(Network.server.moveCursor(e),player.lastPosition=e)}}var Assets={};Assets.preload=function(e){var t=R.range(1,55);R.forEach(function(t){e.load.image("cursor"+t,"/img/cursors/"+t+".png")})(t),e.load.image("flip","/assets/flip.png"),e.load.image("stack","/assets/load.png"),e.load.image("shuffle","/assets/shuffle.png"),e.load.image("hand","/assets/hand.png"),e.load.image("table","/assets/table_low.jpg"),e.load.image("rotate","/assets/rotate.png"),e.load.spritesheet("button","/assets/button_sprite_sheet.png",193,71),R.forEach(function(t){e.load[t.method].apply(e.load,t.args)})(assets)};var Controls={},cursors;Controls.selected=[],Controls.getSelected=function(e){return Controls.selected.length?Controls.selected:[e]},Controls.add=function(){Controls.controls=game.add.group(),Controls.controls.position.set(-100),Controls.rotationControls=Controls.controls.create(0,0,"rotate"),Controls.flipControls=Controls.controls.create(50,0,"flip"),Controls.stackControls=Controls.controls.create(100,0,"stack"),Controls.shuffleControls=Controls.controls.create(150,0,"shuffle"),Controls.handControls=Controls.controls.create(150,0,"hand"),Controls.rotationControls.scale.set(.7),T.centerAnchor(Controls.rotationControls),T.centerAnchor(Controls.flipControls),T.centerAnchor(Controls.stackControls),T.centerAnchor(Controls.shuffleControls),T.centerAnchor(Controls.handControls),Controls.rotationControls.inputEnabled=!0,Controls.rotationControls.input.useHandCursor=!0,Controls.rotationControls.events.onInputUp.add(T.onRotate),Controls.flipControls.inputEnabled=!0,Controls.flipControls.input.useHandCursor=!0,Controls.flipControls.events.onInputUp.add(T.onFlip),Controls.stackControls.inputEnabled=!0,Controls.stackControls.input.useHandCursor=!0,Controls.stackControls.events.onInputUp.add(S.onTidy),Controls.shuffleControls.inputEnabled=!0,Controls.shuffleControls.input.useHandCursor=!0,Controls.shuffleControls.events.onInputUp.add(S.onShuffle),Controls.handControls.inputEnabled=!0,Controls.handControls.input.useHandCursor=!0,Controls.handControls.events.onInputUp.add(T.onTake),Cursor.reset(Controls.rotationControls),Cursor.reset(Controls.flipControls),Cursor.reset(Controls.stackControls),Cursor.reset(Controls.shuffleControls),Cursor.reset(Controls.handControls),Controls.graphics=game.add.graphics(0,0),Controls.graphics.lineStyle(10,16777215,.8),Controls.graphics.beginFill(11189230,.3)},Controls.setTarget=function(e){return Controls.target=e,Controls.hide(),Controls.assignRelativePositions(e),e},Controls.assignRelativePositions=function(e){R.forEach(S.assignRelativePosition(e))(Controls.selected)},Controls.at=function(e){Controls.show(e),Utils.toCorner(Controls.controls,e)},Controls.show=function(e){Controls.positionX=0,Controls.controls.visible=!0,Controls.position(Controls.flipControls,e.flipable),Controls.position(Controls.rotationControls,e.rotateable&&!Controls.selected.length),Controls.position(Controls.handControls,e.handable&&!Controls.selected.length),Controls.position(Controls.stackControls,Controls.selected.length&&!e.isDice),Controls.position(Controls.shuffleControls,Controls.selected.length&&!e.isDice)},Controls.position=function(e,t){t?(e.visible=!0,e.x=Controls.positionX,Controls.positionX+=e.width):e.visible=!1},Controls.hide=function(e){e?Controls.target===e&&(Controls.controls.visible=!1):Controls.controls.visible=!1},Controls.cursors=function(){game.input.keyboard.createCursorKeys()},Controls.onStartSelection=function(e,t){Controls.hide(),Controls.selecting=!0,Controls.rect={x:t.worldX,y:t.worldY}},Controls.sanitizeRect=function(e){var t={};return e.width<0?(t.x=e.x+e.width,t.width=-e.width):(t.x=e.x,t.width=e.width),e.height<0?(t.y=e.y+e.height,t.height=-e.height):(t.y=e.y,t.height=e.height),t},Controls.onStopSelection=function(){Controls.selecting=!1,Controls.graphics.clear(),Controls.selected.length&&Controls.at(Controls.setTarget(Controls.selected[0]))},Controls.findSelectedTiles=function(e){var t=[];return R.mapObj(function(n){R.forEach(function(n){var o=Utils.pointIntersection(n,e);o?(T.select(n),t.push(n)):T.deselect(n)})(n.children)})(G.groups.all()),t},Controls.dragAlong=function(e){T.dragging&&R.forEach(S.moveRelativeTo(Controls.target))(e)},Controls.update=function(){Controls.selecting?game.input.mouse.event&&(Controls.rect.width=game.input.activePointer.worldX-Controls.rect.x,Controls.rect.height=game.input.activePointer.worldY-Controls.rect.y,Controls.graphics.clear(),Controls.selected=Controls.findSelectedTiles(Controls.sanitizeRect(Controls.rect)),Controls.graphics.drawRect(Controls.rect.x,Controls.rect.y,Controls.rect.width,Controls.rect.height)):Controls.selected.length&&game.input.mouse.event&&Controls.dragAlong(Controls.selected)},Controls.verifySelection=function(e){R.contains(e)(Controls.selected)||Controls.deselectAll()},Controls.deselectAll=function(){R.forEach(T.deselect)(Controls.selected),Controls.selected=[]};var Cursor={};Cursor.new=function(e){var t=players.create(0,0,"cursor"+e.cursor);return t.name=e.name,t.addChild(game.add.text(40,0,e.name,{font:"26px Arial",fill:"#fff"})),Cursor.set(),t},Cursor.set=function(){game.canvas.setAttribute("style","cursor: url(/img/cursors/"+cursorId+".png), auto;")},Cursor.reset=function(e){return e.events.onInputOut.add(Cursor.set),e};var Dice={};Dice.add=function(e,t,n){var o=t.create(100+80*t.children.length,100,e);return t.numSides=n,o.animations.add("spin",R.range(0,n)),o.play("spin",30),o.animations.currentAnim.setFrame(0,!0),o.isDice=!0,T.draggable(o),Dice.spinnable(o),Cursor.reset(o),T.setId(o),T.networkAble(o),o},Dice.onSpinClicked=function(e){var t=R.compose(R.pluck("id"),R.filter(R.propEq("isDice",!0)))(Controls.getSelected(e));if("test"===mode){var n=R.map(function(){return Math.floor(300+567*Math.random())})(t),o=R.map(function(){return Math.floor(Math.random()*e.parent.numSides)})(t);Dice.spin(t,n,o)}else Network.server.spin(t,e.parent.numSides)},Dice.spin=function(e,t,n){R.forEach.idx(function(e,o){var r=G.findTile(e),i=t[o],a=n[o];r.play("spin",100,!0),setTimeout(function(){r.animations.stop(null,!1),r.frame=a},i-200),game.add.tween(r).to({rotation:i/20},i,Phaser.Easing.Cubic.Out,!0,0,!1)})(e)},Dice.spinnable=function(e){e.anchor.set(.4),e.events.onInputUp.add(Dice.onSpinClicked,this)};var G={};G._groups={},G.groups={add:function(e,t,n,o,r){t=t||0,n=n||0,G._groups[e]=game.add.group(),G._groups[e].z=t,G._groups[e].rotateBy=n,G._groups[e].flipable=o,G._groups[e].handable=r},get:function(e){return G._groups[e]},all:function(){return G._groups}},G.init=function(e){G.button=R.converge(e.add.button,R.always(0),R.always(0),R.always("button"),R.I,R.argN(1),R.always(1),R.always(0),R.always(2)).bind(e.add)},G.addText=R.curryN(2,function(e,t,n,o){o=o||"#ccc";var r=game.add.text(20,20,e,{fontSize:"32px",fill:o});return n&&n(r,t),t.setText=r.setText.bind(r),t.addChild(r),t}),G.updatePositions=[],G.update=function(){R.forEach(function(e){return e.follower.relativePosition?void Utils.alignRelativePosition(e.follower,e.target):void Utils.alignPosition(e.follower,e.target)})(G.updatePositions)},G.addUpdatePosition=function(e){G.updatePositions.push(e)},G.removeUpdatePosition=function(e){G.updatePositions=R.reject(R.propEq("target",e))(G.updatePositions)},G.findTile=function(e){e=Number(e);var t;return R.mapObj(function(n){t=R.find(R.propEq("id",e))(n.children)||t})(G.groups.all()),t?t:{}},G.findTiles=function(e){return R.map(function(e){return G.findTile(e)})(e)},G.findStack=function(e){e=Number(e);var t=R.find(R.propEq("id",e))(stacks.children);return t?t:{}},G.saveSetup=function(){Network.server.saveSetup(),UI.message("Saved setup",gameName)};var H={};H.offsetX=1.2,H.offsetY=-2,H.hand={},H.init=function(){},H.add=function(e){H.hand[e.id]=e,Controls.hide(),T.show(e),T.scale(.5,e)},H.update=function(){var e=100;R.mapObj(function(t){UI.fixedToCamera(!1,t),t.x=e,e+=t.width,t.y=game.camera.height-t.height/3,S.bringToTop(t),UI.fixedToCamera(!0,t)})(H.hand)},H.release=function(e){UI.fixedToCamera(!1,e),H.hand[e.id]&&(Network.server.fromHand(e.id),delete H.hand[e.id],T.scale(1,e))};var Network={};Network.ready=!1,Network.isMine=function(e){return Network.myId===e},Network.setup=function(){Network.client=new Eureca.Client,Network.client.ready(function(e){Network.server=e}),Network.client.exports.setId=function(e){Network.myId=e,Network.server.handshake(e,cursorId,playerName,roomName,mode),create(),Network.ready=!0},Network.client.exports.kill=function(e){playerList[e.id]&&(playerList[e.id].kill(),delete playerList[e.id],UI.message(e.name,"left the table..."),UI.updateNames()),Video.killClient(e.id,e.name)},Network.client.exports.spawnPlayer=function(e,t){if(!Network.isMine(e.id)){var n=Cursor.new(e);playerList[e.id]=n,UI.message(e.name,"joined the table!"),UI.updateNames(),Video.newClient(e.id,e.name)}},Network.client.exports.updateCursor=function(e,t){Network.isMine(e.id)||playerList[e.id]&&(playerList[e.id].x=t.x,playerList[e.id].y=t.y)},Network.client.exports.dragTiles=function(e,t,n){if(!Network.isMine(e.id)&&t.length){var o=G.findTiles(t);return void R.forEach.idx(function(t,o){Controls.hide(t),t.relativePosition=n[o],G.addUpdatePosition({follower:t,target:playerList[e.id]})})(o)}},Network.client.exports.positionTile=function(e,t,n){if(Network.isMine(e.id)){var o=G.findTile(t);Controls.hide(o),R.compose(T.enableInput,T.show)(o),Utils.syncTile(o,n),UI.message("Positioning tile",t),n.hand&&(n.hand===playerName?H.add(o):o.visible=!1)}},Network.client.exports.dropTile=function(e,t,n){if(!Network.isMine(e.id)){var o=G.findTile(t);Controls.hide(o),o.visible=!0,G.removeUpdatePosition(playerList[e.id]),delete o.relativePosition,Utils.syncTile(o,n),UI.message(e.name,"moved tile",o.id)}},Network.client.exports.flipTile=function(e,t,n){if(!Network.isMine(e.id)){var o=G.findTile(t);Controls.hide(o),o.frame=n,UI.message(e.name,"flipped tile",o.id)}},Network.client.exports.toHand=function(e,t){if(!Network.isMine(e.id)){var n=G.findTile(t);Controls.hide(n),n.visible=!1,UI.message(e.name,"took tile",n.id,"to hand")}},Network.client.exports.fromHand=function(e,t){if(!Network.isMine(e.id)){var n=G.findTile(t);n.visible=!0,UI.message(e.name,"plays tile",n.id,"from hand")}},Network.client.exports.dragStack=function(e,t){if(!Network.isMine(e.id)){var n=G.findStack(t);n.remoteDragged=!0,G.addUpdatePosition({follower:n,target:playerList[e.id]})}},Network.client.exports.dropStack=function(e,t,n){if(!Network.isMine(e.id)){var o=G.findStack(t);G.removeUpdatePosition(playerList[e.id]),o.remoteDragged=!1,Utils.syncTile(o,n),S.tidy(o),UI.message(e.name,"moved stack",t)}},Network.client.exports.positionStack=function(e,t,n){if(Network.isMine(e.id)){var o=G.findStack(t);Utils.syncTile(o,n.position),S.updateCards(o,n.cards),S.alignElements(o),UI.message("Positioning stack",t)}},Network.client.exports.updateStackCards=function(e,t){S.shuffle(G.findTiles(t))},Network.client.exports.flipStack=function(e,t){var n=G.findStack(t);S.flipCards(n)},Network.client.exports.spin=function(e,t,n,o){Dice.spin(t,n,o),UI.message("Spinning",t.length,"dice")},Network.client.exports.receiveChat=function(e,t){UI.message(e.name,":",t)}};var S={};S.offsetX=1.2,S.offsetY=-2,S.create=function(e){var t=T.centerAnchor(stacks.create(0,0,e.image));t.width=280,t.height=280,t.align=[],t.config=e,T.draggable(t),t.input.useHandCursor=!1,t.events.onInputDown.add(S.onDragStack),t.events.onInputUp.add(S.onDropStack),T.setId(t),t.cards=[],t.position.set(e.x,e.y),G.addText("0",t,Utils.childTo(0,.78),"#3b74aa");var n=R.compose(Cursor.reset,S.align(t),Utils.aboveCorner(t),S.assign(t),T.scale(.4));return e.shuffle&&R.compose(n,G.addText("SHUFFLE"))(UI.handCursor(G.button(S.onShuffle,t))),e.hidden||R.compose(n,G.addText("FLIP"))(UI.handCursor(G.button(S.onFlipButton,t))),t},S.align=R.curry(function(e,t){var n=R.last(e.align);return e.align.push(t),n&&(t.x+=n.width*(e.align.length-1)),S.assignRelativePosition(e,t)}),S.assignRelativePosition=function(e){return function(t){return t.relativePosition={x:t.x-e.x,y:t.y-e.y},t}},S.assign=R.curry(function(e,t){return t.stack=e,t}),S.onDragStack=function(e){Network.server.stackDragStart(e.id),Controls.hide()},S.onDropStack=function(e){var t=e.position.clone();t.width=e.width,t.height=e.height,Network.server.stackDragStop(e.id,t),S.tidy(e)},S.onShuffle=function(){Network.server.shuffleStack(T.getSelectedIds())},S.onFlipButton=function(e){var t=e.stack;Network.server.flipStack(t.id)},S.onTidy=function(){S.tidy(Controls.selected)},S.bringToTop=function(e){return e.bringToTop(),e},S.shuffle=function(e){R.forEach.idx(function(e,t){e.rotation=0,T.hide(e);var n=S.calculateCardPos(Controls.target.position,t,0);Utils.alignPosition(e,n),S.bringToTop(e)})(e)},S.tidy=function(e){var t={},n={},o=-e[0].width,r=Controls.target.position.clone();R.forEach.idx(function(e){if(t[e.key])R.contains(e.defaultFrame.toString())(R.keys(t[e.key]))?n[e.key][e.defaultFrame]+=1:(o+=e.width+20,t[e.key][e.defaultFrame]=o,n[e.key][e.defaultFrame]=1);else{var i={};o+=e.width+20,i[e.defaultFrame]=o,t[e.key]=i;var a={};a[e.defaultFrame]=1,n[e.key]=a}e.rotation=0,T.show(e);var s=S.calculateCardPos(r,n[e.key][e.defaultFrame],t[e.key][e.defaultFrame]);Utils.alignPosition(e,s),S.bringToTop(e)})(e)},S.overlap=R.curry(function(e,t){return game.physics.arcade.overlap(e,t)}),S.flipCards=function(e){R.forEach(function(e){var t=G.findTile(e);0===t._frame.index?T.show(t):T.hide(t)})(e.cards)},S.calculateCardPos=function(e,t,n){return{x:e.x+S.offsetX*t+(n||0),y:e.y+S.offsetY*t}},S.moveRelativeTo=R.curry(function(e,t){return t.relativePosition&&e!==t?(t.x=e.x+t.relativePosition.x,t.y=e.y+t.relativePosition.y,t):t}),S.updateCounter=function(e){return e.setText(e.cards.length),e},S.updateCards=function(e,t){if(e&&t){var n=R.difference(t,e.cards);R.forEach(S.removeCardFromStacks)(n),e.cards=t,n.length?R.forEach(function(t){var n=G.findTile(t),o=game.add.tween(n).to(e.position,200,Phaser.Easing.Cubic.In,!0,0,!1);o.onComplete.add(function(){S.tidy(e)})})(n):S.tidy(e)}},S.removeCardFromStacks=function(e){var e=Number(e);return R.forEach(function(t){t.cards=R.reject(R.eq(e))(t.cards),S.tidy(t)})(stacks&&stacks.children||[]),e};var T={};T.id=0,T.centerAnchor=function(e){return e.anchor.set(.5),e},T.draggable=function(e){return e.controls=e.controls||game.add.group(),e.inputEnabled=!0,e.input.enableDrag(!1,!0),e.input.useHandCursor=!0,game.physics.arcade.enable(e),e.body.collideWorldBounds=!0,e},T.networkAble=function(e){return e.events.onInputDown.add(T.onStartDrag),e.events.onInputUp.add(T.onStopDrag),e},T.stackable=function(e){return e.stackable=!0,e},T.scale=R.curry(function(e,t){return t.scale.set(e),t}),T.setId=function(e){return e.id=T.id++,e},T.resetRotation=function(e){return e.rotation=0,e},T.rotateable=function(e){return e?function(e){return e.parent.rotateBy?(e.rotateable=!0,e.events.onInputDown.add(T.onDragControllable),e.events.onInputUp.add(T.onStopDragControllable),e):R.I}:R.I},T.onRotate=function(){var e=Controls.target,t=e.parent.rotateBy,n=T.getPosition(e);n.rotation=e.rotation+t,Network.server.tileDragStop(e.id,n),game.add.tween(e).to({rotation:"+"+t},50,Phaser.Easing.Linear.None,!0,0,!1)},T.flipable=function(e){return e?function(e){return e.flipable=!0,e.events.onInputDown.add(T.onDragControllable),e.events.onInputUp.add(T.onStopDragControllable),e}:R.I},T.handable=function(e){return e?function(e){return e.handable=!0,e}:R.I},T.onFlip=function(){var e=Controls.target;return e.flipable?(Network.server.flipTiles(T.getSelectedIds(e),T.nextFlipStates(e)),void R.forEach(T.flip)(Controls.getSelected(e))):R.I},T.nextFlipStates=function(e){return R.map(function(e){return e.frame===e.defaultFrame?0:e.defaultFrame})(Controls.getSelected(e))},T.onTake=function(){var e=Controls.target;H.add(e),Network.server.toHand(e.id)},T.getSelectedIds=function(e){return R.pluck("id")(Controls.getSelected(e))},T.getPositions=function(e){return R.map(function(e){return T.getPosition(e)})(Controls.getSelected(e))},T.getPosition=function(e){return{x:e.x,y:e.y,rotation:e.rotation,frame:e.frame}},T.onStartDrag=function(e){T.dragging=!0,H.release(e),Controls.verifySelection(e);var t=Controls.selected.length&&R.pluck("relativePosition")(Controls.selected)||[{x:0,y:0}];Network.server.tileDragStart(T.getSelectedIds(e),t),Controls.setTarget(e)},T.onStopDrag=function(e){T.dragging=!1,Network.server.tileDragStop(T.getSelectedIds(e),T.getPositions(e))},T.onDragControllable=function(e){T.dragging=!0,Controls.setTarget(e)},T.onStopDragControllable=function(e){T.dragging=!1,Controls.at(e)},T.enableInput=function(e){return e.inputEnabled=!0,e},T.flip=function(e){e.flipable&&(e.frame=e.frame===e.defaultFrame?0:e.defaultFrame)},T.show=function(e){return e.flipable&&e.defaultFrame&&(e.frame=e.defaultFrame),e},T.hide=function(e){return e.flipable&&e.defaultFrame&&(e.frame=0),e},T.select=function(e){return e.alpha=.5,e.selected=!0,e},T.deselect=function(e){return e.alpha=1,e.selected=!1,delete e.relativePosition,e};var UI={};UI.lines=[],UI.timeout=null,UI.init=function(){UI.gameText=game.add.text(0,0,"table > "+roomName,{font:"bold 22px Arial",fill:"#ccc"}),UI.gameText.alpha=.7,UI.nameText=game.add.text(0,0,"----------------\nNAME:"+playerName,{font:"bold 18px Arial",fill:"#ccc"}),UI.nameText.align="right",UI.nameText.alpha=.7,UI.messageText=game.add.text(0,0,"Messages:",{font:"18px Arial",fill:"#ccc"}),UI.messageText.align="right",UI.messageText.alpha=.7,UI.textElements=[UI.gameText,UI.nameText,UI.messageText],UI.update()},UI.update=function(){R.forEach(UI.fixedToCamera(!1))(UI.textElements),UI.gameText.x=UI.nameText.x=UI.messageText.x=16,UI.gameText.y=5,UI.nameText.y=40,UI.messageText.y=280,R.forEach(UI.fixedToCamera(!0))(UI.textElements)},UI.fixedToCamera=R.curry(function(e,t){return t.fixedToCamera=e,t}),UI.handCursor=function(e){return e.input.useHandCursor=!0,e},UI.message=function(){UI.messageText.alpha=.7;var e=R.join(" ",slice(arguments));e=e.match(/.{1,30}/g),UI.lines=R.concat(e,UI.lines),UI.lines.length>10&&UI.lines.pop(),UI.messageText.setText("-> "+R.join("\n")(UI.lines)+"\n..."),clearTimeout(UI.timeout),UI.timeout=setTimeout(function(){game.add.tween(UI.messageText).to({alpha:0},2e3,Phaser.Easing.Linear.None,!0)},1e4)},UI.setNames=function(e){UI.nameText.setText(R.join("\n")(e))},UI.updateNames=function(){UI.setNames(R.concat(["* "+playerName],R.pluck("name",R.values(playerList))))};var Utils={humanize:function(e,t,n){return R.align(ifLte,R.interpolate(e,t,n.length),n)},alignPosition:function(e,t){e&&t&&(e.x=t.x,e.y=t.y)},alignRelativePosition:function(e,t){e&&t&&e.relativePosition&&(e.x=t.x+e.relativePosition.x,e.y=t.y+e.relativePosition.y)},syncTile:function(e,t){e&&t&&(e.x=t.x,e.y=t.y,e.rotation=t.rotation,e.frame=t.frame)},alignRelativePosRot:function(e,t){e&&t&&e.relativePosition&&(e.x=t.x+e.relativePosition.x,e.y=t.y+e.relativePosition.y,e.rotation=t.rotation)},toCorner:function(e,t){e&&t&&(e.x=t.x-t.width/2,e.y=t.y-t.height/2)},childTo:function(e,t){return function(n,o){n&&o&&(n.x=o.width*e,n.y=o.height*t)}},aboveCorner:R.curry(function(e,t){return t&&e&&(t.x=e.x-e.width/2,t.y=e.y-e.height/2-t.height),t}),delta:function(e,t){return{x:e.x-t.x,y:e.y-t.y}},shuffle:function(e){for(var t=e.length-1;t>0;t--){var n=Math.floor(Math.random()*(t+1)),o=e[t];e[t]=e[n],e[n]=o}return e},printargs:function(){return arguments[0]},buttonize:function(e,t){return e.interactive=!0,e.buttonMode=!0,e.defaultCursor="pointer",e.click=e.tap=t,e},angle:function(e){return Math.atan2(e.y,e.x)},angle2points:function(e,t){return R.compose(Utils.angle,Utils.delta)(e,t)},rad2Deg:function(e){var t=180*e/Math.PI;return 0>t&&(t+=360),t},deg2Rad:function(e){0>e&&(e+=360);var t=e/180*Math.PI;return t},addProperties:function(e,t){return R.forEach(function(n){e[n]=t[n]})(R.keys(t)),e},rotate90:function(e){return e+Math.PI/2},removeFromArray:R.curry(function(e,t){return t&&t.length>0&&t.splice(t.indexOf(e),1),e}),removeChildren:function(e){R.times(function(){e.children.length&&e.getChildAt(0)&&e.removeChild(e.getChildAt(0))},e.children.length)},move:function(e){var t,n,o=e.rotation,r=e.speed;return t=Math.cos(o)*r,n=Math.sin(o)*r,e.position.set(e.x+t,e.y+n),e},center:function(e,t){e.x=t.x+(t.width-e.width)/2,e.y=t.y+(t.height-e.height)/2},testHitArray:function(e,t){return function(n){for(var o=t.length-1;o>=0;o-=1)Utils.testHit(n,t[o],e);return n}},testHit:function(e,t,n){Utils.collidesRectCircle(e,t)&&n(e,t)},testNearMissArray:function(e,t){return function(n){for(var o=t.length-1;o>=0;o-=1)Utils.testNearMiss(n,t[o],e);return n}},testNearMiss:function(e,t,n){Utils.collidesRectCircle(e,t,t.nearMissRadius)&&n(t)},pointIntersection:function(e,t){return e.x>t.x&&e.x<t.x+t.width&&e.y>t.y&&e.y<t.y+t.height},simpleIntersection:function(e,t){return!(t.x>e.x+e.width||t.x+t.width<e.x||t.y>e.y+e.height||t.y+t.height<e.y)},getPowDistance:function(e,t,n,o){var r=Math.abs(e-n),i=Math.abs(t-o);return r*r+i*i},collidesRectCircle:function(e,t,n){var o=n||.5*t.width,r=.75*Math.max(e.width,e.height);if(Math.abs(t.x-e.x)<o+r&&Math.abs(t.y-e.y)<o+r){var i,a,s=e.rotation>0?-1*e.rotation:-1*e.rotation+Math.PI,l=Math.cos(s)*(t.x-e.x)-Math.sin(s)*(t.y-e.y)+e.x,d=Math.sin(s)*(t.x-e.x)+Math.cos(s)*(t.y-e.y)+e.y,c=e.x-.5*e.width,u=e.y-.5*e.height;i=c>l?c:l>c+e.width?c+e.width:l,a=u>d?u:d>u+e.height?u+e.height:d;var f=this.getPowDistance(l,d,i,a);if(o*o>f)return!0}return!1},doPolygonsIntersect:function(e,t){var n,o,r,i,a,s,l,d,c=[e,t];for(i=0;i<c.length;i++){var u=c[i];for(a=0;a<u.length;a++){var f=(a+1)%u.length,p=u[a],g=u[f],h={x:g.y-p.y,y:p.x-g.x};for(n=o=void 0,s=0;s<e.length;s++)r=h.x*e[s].x+h.y*e[s].y,(isUndefined(n)||n>r)&&(n=r),(isUndefined(o)||r>o)&&(o=r);for(l=d=void 0,s=0;s<t.length;s++)r=h.x*t[s].x+h.y*t[s].y,(isUndefined(l)||l>r)&&(l=r),(isUndefined(d)||r>d)&&(d=r);if(l>o||n>d)return CONSOLE("polygons don't intersect!"),!1}}return!0}},Video={};Video.existingCalls=[],navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia,Video.newPeerServerConnection=function(){Video.peer=new Peer(Network.myId,{key:"8z62zmz8keasjor",debug:1,iceServers:[{url:"stun:stun.l.google.com:19302"}]})},Video.init=function(){$("#video-container").show(),Video.newPeerServerConnection(),Video.peer.on("open",function(e){Video.id=e}),Video.peer.on("call",function(e){e.answer(window.localStream),Video.step3(e)}),Video.peer.on("error",function(e){if(/Could not connect to peer (\w+)/.exec(e.message)){var t=/Could not connect to peer (\w+)/.exec(e.message)[1];Video.step2(t)}else Video.newPeerServerConnection()}),$(function(){$("#step1-retry").click(function(){$("#step1-error").hide(),Video.step1()}),Video.step1()})},Video.newClient=function(e,t){e&&(Video.addVideo(e),$("#"+e).find(".step3").hide(),$("#"+e).find(".make-call").text("Call "+t),$(function(){$("#"+e).find(".make-call").click(function(){var e=$(this).parents("div.video-group").attr("id"),t=Video.peer.call(e,window.localStream);Video.step3(t)}),$("#"+e).find(".end-call").click(function(){$(this).parents("div.video-group").attr("id");Video.existingCalls[e].close(),Video.step2(e)})}),Video.step2(e))},Video.killClient=function(e){Video.removeVideo(e)},Video.addVideo=function(e){$("#their-videos").append('<div class="video-group" id="'+e+'"><div class="step3"><a href="#" class="btn btn-xs btn-danger end-call">x</a></div><video class="video" style="display: none;" autoplay></video><div class="step step2"><a href="#" class="btn btn-xs btn-success make-call">Call</a></div></div>')},Video.removeVideo=function(e){$("#"+e).remove()},Video.step1=function(){$("#step1-error").hide(),navigator.getUserMedia({audio:!0,video:!0},function(e){$("#my-video").prop("src",URL.createObjectURL(e)),$("#my-video").show(),window.localStream=e,$("#step1").hide()},function(){$("#step1-error").show(),$("#my-video").hide()})},Video.step2=function(e){$("#step1").hide(),$("#"+e).find(".step3").hide(),$("#"+e).find(".step2").show()},Video.step3=function(e){Video.existingCalls[e.peer]&&Video.existingCalls[e.peer].close(),e&&(e.on("stream",function(t){$("#"+e.peer).find("video").show(),$("#"+e.peer).find("video").prop("src",URL.createObjectURL(t))}),e.on("close",function(){$("#"+e.peer).find("video").hide(),Video.step2(e.peer)}),e.on("error",function(){$("#"+e.peer).find("video").hide()}),Video.existingCalls[e.peer]=e,$("#step1").hide(),$("#"+e.peer).find(".step2").hide(),$("#"+e.peer).find(".step3").show())};var Screen={},World={width:4e3,height:2e3};Screen.x=window.innerWidth*window.devicePixelRatio,Screen.y=window.innerHeight*window.devicePixelRatio;var game=new Phaser.Game(Screen.x,Screen.y,Phaser.CANVAS,"boardgame",{preload:preload,create:Network.setup,update:update}),redDice,stacks,players,table,playerList={},player={},stack1,stack2,chatInput,screenShot=function(){window.open(game.canvas.toDataURL())};