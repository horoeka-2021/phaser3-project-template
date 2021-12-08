import { Scene, Curves } from 'phaser'
import { Boss4 } from '../classes/bosses/boss4'
import { Player } from '../classes/player'
import { Trigger } from '../classes/triggers/endLevel'
import { BossHpTrigger } from '../classes/triggers/bossHpTrigger'
import { Facilitator } from '../classes/npc'
import { MobSpawner } from '../classes/groups/mob-spawner'

export class Level45 extends Scene {
  constructor () {
    super('level-45-scene')
  }

  create () {
    this.sceneNum = 4

    this.initMap()
    this.initPlayer()
    this.triggerSetup()
    this.initNpc()
    this.pathSetup()
    this.enemySetup()
    this.uISetup()
    this.cameraSetup()

    this.sound.stopAll()
    this.sound.add('portalAudio')
    this.sound.add('stepsAudio')
    this.sound.add('playerFireAudio')
    this.sound.add('level45BgAudio')
    this.sound.play('level45BgAudio', { volume: 0.3, loop: true })
  }

  changeScene () {
    this.scene.start('loading-scene', { scene: 'level-5-scene' })
  }

  initMap () {
    // creating tilemap
    const level45map = this.make.tilemap({ key: 'level45-map' })
    const tileSetLevel45 = level45map.addTilesetImage('Retro-Lines-Tiles-transparent', 'level45')
    const tileSetLevel4 = level45map.addTilesetImage('Terrain', 'level4Ground')
    this.walls = level45map.createLayer('walls', tileSetLevel4)
    this.jumpLayer = level45map.createLayer('jumpLayer', tileSetLevel45)
    level45map.addTilesetImage('Background', tileSetLevel45)
    level45map.createLayer('Etc', tileSetLevel45)
    // creating layers to reflect tilemap layers - order matters for rendering
    level45map.createLayer('Platform', tileSetLevel45, 0, 0)
    this.water = level45map.createLayer('Waterfall', tileSetLevel45)
    // setting collision property to ground
    this.jumpLayer.setCollisionByExclusion(-1, true)
    this.walls.setCollisionByExclusion(-1, true)
    this.water.setCollisionByExclusion(-1, 0)
  }

  initNpc () {
    this.caro = new Facilitator(this, 270, 458, 'caro').setScale(0.5)
  }

  initPlayer () {
    this.player = new Player(this, 4320, 944)
  }

  cameraSetup () {
    this.cameras.main.setViewport(0, 0, 960, 540)
    this.physics.world.setBounds(0, 0, 4800, 1088)
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5, 0, 20)
    this.cameras.main.setBounds(0, 0, 4800, 1088)
  }

  enemySetup () {
    this.boss = new Boss4(this, 310, 420)

    const carrotConifg = {
      key: {
        run: '-run',
        idle: '-idle'
      },
      w: 48,
      h: 48,
      xOff: 0,
      yOff: 0,
      scale: 2,
      prefix: 'carrot-',
      frameRate: 4,
      frameEnds: {
        idle: 0,
        run: 2,
        death: 4
      }
    }

    const turdConifg = {
      key: {
        run: '-run',
        idle: '-idle'
      },
      w: 48,
      h: 48,
      xOff: 0,
      yOff: 0,
      scale: 2,
      prefix: 'turd-',
      frameRate: 4,
      frameEnds: {
        idle: 1,
        run: 3,
        death: 4
      }
    }

    const bugConifg = {
      key: {
        run: '-run'
      },
      w: 48,
      h: 48,
      xOff: 0,
      yOff: 0,
      scale: 2,
      prefix: 'bug-',
      frameRate: 4,
      frameEnds: {
        run: 3,
        death: 4
      }
    }

    this.carrotSpawn = new MobSpawner(this, 3000, 1000, 'carrot', carrotConifg, 45)
    this.turdSpawn = new MobSpawner(this, 3000, 1000, 'turd', turdConifg, 45)
    this.bugSpawn = new MobSpawner(this, 3000, 1000, 'bug', bugConifg, 45)
    this.add.existing(this.carrotSpawn)
    this.add.existing(this.turdSpawn)
    this.add.existing(this.bugSpawn)

    this.time.addEvent({
      callback: () => this.carrotSpawn.spawnMob(3000, 850),
      callbackScope: this,
      delay: 4000,
      loop: true
    })
    this.time.addEvent({
      callback: () => this.turdSpawn.spawnMob(2200, 435),
      callbackScope: this,
      delay: 3500,
      loop: true
    })

    this.time.addEvent({
      callback: () => this.bugSpawn.spawnMob(2650, 350),
      callbackScope: this,
      delay: 2000,
      loop: true
    })
  }

  triggerSetup () {
    this.endLevel = new Trigger(this, 32, 420)
    this.bossHealth = new BossHpTrigger(this, 900, 280, { healthBarX: 5400, healthBarY: 34, sizeX: 28, sizeY: 600 })
  }

  pathSetup () {
    const points1 = [50, 400, 135, 400]
    const flyingPoints = [50, 400, 125, 320, 200, 400]
    this.curve = new Curves.Spline(points1)
    this.flying = new Curves.Spline(flyingPoints)
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
    this.endLevel.update()
    if (this.player.hp > 0) {
      this.player.update()
    } else if (this.player.active) {
      this.player.die()
    }
    if (this.boss.hp > 0) {
      this.boss.update()
    } else if (this.boss.active && !this.caro.active) {
      this.boss.die()
    }
    if (this.caro.active) {
      this.caro.update()
    }
  }
}
