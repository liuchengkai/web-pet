import {enableGesture} from './gesture'
import '../resources/css/webpet.css'
import {deepAssign, observeUpdate, rand, throttle} from './utils'


export function createRenderer({querySeletcor, setSize}){
    return {   
        createPet(options){
            return {
                init(el){
                    this.wander_timer = null
                    this.wander_timeout = null
                    this.isWander = false
                    // Init options value
                    this.happiness_decreasing = options.happiness_decreasing
                    this.wander_interval = options.wander_interval
                    // Set the attributes of the container element.
                    for(let attr in options.style){
                        el.style[attr] = options.style[attr]
                    }
                    // Change image url.*************************************
                    for(let sheet of document.styleSheets){
                        if(sheet.cssRules[0].selectorText.indexOf('.wp_')!=-1){
                            for(let cssRule of sheet.cssRules){
                                if(cssRule.selectorText.indexOf('.wp_pet-')!=-1){
                                    cssRule.style.cssText = cssRule.style.cssText.replace('./resources/img/pet.png', options.img_url)
                                }
                            }
                            break
                        }
                    }
                    // *******************************************************
                    // Append pet image *************************************
                    setSize(el, options.width, options.height)
                    const pet = document.createElement('div')
                    pet.classList.add('wp_pet-super-happy')
                    el.appendChild(pet)
                    this.pet = pet
                    enableGesture(pet)
                    // ********************************************************
                    // Append happiness bar *********************************
                    const bar_container = document.createElement('div')
                    bar_container.classList.add('wp_progress-container')
                    this.happiness_bar = document.createElement('div')
                    bar_container.appendChild(this.happiness_bar)
                    this.happiness_bar.classList.add('wp_progress-bar')
                    el.appendChild(bar_container)
                    // ******************************************************** 
                    // Right click to drag pet *********************************
                    let startPos = {x: 0, y: 0}, elemPos = {x: 0, y: 0}
                    el.addEventListener("dragpetstart", (e)=>{
                        startPos.x = e.clientX
                        startPos.y = e.clientY
                    })
                    el.addEventListener("dragpetmove", (e)=>{
                        let dx = e.clientX - startPos.x, dy = e.clientY - startPos.y
                        el.style.transform = `translate3d(${elemPos.x + dx}px, ${elemPos.y + dy}px,0)`
                　　if (e.stopPropagation) {
                    　　　　e.stopPropagation()
                　　}else{
                    　　　　e.cancelBubble = true
                　　}
                    })
                    el.addEventListener("dragpetend", (e)=>{
                        let dx = e.clientX - startPos.x, dy = e.clientY - startPos.y
                        // Update new position
                        elemPos.x += dx
                        elemPos.y += dy
                        el.style.transform = `translate3d(${elemPos.x}px, ${elemPos.y}px,0)`
                    })
                    this.pet.addEventListener("pan", throttle((e)=>{
                        this.mypet.isCaress = true
                        if(this.mypet.happiness + 2 <=100){
                            this.mypet.happiness += 2
                        }else{
                            this.mypet.happiness = 100
                        }
                    }))
                    this.pet.addEventListener("panend", (e)=>{
                        this.mypet.isCaress = false
                        this.mypet.happiness = this.mypet.happiness
                    })
                    // ********************************************************
                    // Initialize pet attributes. *******************************
                    this._STATUS = {
                        BASIC: 1,
                        SUPERHAPPY: 2,
                        HAPPY: 3,
                        SAD: 4,
                        ANGRY: 5,
                        SHY: 6
                    }
                    this.mypet = {
                        isCaress: false,
                        state: this._STATUS,
                        happiness: 100,
                    } 
                    this.mypet  = observeUpdate(this.mypet, (props, value) => {
                        if(props == 'happiness'){
                            this.updateProgressBar(value)
                            if(this.mypet.isCaress) return
                            if(value >= 90){
                                if(this.mypet.status != this._STATUS.SUPERHAPPY)
                                    this.mypet.status = this._STATUS.SUPERHAPPY
                            }
                            else if(value >= 80){
                                if(this.mypet.status != this._STATUS.HAPPY)
                                    this.mypet.status = this._STATUS.HAPPY
                            }
                            else if(value >= 60){
                                if(this.mypet.status != this._STATUS.BASIC)
                                    this.mypet.status = this._STATUS.BASIC
                            }
                            else if(value >= 20){
                                if(this.mypet.status != this._STATUS.SAD)
                                    this.mypet.status = this._STATUS.SAD
                            }
                            else
                                if(this.mypet.status != this._STATUS.ANGRY)
                                    this.mypet.status = this._STATUS.ANGRY
                        }else if(props == 'status'){
                            this.updatePetImg(value)
                        }else if(props == 'isCaress'){
                            if(value){
                                this.mypet.status = this._STATUS.SHY
                            }
                        }
                    })
                    this.mypet.happiness = 100
                    let happiness_timer = setInterval(()=>{
                        if(this.mypet.happiness >0){
                            this.mypet.happiness -= this.happiness_decreasing.value
                        }
                    }, this.happiness_decreasing.time)
                    this.random_wander = (min, max)=>{
                        return setTimeout(() => {
                            this.petWander()
                        }, rand(min, max))
                    }
                    this.wander_timeout = this.random_wander(this.wander_interval.min, this.wander_interval.max)
                    // *******************************************************
                },
                updateProgressBar(happiness){
                    this.happiness_bar.style.width = happiness + '%'
                },
                updatePetImg(status){
                    for(let c of this.pet.classList){
                        this.pet.classList.remove(c)
                    }
                    let class_name = ''
                    if(status == this._STATUS.SUPERHAPPY){
                        class_name = 'wp_pet-super-happy'
                    }
                    else if(status == this._STATUS.HAPPY){
                        class_name = 'wp_pet-happy'
                    }
                    else if(status == this._STATUS.BASIC){
                        class_name = 'wp_pet-basic'
                    }
                    else if(status == this._STATUS.SAD){
                        class_name = 'wp_pet-sad'
                    }
                    else if(status == this._STATUS.ANGRY){
                        class_name = 'wp_pet-angry'
                    }
                    else if(status == this._STATUS.SHY){
                        class_name = 'wp_pet-shy'
                    }
                    this.pet.classList.add(class_name)
                },
                petWander(){
                    this.isWander = true
                    this.pet.style.transform = `translate3d(0,0,0) rotate(0deg)`
                    let wander_distance = 0, wander_max = 150, rotate = 0, rotate_max = 10, direction = -1, rotate_dir = 1
                    let count = 0
                    if(this.wander_timer) clearInterval(this.wander_timer)
                    this.wander_timer = setInterval(()=> {
                        let new_distance = wander_distance + direction * 1
                        let new_rotate = rotate + rotate_dir * 1
                        if(Math.abs(new_distance) > wander_max){
                            wander_distance = wander_max * direction
                            direction *= -1
                            count++
                        }else{
                            wander_distance = new_distance 
                        }
                        if(Math.abs(new_rotate) > rotate_max){
                            rotate = rotate_max * rotate_dir
                            rotate_dir *= -1
                        }else{
                            rotate = new_rotate
                        }
                        if(count == 2 && wander_distance == 0){
                            clearInterval(this.wander_timer)
                            this.wander_timeout = this.random_wander(this.wander_interval.min, this.wander_interval.max)
                            this.isWander = false
                            rotate = 0
                        }
                        this.pet.style.transform = `translate3d(${wander_distance}px, 0, 0) rotate(${rotate}deg) scaleX(${-direction})`
                    }, 16.7) 
                },
                mount(selector){
                    // Process options.
                    const _options = {
                        style: {
                            right: '150px',
                            bottom: '20px',
                            position: 'fixed',
                            width: '100px',
                            height: '100px'
                        },
                        happiness_decreasing: {
                            time: 1000,
                            value: 1,
                        },
                        wander_interval: {
                            min: 500,
                            max: 20000,
                        }
                        //img_url: '/resources/img/pet.png',
                    }
                    options = deepAssign(_options, options)
                    const container = querySeletcor(selector)
                    container.classList.add("wp_container")
                    enableGesture(container)
                    this.init(container)
                }
            }
        }
    }
}
export function createPet(options){
    const renderer = createRenderer({
        querySeletcor(selector){
            return document.querySelector(selector)
        },
        setSize(el, width, height){
            el.style.width = width + 'px'
            el.style.height = height + 'px'
        },

    })
    return renderer.createPet(options)
}