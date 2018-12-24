<script>
import Base from '@/components/Base.vue'
import _ from 'lodash'
let sprites = [{
    x: 0,
    y: 0,
    width: 308,
    height: 88
  },
  {
    x: 0,
    y: 249,
    width: 179,
    height: 108
  },
  {
    x: 0,
    y: 358,
    width: 214,
    height: 65
  },
  {
    x: 309,
    y: 167,
    width: 172,
    height: 58
  },
  {
    x: 309,
    y: 370,
    width: 166,
    height: 47
  },
  {
    x: 419,
    y: 488,
    width: 94,
    height: 57
  }
]

export default {
  extends: Base,
  name: 'Cloud',
  data() {
    return {
      spin: 0,
      x: 0,
      y: 0,
      sx: 0,
      sy: 0,
      width: 0,
      height: 0,
      sprite: null
    }
  },
  methods: {
    created() {
      this.initialize()
    },
    initialize() {
      let direction = Math.random() > 0.5 ? -1 : 1;
      this.sprite = sprites[_.random(sprites.length - 1)]
      this.x = (direction > 0 ? -this.sprite.width : this.ctx.canvas.width) - _.random(200) * direction
      this.y = _.random(150)
      this.sx = direction * (Math.random() * 10 + 10)
      this.sy = 0
      let scale = Math.random() * 0.5 + 0.5
      this.width = this.sprite.width * scale
      this.height = this.sprite.height * scale
    },
    render(ctx) {
      ctx.drawImage(this.provider.images['menu-atlas'],
        this.sprite.x,
        this.sprite.y,
        this.sprite.width,
        this.sprite.height,
        this.x,
        this.y + Math.sin(this.spin) * 2,
        this.sprite.width,
        this.sprite.height - Math.sin(this.spin) * 4)
    },
    update(dt) {
      this.spin += dt * Math.PI
      this.x += this.sx * dt
      this.y += this.sy * dt
      if (this.sx > 0 && this.x > this.ctx.canvas.width) {
        this.initialize()
      }
      if (this.sx < 0 && this.x < -this.sprite.width) {
        this.initialize()
      }
    }
  }
}
</script>
