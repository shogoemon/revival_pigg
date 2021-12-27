class Cube extends Container {
  static degreesToRadians(angle) {
    return angle * (Math.PI / 180);
  }
  static skewRecWidth = 100 * Math.cos(this.degreesToRadians(26.5));
  static cubeSide = Cube.skewRecWidth * 2 * 0.707;
  constructor(w = 100, h = 100, c1 = blue, c2 = red, c3 = green) {
    super(Cube.skewRecWidth * 2, 100);

    const right = new Container();
    const rightSide = new Rectangle(w, h, c1).ske(0, 26.5).addTo(right);
    right.pos(0, 0, "left", "center", this).mov(this.width / 2 - right.width);

    const left = new Container();
    const leftSide = new Rectangle(w, h, c2.darken(0.2))
      .ske(0, -26.5)
      .addTo(left);
    left.pos(0, 0, "right", "center", this).mov(-this.width / 2 + left.width);

    const top = new Container();
    const topSide = new Rectangle(Cube.cubeSide, Cube.cubeSide, c3)
      .addTo(top)
      .rot(45);
    top
      .centerReg()
      .loc(this.width / 2, right.y, this)
      .sca(1, 0.5);

    right.mov(0, right.width / 4);
    left.mov(0, right.width / 4);
    top.mov(0, right.width / 4);
    this.top_height = top.height;
    this.centerReg();
    this.mouseChildren = false;
  }
}
class CustomTile extends Container {
  constructor(w = 100, h = 100) {
    super(w * 2, h * 2);
    const TileContainer = new Container();
    const CustomTile = new Rectangle(Cube.cubeSide, Cube.cubeSide, red)
      .addTo(TileContainer)
      .rot(45);
    TileContainer.centerReg()
      .loc(this.width / 2, 0, this)
      .sca(1, 0.5);
    this.centerReg();
  }
}
class homeMenuUI {
  static linkedTiles;
  constructor() {
    this.editButton = new Button({
      width: 130,
      height: 130,
      label: new Label({
        text: "Edit",
        size: 30,
        color: white,
        rollColor: white,
      }),
      corner: 15,
      backgroundColor: black,
      rollBackgroundColor: yellow,
      shadowColor: -1,
    });
    this.editClickedFlag = false;
    this.editButtonListener;

    this.scaleUpButton = new Button({
      backing: new Circle(25, 25),
      label: "+",
    });

    this.scaleDownButton = new Button({
      backing: new Circle(25, 25),
      label: "-",
    });

    this.posUpButton = new Button({
      backing: new Triangle({
        a: 50,
        b: null,
        c: null,
        color: "black",
        //corner: 15,
      }),
      label: "",
    });

    this.posDownButton = new Button({
      backing: new Triangle({
        a: 50,
        b: null,
        c: null,
        color: "black",
        //corner: 15,
      }).rot(180),
      label: "",
    });

    this.posRightButton = new Button({
      backing: new Triangle({
        a: 50,
        b: null,
        c: null,
        color: "black",
        //corner: 15,
      }).rot(90),
      label: "",
    });

    this.posLeftButton = new Button({
      backing: new Triangle({
        a: 50,
        b: null,
        c: null,
        color: "black",
        //corner: 15,
      }).rot(270),
      label: "",
    });
  }
}

const frame = new Frame({
  scaling: "full",
  width: 1024,
  height: 768,
  color: "#666666",
  outerColor: darker,
});
frame.on("ready", () => {
  zog("ready from ZIM Frame");

  const stage = frame.stage;
  const stageW = frame.width;
  const stageH = frame.height;
  let currentScale = 1.0;

  var stageContainer = new Container(stageW, stageH);
  stage.addChild(stageContainer);
  stageContainer.center();

  /* create Board */
  var holder = new Container(100, 100);
  holder.pos(stageW / 2, stageH / 2);
  holder.addTo(stageContainer);
  var tiles = new Tile(
    new Rectangle({
      width: Cube.cubeSide / 2,
      height: Cube.cubeSide / 2,
      color: "white",
      borderColor: "white",
    }).centerReg({ add: false }),
    8,
    8
  )
    .rot(45)
    .addTo(holder);
  holder.sca(2, 1);

  /* create Wall */
  let rightWallContainer = new Container(300, 300).pos(stageW / 2, stageH / 2);
  rightWallContainer.mov(0, -500);
  rightWallContainer.ske(0, 26.5).addTo(stageContainer);
  let rightWall = new Rectangle({
    width: 100 * tiles.cols,
    height: 500,
    color: "blue",
  });
  rightWall.colorCommand.linearGradient(
    [frame.orange, frame.red],
    [0.5, 1],
    0,
    0,
    0,
    rightWall.height
  );
  rightWall.addTo(rightWallContainer);

  let leftWallContainer = new Container(300, 300).pos(stageW / 2, stageH / 2);
  leftWallContainer.mov(0, -500);
  leftWallContainer.ske(0, 153.5).addTo(stageContainer);
  let leftWall = new Rectangle({
    width: 100 * tiles.cols,
    height: 500,
  });
  leftWall.colorCommand.linearGradient(
    [frame.orange, frame.red],
    [0.2, 1],
    0,
    0,
    0,
    leftWall.height
  );
  leftWall.addTo(leftWallContainer);

  /* board layer */
  var layerContainerArray = [];

  for (var i = 0; i < tiles.cols + tiles.rows - 1; i++) {
    var layerContainer = new Container(100, 100).addTo(stageContainer);
    layerContainer.pos(tiles.x, tiles.y);
    layerContainerArray.push(layerContainer);
  }

  /* UI */
  var UI = new homeMenuUI();
  UI.editButton.pos(stageW - 200, stageH - 150);
  UI.scaleUpButton.pos(stageW - 200, stageH - 275);
  UI.scaleDownButton.pos(stageW - 200, stageH - 220);
  UI.posUpButton.pos(stageW - 300, stageH - 300);
  UI.posDownButton.pos(stageW - 300, stageH - 240);
  UI.posRightButton.pos(stageW - 250, stageH - 270);
  UI.posLeftButton.pos(stageW - 350, stageH - 270);

  UI.scaleUpButton.on("click", function () {
    currentScale = currentScale + 0.1;
    stageContainer.sca(currentScale, currentScale);
    stage.update();
  });

  UI.scaleDownButton.on("click", function () {
    currentScale = currentScale - 0.1;
    stageContainer.sca(currentScale, currentScale);
    stage.update();
  });

  UI.posUpButton.on("click", function () {
    stageContainer.y = stageContainer.y + 100;
    stage.update();
  });

  UI.posDownButton.on("click", function () {
    stageContainer.y = stageContainer.y - 100;
    stage.update();
  });

  UI.posRightButton.on("click", function () {
    stageContainer.x = stageContainer.x - 100;
    stage.update();
  });

  UI.posLeftButton.on("click", function () {
    stageContainer.x = stageContainer.x + 100;
    stage.update();
  });

  UI.editButton.on("click", function (clickEditButtonArg) {
    if (UI.editClickedFlag) {
      UI.editClickedFlag = false;
      clickEditButtonArg.target.text = "Edit";
      clickEditButtonArg.target.backgroundColor = black;
      tiles.off("click", UI.editButtonListener);
    } else {
      UI.editClickedFlag = true;
      clickEditButtonArg.target.text = "Done";
      clickEditButtonArg.target.backgroundColor = yellow;

      UI.editButtonListener = tiles.on("click", function (e) {
        var layerIndex = e.target.tileCol + e.target.tileRow;
        var cube = new Cube();
        layerContainerArray[layerIndex].addChild(cube);
        var objOrigin = e.target.parent.localToGlobal(e.target.x, e.target.y);
        cube
          .pos(
            (objOrigin.x - stageContainer.x) / currentScale,
            (objOrigin.y - stageContainer.y) / currentScale
          )
          .mov(-Cube.skewRecWidth, -100);
        stage.update();
      });
    }
    stage.update();
  });

  stage.update();
});
