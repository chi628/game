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
    id: 'wallet',
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
    id: 'dirty',
    name: '新衣服秒髒',
    description: '打破莫非定律魔咒 衰神退散吧',
  },
]

const MAIN_BACKGROUND_COLOR = '#f3bbac'
const GROUND_1_BGCOLOR = '#a38971'
const GROUND_2_BGCOLOR = '#8fac79'

class Object {
  x
  y
  curr_frame
  width
  height
  frames = []

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
  type = ''
  x = 0
  y = 0
  width = 0
  height = 0
  alive = true
  currFrame = 0
  xSpeed = 0
  ySpeed = 0
}

class myGame {
  ctx
  camera = {
    x: 0,
    y: 0,
  }
  width
  height
  stairObject = []
  stageObject = []
  bigClouds = []
  midClouds = []
  smallClouds = []
  isMovingX = false
  treeSpeed = 1
  mountSpeed = 1
  mountXSpeed = 1
  isGameOver = false
  isDying = false

  ground2Camera = { x: 0, y: 0 }
  mountCamera = { x: 0, y: 0 }
  mount2Camera = { x: 0, y: 0 }
  mount3Camera = { x: 0, y: 0 }
  treeCamera = { x: 0, y: 0 }
  cloudCamera = { x: 0, y: 0 }
  midCloudCamera = { x: 0, y: 0 }
  miniCloudCamera = { x: 0, y: 0 }
  stairCamera = { x: 0, y: 0 }

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

  fpsTestCount = 0

  playerIndex = 0

  isJumping = false

  midStairIndex = -1

  isStartGame = false

  playerGravity = 0

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
        this.isMovingX = true
      },
      {
        passive: false,
      }
    )

    document.addEventListener('touchend', () => {
      console.log('end')
      this.isMovingX = false
    })

    this.initGame()
  }

  async log() {
    await new Promise(resolve => {
      setTimeout(resolve, 5000)
    })
  }

  initGame() {
    this.ctx.fillStyle = '#f3bbac'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.groundOne = {
      x: 0,
      y: this.height - this.height * 0.1,
      width: this.width,
      height: this.height * 0.1,
    }

    this.groundTwo = {
      x: 0,
      y: this.height - this.height * 0.1 - this.height * 0.06,
      width: this.width,
      height: this.height * 0.07,
    }

    this.groundThree = {
      x: 0,
      y: this.height - this.height * 0.1 - this.height * 0.06 - this.height * 0.05,
      width: this.width,
      height: this.height * 0.1,
    }

    // 230 * 111
    this.bigCloud = new Object(0, 0, 230, 111)
    this.bigCloud.LoadFrame('Images/cloud_L.webp')
    this.midCloud = new Object(0, 0, 135, 72)
    this.midCloud.LoadFrame('Images/cloud_M.webp')
    this.clouds = new Object(0, 0, 95, 60)
    this.clouds.LoadFrame('Images/cloud_S.webp')

    this.grounds = new Object(0, 0, 0, 0)
    this.grounds.LoadFrame('Images/ground.webp')
    this.grounds.LoadFrame('Images/ground_L2.webp')

    this.groundL1 = new Object(0, 0, 0, 0)
    this.groundL1.LoadFrame('Images/ground.webp')
    this.groundL2 = new Object(0, 0, 0, 0)
    this.groundL2.LoadFrame('Images/ground_L2.webp')

    this.tree = new Object(0, 0, 1070, 80)
    this.tree.LoadFrame('Images/tree.webp')

    this.mount = new Object(0, 0, 0, 0)
    this.mount.LoadFrame('Images/mt_L1.webp')
    this.mount.LoadFrame('Images/mt_L2.webp')
    this.mount.LoadFrame('Images/mt_L3.webp')

    this.mountL1 = new Object(0, 0, 885, 480)
    this.mountL1.LoadFrame('Images/mt_L1.webp')

    this.mountL2 = new Object(0, 0, 1245, 200)
    this.mountL2.LoadFrame('Images/mt_L2.webp')

    this.mountL3 = new Object(0, 0, 1104, 210)
    this.mountL3.LoadFrame('Images/mt_L3.webp')

    this.stair = new Object(0, 0, 0, 0)
    this.stair.LoadFrame('Images/platform_N.webp')
    this.stair.LoadFrame('Images/platform_S.webp')
    this.stair.LoadFrame('Images/platform_W.webp')

    this.endPoint = new Object(0, 0, 300, 370)
    this.endPoint.LoadFrame('Images/Endpoint.webp')

    // 障礙物 42*80
    this.stages = new Object(0, 0, 50, 50)
    for (let i = 0; i < stageList.length; i++) {
      this.stages.LoadFrame('Images/' + stageList[i].id + '.png')
    }
    this.flag = new Object(0, 0, 50, 83)
    for (let i = 0; i < 10; i++) {
      this.flag.LoadFrame('Images/flag' + i + '.webp')
    }

    this.player = new Object(0, 0, 70, 100)
    for (let i = 0; i < 12; i++) {
      this.player.LoadFrame('Images/standby' + i + '.webp')
    }

    this.rollPlayer = new Object(0, 0, 70, 100)
    for (let i = 0; i < 12; i++) {
      this.rollPlayer.LoadFrame('Images/roll' + i + '.webp')
    }

    const maxBigClouds = Math.ceil(this.width / 230) + 1
    const bigClouds_StartXCoord = -60
    for (let i = 0; i < maxBigClouds; i++) {
      this.bigClouds.push({
        x: 350 * i + bigClouds_StartXCoord,
        y: i % 2 === 0 ? 10 : 40,
        width: this.bigCloud.width,
        height: this.bigCloud.height,
        alive: true,
      })
    }

    const maxMidClouds = Math.ceil(this.width / 140) + 1
    const midClouds_StartXCoord = -105
    for (let i = 0; i < maxMidClouds; i++) {
      this.midClouds.push({
        x: 200 * i + midClouds_StartXCoord,
        y: i % 2 === 0 ? 220 : 140,
        width: this.midCloud.width,
        height: this.midCloud.height,
        alive: true,
      })
    }

    const maxClouds = Math.ceil(this.width / 95) + 1
    const clouds_StartXCoord = 70
    for (let i = 0; i < maxClouds; i++) {
      this.smallClouds.push({
        x: 220 * i + clouds_StartXCoord,
        y: i % 2 === 0 ? 300 : 330,
        width: this.clouds.width,
        height: this.clouds.height,
        alive: true,
      })
    }

    for (let i = 0; i < stairLevel.length; i++) {
      const startX = Math.floor(this.width * 0.6)
      const startY = this.height * 0.75
      let index = 0
      let width = 0
      let height = 23
      switch (stairLevel[i]) {
        case 'l':
          index = 0
          width = 85
          break
        case 's':
          index = 1
          width = 60
          break
        case 'w':
          index = 2
          width = 85
          break
        default:
          break
      }

      this.stairObject.push({
        x: startX + 120 * i,
        y: startY - 50 * i,
        width,
        height,
        currFrame: index,
      })
    }

    while (this.stageIndexes.length < 3) {
      const randomNum = Math.floor(Math.random() * 9)
      if (this.stageIndexes.indexOf(randomNum) === -1) {
        this.stageIndexes.push(randomNum)
      }
    }

    console.log('index', this.stageIndexes)

    // var randomNumbers = generateRandomNumbers()

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
    // console.log('fpscounter', this.fpscounter, this.currentfps)
  }

  draw() {
    console.log('draw')
    this.clearScreen()
    this.isJumping = (this.fpscounter + 10) % 60 > 10

    // updateInput
    this.countFPS()
    this.gameMain()

    this.flagIndex += 1
    this.flagIndex = Math.floor(this.fpscounter / 2) % 9

    this.playerIndex = Math.floor(this.fpscounter / 2) % 12
    // this.playerIndex = this.playerIndex % 12

    this.cloudCamera.x += 1.6
    this.midCloudCamera.x += 1.2
    this.miniCloudCamera.x += 0.8

    this.fpsTestCount += 1

    // if (this.playerGravity <= 90) {
    //   this.playerGravity += 2
    // } else if (this.playerGravity > -1) {
    //   this.playerGravity -= 2
    // }
    this.playerGravity = 90
    // this.stairCamera.x = 1800
    // this.stairCamera.y = 720

    if (this.isMovingX && this.isJumping && !this.isDying) {
      this.camera.x += 0.4
      this.camera.y += 1.6
      this.isStartGame = true

      this.test += 1

      if (this.endPoint.x >= 20) {
        this.stairCamera.x += 5
        this.stairCamera.y += 2
      }

      // tree camera
      if (Math.floor(this.test / 24) < 6) {
        this.treeCamera.x += this.treeXSapce[Math.floor(this.test / 24)] / 24
        this.treeCamera.y += this.treeYSapce[Math.floor(this.test / 24)] / 24
      }

      // mount camera
      if (Math.floor(this.test / 24) < this.test1.length) {
        this.mountCamera.x += this.test1[Math.floor(this.test / 24)] / 24
        this.mountCamera.y += this.test2[Math.floor(this.test / 24)] / 24
        this.mount2Camera.x += this.mountL2XSpace[Math.floor(this.test / 24)] / 24
        this.mount2Camera.y += this.mountL2YSapce[Math.floor(this.test / 24)] / 24
        this.mount3Camera.x += this.mountL3XSpace[Math.floor(this.test / 24)] / 24
        this.mount3Camera.y += this.mountL3YSapce[Math.floor(this.test / 24)] / 24
      }
    }

    window.requestAnimationFrame(this.draw.bind(this))
  }

  gameMain() {
    // if (!this.isGameOver && !this.isDying) {
    //   // player jumping
    // }

    this.findStairIndex()
    this.drawGroundL2()
    // this.drawClouds()
    this.drawMount()
    // this.drawBigClouds()
    // this.drawMidClouds()
    this.drawTree()
    this.drawGroundL1()
    this.drawEndPoint()
    this.drawFlag()
    this.drawStair()
    this.drawStages()
    if (this.isJumping && !this.isDying) {
      this.drawRollPlayer()
    } else {
      this.drawPlayer()
    }
  }

  drawBigClouds() {
    for (let i = 0; i < this.bigClouds.length - 1; i++) {
      const xCoord = this.bigClouds[i].x - this.cloudCamera.x
      if (this.bigClouds[i].alive) {
        this.ctx.drawImage(
          this.bigCloud.frames[0],
          xCoord,
          this.bigClouds[i].y,
          this.bigClouds[i].width,
          this.bigClouds[i].height
        )
      }

      if (xCoord < 10) {
        this.bigClouds.push({
          x: this.bigClouds.length * 350 - 60,
          y: (i + this.bigClouds.length) % 2 === 0 ? 10 : 40,
          width: this.bigCloud.width,
          height: this.bigCloud.height,
          alive: true,
        })
      }
      if (xCoord + this.bigCloud.width < 0) {
        this.bigClouds[i].alive = false
      }
    }
  }

  drawMidClouds() {
    for (let i = 0; i < this.midClouds.length - 1; i++) {
      const xCoord = this.midClouds[i].x - this.midCloudCamera.x
      if (this.midClouds[i].alive) {
        this.ctx.drawImage(
          this.midCloud.frames[0],
          xCoord,
          this.midClouds[i].y,
          this.midClouds[i].width,
          this.midClouds[i].height
        )
      }

      if (xCoord < 10) {
        this.midClouds.push({
          x: this.midClouds.length * 200 - 105,
          y: (i + this.midClouds.length) % 2 === 0 ? 220 : 140,
          width: this.midCloud.width,
          height: this.midCloud.height,
          alive: true,
        })
      }
      if (xCoord + this.midCloud.width < 0) {
        this.midClouds[i].alive = false
      }
    }
  }

  drawClouds() {
    // ;-this.cloudCamera.x
    for (let i = 0; i < this.smallClouds.length - 1; i++) {
      const xCoord = this.smallClouds[i].x - this.miniCloudCamera.x
      if (this.smallClouds[i].alive) {
        this.ctx.drawImage(
          this.clouds.frames[0],
          xCoord,
          this.smallClouds[i].y,
          this.smallClouds[i].width,
          this.smallClouds[i].height
        )
      }

      if (xCoord < 10) {
        this.smallClouds.push({
          x: this.smallClouds.length * 220 + 70,
          y: (i + this.smallClouds.length) % 2 === 0 ? 300 : 330,
          width: this.clouds.width,
          height: this.clouds.height,
          alive: true,
        })
      }
      if (xCoord + this.clouds.width < 0) {
        this.smallClouds[i].alive = false
      }
    }
  }

  drawGroundL1() {
    if (this.groundL1.y <= this.height) {
      // ground1 (24格) y: 40
      // ground1 (24格) y: 40 + 55
      // ground1 (24格) y: 40 + 55 +10
      this.groundL1.y = this.height * 0.84 + this.camera.y
      this.ctx.drawImage(this.groundL1.frames[0], this.groundL1.x, this.groundL1.y, this.width, this.height * 0.07)
      this.ctx.fillStyle = GROUND_1_BGCOLOR
      this.ctx.fillRect(0, this.height * 0.9 + this.camera.y, this.width, this.height * 0.1)
    }
  }

  drawGroundL2() {
    this.ctx.fillStyle = GROUND_2_BGCOLOR
    this.groundL2.y = this.height * 0.8 + this.ground2Camera.y

    this.ctx.fillRect(0, this.groundL2.y, this.width, this.height * 0.2)
    this.ctx.drawImage(this.groundL2.frames[0], this.groundL2.x, this.groundL2.y, this.width, this.height * 0.2)
  }

  drawTree() {
    // - 10 - 30 - 50 - 70 - 90 - 110
    // + 10 + 10 + 20 + 30 + 40 + 50
    this.tree.x = 180 - this.treeCamera.x
    this.tree.y = this.height * 0.84 - this.tree.height * 0.7 + this.treeCamera.y

    this.ctx.drawImage(this.tree.frames[0], this.tree.x, this.tree.y, this.tree.width, this.tree.height)
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
    this.mountL3.x = 5 - this.mount3Camera.x
    this.mountL3.y = this.height * 0.84 - this.mountL3.height - 2 + this.mount3Camera.y

    this.mountL2.x = 5 - this.mount2Camera.x
    this.mountL2.y = this.height * 0.84 - this.mountL2.height * 0.9 + 5 + this.mount2Camera.y

    this.mountL1.x = 150 - this.mountCamera.x
    this.mountL1.y = this.height * 0.84 - this.mountL1.height * 0.98 + this.mountCamera.y

    this.ctx.drawImage(this.mountL3.frames[0], this.mountL3.x, this.mountL3.y, this.mountL3.width, this.mountL3.height)
    this.ctx.drawImage(this.mountL2.frames[0], this.mountL2.x, this.mountL2.y, this.mountL2.width, this.mountL2.height)
    this.ctx.drawImage(this.mountL1.frames[0], this.mountL1.x, this.mountL1.y, this.mountL1.width, this.mountL1.height)
  }
  // 起跳在第一秒13格，降落到第一階在第二秒13格(一秒有24格)
  drawStair() {
    for (let i = 0; i < this.stairObject.length - 1; i++) {
      const xCoord = this.stairObject[i].x - this.stairCamera.x
      const yCoord = this.stairObject[i].y + this.stairCamera.y

      this.ctx.drawImage(
        this.stair.frames[this.stairObject[i].currFrame],
        xCoord,
        yCoord,
        this.stairObject[i].width,
        this.stairObject[i].height
      )
    }
  }

  drawEndPoint() {
    this.endPoint.x = this.stairObject[this.stairObject.length - 1].x - this.stairCamera.x - 130
    this.endPoint.y = this.stairObject[this.stairObject.length - 1].y + this.stairCamera.y - 115

    this.ctx.drawImage(
      this.endPoint.frames[0],
      this.endPoint.x,
      this.endPoint.y,
      this.endPoint.width,
      this.endPoint.height
    )
  }

  drawFlag() {
    const xCoord = this.endPoint.x + 180
    const yCoord = this.endPoint.y + 40
    this.ctx.drawImage(this.flag.frames[this.flagIndex], xCoord, yCoord, this.flag.width, this.flag.height)
  }

  drawPlayer() {
    this.player.y = this.height * 0.84 - this.player.height

    if (this.midStairIndex > -1) {
      this.player.y = this.stairObject[this.midStairIndex].y + this.stairCamera.y - this.player.height
    }
    this.ctx.drawImage(
      this.player.frames[this.playerIndex],
      this.stairObject[0].x - 70,
      this.player.y,
      this.player.width,
      this.player.height
    )
  }

  drawRollPlayer() {
    this.rollPlayer.y = this.stairObject[0].y + this.stairCamera.y - this.rollPlayer.height - this.playerGravity
    //  &&this.midStairIndex < this.stairObject.length - 1

    if (this.midStairIndex > -1) {
      this.rollPlayer.y =
        this.stairObject[this.midStairIndex].y + this.stairCamera.y - this.rollPlayer.height - this.playerGravity
    }

    this.ctx.drawImage(
      this.rollPlayer.frames[this.playerIndex],
      Math.floor(this.width * 0.6) - 70,
      this.rollPlayer.y,
      this.rollPlayer.width,
      this.rollPlayer.height
    )
  }

  findStairIndex() {
    if (this.isJumping) {
      return
    }
    const playerXCoord = Math.floor(this.width * 0.6) - 70 + 10
    const playerEndXCoord = playerXCoord + this.player.width - 20

    this.midStairIndex = this.stairObject.findIndex(o => {
      const stairXcoord = o.x - this.stairCamera.x
      const stairEndXcoord = stairXcoord + o.width

      return (
        (playerXCoord >= stairXcoord && playerXCoord < stairEndXcoord - 5) ||
        (playerEndXCoord - 5 > stairXcoord && playerEndXCoord - 5 <= stairEndXcoord)
      )
    })

    if (this.isStartGame && this.midStairIndex === -1) {
      this.isDying = true
    }

    // console.log('index', this.midStairIndex)
    // console.log(
    //   'xcoord',
    //   playerXCoord,
    //   playerEndXCoord,
    //   this.stairObject.map((o) => {
    //     return {
    //       x: o.x - this.stairCamera.x,
    //       endX: o.x - this.stairCamera.x + o.width,
    //     }
    //   })
    // )
  }

  drawBrokenWood() {}

  drawStages() {
    for (let i = 0; i < this.stageIndexes.length; i++) {
      const xCoord = this.stairObject[this.stageOnStair[i]].x - this.stairCamera.x
      const yCoord = this.stairObject[this.stageOnStair[i]].y + this.stairCamera.y - this.stages.height

      this.ctx.drawImage(
        this.stages.frames[this.stageIndexes[i]],
        xCoord,
        yCoord,
        this.stages.width,
        this.stages.height
      )
    }
  }

  createStairObject(obj) {
    let stair = new SpecialObject()
    stair.type = 'stair'
    stair.x = obj.x - this.camera.x
    let testY = obj.y + this.camera.y

    if (testY >= this.height * 0.85) {
      testY = this.height * 0.85
    }

    stair.y = testY
    stair.width = obj.width
    stair.height = obj.height
    stair.currFrame = obj.currFrame
    this.stairObject.push(stair)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window['myGame'] = new myGame()
})
