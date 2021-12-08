import { Scene, Curves } from 'phaser'
import { Boss5 } from '../classes/bosses/boss5'
import { Player } from '../classes/player'
import { Trigger } from '../classes/triggers/endLevel'
import { BossHpTrigger } from '../classes/triggers/bossHpTrigger'

export class Level5 extends Scene {
  constructor () {
    super('level-5-scene')
  }

  create () {
    this.sceneNum = 5
    this.initMap()
    this.initPlayer()
    this.triggerSetup()
    this.pathSetup()
    this.enemySetup()
    this.uISetup()
    this.cameraSetup()

    this.sound.stopAll()
    this.sound.add('portalAudio')
    this.sound.add('stepsAudio')
    this.sound.add('playerFireAudio')
    this.sound.add('level5BgAudio')
    this.sound.play('level5BgAudio', { volume: 0.2, loop: true })
  }

  changeScene () {
    this.scene.start('loading-scene', { scene: 'win-scene' })
  }

  initMap () {
    // creating tilemap
    const map = this.make.tilemap({ key: 'level5-map' })
    const tilesetBackground = map.addTilesetImage('background', 'level5-bg')
    const tilesetGround = map.addTilesetImage('tiles', 'level5-ground')
    const tilesetProps = map.addTilesetImage('props', 'props')
    const tilesetPlatforms = map.addTilesetImage('platform', 'platforms')

    // linking pngs to tileset names in the map
    // creating layers to reflect tilemap layers - order matters for rendering
    this.walls = map.createLayer('Collision Layer', tilesetGround, 0, 0)
    this.jumpLayer = map.createLayer('Jump Layer', tilesetGround, 0, 0)
    map.createLayer('Background', tilesetBackground)
    this.add.tileSprite(200, 1000, 8000, 2000, 'level5-Bg2')
      .setScrollFactor(0.6)
    this.add.tileSprite(200, 1450, 8000, 220, 'level5-Bg3')
      .setScrollFactor(0.8)
    map.createLayer('Platforms', tilesetPlatforms)
    this.water = map.createLayer('Ground Cover', tilesetGround)
    map.createLayer('Rock1', tilesetGround)
    map.createLayer('Rock2', tilesetGround)
    map.createLayer('Props', tilesetProps)
    // setting collision property to ground
    this.jumpLayer.setCollisionByExclusion(-1, true)
    this.walls.setCollisionByExclusion(-1, true)
  }

  initPlayer () {
    this.player = new Player(this, 0, 1600)
  }

  cameraSetup () {
    this.cameras.main.setViewport(0, 0, 960, 540)
    this.physics.world.setBounds(0, 0, 5755, 5760)
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5, 0, 20)
    this.cameras.main.setBounds(0, 0, 5755, 1920)
  }

  enemySetup () {
    this.boss = new Boss5(this, 4200, 1200)
  }

  triggerSetup () {
    this.endLevel = new Trigger(this, 3050, 1750)
    this.bossHealth = new BossHpTrigger(this, 4800, 1245, { healthBarX: 5400, healthBarY: 34, sizeX: 28, sizeY: 1200 })
  }

  pathSetup () {
    const points1 = [50, 400, 135, 400]
    const flyingPoints = [50, 400, 125, 320, 200, 400]
    this.curve = new Curves.Spline(points1)
    this.flying = new Curves.Spline(flyingPoints)
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
    } else if (this.boss.active) {
      this.boss.die()
    }
  }
}
