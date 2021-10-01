function deepAssign(targetObj, sourceObj){
    if(!(sourceObj && typeof sourceObj === 'object')) return targetObj
    for(let key in sourceObj){
        if(sourceObj.hasOwnProperty(key)){
            if(sourceObj[key] && typeof sourceObj[key] === 'object'){
                deepAssign(targetObj[key], sourceObj[key])
            }else{
                targetObj[key] = sourceObj[key]
            }
        }
    }
    return targetObj
}

function observeUpdate(target, callback){
    return new Proxy(target, {
        get(target, prop){
            return target[prop]
        },
        set(target, prop, value){
            callback(prop, value)
            target[prop] = value
            return true
        }
    })
}

function rand(min, max){
    return Math.floor(Math.random()*(max-min))+min
}

function throttle(fn, delay = 1000){
    let timer = null
    return function(...rest){
        if(!timer){
            fn.apply(this, rest)
            timer = setTimeout(()=>{
                timer = null
            }, delay)
        }
    }
}

export {deepAssign, observeUpdate, rand, throttle}