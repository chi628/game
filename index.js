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

class myGame {
  ctx
  width
  height
  isMovingX = false
  isGameOver = false
  isDying = false

  test = 0
  test1 = [10, 30, 30, 100, 50, 70, 70, 90, 10]
  test2 = [15, 10, 10, 50, 20, 30, 10, 30, 50]
  mountL2XSpace = [10, 30, 50, 70, 70, 70, 0, 0, 150]
  mountL2YSapce = [5, 5, 10, 20, 30, 40, 0, 0, -60]
  mountL3XSpace = [3, 30, 50, 50, 50, 100, 80, 150, 50]
  mountL3YSapce = [-3, -6, 0, 0, 20, 40, 0, 0, 20]
  treeXSapce = [10, 30, 50, 50, 50, 50]
  treeYSapce = [10, 20, 30, 30, 30, 50]

  flagIndex = 0

  stageIndexes = []

  stageOnStair = [2, 7, 12]
  shoeOnStair = [1, 6, 11]

  fpsTestCount = 0

  playerIndex = 0

  isJumping = false

  midStairIndex = -1

  isStartGame = false

  playerGravity = 0

  bigCloudList = []
  midCloudList = []
  miniCloudList = []
  stairList = []
  stageDetailList = []
  playerAnimatorCounter = 0
  stairInviewIndex = -1
  failAnimator = 0
  overStage = false
  playBrokenWood = false
  brokenWoodIndex = 0
  broken_wood_animator = 0
  isStayOnWood = false
  isOnEndPoint = false
  isTouched = false
  win_player_animator = 0
  winPlayerIndex = 0
  ctxAlpha = 0.5
  win_board_animator = 0

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
    this.winBoard = new Object(0, 0, 180, 90)
    this.winBoard.LoadFrame('Images/win-board.webp')
    this.winBoard.SetSpeed({ x: 0, y: 1 })

    this.stageObject = new Object(0, 0, 50, 50)
    for (let i = 0; i < stageList.length; i++) {
      this.stageObject.LoadFrame('Images/jump_' + stageList[i].id + '.png')
    }

    this.flagObject = new Object(0, 0, 50, 83)
    for (let i = 0; i < 10; i++) {
      this.flagObject.LoadFrame('Images/flag' + i + '.webp')
    }

    this.playerObject = new Object(0, 0, 70, 100)
    this.playerObject.LoadFrame('Images/standby0.webp')
    for (let i = 0; i < 12; i++) {
      this.playerObject.LoadFrame('Images/roll' + i + '.webp')
    }

    this.winPlayerObject = new Object(0, 0, 70, 100)
    this.winPlayerObject.LoadFrame('Images/win0.webp')
    this.winPlayerObject.LoadFrame('Images/win1.webp')

    this.failPlayerObject = new Object(0, 0, 70, 100)
    for (let i = 0; i < 6; i++) {
      this.failPlayerObject.LoadFrame('Images/fail' + i + '.webp')
    }

    this.brokenWood = new Object(0, 0, 85, 100)
    this.brokenWood.LoadFrame('Images/platformsW0.webp')
    this.brokenWood.LoadFrame('Images/platformsW1.webp')

    // 470*336
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

      this.stairList.push({
        x: startX + 120 * i,
        y: startY - 50 * i,
        width,
        height,
        currFrame: frameIndex,
        alive: true,
      })
    }
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

  // initGame() {
  //   this.ctx.fillStyle = '#f3bbac'
  //   this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

  //   this.groundOne = {
  //     x: 0,
  //     y: this.height - this.height * 0.1,
  //     width: this.width,
  //     height: this.height * 0.1,
  //   }

  //   this.groundTwo = {
  //     x: 0,
  //     y: this.height - this.height * 0.1 - this.height * 0.06,
  //     width: this.width,
  //     height: this.height * 0.07,
  //   }

  //   this.groundThree = {
  //     x: 0,
  //     y: this.height - this.height * 0.1 - this.height * 0.06 - this.height * 0.05,
  //     width: this.width,
  //     height: this.height * 0.1,
  //   }

  //   // 230 * 111
  //   this.bigCloud = new Object(0, 0, 230, 111)
  //   this.bigCloud.LoadFrame('Images/cloud_L.webp')
  //   this.midCloud = new Object(0, 0, 135, 72)
  //   this.midCloud.LoadFrame('Images/cloud_M.webp')
  //   this.clouds = new Object(0, 0, 95, 60)
  //   this.clouds.LoadFrame('Images/cloud_S.webp')

  //   this.grounds = new Object(0, 0, 0, 0)
  //   this.grounds.LoadFrame('Images/ground.webp')
  //   this.grounds.LoadFrame('Images/ground_L2.webp')

  //   this.groundL1 = new Object(0, 0, 0, 0)
  //   this.groundL1.LoadFrame('Images/ground.webp')
  //   this.groundL2 = new Object(0, 0, 0, 0)
  //   this.groundL2.LoadFrame('Images/ground_L2.webp')

  //   this.tree = new Object(0, 0, 1070, 80)
  //   this.tree.LoadFrame('Images/tree.webp')

  //   this.mount = new Object(0, 0, 0, 0)
  //   this.mount.LoadFrame('Images/mt_L1.webp')
  //   this.mount.LoadFrame('Images/mt_L2.webp')
  //   this.mount.LoadFrame('Images/mt_L3.webp')

  //   this.mountL1 = new Object(0, 0, 885, 480)
  //   this.mountL1.LoadFrame('Images/mt_L1.webp')

  //   this.mountL2 = new Object(0, 0, 1245, 200)
  //   this.mountL2.LoadFrame('Images/mt_L2.webp')

  //   this.mountL3 = new Object(0, 0, 1104, 210)
  //   this.mountL3.LoadFrame('Images/mt_L3.webp')

  //   this.stair = new Object(0, 0, 0, 0)
  //   this.stair.LoadFrame('Images/platform_N.webp')
  //   this.stair.LoadFrame('Images/platform_S.webp')
  //   this.stair.LoadFrame('Images/platform_W.webp')

  //   this.endPoint = new Object(0, 0, 300, 370)
  //   this.endPoint.LoadFrame('Images/Endpoint.webp')

  //   // 障礙物 42*80
  //   this.stages = new Object(0, 0, 60, 60)
  //   for (let i = 0; i < stageList.length; i++) {
  //     this.stages.LoadFrame('Images/jump_' + stageList[i].id + '.png')
  //   }
  //   this.flag = new Object(0, 0, 50, 83)
  //   for (let i = 0; i < 10; i++) {
  //     this.flag.LoadFrame('Images/flag' + i + '.webp')
  //   }

  //   this.player = new Object(0, 0, 70, 100)
  //   for (let i = 0; i < 12; i++) {
  //     this.player.LoadFrame('Images/standby' + i + '.webp')
  //   }

  //   this.rollPlayer = new Object(0, 0, 70, 100)
  //   for (let i = 0; i < 12; i++) {
  //     this.rollPlayer.LoadFrame('Images/roll' + i + '.webp')
  //   }

  //   const maxBigClouds = Math.ceil(this.width / 230) + 1
  //   const bigClouds_StartXCoord = -60
  //   for (let i = 0; i < maxBigClouds; i++) {
  //     this.bigClouds.push({
  //       x: 350 * i + bigClouds_StartXCoord,
  //       y: i % 2 === 0 ? 10 : 40,
  //       width: this.bigCloud.width,
  //       height: this.bigCloud.height,
  //       alive: true,
  //     })
  //   }

  //   const maxMidClouds = Math.ceil(this.width / 140) + 1
  //   const midClouds_StartXCoord = -105
  //   for (let i = 0; i < maxMidClouds; i++) {
  //     this.midClouds.push({
  //       x: 200 * i + midClouds_StartXCoord,
  //       y: i % 2 === 0 ? 220 : 140,
  //       width: this.midCloud.width,
  //       height: this.midCloud.height,
  //       alive: true,
  //     })
  //   }

  //   const maxClouds = Math.ceil(this.width / 95) + 1
  //   const clouds_StartXCoord = 70
  //   for (let i = 0; i < maxClouds; i++) {
  //     this.smallClouds.push({
  //       x: 220 * i + clouds_StartXCoord,
  //       y: i % 2 === 0 ? 300 : 330,
  //       width: this.clouds.width,
  //       height: this.clouds.height,
  //       alive: true,
  //     })
  //   }

  //   for (let i = 0; i < stairLevel.length; i++) {
  //     const startX = Math.floor(this.width * 0.6)
  //     const startY = this.height * 0.75

  //     this.stairObject.push({
  //       x: startX + 120 * i,
  //       y: startY - 50 * i,
  //       width,
  //       height,
  //       currFrame: index,
  //     })
  //   }

  //   while (this.stageIndexes.length < 3) {
  //     const randomNum = Math.floor(Math.random() * 9)
  //     if (this.stageIndexes.indexOf(randomNum) === -1) {
  //       this.stageIndexes.push(randomNum)
  //     }
  //   }

  //   console.log('index', this.stageIndexes)

  //   // var randomNumbers = generateRandomNumbers()

  //   window.requestAnimationFrame(this.draw.bind(this))
  // }

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
    if (this.isMovingX && this.isJumping && !this.isDying) {
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
    this.countFPS()

    // updateInput
    this.gameMain()
    this.updateCamera()

    this.flagIndex += 1
    this.flagIndex = Math.floor(this.fpscounter / 2) % 9

    this.playerAnimatorCounter += 1

    if (this.isTouched) {
      this.isMovingX = this.stairList[this.stairList.length - 1].x > 35
    } else {
      this.isMovingX = false
    }

    if (!this.isStartGame) {
      this.isStartGame = this.stairList[0].x < this.playerObject.x + this.playerObject.width - 20
    }

    if (this.playBrokenWood) {
      this.broken_wood_animator++
      if (this.broken_wood_animator < 4) {
        this.brokenWoodIndex = Math.floor(this.broken_wood_animator / 2)
        console.log('index', this.brokenWoodIndex)
      } else {
        this.playBrokenWood = false
        this.brokenWood.alive = false
        // this.broken_wood_animator = 0
      }
    } else {
      this.brokenWood.alive = true
    }

    if (this.isDying) {
      this.failAnimator += 0.35
      const FAIL_ANIM_CHANGE = 6

      if (this.failAnimator >= FAIL_ANIM_CHANGE) {
        this.failAnimator = 0
      }
    }

    if (this.isOnEndPoint) {
      this.win_player_animator += 1
      this.winPlayerIndex = Math.floor(this.win_player_animator / 6)
      console.log('playerind', this.winPlayerIndex)
      const win_player_counter = 11
      if (this.win_player_animator === win_player_counter) {
        this.win_player_animator = 0
      }
    }
    if (this.win_board_animator > 0 && !this.overStage) {
      this.win_board_animator = 0
    }

    // this.playerIndex = Math.floor(this.fpscounter / 2) % 12
    // this.playerIndex = this.playerIndex % 12

    // this.fpsTestCount += 1

    // if (this.playerGravity <= 90) {
    //   this.playerGravity += 2
    // } else if (this.playerGravity > -1) {
    //   this.playerGravity -= 2
    // }
    // this.playerGravity = 90
    // this.stairCamera.x = 1800
    // this.stairCamera.y = 720

    // if (this.isMovingX && this.isJumping && !this.isDying) {
    //   this.camera.x += 0.4
    //   this.camera.y += 1.6
    //   this.isStartGame = true

    //   this.test += 1

    //   if (this.endPoint.x >= 20) {
    //     this.stairCamera.x += 5
    //     this.stairCamera.y += 2
    //   }

    //   // tree camera
    //   if (Math.floor(this.test / 24) < 6) {
    //     this.treeCamera.x += this.treeXSapce[Math.floor(this.test / 24)] / 24
    //     this.treeCamera.y += this.treeYSapce[Math.floor(this.test / 24)] / 24
    //   }

    //   // mount camera
    //   if (Math.floor(this.test / 24) < this.test1.length) {
    //     this.mountCamera.x += this.test1[Math.floor(this.test / 24)] / 24
    //     this.mountCamera.y += t/,,,,,,,,,,,,k  m m,mmhis.test2[Math.floor(this.test / 24)] / 24
    //     this.mount2Camera.x += this.mountL2XSpace[Math.floor(this.test / 24)] / 24
    //     this.mount2Camera.y += this.mountL2YSapce[Math.floor(this.test / 24)] / 24
    //     this.mount3Camera.x += this.mountL3XSpace[Math.floor(this.test / 24)] / 24
    //     this.mount3Camera.y += this.mountL3YSapce[Math.floor(this.test / 24)] / 24
    //   }
    // }

    window.requestAnimationFrame(this.draw.bind(this))
  }

  gameMain() {
    this.findStairIndex()
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
    this.drawStair()
    this.drawStages()
    this.drawShoes()

    if (this.overStage) {
      this.drawWinBoard()
    }
    if (this.isDying) {
      this.drawFailPlayer()
    } else if (this.isOnEndPoint) {
      this.drawWinPlayer()
    } else {
      this.drawPlayer()
    }
    if (this.playBrokenWood) {
      this.drawBrokenWood()
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
    // mountL3 (24格) x:-5, y:0
    // mountL3 (24格) x:-45, y: 0
    // mountL3 (24格) x:-50, y: 0
    // mountL3 (24格) x:-55, y: -10
    // mountL3 (24格) x:-60, y: -2
    // mountL3 (24格) x:-65, y: +20
    // mountL3 (24格) x:-70, y: +40
    // mountL3 (24格) x;-150, y: -40
    // mountL3 (24格) x;-60, y: +10
    // [5,45,50,55,60,70,150,60]
    // 0,0,0,10,2,-20,-40,40,10
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
  // 起跳在第一秒13格，降落到第一階在第二秒13格(一秒有24格)
  drawStair() {
    for (let i = 0; i < this.stairList.length; i++) {
      // 最後一個階梯的 x 在 35
      if (this.isMovingX && this.isJumping && !this.isDying) {
        this.stairList[i].x -= this.stairObject.xSpeed
        this.stairList[i].y += this.stairObject.ySpeed
      }
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

  drawEndPoint() {
    this.endPointObject.x = this.stairList[this.stairList.length - 1].x - 10
    this.endPointObject.y = this.stairList[this.stairList.length - 1].y - 160
    // this.endPointObject.x = -150
    // this.endPointObject.y = -120

    if (this.endPointObject.x < 375) {
      console.log('endpoint', this.endPointObject.x, this.endPointObject.y)
    }
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
    this.ctx.drawImage(
      this.flagObject.frames[this.flagIndex],
      this.flagObject.x,
      this.flagObject.y,
      this.flagObject.width,
      this.flagObject.height
    )
  }

  drawPlayer() {
    // player padding right 20px
    this.playerObject.x = Math.floor(this.width * 0.6) - 70
    let player_animator_frames = 70
    if (this.stairInviewIndex > -1 && this.stairInviewIndex < this.stairList.length) {
      if (this.shoeOnStair.includes(this.stairInviewIndex)) {
        this.playerObject.y =
          this.stairList[this.stairInviewIndex].y -
          this.playerObject.height -
          Math.floor(this.stairList[this.stairInviewIndex].width / 2)

        player_animator_frames = 90
      } else {
        this.playerObject.y = this.stairList[this.stairInviewIndex].y - this.playerObject.height
      }
    } else {
      this.playerObject.y = this.height * 0.84 - this.playerObject.height
    }

    let currFrame = 0
    if (this.playerAnimatorCounter % player_animator_frames <= 10) {
      this.isJumping = false
      currFrame = 0
    } else {
      this.isJumping = true
      currFrame = Math.floor((((this.playerAnimatorCounter % player_animator_frames) - 10) % 24) / 2) + 1
      this.playerObject.y = this.stairList[0].y - this.playerObject.height - 50

      if (this.stairInviewIndex > -1 && this.stairInviewIndex < this.stairList.length) {
        const index =
          this.stairInviewIndex + 1 === this.stairList.length ? this.stairInviewIndex : this.stairInviewIndex + 1
        this.playerObject.y = this.stairList[index].y - this.playerObject.height - 50

        if (this.shoeOnStair.includes(this.stairInviewIndex)) {
          this.playerObject.y = this.playerObject.y - Math.floor(this.stairList[this.stairInviewIndex].width / 2)
        }
      }
      // TODO: 確認木頭階梯是否 alive
      if (this.isStayOnWood && stairLevel[this.stairInviewIndex] === 'w') {
        this.stairList[this.stairInviewIndex].alive = false
        this.playBrokenWood = true
      } else {
        // this.playBrokenWood = false
      }
    }

    this.ctx.drawImage(
      this.playerObject.frames[currFrame],
      this.playerObject.x,
      this.playerObject.y,
      this.playerObject.width,
      this.playerObject.height
    )
  }

  drawFailPlayer() {
    const xCoord = Math.floor(this.width * 0.6) - 70
    const yCoord = this.height * 0.84 - this.failPlayerObject.height
    const index = Math.floor(this.failAnimator)
    this.ctx.drawImage(
      this.failPlayerObject.frames[index],
      xCoord,
      yCoord,
      this.failPlayerObject.width,
      this.failPlayerObject.height
    )
  }

  drawWinPlayer() {
    this.ctx.drawImage(
      this.winPlayerObject.frames[this.winPlayerIndex],
      this.endPointObject.x + 150,
      this.endPointObject.y + 120 - this.winPlayerObject.height,
      this.winPlayerObject.width,
      this.winPlayerObject.height
    )
  }

  findStairIndex() {
    if (this.isJumping) {
      return
    }
    this.stairInviewIndex = this.stairList.findIndex(
      o =>
        (o.x <= this.playerObject.x + 30 && o.x + o.width >= this.playerObject.x + 30) ||
        (o.x <= this.playerObject.x + this.playerObject.width - 21 &&
          o.x + o.width >= this.playerObject.x + this.playerObject.width - 21)
    )
    if (this.stairInviewIndex === -1 && this.endPointObject.x + 100 <= this.playerObject.x + 30) {
      console.log('on end point ?')
      this.isOnEndPoint = true
      //  this.isDying = false
    }

    // this.isDying =
    //   (this.stairInviewIndex === -1 && this.isStartGame) || this.stageOnStair.includes(this.stairInviewIndex)

    if (!this.isOnEndPoint) {
      this.isDying =
        (this.stairInviewIndex === -1 && this.isStartGame) || this.stageOnStair.includes(this.stairInviewIndex)
    }

    this.overStage = this.stairInviewIndex === 3 || this.stairInviewIndex === 8 || this.stairInviewIndex === 13

    if (stairLevel[this.stairInviewIndex] === 'w') {
      if (!this.isStayOnWood) {
        this.isStayOnWood = true
        return
      }
      if (!this.stairList[this.stairInviewIndex].alive) {
        this.isDying = true
      }
      // if (this.stairList[this.stairInviewIndex].alive) {
      //   this.playBrokenWood = true
      //   this.stairList[this.stairInviewIndex].alive = false
      // }
      // console.log('animato', this.broken_wood_animator)
      // if (
      //   this.broken_wood_animator > 10 &&
      //   stairLevel[this.stairInviewIndex] === 'w' &&
      //   !this.stairList[this.stairInviewIndex].alive
      // ) {
      //   // this.isDying = true
      //   // this.broken_wood_animator = 0
      //   // this.playBrokenWood = false
      // }
    }
  }

  drawBrokenWood() {
    if (!this.playBrokenWood) {
      return
    }
    if (this.brokenWood.alive) {
      this.ctx.drawImage(
        this.brokenWood.frames[this.brokenWoodIndex],
        this.stairList[this.stairInviewIndex].x,
        this.stairList[this.stairInviewIndex].y,
        this.brokenWood.width,
        this.brokenWood.height
      )
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

      const restSpace = this.stairList[this.stageOnStair[i]].width - width
      const xCoord = this.stairList[this.stageOnStair[i]].x + Math.floor(restSpace / 2)

      this.ctx.drawImage(
        this.stageObject.frames[this.stageIndexes[i]],
        xCoord,
        this.stairList[this.stageOnStair[i]].y - this.stageObject.height,
        width,
        height
      )
    }
  }

  drawShoes() {
    for (let i = 0; i < this.shoeOnStair.length; i++) {
      const width = this.stairList[this.shoeOnStair[i]].width
      const height = Math.floor(width / 2)
      const xcoord = this.stairList[this.shoeOnStair[i]].x
      const ycoord = this.stairList[this.shoeOnStair[i]].y - height
      this.ctx.drawImage(this.propsShoes.frames[0], xcoord, ycoord, width, height)
    }
  }

  drawWinBoard() {
    if (!this.overStage || this.win_board_animator > 80) {
      return
    }
    this.win_board_animator += 1
    let yCoord = this.stairList[this.stairInviewIndex].y - this.stageObject.height - 40

    if (this.win_board_animator < 40) {
      if (this.ctxAlpha < 1) {
        this.ctxAlpha += 0.01
      }
    } else {
      this.ctxAlpha -= 0.01
    }

    this.ctx.globalAlpha = this.ctxAlpha
    this.ctx.drawImage(this.winBoard.frames[0], 0, yCoord, this.winBoard.width, this.winBoard.height)
    this.ctx.font = 'bold 18px NotoSansCJKTC'
    this.ctx.fillStyle = '#000'
    this.ctx.textAlign = 'center'
    const i = this.stageOnStair.findIndex(o => o === this.stairInviewIndex - 1)
    this.ctx.fillText(
      stageList[this.stageIndexes[i]].name,
      Math.floor(this.winBoard.width - 15) / 2,
      yCoord + Math.floor(110 / 2)
    )
    this.ctx.globalAlpha = 1
  }

  drawPropsBox() {
    this.ctx.drawImage(this.propsBoxObject.frames[0], 0, 0, this.propsBoxObject.width, this.propsBoxObject.height)
    this.ctx.font = ''
    const shoeXcoord = Math.floor((this.propsBoxObject.width - 5 - this.propsShoes.width) / 2)
    const shoeYcoord = Math.floor((this.propsBoxObject.height - 55) / 2)
    this.ctx.drawImage(this.propsShoes.frames[0], shoeXcoord, shoeYcoord, this.propsShoes.width, this.propsShoes.height)
  }
}

// const swiper = new Swiper('.swiper', {
//   // Optional parameters
//   direction: 'horizontal',
//   loop: true,

//   // If we need pagination
//   pagination: {
//     el: '.swiper-pagination',
//     clickable: true
//   },

//   // Navigation arrows
//   navigation: {
//     nextEl: '.swiper-button-next',
//     prevEl: '.swiper-button-prev'
//   }

//   // And if we need scrollbar
//   // scrollbar: {
//   //   el: '.swiper-scrollbar'
//   // }
// })

document.addEventListener('DOMContentLoaded', () => {
  window['myGame'] = new myGame()
})
