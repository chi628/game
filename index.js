import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs'

/**
 * l -> 長階梯
 * s -> 短階梯
 * w -> 木頭階梯
 * e -> 勝利平台
 */
const stairLevel = ['s', 'l', 'l', 's', 'w', 's', 'l', 'l', 's', 'w', 's', 'l', 'l', 's', 's']
let test = 0
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

const shoesList = [
  {
    id: '550-red',
    name: '摩登紅',
  },
  {
    id: '550-brown',
    name: '復古棕',
  },
  {
    id: '550-black',
    name: '洗鍊黑',
  },
  {
    id: '550-gray',
    name: '混搭灰',
  },
  {
    id: '550-white',
    name: '奶油白',
  },
  {
    id: '1906-red',
    name: '個性紅',
  },
  {
    id: '1906-blue',
    name: '前衛藍',
  },
  {
    id: '1906-gray',
    name: '流線銀',
  },
  {
    id: '1906-silver',
    name: '耀月銀',
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
  imgLoaded = 0

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
    if (frame.complete) {
      this.imgLoaded += 1
    } else {
      frame.onload = () => {
        this.imgLoaded += 1
      }
    }
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
  imgLoaded = 0

  constructor(width, height) {
    this.width = width
    this.height = height
  }

  LoadFrame(filename) {
    let frame = new Image()
    frame.src = filename
    this.frames.push(frame)
    if (frame.complete) {
      this.imgLoaded += 1
    } else {
      frame.onload = () => {
        this.imgLoaded += 1
      }
    }
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
  reqAnim

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
  isRolling = false
  isFallingDown = false
  isCollideStage = false
  isStart = false

  displayStagesIndex = [] // 隨機3個障礙物的 index list
  stageOnStairIndex = [2, 7, 12] // 障礙物在階梯上的 index list
  successStageIndex = [] // 已經成功翻越障礙物所在階梯的 index list
  shoeOnStairIndex = [1, 6, 11] // 鞋子道具在階梯上的 index
  bigCloudList = []
  midCloudList = []
  miniCloudList = []
  stairList = []
  propsShoeList = []

  playerOnStairIndex = -1 // player 站在哪一個階梯上
  preStairIndex = -1 // player 所在的前一個階梯
  overStageStairIndex = -1 // 翻越障礙物所在的階梯 index
  brokenWoodIndex = 0

  camera = 0
  resultAnim = 0

  TREE_INIT_YCOORD
  PLAYER_PADDING
  LOADED_COUNT = 78
  loadCounter = 0
  isLoaded = false

  constructor() {
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

    this.initScreen()
    this.initGame()
  }

  initScreen() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.canvas.width = this.width * this.ratio
    this.canvas.height = this.height * this.ratio

    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
    this.ctx.scale(this.ratio, this.ratio)
  }

  touchStart(e) {
    e.preventDefault()
    window['myGame'].isTouched = true
  }

  touchEnd() {
    window['myGame'].isTouched = false
  }

  startGame() {
    if (!this.isLoaded) {
      document.getElementById('loading').style.display = 'block'
    }
    this.isStart = true
    document.addEventListener('touchstart', this.touchStart, { passive: false })
    document.addEventListener('touchend', this.touchEnd)
  }

  checkImgLoaded() {
    this.loadCounter += this.bigCloudObject.imgLoaded
    this.loadCounter += this.midCloudObject.imgLoaded
    this.loadCounter += this.miniCloudObject.imgLoaded
    this.loadCounter += this.groundObject.imgLoaded
    this.loadCounter += this.treeObject.imgLoaded
    this.loadCounter += this.mountL1Object.imgLoaded
    this.loadCounter += this.mountL2Object.imgLoaded
    this.loadCounter += this.mountL3Object.imgLoaded
    this.loadCounter += this.stairObject.imgLoaded
    this.loadCounter += this.endPointObject.imgLoaded
    this.loadCounter += this.propsBoxObject.imgLoaded
    this.loadCounter += this.propsShoes.imgLoaded
    this.loadCounter += this.stageObject.imgLoaded
    this.loadCounter += this.winBoard.imgLoaded
    this.loadCounter += this.flagObject.imgLoaded
    this.loadCounter += this.playerObject.imgLoaded
    this.loadCounter += this.winPlayerObject.imgLoaded
    this.loadCounter += this.failPlayerObject.imgLoaded
    this.loadCounter += this.brokenWood.imgLoaded
    this.isLoaded = this.loadCounter === this.LOADED_COUNT
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
    this.isRolling = false
    this.isFallingDown = false
    this.isCollideStage = false
    this.isFirstFail = true

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
    this.preStairIndex = -1
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
    this.resultAnim = 0
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
    // 1197 × 537
    this.propsShoes.LoadFrame('Images/bb550vga.webp')
    // 1203 × 537
    this.propsShoes.LoadFrame('Images/bb550vgc.webp')
    // 1191 × 567
    this.propsShoes.LoadFrame('Images/bbw550bh.webp')
    // 1206 × 576
    this.propsShoes.LoadFrame('Images/bb550vgb.webp')
    // 1200 × 624
    this.propsShoes.LoadFrame('Images/bb550bk.webp')
    // 1188 × 549
    this.propsShoes.LoadFrame('Images/m1906rea.webp')
    // 1188 × 579
    this.propsShoes.LoadFrame('Images/m1906reb.webp')
    // 1188 × 558
    this.propsShoes.LoadFrame('Images/m1906reh.webp')
    // 1182 × 555
    this.propsShoes.LoadFrame('Images/m1906ree.webp')

    this.stageObject = new Object(0, 0, 85, 85)
    for (let i = 0; i < stageList.length; i++) {
      this.stageObject.LoadFrame('Images/jump_' + stageList[i].id + '.png')
    }

    this.winBoard = new AnimatorObject(270, 135)
    this.winBoard.LoadFrame('Images/win-board.webp')

    this.flagObject = new AnimatorObject(50, 83)
    for (let i = 0; i < 10; i++) {
      this.flagObject.LoadFrame('Images/flag' + i + '.webp')
    }

    this.playerObject = new AnimatorObject(100, 140)
    this.playerObject.LoadFrame('Images/standby0.webp')
    for (let i = 0; i < 12; i++) {
      this.playerObject.LoadFrame('Images/roll' + i + '.webp')
    }
    for (let i = 0; i < 12; i++) {
      this.playerObject.LoadFrame('Images/jumper' + i + '.webp')
    }

    this.winPlayerObject = new AnimatorObject(100, 140)
    this.winPlayerObject.LoadFrame('Images/win0.webp')
    this.winPlayerObject.LoadFrame('Images/win1.webp')

    this.failPlayerObject = new AnimatorObject(100, 140)
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
        x: startX + 150 * i,
        y: startY - 50 * i,
        width,
        height,
        currFrame: frameIndex,
      })
    }

    // 選擇的鞋
    for (let i = 0; i < this.shoeOnStairIndex.length; i++) {
      this.createPropsShoe({
        width: this.propsShoes.width,
        height: this.propsShoes.height,
      })
    }

    this.winBoard.SetAnimChange(60)
    this.flagObject.SetAnimChange(18)
    this.playerObject.SetAnimChange(70)
    this.winPlayerObject.SetAnimChange(12)
    this.failPlayerObject.SetAnimChange(18)
    this.brokenWood.SetAnimChange(15)

    const playerInitXcoord = Math.floor(this.width * 0.6) - this.playerObject.width
    const playerInitYCoord = this.height * 0.84 - this.playerObject.height

    this.playerObject.x = playerInitXcoord
    this.playerObject.y = playerInitYCoord
    this.PLAYER_PADDING = this.playerObject.width * 0.25

    this.failPlayerObject.x = playerInitXcoord
    this.failPlayerObject.y = playerInitYCoord

    this.TREE_INIT_YCOORD = this.height * 0.84 - this.treeObject.height * 0.7
  }

  updateObject() {
    this.stairList = []
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
      })
    }
    this.TREE_INIT_YCOORD = this.height * 0.84 - this.treeObject.height * 0.7
  }

  createStair({ x, y, width, height, currFrame }) {
    let special = new SpecialObject()
    special.x = x
    special.y = y
    special.width = width
    special.height = height
    special.currFrame = currFrame
    special.alive = true
    special.state = 0 // 0: 正常階梯, 1: 斷裂階梯
    this.stairList.push(special)
  }

  createPropsShoe({ width, height }) {
    let special = new SpecialObject()
    special.x = 0
    special.y = 0
    special.width = width
    special.height = height
    special.currFrame = shoeIndex
    special.alive = true
    this.propsShoeList.push(special)
  }

  async initGame() {
    this.loadImages()
    this.resetGame()
    this.createRandomStages()
    this.initObject()
    window.requestAnimationFrame(this.draw.bind(this))
  }

  lastCalledTime = new Date()
  fpscounter = 0
  currentfps = 0
  countFPS() {
    this.fpscounter += 1
    let delta = (new Date().getTime() - this.lastCalledTime.getTime()) / 1000
    if (delta > 1) {
      this.currentfps = this.fpscounter
      this.fpscounter = 0
      this.lastCalledTime = new Date()
    }
  }

  initByFPS(number) {
    if (this.currentfps > 0) {
      return (number / 16) * (1000 / this.currentfps)
    }
    return number
  }

  updateCamera() {
    if (
      this.isMovingX &&
      this.isJumping &&
      !this.isDying &&
      !this.isWin &&
      !this.isFallingDown &&
      !this.isCollideStage
    ) {
      this.camera += this.initByFPS(1)
      this.groundObject.camera.y += this.initByFPS(1.6)

      if (this.camera <= 25) {
        this.treeObject.camera.x += this.initByFPS(0.4)
        this.treeObject.camera.y += this.initByFPS(0.4)
      } else if (this.camera < 50) {
        this.treeObject.camera.x += this.initByFPS(1.25)
        this.treeObject.camera.y += this.initByFPS(0.8)
      } else {
        this.treeObject.camera.x += this.initByFPS(2)
        this.treeObject.camera.y += this.initByFPS(1.25)
      }

      switch (Math.floor(this.camera / 24)) {
        case 0:
          this.mountL1Object.camera.x += this.initByFPS(0.4)
          this.mountL1Object.camera.y += this.initByFPS(0.625)
          this.mountL2Object.camera.x += this.initByFPS(0.4)
          this.mountL2Object.camera.y += this.initByFPS(0.2)
          this.mountL3Object.camera.x += this.initByFPS(0.125)
          this.mountL3Object.camera.y -= this.initByFPS(0.125)
          break
        case 1:
          this.mountL1Object.camera.x += this.initByFPS(1.25)
          this.mountL1Object.camera.y += this.initByFPS(0.4)
          this.mountL2Object.camera.x += this.initByFPS(1.25)
          this.mountL2Object.camera.y += this.initByFPS(0.2)
          this.mountL3Object.camera.x += this.initByFPS(1.25)
          this.mountL3Object.camera.y -= this.initByFPS(0.25)
          break
        case 2:
          this.mountL1Object.camera.x += this.initByFPS(1.25)
          this.mountL1Object.camera.y += this.initByFPS(0.4)
          this.mountL2Object.camera.x += this.initByFPS(2)
          this.mountL2Object.camera.y += this.initByFPS(0.4)
          this.mountL3Object.camera.x += this.initByFPS(2)
          this.mountL3Object.camera.y += this.initByFPS(0)
          break
        case 3:
          this.mountL1Object.camera.x += this.initByFPS(4)
          this.mountL1Object.camera.y += this.initByFPS(2)
          this.mountL2Object.camera.x += this.initByFPS(3)
          this.mountL2Object.camera.y += this.initByFPS(0.8)
          this.mountL3Object.camera.x += this.initByFPS(2)
          this.mountL3Object.camera.y += this.initByFPS(0)
          break
        case 4:
          this.mountL1Object.camera.x += this.initByFPS(4)
          this.mountL1Object.camera.y += this.initByFPS(0.8)
          this.mountL2Object.camera.x += this.initByFPS(3)
          this.mountL2Object.camera.y += this.initByFPS(1.25)
          this.mountL3Object.camera.x += this.initByFPS(2)
          this.mountL3Object.camera.y += this.initByFPS(0.8)
          break
        case 5:
          this.mountL1Object.camera.x += this.initByFPS(3)
          this.mountL1Object.camera.y += this.initByFPS(1.25)
          this.mountL2Object.camera.x += this.initByFPS(3)
          this.mountL2Object.camera.y += this.initByFPS(1.67)
          this.mountL3Object.camera.x += this.initByFPS(4.2)
          this.mountL3Object.camera.y += this.initByFPS(1.67)
          break
        case 6:
          this.mountL1Object.camera.x += this.initByFPS(3)
          this.mountL1Object.camera.y += this.initByFPS(0.4)
          this.mountL2Object.camera.x += this.initByFPS(0)
          this.mountL2Object.camera.y += this.initByFPS(0)
          this.mountL3Object.camera.x += this.initByFPS(4)
          this.mountL3Object.camera.y += this.initByFPS(0)
          break
        case 7:
          this.mountL1Object.camera.x += this.initByFPS(3.75)
          this.mountL1Object.camera.y += this.initByFPS(1.25)
          this.mountL2Object.camera.x += this.initByFPS(1.5)
          this.mountL2Object.camera.y += this.initByFPS(0)
          this.mountL3Object.camera.x += this.initByFPS(6.25)
          this.mountL3Object.camera.y += this.initByFPS(0)
          break
        case 8:
          this.mountL1Object.camera.x += this.initByFPS(0.4)
          this.mountL1Object.camera.y += this.initByFPS(2)
          this.mountL2Object.camera.x += this.initByFPS(6.25)
          this.mountL2Object.camera.y -= this.initByFPS(2)
          this.mountL3Object.camera.x += this.initByFPS(2)
          this.mountL3Object.camera.y += this.initByFPS(0.8)
          break
        default:
          this.mountL1Object.camera.x += this.initByFPS(1)
          this.mountL1Object.camera.y += this.initByFPS(0.1)
          this.mountL2Object.camera.x += this.initByFPS(1)
          this.mountL2Object.camera.y += this.initByFPS(0.2)
          this.mountL3Object.camera.x += this.initByFPS(1)
          this.mountL3Object.camera.y += this.initByFPS(0.1)
          break
      }
    }
  }

  clearScreen() {
    this.ctx.fillStyle = MAIN_BACKGROUND_COLOR
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  draw() {
    if (!this.isLoaded) {
      this.loadCounter = 0
      this.checkImgLoaded()
    } else {
      if (this.isStart) {
        document.getElementById('loading').style.display = 'none'
      }
    }
    this.countFPS()
    this.clearScreen()

    if (this.isGameOver) {
      window.cancelAnimationFrame(this.reqAnim)
      document.removeEventListener('touchstart', this.touchStart, { passive: false })
      document.removeEventListener('touchend', this.touchEnd)

      showModal()
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
    this.stairObject.xSpeed = this.initByFPS(7)
    this.stairObject.ySpeed = this.initByFPS(2)
    if (this.isStayOnWood) {
      if (this.stairList[this.brokenWoodIndex].alive) {
        this.stairList[this.brokenWoodIndex].state = 1
        this.stairList[this.brokenWoodIndex].alive = false
        this.playerObject.anim = 3
        this.isPlayingBrokenWood = true
        this.isJumpOnShoe = false
        this.playerObject.SetAnimChange(70)
      }
    }
    if (this.isPlayingBrokenWood) {
      this.brokenWood.anim += this.initByFPS(1)
      if (this.brokenWood.anim >= this.brokenWood.anim_change) {
        this.brokenWood.anim = 0
        this.isPlayingBrokenWood = false
        this.isStayOnWood = false
      } else {
        this.drawBrokenWood()
      }
    }
    this.updateStairs()
    this.drawStair()

    this.drawStages()
    this.checkStageStatus()
    this.drawShoes()

    this.updatePlayer()

    this.drawPropsBox()
    this.updateCamera()

    this.isJumping = this.playerObject.anim > 2

    if (this.isTouched) {
      // 最後一個階梯的 x (階梯左側)
      this.isMovingX = this.stairList[this.stairList.length - 1].x > 35
    } else {
      this.isMovingX = false
    }

    this.flagObject.anim += this.initByFPS(1)
    if (this.flagObject.anim >= this.flagObject.anim_change) {
      this.flagObject.anim = 0
    }

    if (this.currentfps > 25) {
      this.playerObject.anim += this.initByFPS(1)
    }
    if (this.playerObject.anim >= this.playerObject.anim_change) {
      this.playerObject.anim = 0
    }

    if (this.isCollideStage) {
      if (!this.isDying) {
        this.failPlayerObject.anim += this.initByFPS(1)
      }
      if (this.failPlayerObject.anim >= this.failPlayerObject.anim_change) {
        this.failPlayerObject.anim = 4
        this.isDying = true
      }
    }

    this.winPlayerObject.anim += this.initByFPS(1)
    if (this.winPlayerObject.anim >= this.winPlayerObject.anim_change) {
      this.winPlayerObject.anim = 0
    }

    if (this.isOverStage) {
      this.winBoard.anim += this.initByFPS(1)
      if (Math.round(this.winBoard.anim) >= this.winBoard.anim_change || this.ctxAlpha < 0) {
        this.winBoard.anim = 0
        this.ctxAlpha = 0.5
        this.isOverStage = false
      }
      if (this.winBoard.anim <= 10) {
        this.ctxAlpha += this.initByFPS(0.05)
      } else if (this.winBoard.anim > 50) {
        this.ctxAlpha -= this.initByFPS(0.1)
      }
    }

    if (this.isWin || this.isDying) {
      this.resultAnim += this.initByFPS(1)
      this.isGameOver = this.resultAnim >= Math.floor(this.currentfps / 2)
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
    if (
      this.isMovingX &&
      this.isJumping &&
      !this.isDying &&
      !this.isWin &&
      !this.isCollideStage &&
      !this.isFallingDown
    ) {
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
    const yCoord = this.stairList[this.brokenWoodIndex].y + this.brokenWood.anim * 5

    let currFrame
    if (Math.floor(this.brokenWood.anim / 4) < 2) {
      currFrame = Math.floor(this.brokenWood.anim / 4)
    } else {
      currFrame = 1
    }

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

  failAnimPlaytimes = 0
  isTimeToDie = false
  updatePlayer() {
    if (this.isCollideStage) {
      this.isFirstFail = false
      
      if (this.failPlayerObject.y + this.failPlayerObject.height < this.stairList[this.preStairIndex].y) {
        this.failPlayerObject.y = this.stairList[this.preStairIndex].y - this.failPlayerObject.height + 10
      }
      this.failPlayerObject.currFrame = Math.floor(this.failPlayerObject.anim / 3)

      this.drawFailPlayer()
    } else if (this.isFallingDown) {
      this.playerObject.currFrame += 1
      if (this.playerObject.currFrame >= 12 || this.playerObject.currFrame === 0) {
        this.playerObject.currFrame = 1
      }
      this.playerObject.y += this.initByFPS(20)

      if (this.playerObject.y > this.height - 15) {
        this.isDying = true
      }
      this.drawPlayer()
    } else if (this.isWin) {
      this.winPlayerObject.currFrame = Math.floor(this.winPlayerObject.anim / 6)
      this.winPlayerObject.x = this.playerObject.x
      this.winPlayerObject.y = this.endPointObject.y + 120 - this.winPlayerObject.height + 2

      this.drawWinPlayer()
    } else {
      if (this.playerObject.anim <= 2) {
        this.playerObject.currFrame = 0

        if (this.playerOnStairIndex > -1) {
          this.playerObject.y = this.stairList[this.playerOnStairIndex].y - this.playerObject.height + 2
        } else if (this.preStairIndex > -1) {
          this.playerObject.y = this.stairList[this.preStairIndex].y - this.playerObject.height + 2
        } else if (this.isStartGame) {
          this.playerObject.y = this.stairList[0].y - this.playerObject.height
        } else {
          this.playerObject.y = this.height * 0.84 - this.playerObject.height + 2
        }
      } else {
        // jump
        const maxFrame = this.isJumpOnShoe ? 24 : 12
        if (this.playerObject.currFrame >= maxFrame) {
          this.playerObject.currFrame = this.isJumpOnShoe ? 13 : 1
        } else {
          this.playerObject.currFrame += 1
        }

        let distance = this.height * 0.4
        if (this.isJumpOnShoe) {
          distance = this.height * 0.4 + this.playerObject.height - 25
        }
        const halfAnimChange = Math.floor((this.playerObject.anim_change - 2) / 2)
        if (this.playerObject.anim - 2 < halfAnimChange) {
          this.playerObject.y -= this.initByFPS(Math.floor(distance) / halfAnimChange)
        } else {
          this.playerObject.y += this.initByFPS(Math.floor(distance) / halfAnimChange)
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

  isFirstFail = true
  isStartGame = false
  checkPlayerStair() {
    this.isStartGame = this.playerObject.x + this.playerObject.width - this.PLAYER_PADDING >= this.stairList[0].x + 10

    this.playerOnStairIndex = this.stairList.findIndex((stair, i) => {
      if (
        (stair.x < this.playerObject.x + this.playerObject.width - this.playerObject.width * 0.35 &&
          stair.x + stair.width >= this.playerObject.x + this.playerObject.width - this.PLAYER_PADDING) ||
        (stair.x <= this.playerObject.x + this.PLAYER_PADDING &&
          stair.x + stair.width > this.playerObject.x + this.playerObject.width * 0.35)
      ) {
        // 修正跳到下一階時閃動問題
        if (this.playerObject.y + this.playerObject.height - 3 > stair.y) {
          this.playerObject.anim = 0
        }

        // 現在所在的 x 範圍在有鞋子
        if (this.shoeOnStairIndex.includes(i)) {
          if (
            this.playerObject.y + this.playerObject.height - 3 >= stair.y - this.propsShoes.height &&
            this.playerObject.y + this.playerObject.height - 3 <= stair.y
          ) {
            const index = this.shoeOnStairIndex.findIndex(o => o === i)

            if (index > -1) {
              if (this.propsShoeList[index].alive) {
                // 一碰到鞋子，就跳躍
                this.playerObject.anim = 3
                this.playerObject.currFrame = 12
                this.playerObject.SetAnimChange(120)
                this.isJumpOnShoe = true
                this.propsShoeList[index].alive = false
              } else if (this.isJumpOnShoe && this.playerObject.anim >= 70) {
                // 完成吃掉鞋子動畫後，還在原階梯上，恢復原本動畫
                this.isJumpOnShoe = false
                this.playerObject.SetAnimChange(70)
              }
            }
          }
        }
        return true
      }
    })

    this.isRolling = this.playerObject.anim < this.playerObject.anim_change - 5
    if (this.playerOnStairIndex > -1) {
      this.preStairIndex = this.playerOnStairIndex
      // 如果降落的階梯不含有鞋子，更改動畫
      if (!this.shoeOnStairIndex.includes(this.playerOnStairIndex) && !this.isJumping) {
        this.isJumpOnShoe = false
        this.playerObject.SetAnimChange(70)
      }
      // 檢查是否落在木頭階梯上
      if (
        stairLevel[this.playerOnStairIndex] === 'w' &&
        this.playerObject.y + this.playerObject.height + 3 >= this.stairList[this.playerOnStairIndex].y
      ) {
        // 還在正常階梯時
        if (this.stairList[this.playerOnStairIndex].state === 0) {
          this.playerObject.anim = 0
          this.isStayOnWood = true
          this.brokenWoodIndex = this.playerOnStairIndex
        } else {
          // 階梯已斷裂，且沒在播動畫
          this.isFallingDown = !this.isPlayingBrokenWood
        }
      }
    }

    if (this.playerOnStairIndex === -1 && this.isStartGame) {
      if (
        Math.floor(this.endPointObject.x + 110) <=
        this.playerObject.x + this.playerObject.width - this.PLAYER_PADDING
      ) {
        if (
          this.playerObject.y + this.playerObject.height + 3 >= this.endPointObject.y + 115 ||
          this.playerObject.anim === 0
        ) {
          this.isWin = true
        }
      } else {
        const index = this.preStairIndex === -1 ? 0 : this.preStairIndex
        if (
          this.playerObject.anim > this.playerObject.anim_change - 5 &&
          this.playerObject.y + this.playerObject.height < Math.round(this.stairList[index].y - 3)
        ) {
          this.isFallingDown = true
        }
      }
    }
    if (
      this.stageOnStairIndex.includes(this.playerOnStairIndex) &&
      (Math.floor(this.playerObject.anim) > this.playerObject.anim_change - 5 || this.playerObject.anim < 3)
    ) {
      if (this.isFirstFail) {
        this.failPlayerObject.y = this.playerObject.y + Math.floor(this.failPlayerObject.height / 3)
      }
      this.isCollideStage = true
    }
    document.getElementById('pre').innerText = this.preStairIndex
    if (
      this.preStairIndex > -1 &&
      this.stageOnStairIndex.includes(this.preStairIndex) &&
      !this.stageOnStairIndex.includes(this.playerOnStairIndex)
    ) {
      test++
      console.log('test', test, this.preStairIndex, this.playerOnStairIndex)
      if (!this.successStageIndex.includes(this.preStairIndex)) {
        this.successStageIndex.push(this.preStairIndex)
        this.isOverStage = true
        this.overStageStairIndex = this.preStairIndex
        const index = this.stageOnStairIndex.findIndex(o => o === this.preStairIndex)
        if (index > -1) {
          successStage.push(stageList[this.displayStagesIndex[index]])
        }
      }
    }
    document.getElementById('test').innerText = test
    document.getElementById('cur').innerText = this.playerOnStairIndex
  }

  checkStageStatus() {
    if (this.isOverStage) {
      this.winBoard.x = Math.floor((this.width - this.winBoard.width) / 2)
      this.winBoard.y = this.height * 0.16
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
      let yCoord = this.stairList[this.stageOnStairIndex[i]].y - this.stageObject.height + 3

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
    if (this.ctxAlpha < 0) {
      return
    }
    this.ctx.globalAlpha = this.ctxAlpha

    this.ctx.drawImage(
      this.winBoard.frames[0],
      this.winBoard.x,
      this.winBoard.y,
      this.winBoard.width,
      this.winBoard.height
    )

    this.ctx.font = 'bold 22px NotoSansCJKTC'
    this.ctx.fillStyle = '#000'
    this.ctx.textAlign = 'center'

    const textXcoord = this.winBoard.x + Math.floor((this.winBoard.width - 15) / 2)
    const textYcoord = this.winBoard.y + 100
    const index = this.stageOnStairIndex.findIndex(i => i === this.overStageStairIndex)

    const stageIndex = this.displayStagesIndex[index]
    const stageXcoord = this.winBoard.x + 175
    const stageYcoord = this.winBoard.y + 15
    this.ctx.drawImage(this.stageObject.frames[stageIndex], stageXcoord, stageYcoord, 50, 50)

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
    let prefix = shoeIndex < 5 ? '550' : '1906R'
    const shoesName = `${prefix}${shoesList[shoeIndex].name}`
    this.ctx.fillText(shoesName, Math.floor((this.propsBoxObject.width + 25) / 2), this.propsBoxObject.height)
  }
}

var vConsole = new window.VConsole()
let baseIndex = 0
const shoeSwiper = new Swiper('.shoes-swiper', {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  on: {
    activeIndexChange: function (swiper) {
      shoeIndex = swiper.activeIndex + baseIndex

      if (shoeIndex < 5) {
        const shoesColor550 = document.getElementById('550-shoes-color')
        if (shoesColor550) {
          shoesColor550.innerHTML = shoesList[shoeIndex].name
        }
        if (swiper.slides.length === 5) {
          document.getElementById('swiper-pagination').childNodes[swiper.previousIndex].style.borderColor = '#151415'
          document.getElementById('swiper-pagination').childNodes[swiper.activeIndex].style.borderColor = '#fff'
        }
      } else {
        const shoesColor1906 = document.getElementById('1906-shoes-color')
        if (shoesColor1906) {
          shoesColor1906.innerHTML = shoesList[shoeIndex].name
        }
        if (swiper.slides.length === 4) {
          document.getElementById('swiper-pagination').childNodes[swiper.previousIndex].style.borderColor = '#151415'
          document.getElementById('swiper-pagination').childNodes[swiper.activeIndex].style.borderColor = '#fff'
        }
      }
    },
    init: function (swiper) {
      shoeIndex = swiper.activeIndex
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

window.addEventListener('resize', () => {
  if (window['myGame']) {
    window['myGame'].initScreen()
    window['myGame'].updateObject()
  }
})

let preGame
let preGameBtn
let series550
let series1906
let shoesColor550
let swiperPagination
let successModal
let failModal

const shoes550List = ['red', 'brown', 'black', 'gray', 'white']
const shoes1906List = ['red', 'blue', 'gray', 'silver']

document.addEventListener('DOMContentLoaded', () => {
  window['myGame'] = new myGame()

  preGame = document.getElementById('pre-game')
  preGameBtn = document.getElementById('pre-game-btn')

  series550 = document.getElementById('series-550')
  series1906 = document.getElementById('series-1906')
  swiperPagination = document.getElementById('swiper-pagination')
  successModal = document.getElementById('success-modal')
  failModal = document.getElementById('fail-modal')

  startGame()

  append550Shoes()

  shoesColor550 = document.getElementById('550-shoes-color')

  if (shoesColor550) {
    shoesColor550.innerHTML = shoesList[shoeIndex].name
  }

  swiperPagination.childNodes[shoeIndex].style.borderColor = '#fff'

  if (series550 && series1906) {
    series550.addEventListener('click', e => {
      baseIndex = 0
      series550.classList.add('choose')
      series1906.classList.remove('choose')
      swiperPagination.classList.remove('pagination-1906')
      shoeSwiper.removeAllSlides()

      append550Shoes()
      swiperPagination.childNodes[0].style.borderColor = '#fff'
    })

    series1906.addEventListener('click', e => {
      baseIndex = 5
      shoeIndex = baseIndex
      series550.classList.remove('choose')
      series1906.classList.add('choose')
      swiperPagination.classList.remove('pagination-550')
      shoeSwiper.removeAllSlides()

      append1906Shoes()
      swiperPagination.childNodes[0].style.borderColor = '#fff'
    })
  }

  const playAgainBtn = document.getElementById('play-again')

  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      failModal.style.display = 'none'
      preGame.style.display = 'flex'
      window['myGame'].initGame()
    })
  }
})

function startGame() {
  if (preGameBtn && preGame) {
    preGameBtn.addEventListener('click', () => {
      preGame.style.display = 'none'
      window['myGame'].startGame()
    })
  }
}

function append550Shoes() {
  for (let i = 0; i < shoes550List.length; i++) {
    const shoes = document.createElement('div')
    shoes.classList.add('swiper-slide')
    shoes.classList.add('shoes-slide')
    shoes.classList.add(`${shoes550List[i]}-550`)
    shoeSwiper.appendSlide(shoes)
  }
  if (swiperPagination) {
    swiperPagination.classList.add('pagination-550')
  }
}

function append1906Shoes() {
  for (let i = 0; i < shoes1906List.length; i++) {
    const shoes = document.createElement('div')
    shoes.classList.add('swiper-slide')
    shoes.classList.add('shoes-slide')
    shoes.classList.add(`${shoes1906List[i]}-1906`)
    shoeSwiper.appendSlide(shoes)
  }

  if (swiperPagination) {
    swiperPagination.classList.add('pagination-1906')
  }
}

function showStageList() {
  if (successStage.length) {
    document.getElementById('stage-name').innerHTML = successStage[stageIndex].name
    document.getElementById('stage-description').innerHTML = successStage[stageIndex].description
    document.getElementById('stage-amount').innerHTML = `${successStage.length}`

    for (let i = 0; i < successStage.length; i++) {
      const stage = document.createElement('div')
      stage.classList.add('swiper-slide')
      stage.classList.add('stage-baseImg')
      if (successStage[i].id === 'boss') {
        stage.classList.add('boss-site')
      } else {
        stage.classList.add(successStage[i].id)
      }
      stageSwiper.appendSlide(stage)
    }
  }
}

function showModal() {
  if (successStage.length > 0) {
    successModal.style.display = 'flex'
    showStageList()
  } else {
    failModal.style.display = 'flex'
  }
}
