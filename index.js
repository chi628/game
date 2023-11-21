/**
 * l -> 長階梯
 * s -> 短階梯
 * w -> 木頭階梯
 * e -> 勝利平台
 */
const stairLevel = ['l', 's', 'l', 's', 'w', 's', 'l', 's', 'l', 'w', 'l', 's', 's', 's', 's']

const stageList = [
  {
    id: 'boss',
    name: '慣老闆',
    description: '成功遠離 前途一片光明',
  },
  {
    id: 'pig',
    name: '雷隊友',
    description: '神隊友降臨 天天都有神救援',
  },
  {
    id: 'weasel',
    name: '犯小人',
    description: '完美防守 逢凶化吉迎貴人',
  },
  {
    id: 'money',
    name: '荷包空空',
    description: '年終翻倍 投資有賺無賠',
  },
  {
    id: 'invoice',
    name: '發票摃龜',
    description: '有對有驚喜 張張中大獎',
  },
  {
    id: 'goldfish',
    name: '忘東忘西金魚腦',
    description: '進化金頭腦 耳聰目明記憶好',
  },
  {
    id: 'ghost',
    name: '水逆',
    description: '變身破關小天才 凡事不再怪水逆',
  },
  {
    id: 'love',
    name: '爛桃花',
    description: '單身轉角遇到愛 脫單好人好事多',
  },
  {
    id: 'clothes',
    name: '新衣服秒髒',
    description: '打破莫非定律魔咒 衰神退散吧',
  },
]

const successStage = []

const MAIN_BACKGROUND_COLOR = '#f3bbac'
const GROUND_1_BGCOLOR = '#a38971'
const GROUND_2_BGCOLOR = '#8fac79'
const BIG_CLOUD_INIT_XCOORD = -60
const MID_CLOUD_INIT_XCOORD = -105
const MINI_CLOUD_INIT_XCOORD = 70
const TREE_INIT_XCOORD = 180

class Object {
  x
  y
  curr_frame
  width
  height
  frames = []
  camera = { x: 0, y: 0 }
  xSpeed = 0
  ySpeed = 0
  alive = true

  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  LoadFrame(filename) {
    let frame = new Image()
    frame.src = filename
    this.frames.push(frame)
  }

  SetSpeed({ x, y }) {
    this.xSpeed = x
    this.ySpeed = y
  }

  MovingCamera({ x, y }) {
    this.camera.x += x
    this.camera.y += y
  }
}

class SpecialObject {
  x
  y
  width
  height
  alive
  currFrame
  state
}

class AnimatorObject {
  x = 0
  y = 0
  width
  height
  currFrame = 0
  anim = 0
  anim_change = 0
  frames = []

  constructor(width, height) {
    this.width = width
    this.height = height
  }

  LoadFrame(filename) {
    let frame = new Image()
    frame.src = filename
    this.frames.push(frame)
  }

  SetAnimChange(limit) {
    this.anim_change = limit
  }
}

class myGame {
  ctx
  width
  height
  isMovingX = false
  isGameOver = false
  isDying = false
  isWin = false

  test = 0
  test1 = [10, 30, 30, 100, 50, 70, 70, 90, 10]
  test2 = [15, 10, 10, 50, 20, 30, 10, 30, 50]
  mountL2XSpace = [10, 30, 50, 70, 70, 70, 0, 0, 150]
  mountL2YSapce = [5, 5, 10, 20, 30, 40, 0, 0, -60]
  mountL3XSpace = [3, 30, 50, 50, 50, 100, 80, 150, 50]
  mountL3YSapce = [-3, -6, 0, 0, 20, 40, 0, 0, 20]
  treeXSapce = [10, 30, 50, 50, 50, 50]
  treeYSapce = [10, 20, 30, 30, 30, 50]

  stageIndexes = [] // 隨機3個障礙物的index
  stageOnStairIndex = [2, 7, 12] // 障礙物在階梯上的 index
  shoeOnStair = [1, 6, 11] // 鞋子道具在階梯上的 index
  fpsTestCount = 0
  playerIndex = 0
  isJumping = false
  bigCloudList = []
  midCloudList = []
  miniCloudList = []
  stairList = []
  stageDetailList = []
  propsShoeList = []
  playerAnimatorCounter = 0
  playerOnStairIndex = -1 // player 站在哪一個階梯上
  failAnimator = 0
  isOverStage = false
  playBrokenWood = false
  brokenWoodIndex = 0
  broken_wood_animator = 0
  isStayOnWood = false
  isOnEndpoint = false
  isTouched = false
  win_player_animator = 0
  winPlayerIndex = 0
  ctxAlpha = 0.5
  win_board_animator = 0
  isPlayingBrokenWood = false
  overStageIndex = -1
  isOverStageButDie = false

  constructor() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas = document.getElementById('my-canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')

    document.addEventListener(
      'touchstart',
      e => {
        console.log('start')
        e.preventDefault()
        this.isTouched = true
      },
      {
        passive: false,
      }
    )

    document.addEventListener('touchend', () => {
      console.log('end')
      this.isTouched = false
    })

    this.initGame()
  }

  async log() {
    await new Promise(resolve => {
      setTimeout(resolve, 1500)
    })
  }

  loadImages() {
    this.bigCloudObject = new Object(0, 0, 230, 111)
    this.bigCloudObject.LoadFrame('Images/cloud_L.webp')
    this.bigCloudObject.SetSpeed({ x: 1.6, y: 0 })

    this.midCloudObject = new Object(0, 0, 135, 72)
    this.midCloudObject.LoadFrame('Images/cloud_M.webp')
    this.midCloudObject.SetSpeed({ x: 1.2, y: 0 })

    this.miniCloudObject = new Object(0, 0, 95, 60)
    this.miniCloudObject.LoadFrame('Images/cloud_S.webp')
    this.miniCloudObject.SetSpeed({ x: 0.8, y: 0 })

    this.groundObject = new Object(0, 0, 0, 0)
    this.groundObject.LoadFrame('Images/ground.webp')
    this.groundObject.LoadFrame('Images/ground_L2.webp')
    this.groundObject.SetSpeed({ x: 0, y: 1.6 })

    this.treeObject = new Object(0, 0, 1070, 80)
    this.treeObject.LoadFrame('Images/tree.webp')

    this.mountL1Object = new Object(0, 0, 885, 480)
    this.mountL1Object.LoadFrame('Images/mt_L1.webp')

    this.mountL2Object = new Object(0, 0, 1245, 200)
    this.mountL2Object.LoadFrame('Images/mt_L2.webp')

    this.mountL3Object = new Object(0, 0, 1104, 210)
    this.mountL3Object.LoadFrame('Images/mt_L3.webp')

    this.stairObject = new Object(0, 0, 0, 0)
    this.stairObject.LoadFrame('Images/platform_N.webp')
    this.stairObject.LoadFrame('Images/platform_S.webp')
    this.stairObject.LoadFrame('Images/platform_W.webp')
    this.stairObject.SetSpeed({ x: 5, y: 2 })

    this.endPointObject = new Object(0, 0, 300, 370)
    this.endPointObject.LoadFrame('Images/Endpoint.webp')

    // 708*359
    this.winBoard = new AnimatorObject(180, 90)
    this.winBoard.LoadFrame('Images/win-board.webp')
    this.winBoard.SetAnimChange(60)

    this.stageObject = new Object(0, 0, 50, 50)
    for (let i = 0; i < stageList.length; i++) {
      this.stageObject.LoadFrame('Images/jump_' + stageList[i].id + '.png')
    }

    this.propsBoxObject = new Object(0, 0, 150, 107)
    this.propsBoxObject.LoadFrame('Images/props-box.webp')

    this.propsShoes = new Object(0, 0, 95, 45)
    this.propsShoes.LoadFrame('Images/550-black.png')
    this.propsShoes.LoadFrame('Images/550-brown.png')
    this.propsShoes.LoadFrame('Images/550-red.png')
    this.propsShoes.LoadFrame('Images/1906-red.png')
    this.propsShoes.LoadFrame('Images/1906-blue.png')
    this.propsShoes.LoadFrame('Images/1906-gray.png')
    this.propsShoes.LoadFrame('Images/1906-silver.png')

    this.flagObject = new AnimatorObject(50, 83)
    for (let i = 0; i < 10; i++) {
      this.flagObject.LoadFrame('Images/flag' + i + '.webp')
    }
    this.flagObject.SetAnimChange(18)

    this.playerObject = new AnimatorObject(70, 100)
    this.playerObject.LoadFrame('Images/standby0.webp')
    for (let i = 0; i < 12; i++) {
      this.playerObject.LoadFrame('Images/roll' + i + '.webp')
    }
    this.playerObject.SetAnimChange(70)

    this.winPlayerObject = new AnimatorObject(70, 100)
    this.winPlayerObject.LoadFrame('Images/win0.webp')
    this.winPlayerObject.LoadFrame('Images/win1.webp')
    this.winPlayerObject.SetAnimChange(12)

    this.failPlayerObject = new AnimatorObject(70, 100)
    for (let i = 0; i < 6; i++) {
      this.failPlayerObject.LoadFrame('Images/fail' + i + '.webp')
    }
    this.failPlayerObject.SetAnimChange(18)

    this.brokenWood = new AnimatorObject(85, 100)
    this.brokenWood.LoadFrame('Images/platformsW0.webp')
    this.brokenWood.LoadFrame('Images/platformsW1.webp')
    this.brokenWood.SetAnimChange(4)
  }

  initObject() {
    for (let i = 0; i < 10; i++) {
      const yCoord = i % 2 === 0 ? 10 : 40
      this.bigCloudList.push({
        x: 350 * i + BIG_CLOUD_INIT_XCOORD,
        y: yCoord + Math.random(),
        width: this.bigCloudObject.width,
        height: this.bigCloudObject.height,
      })
    }

    for (let i = 0; i < 15; i++) {
      const yCoord = i % 2 === 0 ? 220 : 140
      this.midCloudList.push({
        x: 200 * i + MID_CLOUD_INIT_XCOORD,
        y: yCoord + Math.random(),
        width: this.midCloudObject.width,
        height: this.midCloudObject.height,
      })
    }

    for (let i = 0; i < 20; i++) {
      const yCoord = i % 2 === 0 ? 300 : 330
      this.miniCloudList.push({
        x: 220 * i + MINI_CLOUD_INIT_XCOORD,
        y: yCoord + Math.random(),
        width: this.miniCloudObject.width,
        height: this.miniCloudObject.height,
      })
    }

    for (let i = 0; i < stairLevel.length; i++) {
      const startX = Math.floor(this.width * 0.6)
      const startY = this.height * 0.75

      let frameIndex = 0
      let width = 0
      let height = 23

      switch (stairLevel[i]) {
        case 'l':
          frameIndex = 0
          width = 85
          break
        case 's':
          frameIndex = 1
          width = 60
          break
        case 'w':
          frameIndex = 2
          width = 85
          break
        default:
          break
      }

      this.createStair({
        x: startX + 120 * i,
        y: startY - 50 * i,
        width,
        height,
        currFrame: frameIndex,
        state: 0,
      })
    }

    for (let i = 0; i < this.shoeOnStair.length; i++) {
      this.createPropsShoe({
        width: 55,
        height: 26,
      })
    }

    this.playerObject.x = Math.floor(this.width * 0.6) - 70
    this.playerObject.y = this.height * 0.84 - this.playerObject.height

    this.failPlayerObject.x = Math.floor(this.width * 0.6) - 70
    this.failPlayerObject.y = this.height * 0.84 - this.failPlayerObject.height
  }

  createStair({ x, y, width, height, currFrame, state }) {
    let special = new SpecialObject()
    special.x = x
    special.y = y
    special.width = width
    special.height = height
    special.currFrame = currFrame
    special.alive = true
    special.state = state // 0: 正常階梯, 1: 斷裂階梯
    this.stairList.push(special)
  }

  createPropsShoe({ width, height }) {
    let special = new SpecialObject()
    special.x = 0
    special.y = 0
    special.width = width
    special.height = height
    special.currFrame = 0 // TODO: 遊戲開始前，選擇鞋款
    special.alive = true
    this.propsShoeList.push(special)
  }

  createRandomStages() {
    while (this.stageIndexes.length < 3) {
      const randomNum = Math.floor(Math.random() * 9)
      if (this.stageIndexes.indexOf(randomNum) === -1) {
        this.stageIndexes.push(randomNum)
      }
    }
  }

  async initGame() {
    this.loadImages()
    this.log()
    this.initObject()
    this.createRandomStages()
    window.requestAnimationFrame(this.draw.bind(this))
  }

  clearScreen() {
    this.ctx.fillStyle = MAIN_BACKGROUND_COLOR
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  lastCalledTime = new Date()
  fpscounter = 0
  currentfps = 0
  countFPS() {
    this.fpscounter++
    let delta = (new Date().getTime() - this.lastCalledTime.getTime()) / 1000
    if (delta > 1) {
      console.log('fpsTestCount', this.fpsTestCount, this.fpscounter)
      this.currentfps = this.fpscounter
      this.fpscounter = 0
      this.lastCalledTime = new Date()
    }
  }

  updateCamera() {
    if (this.isMovingX && this.isJumping && !this.isDying && !this.isWin) {
      this.groundObject.MovingCamera({ x: 0, y: 1.6 })

      if (this.treeObject.camera.x <= 10) {
        this.treeObject.MovingCamera({ x: 0.4, y: 0 })
      } else if (this.treeObject.camera.x <= 40) {
        this.treeObject.MovingCamera({ x: 1.25, y: 0 })
      } else {
        this.treeObject.MovingCamera({ x: 2, y: 0 })
      }

      if (this.treeObject.camera.y <= 10) {
        this.treeObject.MovingCamera({ x: 0, y: 0.4 })
      } else if (this.treeObject.camera.y <= 30) {
        this.treeObject.MovingCamera({ x: 0, y: 0.8 })
      } else {
        this.treeObject.MovingCamera({ x: 0, y: 1.25 })
      }

      this.test += 1
      if (Math.floor(this.test / 24) < 9) {
        const l3 = this.mountL3XSpace[Math.floor(this.test / 24)] / 24
        const l3Y = this.mountL3YSapce[Math.floor(this.test / 24)] / 24
        this.mountL3Object.MovingCamera({ x: l3, y: l3Y })

        const l2 = this.mountL2XSpace[Math.floor(this.test / 24)] / 24
        const l2Y = this.mountL2YSapce[Math.floor(this.test / 24)] / 24
        this.mountL2Object.MovingCamera({ x: l2, y: l2Y })

        const l1 = this.test1[Math.floor(this.test / 24)] / 24
        const l1Y = this.test2[Math.floor(this.test / 24)] / 24
        this.mountL1Object.MovingCamera({ x: l1, y: l1Y })
      } else {
        this.mountL1Object.MovingCamera({ x: 0.5, y: 0.02 })
        this.mountL2Object.MovingCamera({ x: 0.5, y: 0.02 })
        this.mountL3Object.MovingCamera({ x: 0.5, y: 0.02 })
      }
    }
  }

  draw() {
    console.log('draw')
    this.clearScreen()
    // this.countFPS()

    this.gameMain()
    this.updateCamera()

    this.isJumping = this.playerObject.anim > 10

    if (this.isTouched) {
      this.isMovingX = this.stairList[this.stairList.length - 1].x > 35
    } else {
      this.isMovingX = false
    }

    this.flagObject.anim += 1
    if (this.flagObject.anim >= this.flagObject.anim_change) {
      this.flagObject.anim = 0
    }

    this.playerObject.anim += 1
    if (this.playerObject.anim >= this.playerObject.anim_change) {
      this.playerObject.anim = 0
    }

    this.failPlayerObject.anim += 1
    if (this.failPlayerObject.anim >= this.failPlayerObject.anim_change) {
      this.failPlayerObject.anim = 0
    }

    this.winPlayerObject.anim += 1
    if (this.winPlayerObject.anim >= this.winPlayerObject.anim_change) {
      this.winPlayerObject.anim = 0
    }

    if (this.isOverStage) {
      this.winBoard.anim += 1
      if (this.winBoard.anim >= this.winBoard.anim_change) {
        this.winBoard.anim = 0
        this.ctxAlpha = 0.5
        this.isOverStage = false
      }
      if (this.winBoard.anim <= 10) {
        this.ctxAlpha += 0.05
      } else if (this.winBoard.anim > 50) {
        this.ctxAlpha -= 0.1
      }
    }

    window.requestAnimationFrame(this.draw.bind(this))
  }

  gameMain() {
    this.checkPlayerStair()
    this.drawGroundL2()
    this.checkMiniClouds()
    this.drawMiniClouds()
    this.drawMount()
    this.checkBigClouds()
    this.drawBigClouds()
    this.checkMidClouds()
    this.drawMidClouds()
    this.drawTree()
    this.drawGroundL1()
    this.drawEndPoint()
    this.drawFlag()
    this.updateStairs()
    this.drawStair()
    if (this.isPlayingBrokenWood) {
      this.brokenWood.currFrame = Math.floor(this.brokenWood.anim / 2)
      this.brokenWood.x = this.stairList[this.brokenWoodIndex].x
      this.brokenWood.y = this.stairList[this.brokenWoodIndex].y

      this.brokenWood.anim += 1
      if (this.brokenWood.anim >= this.brokenWood.anim_change) {
        this.brokenWood.anim = 0
        this.isPlayingBrokenWood = false
        this.isStayOnWood = false
      }
      this.drawBrokenWood()
    }

    this.checkStageStatus()
    this.drawStages()
    this.drawShoes()

    this.updatePlayer()

    if (this.isJumping && this.isStayOnWood) {
      this.stairList[this.brokenWoodIndex].state = 1
      this.stairList[this.brokenWoodIndex].alive = false
      this.isPlayingBrokenWood = true
    }
    this.drawPropsBox()
  }

  checkBigClouds() {
    const outOfBoundIndex = this.bigCloudList.findIndex(o => o.x + o.width < 0)

    const lastCloudIndex = this.bigCloudList.findIndex(o => o.x === Math.max(...this.bigCloudList.map(o => o.x)))

    if (lastCloudIndex > -1 && outOfBoundIndex > -1) {
      this.bigCloudList[outOfBoundIndex].x = this.bigCloudList[lastCloudIndex].x + 270
    }
  }

  checkMidClouds() {
    const outOfBoundIndex = this.midCloudList.findIndex(o => o.x + o.width < 0)

    const lastCloudIndex = this.midCloudList.findIndex(o => o.x === Math.max(...this.midCloudList.map(o => o.x)))

    if (lastCloudIndex > -1 && outOfBoundIndex > -1) {
      this.midCloudList[outOfBoundIndex].x = this.midCloudList[lastCloudIndex].x + 200
    }
  }

  checkMiniClouds() {
    const outOfBoundIndex = this.miniCloudList.findIndex(o => o.x + o.width < 0)

    const lastCloudIndex = this.miniCloudList.findIndex(o => o.x === Math.max(...this.miniCloudList.map(o => o.x)))

    if (lastCloudIndex > -1 && outOfBoundIndex > -1) {
      this.miniCloudList[outOfBoundIndex].x = this.miniCloudList[lastCloudIndex].x + 220
    }
  }

  drawBigClouds() {
    for (let i = 0; i < this.bigCloudList.length - 1; i++) {
      this.bigCloudList[i].x -= this.bigCloudObject.xSpeed

      this.ctx.drawImage(
        this.bigCloudObject.frames[0],
        this.bigCloudList[i].x,
        this.bigCloudList[i].y,
        this.bigCloudList[i].width,
        this.bigCloudList[i].height
      )
    }
  }

  drawMidClouds() {
    for (let i = 0; i < this.midCloudList.length - 1; i++) {
      this.midCloudList[i].x -= this.midCloudObject.xSpeed

      this.ctx.drawImage(
        this.midCloudObject.frames[0],
        this.midCloudList[i].x,
        this.midCloudList[i].y,
        this.midCloudList[i].width,
        this.midCloudList[i].height
      )
    }
  }

  drawMiniClouds() {
    for (let i = 0; i < this.miniCloudList.length - 1; i++) {
      this.miniCloudList[i].x -= this.miniCloudObject.xSpeed

      this.ctx.drawImage(
        this.midCloudObject.frames[0],
        this.miniCloudList[i].x,
        this.miniCloudList[i].y,
        this.miniCloudList[i].width,
        this.miniCloudList[i].height
      )
    }
  }

  drawGroundL1() {
    const imageYCoord = this.height * 0.84 + this.groundObject.camera.y
    const colorYcoord = this.height * 0.9 + this.groundObject.camera.y

    this.ctx.drawImage(this.groundObject.frames[0], 0, imageYCoord, this.width, this.height * 0.07)
    this.ctx.fillStyle = GROUND_1_BGCOLOR
    this.ctx.fillRect(0, colorYcoord, this.width, this.height * 0.1)
  }

  drawGroundL2() {
    this.ctx.fillStyle = GROUND_2_BGCOLOR
    const yCoord = this.height * 0.8

    this.ctx.fillRect(0, yCoord, this.width, this.height * 0.2)
    this.ctx.drawImage(this.groundObject.frames[1], 0, yCoord, this.width, this.height * 0.2)
  }

  drawTree() {
    // - 10 - 30 - 50 - 70 - 90 - 110
    // + 10 + 10 + 20 + 30 + 40 + 50
    this.treeObject.x = TREE_INIT_XCOORD - this.treeObject.camera.x
    this.treeObject.y = this.height * 0.84 - this.treeObject.height * 0.7 + this.treeObject.camera.y

    this.ctx.drawImage(
      this.treeObject.frames[0],
      this.treeObject.x,
      this.treeObject.y,
      this.treeObject.width,
      this.treeObject.height
    )
  }

  drawMount() {
    this.mountL3Object.x = 5 - this.mountL3Object.camera.x
    this.mountL3Object.y = this.height * 0.84 - this.mountL3Object.height - 2 + this.mountL3Object.camera.y

    this.mountL2Object.x = 5 - this.mountL2Object.camera.x
    this.mountL2Object.y = this.height * 0.84 - this.mountL2Object.height * 0.9 + 5 + this.mountL2Object.camera.y

    this.mountL1Object.x = 150 - this.mountL1Object.camera.x
    this.mountL1Object.y = this.height * 0.84 - this.mountL1Object.height * 0.98 + this.mountL1Object.camera.y

    this.ctx.drawImage(
      this.mountL3Object.frames[0],
      this.mountL3Object.x,
      this.mountL3Object.y,
      this.mountL3Object.width,
      this.mountL3Object.height
    )
    this.ctx.drawImage(
      this.mountL2Object.frames[0],
      this.mountL2Object.x,
      this.mountL2Object.y,
      this.mountL2Object.width,
      this.mountL2Object.height
    )
    this.ctx.drawImage(
      this.mountL1Object.frames[0],
      this.mountL1Object.x,
      this.mountL1Object.y,
      this.mountL1Object.width,
      this.mountL1Object.height
    )
  }

  updateStairs() {
    if (this.isMovingX && this.isJumping && !this.isDying && !this.isWin) {
      for (let i = 0; i < this.stairList.length; i++) {
        this.stairList[i].x -= this.stairObject.xSpeed
        this.stairList[i].y += this.stairObject.ySpeed

        if (this.stairList[i].x + this.stairList[i].width < 0) {
          this.stairList[i].alive = false
        }
      }
    }
  }

  drawStair() {
    for (let i = 0; i < this.stairList.length; i++) {
      if (this.stairList[i].alive) {
        this.ctx.drawImage(
          this.stairObject.frames[this.stairList[i].currFrame],
          this.stairList[i].x,
          this.stairList[i].y,
          this.stairList[i].width,
          this.stairList[i].height
        )
      }
    }
  }

  drawBrokenWood() {
    this.ctx.drawImage(
      this.brokenWood.frames[this.brokenWood.currFrame],
      this.brokenWood.x,
      this.brokenWood.y,
      this.brokenWood.width,
      this.brokenWood.height
    )
  }

  drawEndPoint() {
    this.endPointObject.x = this.stairList[this.stairList.length - 1].x - 10
    this.endPointObject.y = this.stairList[this.stairList.length - 1].y - 160

    this.ctx.drawImage(
      this.endPointObject.frames[0],
      this.endPointObject.x,
      this.endPointObject.y,
      this.endPointObject.width,
      this.endPointObject.height
    )
  }

  drawFlag() {
    this.flagObject.x = this.endPointObject.x + 180
    this.flagObject.y = this.endPointObject.y + 40
    this.flagObject.currFrame = Math.floor(this.flagObject.anim / 2) % 9
    this.ctx.drawImage(
      this.flagObject.frames[this.flagObject.currFrame],
      this.flagObject.x,
      this.flagObject.y,
      this.flagObject.width,
      this.flagObject.height
    )
  }

  updatePlayer() {
    if (this.isDying) {
      this.failPlayerObject.currFrame = Math.floor(this.failPlayerObject.anim / 3)
      this.drawFailPlayer()
    } else if (this.isWin) {
      this.winPlayerObject.currFrame = Math.floor(this.winPlayerObject.anim / 6)
      // TODO: winplayerobject x 調整在降落的位置
      // this.winPlayerObject.x = this.endPointObject.x + 150
      this.winPlayerObject.x = this.playerObject.x
      this.winPlayerObject.y = this.endPointObject.y + 120 - this.winPlayerObject.height
      this.drawWinPlayer()
    } else {
      if (this.playerObject.anim <= 10) {
        // stand
        this.playerObject.currFrame = 0

        this.playerObject.y = this.height * 0.84 - this.playerObject.height

        if (this.playerOnStairIndex > -1) {
          this.playerObject.y = this.stairList[this.playerOnStairIndex].y - this.playerObject.height
        }
      } else {
        // jump
        if (this.playerObject.anim % 2 === 0) {
          if (this.playerObject.currFrame === this.playerObject.frames.length - 1) {
            this.playerObject.currFrame = 1
          } else {
            this.playerObject.currFrame += 1
          }
        }

        if (this.playerObject.anim - 10 < Math.floor(this.playerObject.anim_change - 10) / 2) {
          this.playerObject.y -= 5
        } else {
          this.playerObject.y += 5
        }
      }
      this.drawPlayer()
    }
  }

  drawPlayer() {
    this.ctx.drawImage(
      this.playerObject.frames[this.playerObject.currFrame],
      this.playerObject.x,
      this.playerObject.y,
      this.playerObject.width,
      this.playerObject.height
    )
  }

  drawFailPlayer() {
    this.ctx.drawImage(
      this.failPlayerObject.frames[this.failPlayerObject.currFrame],
      this.failPlayerObject.x,
      this.failPlayerObject.y,
      this.failPlayerObject.width,
      this.failPlayerObject.height
    )
  }

  drawWinPlayer() {
    this.ctx.drawImage(
      this.winPlayerObject.frames[this.winPlayerObject.currFrame],
      this.winPlayerObject.x,
      this.winPlayerObject.y,
      this.winPlayerObject.width,
      this.winPlayerObject.height
    )
  }

  checkPlayerStair() {
    if (this.playerObject.anim < this.playerObject.anim_change - 5) {
      return
    }

    /**
     * 因 player 的圖左右有留白邊，判斷玩家是否在階梯上x軸需要調整
     * player 最左邊的x軸 > player x軸+30
     * player 最右邊的x軸 > this.playerObject.x + this.playerObject.width - 21
     */
    this.playerOnStairIndex = this.stairList.findIndex(
      stair =>
        (stair.x <= this.playerObject.x + 30 && stair.x + stair.width >= this.playerObject.x + 30) ||
        (stair.x <= this.playerObject.x + this.playerObject.width - 21 &&
          stair.x + stair.width >= this.playerObject.x + this.playerObject.width - 21)
    )

    // 第一個階梯的 x 起點在 player 寬度一半的左邊視為遊戲開始
    const isStartGame = this.playerObject.width / 2 + this.playerObject.x >= this.stairList[0].x

    if (this.playerOnStairIndex === -1) {
      // 在終點平台上
      if (this.endPointObject.x + 100 <= this.playerObject.x + 30) {
        // this.isOnEndpoint = true
        this.isWin = true
      } else {
        // 如果遊戲已開始，playerOnStairIndex 是 -1 代表 fail
        if (isStartGame) {
          this.isDying = true
        }
      }
    }

    // 如果 playerOnStairIndex 有障礙物，代表 fail
    if (this.stageOnStairIndex.includes(this.playerOnStairIndex)) {
      this.isDying = true
    }

    // 是不是在木頭階梯上
    if (stairLevel[this.playerOnStairIndex] === 'w') {
      if (this.stairList[this.playerOnStairIndex].state === 0) {
        this.isStayOnWood = true
        this.brokenWoodIndex = this.playerOnStairIndex
      } else {
        this.isDying = !this.isPlayingBrokenWood
      }
    }

    // 階梯上是否含有道具鞋
    if (this.shoeOnStair.includes(this.playerOnStairIndex)) {
      const index = this.shoeOnStair.findIndex(o => o === this.playerOnStairIndex)

      if (index > -1) {
        if (this.propsShoeList[index].alive) {
          this.playerObject.anim = 0
          this.playerObject.SetAnimChange(120)
          this.propsShoeList[index].alive = false
        } else {
          this.playerObject.SetAnimChange(70)
        }
      }
    } else {
      this.playerObject.SetAnimChange(70)
    }
  }

  checkStageStatus() {
    if (successStage.length === 0) {
      if (this.playerOnStairIndex > this.stageOnStairIndex[0]) {
        this.isOverStage = true
        this.overStageIndex = 0
        successStage.push(stageList[this.stageIndexes[0]])
      }
    } else if (successStage.length === 1) {
      if (this.playerOnStairIndex > this.stageOnStairIndex[1]) {
        this.isOverStage = true
        this.overStageIndex = 1
        successStage.push(stageList[this.stageIndexes[1]])
      }
    } else if (successStage.length === 2) {
      if (this.playerOnStairIndex > this.stageOnStairIndex[2]) {
        this.isOverStage = true
        this.overStageIndex = 2
        successStage.push(stageList[this.stageIndexes[2]])
      }
    }

    if (this.playerOnStairIndex === -1) {
      let stair_count = -1
      this.stairList.forEach(stair => {
        if (stair.x + stair.width < this.playerObject.x + 30) {
          stair_count += 1
        }
      })

      if (stair_count > 0 && !this.isOverStageButDie) {
        this.isOverStage = true
        this.isOverStageButDie = true
        this.overStageIndex = this.stageOnStairIndex.findIndex(o => o < stair_count)
        successStage.push(stageList[this.stageIndexes[this.overStageIndex]])
      }
    }

    if (this.isOverStage) {
      this.winBoard.x =
        this.stairList[this.stageOnStairIndex[this.overStageIndex]].x -
        Math.floor((this.winBoard.width - this.stairList[this.stageOnStairIndex[this.overStageIndex]].width) / 2)
      this.winBoard.y =
        this.stairList[this.stageOnStairIndex[this.overStageIndex]].y - this.stageObject.height - this.winBoard.height

      this.drawWinBoard()
    }
  }

  drawStages() {
    for (let i = 0; i < this.stageIndexes.length; i++) {
      let width = this.stageObject.width
      let height = this.stageObject.height

      if (this.stageIndexes[i] === 0) {
        width = width + 20
        height = height + 20
      }

      const restSpace = this.stairList[this.stageOnStairIndex[i]].width - width
      const xCoord = this.stairList[this.stageOnStairIndex[i]].x + Math.floor(restSpace / 2)

      this.ctx.drawImage(
        this.stageObject.frames[this.stageIndexes[i]],
        xCoord,
        this.stairList[this.stageOnStairIndex[i]].y - this.stageObject.height,
        width,
        height
      )
    }
  }

  drawShoes() {
    for (let i = 0; i < this.propsShoeList.length; i++) {
      const width = this.propsShoeList[i].width
      const height = this.propsShoeList[i].height

      const restSpace = this.stairList[this.shoeOnStair[i]].width - width
      const xcoord = this.stairList[this.shoeOnStair[i]].x + Math.floor(restSpace / 2)
      const ycoord = this.stairList[this.shoeOnStair[i]].y - height

      if (this.propsShoeList[i].alive) {
        this.ctx.drawImage(this.propsShoes.frames[this.propsShoeList[i].currFrame], xcoord, ycoord, width, height)
      }
    }
  }

  drawWinBoard() {
    this.ctx.globalAlpha = this.ctxAlpha
    this.ctx.drawImage(
      this.winBoard.frames[0],
      this.winBoard.x,
      this.winBoard.y,
      this.winBoard.width,
      this.winBoard.height
    )
    this.ctx.font = 'bold 18px NotoSansCJKTC'
    this.ctx.fillStyle = '#000'
    this.ctx.textAlign = 'center'
    const textXcoord = this.winBoard.x + Math.floor((this.winBoard.width - 15) / 2)
    const textYcoord = this.winBoard.y + 55
    this.ctx.fillText(successStage[this.overStageIndex].name, textXcoord, textYcoord)
    this.ctx.globalAlpha = 1
  }

  drawPropsBox() {
    this.ctx.drawImage(this.propsBoxObject.frames[0], 10, 10, this.propsBoxObject.width, this.propsBoxObject.height)
    const shoeXcoord = Math.floor((this.propsBoxObject.width + 25 - this.propsShoes.width) / 2)
    const shoeYcoord = Math.floor((this.propsBoxObject.height - 25) / 2)
    this.ctx.drawImage(this.propsShoes.frames[0], shoeXcoord, shoeYcoord, this.propsShoes.width, this.propsShoes.height)
    this.ctx.font = 'bold 13px ProximaNova'
    this.ctx.fillStyle = '#151415'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('550酷帥紅', Math.floor((this.propsBoxObject.width + 25) / 2), this.propsBoxObject.height)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window['myGame'] = new myGame()
})
