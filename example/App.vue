<template>
   <div id="app">
      <header class="header">
         <div class="navbar-brand" @click.stop="active = !active" @touchstart.stop @touchmove.stop @touchend.stop @mousedown.stop @mousemove.stop @mouseup.stop>
            <span class="material-icons">
               menu
            </span>
         </div>
         <div class="logo">
            <img src="https://fptplay.vn/images/logo.png">
         </div>
         <div class="navbar-brand">
            <span class="material-icons">
               search
            </span>
         </div>
         <vue-swipe-show class="collapse-nav" :active.sync="active" use-transform @update:animating="animating = $event" @update:left-area="left = $event">
            <ul class="list">
               <li class="nav-item">
                  <a href="#" class="nav-link active"> Trang chủ </a>
               </li>
               <li class="nav-item">
                  <a href="#" class="nav-link active"> Ứng dụng </a>
               </li>
               <li class="nav-item">
                  <a href="#" class="nav-link active"> Thể loại </a>
               </li>
               <li class="nav-item">
                  <a href="#" class="nav-link active"> Giới thiệu </a>
               </li>
            </ul>
         </vue-swipe-show>
      </header>
      <div class="content" :class="{ animating }" :style="{ left: left + 'px' }">
         kzkxksos
      </div>
   </div>
</template>
<style lang="scss" scoped>
   * {
      margin: 0;
      padding: 0;
   }

   body,
   :root {
      background-color: rgb(17, 17, 17);
   }

   *,
   ::after,
   ::before {
      box-sizing: border-box;
   }

   button {
      outline: none;
      border: 0;
   }

   button:focus {
      outline: none;
   }

   hr {
      background-color: currentcolor;
      border: 0;
      margin: 1rem 0;
      opacity: 0.25,
   }

   *,
   ::after,
   ::before {
      box-sizing: border-box
   }

   a {
      text-decoration: none;
   }

   @font-face {
      font-family: 'Material Icons';
      font-style: normal;
      font-weight: 400;
      src: url(https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNZ.ttf) format('truetype');
   }

   .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
   }


   $width-expand: 728px;

   #app {
      .header {
         display: flex;
         align-items: center;
         justify-content: space-between;
         background-color: rgb(0, 0, 0);
         width: 100%;
         z-index: 1024;
         position: fixed;
         top: 0;
         left: 0;

         .logo {
            font-size: 2.1rem;

            @media (min-width: $width-expand) {
               padding: {
                  left: 18px;
                  right: 18px;
               }
            }

         }

         .navbar-brand {
            span {
               height: 55px;
               line-height: 55px;
               font-size: 24px;
               color: rgb(255, 255, 255);
            }

            padding: {
               left: 18px;
               right: 18px;
            }

            @media (min-width: $width-expand) {
               display: none;
            }
         }

         .collapse-nav {
            flex: 0 0 100%;
            box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0, 0 rgba(0, 0, 0, 0.12) 0 1px 5px 0, rgba(0, 0, 0, 0.2) 0 3px 1pX -2px;
            overflow-y: auto;
            padding-bottom: 60px;
            transform: translateX(-105%);
            will-change: transform;
            z-index: 999;
            backface-visibility: hidden;
            //transition: transform .4s ease;
            background-color: rgb(255, 255, 255);
            height: calc(100% + 60px);
            left: 0;
            position: fixed;
            top: 0;

            width: 250px;

            &.active {
               transform: translateX(0);
            }

            @media (min-width: $width-expand) {
               transform: none;
               background-color: transparent;
               width: auto;
               position: static;
               height: auto;
               padding: 0;
               box-shadow: none;
               display: inline;
               flex: 0 0 auto;
               overflow: visible;
            }

            .list {
               margin: 0;
               padding: 0;
               list-style: none;

               @media (min-width: $width-expand) {
                  display: flex;
                  align-items: center;
               }

               .nav-item {
                  line-height: 40px;

                  &>>>.nav-link {
                     transition: background-color .3s ease;
                     cursor: pointer;
                     display: block;
                     font-size: 1rem;
                     color: rgba(0, 0, 0, 0.87);

                     @media (min-width: $width-expand) {
                        color: rgba(255, 255, 255, .87);
                     }

                     font-size: 14px;
                     font-weight: 500;
                     height: 40px;
                     line-height: 40px;

                     padding: 0 20px;

                     @media (min-width: $width-expand) {
                        padding: 0;
                        margin-right: 20px;
                     }

                     .material-icons {
                        vertical-align: middle;
                     }

                     &:hover,
                     &.active {
                        color: rgb(255, 101, 0);
                        transition: all .4s ease;
                        background-color: rgba(0, 0, 0, .05);

                        @media (min-width: $width-expand) {
                           color: rgb(255, 255, 255);
                           background-color: transparent;

                           &.active {
                              border-bottom: 3px solid rgb(255, 101, 0);
                           }
                        }
                     }
                  }
               }
            }
         }
      }

      .content {
         position: absolute;
         top: 55px;
         left: 0;

         &.animating {
            transition: left .4s ease;
         }
      }
   }
</style>
<script>
   export default {
      data: () => ({
         animating: false,
         active: false,
         left: 0
      })
   }
</script>