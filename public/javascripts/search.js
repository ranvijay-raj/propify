const type1s = document.getElementsByClassName("type1")
const type2s = document.getElementsByClassName("type2")
const searchFor = document.getElementById("searchFor")
const type2Container = document.getElementsByClassName("typeContainer")[1]
const nextBtn = document.getElementById("nextBtn")
const searchBtn = document.getElementById("searchBtn")
const component = document.querySelectorAll(".components")
let con1 = false
let con2 = false
let con3 = false
let value = false
let person = false
let type = ""
let type1Array = Array.from(type1s)
let type2Array = Array.from(type2s)
component[1].style.color = "royalblue"
component[0].addEventListener("click", () => {
    window.location.href = "/"
})
component[1].addEventListener("click", () => {
    window.location.href = "/search"
})
const basic = (elemList, current) => {
    elemList[0].classList.remove("typeActive")
    elemList[1].classList.remove("typeActive")
    current.classList.add("typeActive")
}
const checkCondition = () => {
    if (person && con3) {
        nextBtn.disabled = false
        nextBtn.classList.remove("disabled")
    } else {
        if (con1 == true && con2 == true && con3 == true) {
            nextBtn.disabled = false
            nextBtn.classList.remove("disabled")
        }
        if (!con3) {
            nextBtn.disabled = true
            nextBtn.classList.add("disabled")
        }
    }
}
type1Array.forEach((type1) => {
    type1.addEventListener("click", () => {
        basic(type1s, type1)
        if (type1.classList.contains("property")) {
            searchFor.style.height = "44vh"
            type2Container.classList.remove("hide")
            type2Container.classList.add("flex")
            con1 = true
            type2Array.forEach((type2) => {
                if (type2.classList.contains("typeActive")) {
                    type = type2.dataset.select
                    person = false
                    checkCondition()
                }
            })
            if (!con2) {
                nextBtn.disabled = true
                nextBtn.classList.add("disabled")
            }
        }
        else {
            searchFor.style.height = "24vh"
            type2Container.classList.add("hide")
            type2Container.classList.remove("flex")
            con1 = true
            person = true
            checkCondition()
        }
    })
})
type2Array.forEach((type2) => {
    type2.addEventListener("click", () => {
        type = type2.dataset.select
        basic(type2s, type2)
        con2 = true
        checkCondition()
    })
})
searchBtn.addEventListener("input", () => {
    if (searchBtn.value.trim().length > 3) {
        con3 = true
    }
    else {
        con3 = false
    }
    checkCondition()
})
nextBtn.addEventListener("click", ()=>{
    if(person){
        type = "PERSON"
    }
    window.location.href = `/searched?q=${searchBtn.value}&t=${type}`
})