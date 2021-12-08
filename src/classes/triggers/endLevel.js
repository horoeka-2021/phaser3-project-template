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

    this.setVisible(true)
    this.setActive(true)

    this.scene.anims.create({
      key: 'portal-idle',
      frames: this.scene.anims.generateFrameNames('end-level', {
        prefix: 'idle-',
        end: 4
      }),
      duration: 1000,
      repeat: true
    })

    const triggerZone = scene.physics.world.addOverlap(this, this.scene.player, () => {
      this.scene.time.addEvent({
        delay: 2500,
        callback: () => this.scene.changeScene()
      })
      this.scene.sound.play('portalAudio', { volume: 0.2, loop: false })
      this.scene.physics.world.removeCollider(triggerZone)
    })
  }

  update () {
    if (this.active) {
      this.anims.play('portal-idle', true)
    }
  }
}
