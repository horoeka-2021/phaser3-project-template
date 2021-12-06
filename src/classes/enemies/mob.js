import { Math } from 'phaser'
import { Actor } from '../actor'

export class Mob extends Actor {
  constructor (scene, x, y, texture, config) {
    super(scene, x, y, texture)

    scene.physics.add.existing(this)
    this.name = texture
    if (config === null || config === undefined) {
      this.config = {
        w: 30,
        h: 30,
        xOff: 50,
        yOff: 8,
        scale: 2,
        frameEnds: {
          idle: 4
        }
      }
    } else {
      this.config = config
    }
    this.setAnims()
    this.setScale(this.config.scale)
    this.setSize(this.config.w, this.config.h)
    this.setOffset(this.config.xOff, this.config.yOff)
    this.setColliders(scene)
  }

  setAnims () {
    this.scene.anims.create({
      key: this.name + '-idle',
      frames: this.scene.anims.generateFrameNames(this.name, {
        prefix: 'idle-',
        end: this.config.frameEnds.idle
      }),
      frameRate: 12
    })
  }

  setColliders (scene) {
    scene.physics.world.addOverlap(scene.player, this, () => {
      this.scene.player.getDamage(20)
      this.scene.playerHealthBar.scaleX = (this.scene.player.hp / this.scene.player.maxHealth)
      this.scene.playerHealthBar.x -= (this.scene.player.hp / this.scene.player.maxHealth) - 1
      this.scene.sound.play('playerDamageAudio', { loop: false })
      this.destroy()
    })
    scene.physics.world.addCollider(this, scene.floor)
    scene.physics.world.addCollider(this, scene.platforms)
    scene.physics.world.addOverlap(scene.player.gun, this, (mob, bullet) => {
      bullet.destroy()
      this.destroy()
    })
  }

  spawn (x, y) {
    this.x = x
    this.y = y
    this.setActive(true)
    this.setVisible(true)
    this.body.allowGravity = true
    this.setVelocity(Math.Between(-300, -100), Math.Between(-200, -50))
  }

  update () {
    if (this.active) {
      this.scene.physics.accelerateToObject(this, this.scene.player, 70, 180)
      this.anims.play(this.name + '-idle', true)
    }
  }
}
