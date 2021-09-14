window.$ = window.jQuery = function(stringOrArray) {
    let elements
    if(typeof stringOrArray === 'string'){
        if(stringOrArray.trim()[0] === '<'){
            elements = [createElements(stringOrArray)]
        }else{
            elements = document.querySelectorAll(stringOrArray)
        }
    }else if(stringOrArray instanceof Array){
        elements = stringOrArray
    }

    function createElements(string){
        const container = document.createElement('template')
        container.innerHTML = string.trim()
        return container.content.firstChild
    }
    const api = Object.create(jQuery.prototype)
    Object.assign(api, {
        elements : elements,
        oldApi : stringOrArray.oldApi
    })
    // 相当于上面两行
    // api.elements = elements
    // api.oldApi = stringOrArray.oldApi
    return api
}

jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    jquery: true,
    get(index){
      return this.elements[index]
    },
    classAdd(className){
        for(let i=0; i<this.elements.length; i++){
            this.elements[i].classList.add(className)
        }
        return this
    },
    find(selector){
        let array = []
        for(let i=0; i<this.elements.length; i++){
            array = array.concat(Array.from(this.elements[i].querySelectorAll(selector)))
        }
        array.oldApi = this
        return jQuery(array)
    },
    each(fn){
        for(let i=0; i<this.elements.length; i++){
            fn.call(null, this.elements[i], i)
        }
        return this
    },
    parent(){
        const array = []
        this.each((node)=>{
            if(array.indexOf(node.parentNode) === -1) {
                array.push(node.parentNode)
            }
        })
        array.oldApi = this
        return jQuery(array)
    },
    children(){
        const array = []
        this.each((node)=>{
            array.push(...node.children)
        })
        array.oldApi = this
        return jQuery(array)
    },
    siblings(){
        const array = []
        this.each((node)=>{
            array.push(...Array.from(node.parentNode.children).filter((n)=>n!==node))
        })
        array.oldApi = this
        return jQuery(array)
    },
    index(){
        const array = []
        this.each((node)=>{
            let x = node.parentNode.children
            for(let i=0;i<x.length; i++){
                if(x[i] === node) {
                    array.push(i)
                }
            }
        })
        array.oldApi = this
        return jQuery(array)
    },
    next(){
        const array = []
        this.each((node)=>{
            let x = node.nextSibling
            while(x && x.nodeType === 3){
                x = x.nextSibling
            }
            array.push(x)
        })
        array.oldApi = this
        return jQuery(array)
    },
    prev(){
        const array = []
        this.each((node)=>{
            let x = node.previousSibling
            while(x && x.nodeType === 3){
                x = x.previousSibling
            }
            array.push(x)
        })
        array.oldApi = this
        return jQuery(array)
    },
    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => node.appendChild(el))
        } else if (node.jquery === true) {
            this.each(el => node.get(0).appendChild(el))
        }
        return this
    },
    remove(){
        this.each(node => node.parentNode.removeChild(node))
        // this.each(node => node.remove())
        return this
    },
    empty(){
        this.each(node => {
            while(node.children.length !== 0){
                node.children[0].remove()
            }
        })
        return this
    },
    text(string){
        const array = []
        this.each(node=>{
            if(arguments.length === 1){
                if('innerText' in node){
                    node.innerText = string
                }else{
                    node.textContent = string
                }
            }else{
                if('innerText' in node){
                    array.push(node.innerText)
                }else{
                    array.push(node.textContent)
                }
            }
        })
        array.oldApi = this
        return jQuery(array)
    },
    html(string){
        const array = []
        this.each(node=>{
            if(arguments.length === 1){
                node.innerHTML = string
            }else{
                array.push(node.innerHTML)
            }
        })
        array.oldApi = this
        return jQuery(array)
    },
    attr(name, value){
        const array = []
        this.each(node=> {
            if (arguments.length === 2) {
                node.setAttribute(name, value)
            } else if (arguments.length === 1) {
                array.push(node.getAttribute(name))
            }
        })
        array.oldApi = this
        return jQuery(array)
    },
    css(name, value){
        const array = []
        if(arguments.length === 2){
            this.each(node=> node.style[name] = value)
        }else if(arguments.length === 1){
            if(typeof name === 'string'){
                this.each(node=>array.push(node.style[name]))
            }else if(name instanceof Object){
                this.each(node=> {
                    for(let i in name){
                        node.style[i] = name[i]
                    }
                })
            }
        }
        array.oldApi = this
        return jQuery(array)
    },
    on(eventName, fn){
        this.each(node=> {
            node.addEventListener(eventName, fn)
        })
        return this
    },
    off(eventName, fn){
        this.each(node=> {
            node.removeEventListener(eventName, fn)
        })
        return this
    },
    print(){
        console.log(this.elements)
        return this
    },
    end(){
        return this.oldApi
    }
}