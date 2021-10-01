export function enableGesture(ele){
    let contexts = {}
    const MOUSE_TYPE = Symbol("mouse")
    if(!("ontouchstart" in document)){
        ele.addEventListener("mousedown", (e) => {
            contexts[MOUSE_TYPE] = {}
            if(e.button == 0){
                onStart(e, contexts[MOUSE_TYPE])
                let move = e => {
                    onMove(e, contexts[MOUSE_TYPE])
                }
                let end = e => {
                    onEnd(e, contexts[MOUSE_TYPE])
                    document.removeEventListener("mousemove", move)
                }
                document.addEventListener("mousemove", move)
                document.addEventListener("mouseup", end, {once: true})
            }else if(e.button == 2){
                onDragStart(e, contexts[MOUSE_TYPE])
                let contextMenu = e => {
                    document.removeEventListener("contextmenu", contextMenu)
                    e.preventDefault()
                }
                let dragMove = e => {
                    onDragMove(e, contexts[MOUSE_TYPE])
                }
                let dragEnd = e => {
                    if(!contexts[MOUSE_TYPE].isDrag) return
                    onDragEnd(e, contexts[MOUSE_TYPE])
                    document.removeEventListener("mousemove", dragMove)
                    document.removeEventListener("mousemove", dragEnd)
                    ele.removeEventListener("mouseleave", dragMove)
                }
                document.addEventListener("contextmenu", contextMenu)
                document.addEventListener("mousemove", dragMove, true)
                ele.addEventListener("mouseleave", dragEnd)
                document.addEventListener("mouseup", dragEnd)
            }
        })
    }
    contexts[MOUSE_TYPE] = {}
    ele.addEventListener("touchstart", (e)=>{
        for(let touch of e.changedTouches){
            onStart(touch, contexts[MOUSE_TYPE])
        }
    })
    ele.addEventListener("touchmove", (e)=>{
        for(let touch of e.changedTouches){
            onMove(touch, contexts[MOUSE_TYPE])
        }
    })
    ele.addEventListener("touchend", (e)=>{
        for(let touch of e.changedTouches){
            onEnd(touch, contexts[MOUSE_TYPE])
        }
    })
    let onStart = (e, contexts) => {
        e.preventDefault()
        ele.dispatchEvent(Object.assign(new CustomEvent("start"), {
            clientX: e.clientX,
            clientY: e.clientY
        }))
        contexts.isTap = true
        contexts.startX = e.clientX
        contexts.startY = e.clientY
        clearTimeout(contexts.timeout)
        contexts.timeout = setTimeout(() => {
            contexts.isTap = false
            contexts.isPress = true
            ele.dispatchEvent(Object.assign(new CustomEvent("pressstart"), {
                clientX: e.clientX,
                clientY: e.clientY,
            }))
        }, 500)
    }
    let onMove = (e, contexts) => {
        let dx = e.clientX - contexts.startX
        let dy = e.clientY - contexts.startY
        let pan_distance = dx ** 2 + dy ** 2
        //console.log(pan_distance)
        ele.dispatchEvent(Object.assign(new CustomEvent("move"), {
            clientX: e.clientX,
            clientY: e.clientY
        }))
        if(pan_distance > 100 && (!contexts.isPan)){
            contexts.isPan = true
            if(contexts.isPress){
                ele.dispatchEvent(Object.assign(new CustomEvent("presscancel"), {
                    clientX: e.clientX,
                    clientY: e.clientY,
                }))
            }
            clearTimeout(contexts.timeout)
            contexts.isTap = false
            contexts.isPress = false
            ele.dispatchEvent(Object.assign(new CustomEvent("panstart"), {
                clientX: e.clientX,
                clientY: e.clientY,
                startX: contexts.startX,
                startY: contexts.startY
            }))
            return
        }
        if(contexts.isPan){
            ele.dispatchEvent(Object.assign(new CustomEvent("pan"), {
                clientX: e.clientX,
                clientY: e.clientY,
                startX: contexts.startX,
                startY: contexts.startY
            }))
        }
    }
    let onEnd = (e, contexts) => {
        if(contexts.isPan){
            ele.dispatchEvent(Object.assign(new CustomEvent("panend"), {
                clientX: e.clientX,
                clientY: e.clientY,
                startX: contexts.startX,
                startY: contexts.startY
            }))
            contexts.isPan = false
        }
        if(contexts.isTap){
            ele.dispatchEvent(Object.assign(new CustomEvent("tap"), {
                clientX: e.clientX,
                clientY: e.clientY
            }))
            contexts.isTap = false
        }
        if(contexts.isPress){
            ele.dispatchEvent(Object.assign(new CustomEvent("press"), {
                clientX: e.clientX,
                clientY: e.clientY
            }))
            contexts.isPress = false
        }
        ele.dispatchEvent(Object.assign(new CustomEvent("end"), {
            clientX: e.clientX,
            clientY: e.clientY
        }))
    }

    let onDragStart = (e, contexts) => {
        ele.dispatchEvent(Object.assign(new CustomEvent("dragpetstart"), {
            clientX: e.clientX,
            clientY: e.clientY
        }))
        contexts.isDrag = true
        contexts.startX = e.clientX
        contexts.startY = e.clientY
    }
    let onDragMove = (e, contexts) => {
        if(!contexts.isDrag) return
        ele.dispatchEvent(Object.assign(new CustomEvent("dragpetmove"), {
            clientX: e.clientX,
            clientY: e.clientY
        }))
    }

    let onDragEnd = (e, contexts) => {
        if(!contexts.isDrag) return
        contexts.isDrag = false
        ele.dispatchEvent(Object.assign(new CustomEvent("dragpetend"), {
            clientX: e.clientX,
            clientY: e.clientY
        }))
    }
}