import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

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

let shoeIndex = 0
let stageIndex = 0

const successStage = []
const MAIN_BACKGROUND_COLOR = '#f3bbac'
const GROUND_1_BGCOLOR = '#a38971'
const GROUND_2_BGCOLOR = '#8fac79'
const BIG_CLOUD_INIT_XCOORD = -60
const MID_CLOUD_INIT_XCOORD = -105
const MINI_CLOUD_INIT_XCOORD = 70
const TREE_INIT_XCOORD = 180

// curr_frame
class Object {
  x
  y
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
  ctxAlpha = 0.5
  width
  height
  devicePixelRatio
  backingStoreRatio
  ratio

  isMovingX = false
  isGameOver = false
  isDying = false
  isWin = false
  isJumping = false
  isOverStage = false
  isStayOnWood = false
  isTouched = false
  isPlayingBrokenWood = false
  isJumpOnShoe = false

  displayStagesIndex = [] // 隨機3個障礙物的 index list
  stageOnStairIndex = [2, 7, 12] // 障礙物在階梯上的 index list
  successStageIndex = [] // 已經成功翻越障礙物所在階梯的 index list
  shoeOnStairIndex = [1, 6, 11] // 鞋子道具在階梯上的 index
  bigCloudList = []
  midCloudList = []
  miniCloudList = []
  stairList = []
  propsShoeList = []

  fpsTestCount = 0
  playerOnStairIndex = -1 // player 站在哪一個階梯上
  brokenWoodIndex = 0
  overStageStairIndex = -1 // 翻越障礙物所在的階梯 index

  camera = 0

  reqAnim

  TREE_INIT_YCOORD

  constructor() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas = document.getElementById('my-canvas')
    this.ctx = this.canvas.getContext('2d')

    this.devicePixelRatio = window.devicePixelRatio || 1
    this.backingStoreRatio =
      this.ctx.webkitBackingStorePixelRatio ||
      this.ctx.mozBackingStorePixelRatio ||
      this.ctx.msBackingStorePixelRatio ||
      this.ctx.oBackingStorePixelRatio ||
      this.ctx.backingStorePixelRatio ||
      1
    this.ratio = this.devicePixelRatio / this.backingStoreRatio || 3

    this.canvas.width = this.width * this.ratio
    this.canvas.height = this.height * this.ratio

    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`

    this.ctx.scale(this.ratio, this.ratio)

    this.initGame()
  }

  touchStart(e) {
    e.preventDefault()
    window['myGame'].isTouched = true
  }

  touchEnd() {
    window['myGame'].isTouched = false
  }

  startGame() {
    // TODO: debounce
    document.addEventListener('touchstart', this.touchStart, { passive: false })
    document.addEventListener('touchend', this.touchEnd)
  }

  resetGame() {
    console.log('reset')
    this.isGameOver = false
    this.isMovingX = false
    this.isJumping = false
    this.isDying = false
    this.isWin = false
    this.isTouched = false
    this.isOverStage = false
    this.isPlayingBrokenWood = false
    this.isStayOnWood = false
    this.isJumpOnShoe = false

    this.camera = 0
    this.groundObject.camera.y = 0
    this.treeObject.camera.x = 0
    this.treeObject.camera.y = 0
    this.mountL1Object.camera.x = 0
    this.mountL1Object.camera.y = 0
    this.mountL2Object.camera.x = 0
    this.mountL2Object.camera.y = 0
    this.mountL3Object.camera.x = 0
    this.mountL3Object.camera.y = 0

    this.flagObject.anim = 0
    this.playerObject.anim = 0
    this.failPlayerObject.anim = 0
    this.winPlayerObject.anim = 0
    this.winBoard.anim = 0
    this.brokenWood.anim = 0
    this.ctxAlpha = 0.5

    this.brokenWoodIndex = 0
    this.playerOnStairIndex = -1
    this.overStageStairIndex = -1

    this.displayStagesIndex = []
    this.bigCloudList = []
    this.midCloudList = []
    this.miniCloudList = []
    this.stairList = []
    this.propsShoeList = []
    this.successStageIndex = []

    this.fpsTimer = 0
    this.fpscounter = 0
    this.currentfps = 0

    this.createRandomStages()
    this.initObject()

    window.requestAnimationFrame(this.draw.bind(this))
  }

  loadImages() {
    this.bigCloudObject = new Object(0, 0, 230, 111)
    this.bigCloudObject.LoadFrame('Images/cloud_L.webp')

    this.midCloudObject = new Object(0, 0, 135, 72)
    this.midCloudObject.LoadFrame('Images/cloud_M.webp')

    this.miniCloudObject = new Object(0, 0, 95, 60)
    this.miniCloudObject.LoadFrame('Images/cloud_S.webp')

    this.groundObject = new Object(0, 0, 0, 0)
    this.groundObject.LoadFrame('Images/ground.webp')
    this.groundObject.LoadFrame('Images/ground_L2.webp')

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

    this.endPointObject = new Object(0, 0, 300, 370)
    this.endPointObject.LoadFrame('Images/Endpoint.webp')

    this.propsBoxObject = new Object(0, 0, 150, 107)
    this.propsBoxObject.LoadFrame('Images/props-box.webp')

    this.propsShoes = new Object(0, 0, 90, 40.3)
    this.propsShoes.LoadFrame('Images/550-red.webp')
    this.propsShoes.LoadFrame('Images/550-brown.webp')
    this.propsShoes.LoadFrame('Images/550-black.webp')
    this.propsShoes.LoadFrame('Images/1906-red.webp')
    this.propsShoes.LoadFrame('Images/1906-blue.webp')
    this.propsShoes.LoadFrame('Images/1906-gray.webp')
    this.propsShoes.LoadFrame('Images/1906-silver.webp')

    this.stageObject = new Object(0, 0, 50, 50)
    for (let i = 0; i < stageList.length; i++) {
      this.stageObject.LoadFrame('Images/jump_' + stageList[i].id + '.png')
    }

    this.winBoard = new AnimatorObject(180, 90)
    this.winBoard.LoadFrame('Images/win-board.webp')

    this.flagObject = new AnimatorObject(50, 83)
    for (let i = 0; i < 10; i++) {
      this.flagObject.LoadFrame('Images/flag' + i + '.webp')
    }

    this.playerObject = new AnimatorObject(70, 100)
    this.playerObject.LoadFrame('Images/standby0.webp')
    for (let i = 0; i < 12; i++) {
      this.playerObject.LoadFrame('Images/roll' + i + '.webp')
    }
    for (let i = 0; i < 12; i++) {
      this.playerObject.LoadFrame('Images/jumper' + i + '.webp')
    }

    this.winPlayerObject = new AnimatorObject(70, 100)
    this.winPlayerObject.LoadFrame('Images/win0.webp')
    this.winPlayerObject.LoadFrame('Images/win1.webp')

    this.failPlayerObject = new AnimatorObject(70, 100)
    for (let i = 0; i < 6; i++) {
      this.failPlayerObject.LoadFrame('Images/fail' + i + '.webp')
    }

    this.brokenWood = new AnimatorObject(85, 100)
    this.brokenWood.LoadFrame('Images/platformsW0.webp')
    this.brokenWood.LoadFrame('Images/platformsW1.webp')
  }

  createRandomStages() {
    while (this.displayStagesIndex.length < 3) {
      const randomNum = Math.floor(Math.random() * 9)
      if (this.displayStagesIndex.indexOf(randomNum) === -1) {
        this.displayStagesIndex.push(randomNum)
      }
    }
  }

  async log() {
    await new Promise(resolve => {
      setTimeout(resolve, 1500)
    })
  }

  initObject() {
    // 大朵雲
    for (let i = 0; i < 10; i++) {
      const yCoord = i % 2 === 0 ? 10 : 40
      this.bigCloudList.push({
        x: 350 * i + BIG_CLOUD_INIT_XCOORD,
        y: yCoord + Math.random(),
        width: this.bigCloudObject.width,
        height: this.bigCloudObject.height,
      })
    }
    this.bigCloudObject.xSpeed = 1.6

    // 中朵雲
    for (let i = 0; i < 15; i++) {
      const yCoord = i % 2 === 0 ? 220 : 140
      this.midCloudList.push({
        x: 200 * i + MID_CLOUD_INIT_XCOORD,
        y: yCoord + Math.random(),
        width: this.midCloudObject.width,
        height: this.midCloudObject.height,
      })
    }
    this.midCloudObject.xSpeed = 1.2

    // 小朵雲
    for (let i = 0; i < 20; i++) {
      const yCoord = i % 2 === 0 ? 300 : 330
      this.miniCloudList.push({
        x: 220 * i + MINI_CLOUD_INIT_XCOORD,
        y: yCoord + Math.random(),
        width: this.miniCloudObject.width,
        height: this.miniCloudObject.height,
      })
    }
    this.miniCloudObject.xSpeed = 0.8

    // 階梯
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
    this.stairObject.xSpeed = 5
    this.stairObject.ySpeed = 2

    // 選擇的鞋
    for (let i = 0; i < this.shoeOnStairIndex.length; i++) {
      this.createPropsShoe({
        width: 55,
        height: 26,
      })
    }

    this.winBoard.SetAnimChange(60)
    this.flagObject.SetAnimChange(18)
    // TODO 要不要改成 60，初始狀態獨立出來
    this.playerObject.SetAnimChange(70)
    this.winPlayerObject.SetAnimChange(12)
    this.failPlayerObject.SetAnimChange(18)
    this.brokenWood.SetAnimChange(4)

    const playerInitXcoord = Math.floor(this.width * 0.6) - 70
    const playerInitYCoord = this.height * 0.84 - this.playerObject.height
    this.playerObject.x = playerInitXcoord
    this.playerObject.y = playerInitYCoord

    this.failPlayerObject.x = playerInitXcoord
    this.failPlayerObject.y = playerInitYCoord

    this.TREE_INIT_YCOORD = this.height * 0.84 - this.treeObject.height * 0.7
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
    special.currFrame = shoeIndex // TODO: 遊戲開始前，選擇鞋款
    special.alive = true
    this.propsShoeList.push(special)
  }

  async initGame() {
    this.loadImages()
    this.createRandomStages()
    // this.log()
    this.initObject()
    window.requestAnimationFrame(this.draw.bind(this))
  }

  lastCalledTime = new Date()
  fpscounter = 0
  currentfps = 0
  fpsTimer = 0
  countFPS() {
    this.fpscounter += 1
    let delta = (new Date().getTime() - this.lastCalledTime.getTime()) / 1000
    if (delta > 1) {
      console.log('fpsTestCount', this.fpscounter)
      this.fpsTimer += 1
      this.fpscounter = 0
      this.lastCalledTime = new Date()
    }
  }

  updateCamera() {
    if (this.isMovingX && this.isJumping && !this.isDying && !this.isWin) {
      this.camera += 1
      this.groundObject.camera.y += 1.6

      if (this.camera <= 25) {
        this.treeObject.camera.x += 0.4
        this.treeObject.camera.y += 0.4
      } else if (this.camera < 50) {
        this.treeObject.camera.x += 1.25
        this.treeObject.camera.y += 0.8
      } else {
        this.treeObject.camera.x += 2
        this.treeObject.camera.y += 1.25
      }

      console.log('camera', Math.floor(this.camera / 24))

      switch (Math.floor(this.camera / 24)) {
        case 0:
          this.mountL1Object.camera.x += 0.4
          this.mountL1Object.camera.y += 0.625
          this.mountL2Object.camera.x += 0.4
          this.mountL2Object.camera.y += 0.2
          this.mountL3Object.camera.x += 0.125
          this.mountL3Object.camera.y -= 0.125
          break
        case 1:
          this.mountL1Object.camera.x += 1.25
          this.mountL1Object.camera.y += 0.4
          this.mountL2Object.camera.x += 1.25
          this.mountL2Object.camera.y += 0.2
          this.mountL3Object.camera.x += 1.25
          this.mountL3Object.camera.y -= 0.25
          break
        case 2:
          this.mountL1Object.camera.x += 1.25
          this.mountL1Object.camera.y += 0.4
          this.mountL2Object.camera.x += 2
          this.mountL2Object.camera.y += 0.4
          this.mountL3Object.camera.x += 2
          this.mountL3Object.camera.y += 0
          break
        case 3:
          this.mountL1Object.camera.x += 4
          this.mountL1Object.camera.y += 2
          this.mountL2Object.camera.x += 3
          this.mountL2Object.camera.y += 0.8
          this.mountL3Object.camera.x += 2
          this.mountL3Object.camera.y += 0
          break
        case 4:
          this.mountL1Object.camera.x += 4
          this.mountL1Object.camera.y += 0.8
          this.mountL2Object.camera.x += 3
          this.mountL2Object.camera.y += 1.25
          this.mountL3Object.camera.x += 2
          this.mountL3Object.camera.y += 0.8
          break
        case 5:
          this.mountL1Object.camera.x += 3
          this.mountL1Object.camera.y += 1.25
          this.mountL2Object.camera.x += 3
          this.mountL2Object.camera.y += 1.67
          this.mountL3Object.camera.x += 4.2
          this.mountL3Object.camera.y += 1.67
          break
        case 6:
          this.mountL1Object.camera.x += 3
          this.mountL1Object.camera.y += 0.4
          this.mountL2Object.camera.x += 0
          this.mountL2Object.camera.y += 0
          this.mountL3Object.camera.x += 4
          this.mountL3Object.camera.y += 0
          break
        case 7:
          this.mountL1Object.camera.x += 3.75
          this.mountL1Object.camera.y += 1.25
          this.mountL2Object.camera.x += 1.5
          this.mountL2Object.camera.y += 0
          this.mountL3Object.camera.x += 6.25
          this.mountL3Object.camera.y += 0
          break
        case 8:
          this.mountL1Object.camera.x += 0.4
          this.mountL1Object.camera.y += 2
          this.mountL2Object.camera.x += 6.25
          this.mountL2Object.camera.y -= 2
          this.mountL3Object.camera.x += 2
          this.mountL3Object.camera.y += 0.8
          break
        default:
          this.mountL1Object.camera.x += 0.1
          this.mountL1Object.camera.y += 0.1
          this.mountL2Object.camera.x += 0.1
          this.mountL2Object.camera.y -= 0
          this.mountL3Object.camera.x += 0.1
          this.mountL3Object.camera.y += 0.1
          break
      }
    }
  }

  clearScreen() {
    this.ctx.fillStyle = MAIN_BACKGROUND_COLOR
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  draw() {
    console.log('draw')
    this.clearScreen()

    if (this.isGameOver) {
      window.cancelAnimationFrame(this.reqAnim)
      document.removeEventListener('touchstart', this.touchStart, { passive: false })
      document.removeEventListener('touchend', this.touchEnd)

      this.fpsTimer = 0

      const successModal = document.getElementById('success-modal')
      const failModal = document.getElementById('fail-modal')
      if (successStage.length > 0) {
        successModal.style.display = 'flex'
        showStageList()
      } else {
        failModal.style.display = 'flex'
      }
      return
    }

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
      if (this.playerObject.anim - 10 >= 5 && this.stairList[this.brokenWoodIndex].alive) {
        this.stairList[this.brokenWoodIndex].state = 1
        this.stairList[this.brokenWoodIndex].alive = false

        this.isPlayingBrokenWood = true
      }
    }
    this.drawPropsBox()
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

    if (this.isWin || this.isDying) {
      this.countFPS()
      this.isGameOver = this.fpsTimer === 2
    }

    this.reqAnim = window.requestAnimationFrame(this.draw.bind(this))
  }

  checkBigClouds() {
    const outOfBoundIndex = this.bigCloudList.findIndex(o => o.x + o.width < 0)

    const lastCloudIndex = this.bigCloudList.findIndex(o => o.x === Math.max(...this.bigCloudList.map(o => o.x)))

    if (lastCloudIndex > -1 && outOfBoundIndex > -1) {
      this.bigCloudList[outOfBoundIndex].x = this.bigCloudList[lastCloudIndex].x + 270
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

  checkMidClouds() {
    const outOfBoundIndex = this.midCloudList.findIndex(o => o.x + o.width < 0)

    const lastCloudIndex = this.midCloudList.findIndex(o => o.x === Math.max(...this.midCloudList.map(o => o.x)))

    if (lastCloudIndex > -1 && outOfBoundIndex > -1) {
      this.midCloudList[outOfBoundIndex].x = this.midCloudList[lastCloudIndex].x + 200
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

  checkMiniClouds() {
    const outOfBoundIndex = this.miniCloudList.findIndex(o => o.x + o.width < 0)

    const lastCloudIndex = this.miniCloudList.findIndex(o => o.x === Math.max(...this.miniCloudList.map(o => o.x)))

    if (lastCloudIndex > -1 && outOfBoundIndex > -1) {
      this.miniCloudList[outOfBoundIndex].x = this.miniCloudList[lastCloudIndex].x + 220
    }
  }

  drawMiniClouds() {
    for (let i = 0; i < this.miniCloudList.length - 1; i++) {
      this.miniCloudList[i].x -= this.miniCloudObject.xSpeed

      this.ctx.drawImage(
        this.miniCloudObject.frames[0],
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
    const height = this.height * 0.2

    this.ctx.fillRect(0, yCoord, this.width, height)
    this.ctx.drawImage(this.groundObject.frames[1], 0, yCoord, this.width, height)
  }

  drawTree() {
    this.treeObject.x = TREE_INIT_XCOORD - this.treeObject.camera.x
    this.treeObject.y = this.TREE_INIT_YCOORD + this.treeObject.camera.y

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
    const xCoord = this.stairList[this.brokenWoodIndex].x
    const yCoord = this.stairList[this.brokenWoodIndex].y
    const currFrame = Math.floor(this.brokenWood.anim / 2)

    this.ctx.drawImage(this.brokenWood.frames[currFrame], xCoord, yCoord, this.brokenWood.width, this.brokenWood.height)
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
    const currFrame = Math.floor(this.flagObject.anim / 2) % 9
    this.ctx.drawImage(
      this.flagObject.frames[currFrame],
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
        const maxFrame = this.isJumpOnShoe ? 24 : 12
        if (this.playerObject.currFrame >= maxFrame) {
          this.playerObject.currFrame = this.isJumpOnShoe ? 13 : 1
        } else {
          this.playerObject.currFrame += 1
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
    this.stairList.forEach((o, i) => {
      if (this.shoeOnStairIndex.includes(i)) {
        if (
          (o.x <= this.playerObject.x + 30 && o.x + o.width >= this.playerObject.x + 30) ||
          (o.x <= this.playerObject.x + this.playerObject.width - 21 &&
            o.x + o.width >= this.playerObject.x + this.playerObject.width - 21)
        ) {
          if (
            this.playerObject.y + this.playerObject.height - 45 === o.y - this.stageObject.height - 20 ||
            (this.playerObject.y + this.playerObject.height - 45 > o.y - this.stageObject.height &&
              this.playerObject.y + this.playerObject.height - 45 <= o.y)
          ) {
            const index = this.shoeOnStairIndex.findIndex(o => o === i)
            if (index > -1) {
              if (this.propsShoeList[index].alive) {
                this.playerObject.anim = 11
                this.playerObject.currFrame = 12
                this.playerObject.SetAnimChange(120)
                this.isJumpOnShoe = true
                this.propsShoeList[index].alive = false
              } else {
                this.isJumpOnShoe = false
                this.playerObject.SetAnimChange(70)
              }
            }
          }
        }
      }
    })

    if (this.playerObject.anim < this.playerObject.anim_change - 5) {
      // 還在跳躍中
      this.stairList.forEach((o, i) => {
        if (this.stageOnStairIndex.includes(i)) {
          // 有障礙物的階梯一半的寬度在 player 的左邊
          if (o.x + Math.floor(o.width / 2) <= this.playerObject.x) {
            if (!this.successStageIndex.includes(i)) {
              this.successStageIndex.push(i)
              this.isOverStage = true
              this.overStageStairIndex = i
              const index = this.stageOnStairIndex.findIndex(o => o === i)
              if (index > -1) {
                successStage.push(stageList[this.displayStagesIndex[index]])
              }
            }
          }
        }
      })
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
        this.playerObject.anim = 0
        this.isStayOnWood = true
        this.brokenWoodIndex = this.playerOnStairIndex
      } else {
        this.isDying = !this.isPlayingBrokenWood
      }
    }

    if (!this.shoeOnStairIndex.includes(this.playerOnStairIndex)) {
      this.isJumpOnShoe = false
      this.playerObject.SetAnimChange(70)
    }
  }

  checkStageStatus() {
    if (this.isOverStage) {
      // 障礙物所在的階梯
      const stageStair = this.stairList[this.overStageStairIndex]
      this.winBoard.x = stageStair.x - Math.floor((this.winBoard.width - stageStair.width) / 2)
      this.winBoard.y = stageStair.y - this.stageObject.height - this.winBoard.height
      this.drawWinBoard()
    }
  }

  drawStages() {
    for (let i = 0; i < this.stageOnStairIndex.length; i++) {
      let width = this.stageObject.width
      let height = this.stageObject.height

      // 障礙物是慣老闆 > 調整尺寸
      if (this.displayStagesIndex[i] === 0) {
        width = width + 20
        height = height + 20
      }

      const restSpace = this.stairList[this.stageOnStairIndex[i]].width - width
      const xCoord = this.stairList[this.stageOnStairIndex[i]].x + Math.floor(restSpace / 2)
      const yCoord = this.stairList[this.stageOnStairIndex[i]].y - this.stageObject.height + 3

      this.ctx.drawImage(this.stageObject.frames[this.displayStagesIndex[i]], xCoord, yCoord, width, height)
    }
  }

  drawShoes() {
    for (let i = 0; i < this.propsShoeList.length; i++) {
      const width = this.propsShoeList[i].width
      const height = this.propsShoeList[i].height

      const restSpace = this.stairList[this.shoeOnStairIndex[i]].width - width
      const xcoord = this.stairList[this.shoeOnStairIndex[i]].x + Math.floor(restSpace / 2)
      const ycoord = this.stairList[this.shoeOnStairIndex[i]].y - height + 2

      if (this.propsShoeList[i].alive) {
        this.ctx.drawImage(this.propsShoes.frames[shoeIndex], xcoord, ycoord, width, height)
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
    const index = this.stageOnStairIndex.findIndex(i => i === this.overStageStairIndex)
    this.ctx.fillText(successStage[index].name, textXcoord, textYcoord)
    this.ctx.globalAlpha = 1
  }

  drawPropsBox() {
    this.ctx.drawImage(this.propsBoxObject.frames[0], 10, 10, this.propsBoxObject.width, this.propsBoxObject.height)
    const shoeXcoord = Math.floor((this.propsBoxObject.width + 25 - this.propsShoes.width) / 2)
    const shoeYcoord = Math.floor((this.propsBoxObject.height - 25) / 2)
    this.ctx.drawImage(
      this.propsShoes.frames[shoeIndex],
      shoeXcoord,
      shoeYcoord,
      this.propsShoes.width,
      this.propsShoes.height
    )
    this.ctx.font = 'bold 13px ProximaNova'
    this.ctx.fillStyle = '#151415'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('550酷帥紅', Math.floor((this.propsBoxObject.width + 25) / 2), this.propsBoxObject.height)
  }
}

let baseIndex = 0
const shoeSwiper = new Swiper('.shoes-swiper', {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  on: {
    activeIndexChange: function (swiper) {
      shoeIndex = swiper.activeIndex + baseIndex
    },
    init: function (swiper) {
      shoeIndex = swiper.activeIndex
    },
    slidesLengthChange: function (swiper) {
      console.log('length change', swiper)
    },
  },
})

const stageSwiper = new Swiper('.stage-swiper', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  on: {
    activeIndexChange: function (swiper) {
      stageIndex = swiper.activeIndex
      if (successStage.length) {
        document.getElementById('stage-name').innerHTML = successStage[swiper.activeIndex].name
        document.getElementById('stage-description').innerHTML = successStage[swiper.activeIndex].description
      }
    },
    init: function (swiper) {
      stageIndex = swiper.activeIndex
    },
  },
})

const shoes550List = ['red', 'brown', 'black']
const shoes1906List = ['red', 'blue', 'gray', 'silver']

document.addEventListener('DOMContentLoaded', () => {
  window['myGame'] = new myGame()
  const preGame = document.getElementById('pre-game')
  const preGameBtn = document.getElementById('pre-game-btn')

  if (preGameBtn && preGame) {
    preGameBtn.addEventListener('click', () => {
      preGame.style.display = 'none'
      window['myGame'].startGame()
    })
  }

  const series550 = document.getElementById('series-550')
  const series1906 = document.getElementById('series-1906')

  const swiperPagination = document.getElementById('swiper-pagination')

  for (let i = 0; i < shoes550List.length; i++) {
    const shoes = document.createElement('div')
    shoes.classList.add('swiper-slide')
    shoes.classList.add('shoes-slide')
    shoes.classList.add(`${shoes550List[i]}-550`)
    shoeSwiper.appendSlide(shoes)
    swiperPagination.classList.add('pagination-550')
  }

  series550.addEventListener('click', e => {
    series550.classList.add('choose')
    series1906.classList.remove('choose')
    shoeSwiper.removeAllSlides()
    for (let i = 0; i < shoes550List.length; i++) {
      const shoes = document.createElement('div')
      shoes.classList.add('swiper-slide')
      shoes.classList.add('shoes-slide')
      shoes.classList.add(`${shoes550List[i]}-550`)
      shoeSwiper.appendSlide(shoes)
      swiperPagination.classList.add('pagination-550')
    }
    baseIndex = 0
  })
  series1906.addEventListener('click', e => {
    baseIndex = 3
    series1906.classList.add('choose')
    series550.classList.remove('choose')
    shoeSwiper.removeAllSlides()
    for (let i = 0; i < shoes1906List.length; i++) {
      const shoes = document.createElement('div')
      shoes.classList.add('swiper-slide')
      shoes.classList.add('shoes-slide')
      shoes.classList.add(`${shoes1906List[i]}-1906`)
      shoeSwiper.appendSlide(shoes)
      swiperPagination.classList.add('pagination-1906')
    }
  })

  const playAgainBtn = document.getElementById('play-again')
  playAgainBtn.addEventListener('click', () => {
    document.getElementById('fail-modal').style.display = 'none'
    document.getElementById('pre-game').style.display = 'flex'
    window['myGame'].resetGame()
  })
})

function showStageList() {
  if (successStage.length) {
    document.getElementById('stage-name').innerHTML = successStage[stageIndex].name
    document.getElementById('stage-description').innerHTML = successStage[stageIndex].description
    document.getElementById('stage-amount').innerHTML = `${successStage.length}`

    for (let i = 0; i < successStage.length; i++) {
      const stage = document.createElement('div')
      stage.classList.add('swiper-slide')
      stage.classList.add('stage-baseImg')
      stage.classList.add(successStage[i].id)
      stageSwiper.appendSlide(stage)
    }
  }
}
