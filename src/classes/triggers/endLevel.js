import { Physics } from 'phaser'

export class Trigger extends Physics.Arcade.Sprite {
  constructor (scene, x, y) {
    super(scene, x, y)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.body.allowGravity = false
    this.body.setImmovable(true)
    this.body.setSize(45, 80)
    this.body.setOffset(45, 22)
    this.setScale(0.8)

    this.setVisible(false)
    this.setActive(false)

    this.scene.anims.create({
      key: 'portal-idle',
      frames: this.scene.anims.generateFrameNames('end-level', {
        prefix: 'idle-',
        end: 4
      }),
      duration: 1000,
      repeat: true
    })
  }

  update () {
    if (this.active) {
      this.anims.play('portal-idle', true)
    }
  }
}
