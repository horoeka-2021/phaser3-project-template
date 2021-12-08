import { Scene, Curves } from 'phaser'
import { Player } from '../classes/player'
import { Patroller } from '../classes/enemies/patroller'
import { Boss1 } from '../classes/bosses/boss1'
import { Trigger } from '../classes/triggers/endLevel'
import { BossHpTrigger } from '../classes/triggers/bossHpTrigger'
import { Facilitator } from '../classes/npc'
export class Level1 extends Scene {
  constructor () {
    super('level-1-scene')
  }

  create () {
    this.sceneNum = 1
    this.initMap()
    this.initPlayer()
    this.triggerSetup()
    this.initNpc()
    this.pathSetup()
    this.enemySetup()
    this.uISetup()
    this.cameraSetup()

    //  = pause
    this.sound.stopAll()
    this.sound.add('jaredAudio')

    this.sound.add('portalAudio')
    this.sound.add('stepsAudio')
    this.sound.add('playerFireAudio')
    this.sound.add('level1BgAudio')
    this.sound.play('level1BgAudio', { volume: 0.1, loop: true })
  }

  changeScene () {
    this.scene.start('loading-scene', { scene: 'level-2-scene' })
  }

  initMap () {
    // creating bg
    this.bg = this.add.image(400, 300, 'background').setScale(3).setScrollFactor(0)
    this.add.tileSprite(200, 450, 4500, 350, 'foreground')
      .setScrollFactor(0.5)
    // creating tilemap
    const map = this.make.tilemap({ key: 'map' })
    // linking pngs to tileset names in the map
    const tilesetCloud = map.addTilesetImage('clouds', 'clouds')
    const tilesetGround = map.addTilesetImage('tilesetOpenGame2', 'ground')
    const tilesetWater = map.addTilesetImage('WaterTextures', 'water')
    const tilesetFoliage = map.addTilesetImage('grass-trees', 'foliage')
    const tilesetHouse = map.addTilesetImage('Village-Endesga-Buildings', 'house')

    // creating layers to reflect tilemap layers - order matters for rendering
    this.walls = map.createLayer('Collision Layer', tilesetGround)
    this.jumpLayer = map.createLayer('Jump Layer', tilesetGround)
    map.createLayer('Clouds', tilesetCloud)
    map.createLayer('Foliage', tilesetFoliage)
    this.water = map.createLayer('Water', tilesetWater)
    map.createLayer('Ground', tilesetGround, 0, 0)
    map.createLayer('Bricks', tilesetHouse)
    map.createLayer('Door', tilesetGround)
    map.createLayer('Roof', tilesetHouse)
    // setting collision property to ground
    this.walls.setCollisionByExclusion(-1, true)
    this.jumpLayer.setCollisionByExclusion(-1, true)
    this.water.setCollisionByExclusion(-1, true)
  }

  initPlayer () {
    this.player = new Player(this, 100, 300)
  }

  initNpc () {
    this.jared = new Facilitator(this, 3000, 440, 'jared').setScale(0.7)
  }

  cameraSetup () {
    this.cameras.main.setViewport(0, 0, 960, 540)
    this.physics.world.setBounds(0, 0, 3840, 540)
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5, -400, 185)
    this.cameras.main.setBounds(0, 0, 3840, 540)
  }

  pathSetup () {
    const points1 = [50, 400, 135, 400]
    const flyingPoints = [50, 400, 125, 320, 200, 400]
    this.curve = new Curves.Spline(points1)
    this.flying = new Curves.Spline(flyingPoints)
  }

  enemySetup () {
    const mob3Config = {
      key: {
        idle: '-idle',
        atk: '-atk',
        run: '-run'
      },
      w: 15,
      h: 16,
      xOff: 9,
      yOff: 3,
      scale: 2,
      frameRate: 12,
      frameEnds: {
        idle: 4,
        atk: 10,
        run: 7,
        death: 4
      },
      hasGun: true
    }

    this.enemy1 = new Patroller(this, this.curve, 818, 413, 'gen-mob-2', mob3Config)
    this.enemy2 = new Patroller(this, this.curve, 1712, 412, 'gen-mob-2', mob3Config)
    this.enemy3 = new Patroller(this, this.flying, 1535, 392, 'gen-mob-2', mob3Config)

    this.boss = new Boss1(this, 3300, 220)

    this.enemy1.startFollow({
      duration: 700,
      yoyo: true,
      repeat: -1
    })

    this.enemy2.startFollow({
      duration: 700,
      yoyo: true,
      repeat: -1
    })

    this.enemy3.startFollow({
      duration: 1300,
      yoyo: true,
      repeat: -1
    })
  }

  triggerSetup () {
    this.endLevel = new Trigger(this, 3740, 450)
    this.bossHealth = new BossHpTrigger(this, 2520, 460, { healthBarX: 3450, healthBarY: 34, sizeX: 28, sizeY: 500 })
  }

  uISetup () {
    // change position if needed (but use same position for both images)
    var backgroundBar = this.add.image(150, 50, 'green-bar')
    backgroundBar.setScrollFactor(0)

    this.playerHealthBar = this.add.image(155, 50, 'red-bar')
    this.playerHealthBar.setScrollFactor(0)

    // add text label to left of bar
    this.healthLabel = this.add.text(40, 40, 'Health', { fontSize: '20px', fill: '#ffffff' })
    this.healthLabel.setScrollFactor(0)
  }

  update () {
    this.jared.update()

    if (!this.enemy1.dying) {
      this.enemy1.update()
    }
    if (!this.enemy2.dying) {
      this.enemy2.update()
    }
    if (!this.enemy3.dying) {
      this.enemy3.update()
    }

    this.bossHealth.update()
    this.endLevel.update()

    if (this.boss.hp > 0) {
      this.boss.update()
    } else if (this.boss.active && !this.jared.active) {
      this.boss.die()
    }
    if (this.jared.active) {
      this.jared.update()
    }

    if (this.player.hp > 0) {
      this.player.update()
    } else if (this.player.active) {
      this.player.die()
    }
  }
}
