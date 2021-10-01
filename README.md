# Web Pet
Web Pet is written in JavaScript and can be used to create a pet on your website.  

## Quick start
Include "web-pet.js" in your HTML. The JavaScript file can be found in dist folder.
```html
<script src="web-pet.js">
```
Then create and config the pet as follows.
```html
<script>
    const MyPet = WebPet.createPet()
    MyPet.mount("#fish")
</script>
```
## Config
You can config the pet as follows.
```javascript
const MyPet = WebPet.createPet({
 // You can change the container div style this way.
    style: {
        right: '150px',
        bottom: '20px',
        position: 'fixed',
        width: '100px',
        height: '100px'
    },
// Happiness decreases by 1 unit every 1000 ms
    happiness_decreasing: {
        time: 1000,
        value: 1,
    },
// The pet waits for [500, 20000) ms before moving around each time.
    wander_interval: {
        min: 500,
        max: 20000,
    },
// Set the pet's image path.
    img_url: './resources/img/pet.png',
})
```
Note that this config will change in the future as I want to make it more customized and add more things to it in the future.  
## Examples
* Right click to drag the pet.
![drag](/docs/drag.gif)
* Animation
![animation](/docs/animation.gif)
* Touch your pet to make it happier.
![interaction](/docs/happiness.gif)
## Notes
* I just got started on it and intend to make it more customized so that you can add your own ideas or design.
* In the future I might consider adopting Canvas to display the pet.
* The pet image currently used in the demo is the mascot of my university (Beijing Language and Culture University). If this is not allowed, please inform me and I will change it as soon as possible.