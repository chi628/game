document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("game")
  const player = document.createElement("div")
  const spring = document.createElement("div")
  const boss = document.createElement("div")

  let showPlatformCount = 5
  const platforms = []
  let startBottom = 35
  let playerStartLeft = 0
  let playerStartBottom = startBottom
  let isTouch = false
  let isDie = false
  let isWin = false

  class Platform {
    constructor({ left, bottom }) {
      this.left = left
      this.bottom = bottom
      const platformContainer = document.createElement("div")

      platformContainer.classList.add("platform")
      platformContainer.style.left = this.left + "px"
      platformContainer.style.bottom = this.bottom + "px"
      gameContainer.appendChild(platformContainer)
    }
  }

  function createPlatform() {
    for (let i = 0; i < showPlatformCount; i++) {
      const platformGap = 300 / showPlatformCount
      const newLeft = 70 * i + 10
      const newBottom = 20 + i * platformGap
      let newPlatform = new Platform({ left: newLeft, bottom: newBottom })
      platforms.push(newPlatform)
    }
  }

  function createPlayer() {
    player.classList.add("player")
    player.style.bottom = playerStartBottom + "px"
    player.style.left = playerStartLeft + "px"
    gameContainer.append(player)
  }

  let isJumping = false
  let isBound = false
  function jump() {
    if (isDie || isWin) {
      return
    } else {
      if (playerStartBottom > startBottom + 200) {
        isBound = true
      } else if (playerStartBottom <= startBottom) {
        isBound = false
      }

      if (isBound) {
        isJumping = false
        if (!isTouch) {
          playerStartBottom -= 5
        }
        // platforms.forEach((o) => {
        //   if (o.left <= playerStartLeft + 40 && playerStartLeft <= o.left + 70 && !isJumping) {
        //     // if (playerStartLeft + 64 >= 85 && playerStartBottom + 64 < 120) {
        //     //   console.log("hello")
        //     //   startBottom = o.bottom + 47
        //     // } else {
        //     //   console.log("else")
        //     startBottom = o.bottom + 15
        //     // }
        //   }
        // })
        // o.left <= playerStartLeft + 64 && playerStartLeft <= o.left + 70
        const a = platforms.find((o) => playerStartLeft + 45 >= o.left && playerStartLeft + 64 <= o.left + 70)
        console.log("a", a)

        if (a && !isJumping) {
          if (
            (playerStartLeft >= 85 && playerStartLeft <= 117) ||
            (playerStartLeft + 32 >= 80 && playerStartLeft + 32 <= 100)
          ) {
            console.log("on spring")
            startBottom = a.bottom + 47
          } else if (
            (playerStartLeft >= 155 && playerStartLeft <= 180) ||
            (playerStartLeft + 32 >= 150 && playerStartLeft + 32 <= 180)
          ) {
            //
            if (playerStartBottom <= 200) {
              isDie = true
              alert("die")
              return
            }
          } else {
            console.log("else")
            startBottom = a.bottom + 15
          }
        }
        // if (player
      } else {
        isJumping = true
        playerStartBottom += 10
      }

      player.style.bottom = playerStartBottom + "px"
      window.requestAnimationFrame(jump)
    }
  }

  function moveX() {
    if (isDie || isWin) {
      return
    }
    if (isTouch) {
      if (playerStartLeft + 64 >= 360) {
        playerStartLeft = 360
        alert("win")
        isTouch = false
        isWin = true
        return
      }
      platforms.forEach((o) => {
        if (o.bottom <= playerStartBottom) {
          playerStartLeft += 0.5
          player.style.left = playerStartLeft + "px"
        }
      })
    }
    window.requestAnimationFrame(moveX)
  }

  function createObj() {
    if (platforms.length) {
      spring.classList.add("spring")
      spring.style.bottom = platforms[1].bottom + 15 + "px"
      spring.style.left = platforms[1].left + 5 + "px"
      gameContainer.append(spring)
      boss.classList.add("boss")
      boss.style.bottom = platforms[2].bottom + 15 + "px"
      boss.style.left = platforms[2].left + 5 + "px"
      gameContainer.append(boss)
    }
  }

  function init() {
    createPlatform()
    createObj()
    createPlayer()
    jump()
    document.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault()
        isTouch = true
        moveX()
      },
      { passive: false }
    )
    document.addEventListener("touchend", () => {
      isTouch = false
    })
  }

  init()
})
