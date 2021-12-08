import { Scene, Curves } from 'phaser'
import { Player } from '../classes/player'
import { Boss3 } from '../classes/bosses/boss3'
import { Facilitator } from '../classes/npc'
import { Trigger } from '../classes/triggers/endLevel'
import { BossHpTrigger } from '../classes/triggers/bossHpTrigger'

import { TempBoss2 } from '../classes/bosses/tempBoss2'

export class Level3 extends Scene {
  constructor () {
    super('level-3-scene')
  }

  create () {
    this.sceneNum = 3

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
    this.sound.add('level3BgAudio')
    this.sound.play('level3BgAudio', { volume: 0.7, loop: true })
  }

  changeScene () {
    this.scene.start('loading-scene', { scene: 'level-4-scene' })
  }

  initMap () {
    // creating tilemap
    const level3map = this.make.tilemap({ key: 'level3-map' })
    const tileSetLevel2 = level3map.addTilesetImage('Wasteland-Files', 'level3-tiles')

    this.walls = level3map.createLayer('Wall', tileSetLevel2)
    // creating bg
    this.jumpLayer = level3map.createLayer('jumpLayer', tileSetLevel2, 0, 0)
    this.add.image(400, 300, 'level3Bg').setScale(3)
      .setScrollFactor(0)
    this.add.tileSprite(200, 4000, 4500, 350, 'level3Mountain1')
      .setScrollFactor(0.7, 0.7)
    this.add.tileSprite(200, 3800, 4500, 350, 'level3Mountain2')
      .setScrollFactor(0.4, 0.4)

    // creating layers to reflect tilemap layers - order matters for rendering
    level3map.createLayer('Platform', tileSetLevel2, 0, 0)
    this.water = level3map.createLayer('Water', tileSetLevel2, 0, 0)
    level3map.createLayer('Etc', tileSetLevel2, 0, 0)
    // setting collision property to ground
    this.jumpLayer.setCollisionByExclusion(-1, true)
    this.walls.setCollisionByExclusion(-1, true)
    this.water.setCollisionByExclusion(-1, true)
  }

  initPlayer () {
    this.player = new Player(this, 100, 600)
  }

  initNpc () {
    this.jared = new Facilitator(this, 3000, 200, 'jared')
  }

  cameraSetup () {
    this.cameras.main.setViewport(0, 0, 960, 540)
    this.physics.world.setBounds(0, 0, 1920, 5760)
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5, 0, 20)
    this.cameras.main.setBounds(0, 0, 1920, 5760)
  }

  pathSetup () {
    const points1 = [50, 400, 135, 400]
    const flyingPoints = [50, 400, 125, 320, 200, 400]
    this.curve = new Curves.Spline(points1)
    this.flying = new Curves.Spline(flyingPoints)
  }

  triggerSetup () {
    this.endLevel = new Trigger(this, 1800, 5540)
    this.bossHealth = new BossHpTrigger(this, 970, 3300, { healthBarX: 5400, healthBarY: 34, sizeX: 600, sizeY: 28 })
  }

  enemySetup () {
    // set 1200, 5200
    this.miniBoss = new TempBoss2(this, 1060, 1620)
    this.boss = new Boss3(this, 1200, 5200)
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

    if (this.miniBoss.hp > 0) {
      this.miniBoss.update()
    } else if (this.miniBoss.active) {
      this.miniBoss.die()
    }

    if (this.boss.hp > 0) {
      this.boss.update()
    } else if (this.boss.active) {
      this.boss.die()
    }
  }
}
