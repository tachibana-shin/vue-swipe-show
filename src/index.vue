<template>
   <div :is="tag" :class="[ activeLocap ? classActive : [], animating ? classAnimating : [] ]" :style="disabledAuto ? {} : useTransform ? { transform, transition } : { top, left, transition }">
      <slot name="default" />
   </div>
</template>
<script>
   function getTouches(event) {
      let { type, clientX, clientY, changedTouches } = event
      if (type.match(/^touch/i)) {
         return [...changedTouches]
      }
      if (type.match(/^mouse/i)) {
         return [{ clientX, clientY, identifier: -1 }]
      }
   }

   function toArray(item) {
      return Array.isArray(item) ? item : [item]
   }

   // Test via a getter in the options object to see if the passive property is accessed
   let supportsPassive = false;
   try {
      let opts = Object.defineProperty({}, 'passive', {
         get: function() {
            supportsPassive = true;
         }
      });
      window.addEventListener("testPassive", null, opts);
      window.removeEventListener("testPassive", null, opts);
   } catch (e) {}


   export default {
      listeners: [],
      props: {
         tag: {
            type: String,
            default: "div"
         },
         type: {
            type: String,
            default: "left"
         },
         areaActive: {
            type: [Number],
            default: 10
         },
         speedActive: {
            type: Number,
            default: .15
         },
         active: {
            type: Boolean,
            default: false
         },
         classActive: {
            type: [String, Array, Object],
            default: ""
         },
         classAnimating: {
            type: [String, Array, Object],
            default: ""
         },
         event: {
            type: Array,
            default: () => [
            ["touchstart", "mousedown"],
            ["touchmove", "mousemove"],
            ["touchend", "mouseup"]
         ]
         },
         disabledAuto: {
            type: Boolean,
            default: false
         },
         noTransition: Boolean,
         timing: {
            type: String,
            default: "ease"
         },
         duration: {
            type: Number,
            default: .4
         },
         preventDefault: {
            type: Boolean,
            default: true
         },
         stopPropagation: Boolean,
         useTransform: Boolean,
			clickable: Boolean
      },
      data: () => ({
         top: undefined,
         left: undefined,
         activeLocap: this.active,
         animating: false
      }),
      computed: {
         width() {
            return this.$el ? this.$el.offsetWidth : 0
         },
         height() {
            return this.$el ? this.$el.offsetHeight : 0
         },
         innerWidth() {
            return innerWidth
         },
         innerHeight() {
            return innerHeight
         },
         transition() {
            if (this.animating && !this.noTransition) {
               if (this.useTransform) {
                  return `transform ${this.duration}s ${this.timing}`
               } else {
                  if (this.type.match(/^left|right$/i)) {
                     return `left ${this.duration}s ${this.timing}`
                  }
                  if (this.type.match(/^top|bottom$/i)) {
                     return `top ${this.duration}s ${this.timing}`
                  }
               }
            }
         },
         transform() {
            return `${ this.left !== undefined ? "translateX(" + this.left + ")" : "" } ${ this.top !== undefined ? "translateY(" + this.top + ")" : "" }`
         }
      },
      methods: {
         setDefaults() {
            switch (this.type.toUpperCase()) {
               case "LEFT":
                  this.top = undefined
                  this.left = `${this.activeLocap ? 0 : -this.width}px`
                  break
               case "RIGHT":
                  this.top = undefined
                  this.left = `${this.activeLocap ? this.innerWidth - this.width : this.innerWidth}px`
                  break
               case "TOP":
                  this.left = undefined
                  this.top = `${this.activeLocap ? 0 : -this.height}px`
                  break
               case "BOTTOM":
                  this.left = undefined
                  this.top = `${this.activeLocap ? this.innerHeight - this.height : this.innerHeight}px`
                  break
            }
         },
         emitProgress() {
            switch (this.type.toUpperCase()) {
               case "LEFT":
                  this.$emit("update:left-area", parseFloat(this.left) + this.width)
                     .$emit("progress", (1 + parseFloat(this.left) / this.width) * 100)
                  break
               case "RIGHT":
                  this.$emit("update:right-area", this.innerWidth - parseFloat(this.left))
                     .$emit("progress", (this.innerWidth - parseFloat(this.left)) / this.width * 100)
                  break
               case "TOP":
                  this.$emit("update:top-area", parseFloat(this.top) + this.height)
                  this.$emit("progress", (1 + parseFloat(this.top) / this.height) * 100)
                  break
               case "BOTTOM":
                  this.$emit("update:bottom-area", this.innerHeight - parseFloat(this.top))
                  this.$emit("progress", (this.innerHeight - parseFloat(this.top)) / this.height * 100)
                  break
            }
         },
         offAllEvent() {
            this.$options.listeners.forEach(item => item.el.removeEventListener(item.name, item.listener, supportsPassive ? { passive: true } : undefined))
         }
      },
      watch: {
         type: "setDefaults",
         active(newVal) {
            this.activeLocap = newVal

            this.animating = true
            this.setDefaults()

         },
         activeLocap(newVal) {
            this.$emit("update:active", newVal)
         },
         top: "emitProgress",
         left: "emitProgress",
         animating(newVal) {
            this.$emit("update:animating", newVal)
         },
         event: {
            handler(newVal) {
               this.offAllEvent()
               let lastMove = {}
               let lastTime = null
               const start = (event) => {
                  lastMove = getTouches(event).find(nowMove => {
                     let update = false

                     switch (this.type.toUpperCase()) {
                        case "LEFT":
                           update = this.activeLocap ? nowMove.clientX < this.width : nowMove.clientX < this.areaActive
                           break
                        case "RIGHT":
                           update = this.activeLocap ? this.innerWidth - nowMove.clientX < this.width : this.innerWidth - nowMove.clientX < this.areaActive
                           break
                        case "TOP":
                           update = this.activeLocap ? nowMove.clientY < this.height : nowMove.clientY < this.areaActive
                           break
                        case "BOTTOM":
                           update = this.activeLocap ? this.innerHeight - nowMove.clientY < this.height : this.innerHeight - nowMove.clientY < this.areaActive
                           break
                     }

                     if (update) {
                        lastTime = performance.now()
                        return true
                     }
                  })
                  this.animating = false
                  // getComputedStyle(this.$el).left !== this.leftNow
                  // this.leftNow wait dom load done!

                  // if menu moving -> stop
               }
               const move = (event) => {
                  const nowMove = getTouches(event).find(e => !lastMove || e.identifier === lastMove.identifier)

                  if (!this.activeLocap && lastMove && nowMove) {
                     switch (this.type.toUpperCase()) {
                        case "LEFT":
                           this.left = `${Math.min(Math.max(nowMove.clientX - lastMove.clientX - this.width, -this.width), 0)}px`
                           break
                        case "RIGHT":
                           this.left = `${Math.max(Math.min(this.innerWidth - (lastMove.clientX - nowMove.clientX), this.innerWidth), this.innerWidth - this.width)}px`
                           break
                        case "TOP":
                           this.top = `${Math.min(Math.max(nowMove.clientY - lastMove.clientY - this.height, -this.height), 0)}px`
                           break
                        case "BOTTOM":
                           this.top = `${Math.max(Math.min(this.innerHeight - (lastMove.clientY - nowMove.clientY), this.innerHeight), this.innerHeight - this.height)}px`
                           break
                     }
                  }
                  if (this.activeLocap && nowMove) {
                     switch (this.type.toUpperCase()) {
                        case "LEFT":
                           if (nowMove.clientX < this.width) {
                              if (!lastMove) {
                                 lastMove = nowMove
                              }
                              this.left = `${Math.min(Math.max(nowMove.clientX - lastMove.clientX, -this.width), 0)}px`
                           }
                           break
                        case "RIGHT":
                           if (this.innerWidth - nowMove.clientX < this.width) {
                              if (!lastMove) {
                                 lastMove = nowMove
                              }

                              this.left = `${Math.max(Math.min(this.innerWidth - (lastMove.clientX - nowMove.clientX)  - this.width, this.innerWidth), this.innerWidth - this.width)}px`
                           }
                           break
                        case "TOP":
                           if (nowMove.clientY < this.height) {
                              if (!lastMove) {
                                 lastMove = nowMove
                              }

                              this.top = `${Math.min(Math.max(nowMove.clientY - lastMove.clientY, -this.height), 0)}px`
                           }
                           break
                        case "BOTTOM":
                           if (this.innerHeight - nowMove.clientY < this.height) {
                              if (!lastMove) {
                                 lastMove = nowMove
                              }

                              this.top = `${Math.max(Math.min(this.innerHeight - (lastMove.clientX - nowMove.clientX) - this.height, this.innerHeight), this.innerHeight - this.height)}px`
                           }
                           break
                     }
                  }

                  if (lastMove && nowMove) {
                     try {
                        if (this.stopPropagation) {
                           this.stopPropagation()
                        }
                        if (this.preventDefault) {
                           event.preventDefault()
                        }
                     } catch (e) {}
                  }
               }
               const end = (event) => {
                  this.animating = true

                  setTimeout(() => {
                     if (lastMove) {
                        const nowMove = getTouches(event).find(e => e.identifier === lastMove.identifier)
                        if (nowMove) {
                           const [dx, dy, dt] = [
                     nowMove.clientX - lastMove.clientX,
                     nowMove.clientY - lastMove.clientY,
                     performance.now() - lastTime
                  ]
                           const [sx, sy] = [
                     dx / dt,
                     dy / dt
                  ]

                           const [top, left] = [
                     parseFloat(getComputedStyle(this.$el).top),
                     parseFloat(getComputedStyle(this.$el).left)
                  ]


                           switch (this.type.toUpperCase()) {
                              case "LEFT":
                                 if (Math.abs(sx) >= this.speedActive) {
                                    this.activeLocap = sx > 0
                                    this.left = sx < 0 ? `${-this.width}px` : "0"
                                 } else {
                                    this.activeLocap = -left <= this.width / 2
                                    this.left = -left > this.width / 2 ? `${-this.width}px` : "0"
                                 }
                                 break
                              case "RIGHT":
                                 if (Math.abs(sx) >= this.speedActive) {
                                    this.activeLocap = sx < 0
                                    this.left = sx < 0 ? `${this.innerWidth - this.width}px` : `${this.innerWidth}px`
                                 } else {
                                    this.activeLocap = this.innerWidth - left > this.width / 2
                                    this.left = this.innerWidth - left > this.width / 2 ? `${this.innerWidth - this.width}px` : `${this.innerWidth}px`
                                 }
                                 break
                              case "TOP":
                                 if (Math.abs(sy) >= this.speedActive) {
                                    this.activeLocap = sy > 0
                                    this.top = sy < 0 ? `${-this.height}px` : "0"
                                 } else {
                                    this.activeLocap = -top <= this.height / 2
                                    this.top = -top > this.height / 2 ? `${-this.height}px` : "0"
                                 }
                                 break
                              case "BOTTOM":
                                 if (Math.abs(sy) >= this.speedActive) {
                                    this.activeLocap = sy < 0
                                    this.top = sy < 0 ? `${this.innerHeight - this.height}px` : `${this.innerHeight}px`
                                 } else {
                                    this.activeLocap = this.innerHeight - top > this.height / 2
                                    this.top = this.innerHeight - top > this.height / 2 ? `${this.innerHeight - this.height}px` : `${this.innerHeight}px`
                                 }
                                 break
                           }
                        }
                     }

                  })
               }
               if (this.clickable) {
                  const handler = ({ clientX, clientY }) => {
                     switch (this.type.toUpperCase()) {
                        case "LEFT":
                           if (clientX > this.width) {
                              this.animating = true
                              this.activeLocap = false
                              this.setDefaults()
                           }
                           break
                        case "RIGHT":
                           if (clientX < this.innerWidth - this.width) {
                              this.animating = true
                              this.activeLocap = false
                              this.setDefaults()
                           }
                           break
                        case "TOP":
                           if (clientY > this.height) {
                              this.animating = true
                              this.activeLocap = false
                              this.setDefaults()
                           }
                           break
                        case "BOTTOM":
                           if (clientY < this.innerHeight - this.height) {
                              this.animating = true
                              this.activeLocap = false
                              this.setDefaults()
                           }
                           break
                     }
                  }
						document.addEventListener("click", handler)
                  this.$options.listeners.push({ el: document, name: "click", listener: handler })
               }
               toArray(newVal[0]).forEach(item => {
                  window.addEventListener(item, start)
                  this.$options.listeners.push({
                     name: item,
							el: window,
                     listener: start
                  }, supportsPassive ? { passive: true } : undefined)
               })
               toArray(newVal[1]).forEach(item => {
                  window.addEventListener(item, move, supportsPassive ? { passive: true } : undefined)
                  this.$options.listeners.push({
                     name: item,
							el: window,
                     listener: move
                  })
               })
               toArray(newVal[2]).forEach(item => {
                  window.addEventListener(item, end)
                  this.$options.listeners.push({
                     name: item,
							el: window,
                     listener: end
                  }, supportsPassive ? { passive: true } : undefined)
               })
            },
            immediate: true
         }
      },
      mounted() {
         this.setDefaults()
      },
      beforeDestroy() {
         this.offAllEvent()
      }
   }
</script>
