let detailed = document.querySelector("#detailed")
let type = document.getElementById("type")
let elementsToHide = document.getElementsByClassName("optional")
let priceTag = document.getElementById("priceTag")
let statusTag = document.getElementById("statusTag")
let areaTag = document.getElementById("areaTag")
let areaVal = document.getElementById("areaVal")
type.addEventListener("change", function(){
    if(this.selectedIndex == 2){
        let array = Array.from(elementsToHide)
        array.forEach((element)=>{
            element.style.display = "flex"
            ScrollTrigger.refresh()
        })
        Array.from(document.getElementsByClassName("per")).forEach((el)=>{
          el.style.display = "none"
          ScrollTrigger.refresh()
        })
        elementsToHide[elementsToHide.length-1].style.display="none"
        ScrollTrigger.refresh()
    }
    if(this.selectedIndex ==   0){
        let array = Array.from(elementsToHide)
        array.forEach((element)=>{
            element.style.display = "flex"
            ScrollTrigger.refresh()
        })
        Array.from(document.getElementsByClassName("per")).forEach((el)=>{
          el.style.display = "inline"
          ScrollTrigger.refresh()
        })
    }
    if(this.selectedIndex == 1){
        let array = Array.from(elementsToHide)
        array.forEach((element)=>{
            element.style.display = "none"
            element.firstElementChild.nextElementSibling.required = false
            ScrollTrigger.refresh()
        })
    }
})
statusTag.addEventListener("change", function(){
  if (this.selectedIndex == 0) {
    priceTag.innerHTML = "Price per month (in ₹)"
  } else {
    priceTag.innerHTML = "Price (in ₹)"
  }
})
const refreshIt = ()=>{
  var swiper = new Swiper(".mySwiper", {  
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}
areaTag.addEventListener("change", function(){
  areaVal.innerHTML = "(in " + this.value + ")"
})
const previewMedia = (e)=>{
    let fileContainer = e.target
    let previewsContainer = document.getElementById(fileContainer.dataset.media);
    let toremove = document.querySelectorAll(".toremove")
    for (let i = 0; i < toremove.length; i++) {
      toremove[i].remove()
    }
    if (fileContainer.files) {
      for (var i = 0; i < fileContainer.files.length; i++) {
        let slide = document.createElement('div')
        slide.classList.add("swiper-slide")
        slide.classList.add("toremove")
        let reader = new FileReader();
        reader.onload = function(e) {
          if (fileContainer.dataset.media == "images") {
            let media = document.createElement('img');
            media.src = e.target.result;
            slide.appendChild(media)
            previewsContainer.appendChild(slide);
            refreshIt()
          } else {
            let media = document.createElement('video');
            media.src = e.target.result;
            media.controls = true
            slide.appendChild(media)
            previewsContainer.appendChild(slide);
            refreshIt()
          }
        };
        reader.readAsDataURL(fileContainer.files[i]);
      }
    }
}
const upload = (e)=>{
    e.preventDefault()
    e.target.parentElement.firstElementChild.click()
}
let form = document.getElementById("propertylistingform")
const submitit = (e)=>{
  let Ptitle = document.querySelector("[name='title']")
  let Pprice = document.querySelector("[name='price']")
  let Parea = document.querySelector("[name='area']")
  let Pimage = document.querySelector("[name='mediafile']")
  let Paddress = document.querySelector("[name='address']")
  let Pcity = document.querySelector("[name='city']")
  let Pstate = document.querySelector("[name='state']")
  let Ppin = document.querySelector("[name='pin']")
  let ok = true
  let err
  if (Ptitle.value.trim().length < 4) {
    ok = false
    err = "Title should be At least 4 characters long"
    Ptitle.style.borderColor = "red"
  } else if(Number(Pprice.value) == NaN || Number(Pprice.value) < 100000) {
    ok = false
    if(Number(Pprice.value) == NaN) {
      err = "You should not use any symbol while writing Price"
    } else{
      err = "Price should not be less than 1 lakhs"
    }
    Pprice.style.borderColor = "red"
  } else if(Number(Parea.value) == NaN || Number(Parea.value) <= 0) {
    ok = false
    if (Number(Parea.value) == NaN) {
      err = "You should not use any symbol while writing Area"
    } else {
      err = "area should be equal to or less than zero"
    }
    Parea.style.borderColor = "red"
  }  else if(Pimage.files.length < 2){
    ok = false
    err = "Add at least 2 images"
    Pimage.style.borderColor = "red"
  } else if(Paddress.value.length < 3){
    ok = false
    if(Paddress.value.length == 0){
      err = "Please, Enter the Address"
    } else{
      err = "Address should be at least 3 characters long"
    }
    Paddress.style.borderColor = "red"
  } else if(Pcity.value.length == 0){
    ok = false
    err = "Please fill the city field"
    Pcity.style.borderColor = "red"
  } else if(Pstate.value.length == 0){
    ok = false
    err = "Please fill the state field"
    Pstate.style.borderColor = "red"
  } else if(Number(Ppin.value) == NaN || Number(Ppin.value) <= 0) {
    ok = false
    if(Number(Ppin.value) == NaN) {
      err = "You should not use any symbol while writing Pin Code"
    } else{
      err = "Pin Code should not be equal to or less than zero"
    }
    Ppin.style.borderColor = "red"
  } else if(type.options[type.selectedIndex].value == "APARTMENT" || type.options[type.selectedIndex].value == "FLAT") {
    let Pbedroom = document.querySelector("[name='bedroom']")
    let Pkitchen = document.querySelector("[name='kitchen']")
    let Pbathroom = document.querySelector("[name='bathroom']")
    if(Number(Pbedroom.value) == NaN){
      ok = false
      err = "You should not use any symbol while writing Bedrooms number"
      Pbedroom.style.borderColor = "red"
    } else if(Number(Pbedroom.value) <= 0){
      ok = false
      err = "Number of Bedrooms should not be less than equal to zero"
      Pbedroom.style.borderColor = "red"
    } else if(Number(Pkitchen.value) == NaN){
      ok = false
      err = "You should not use any symbol while writing Kitchens number"
      Pkitchen.style.borderColor = "red"
    } else if(Number(Pkitchen.value) <= 0){
      ok = false
      err = "Number of kitchens should not be less than equal to zero"
      Pkitchen.style.borderColor = "red"
    } else if(Number(Pbathroom.value) == NaN){
      ok = false
      err = "You should not use any symbol while writing Bathrooms number"
      Pbathroom.style.borderColor = "red"
    } else if(Number(Pbathroom.value) <= 0){
      ok = false
      err = "Number of Bathrooms should not be less than equal to zero"
      Pbathroom.style.borderColor = "red"
    } else if(type.options[type.selectedIndex].value == "APARTMENT"){
      let Pfloors = document.querySelector("[name='floors']")
      if(Number(Pfloors.value) == NaN){
        ok = false
        err = "You should not use any symbol while writing Number of floors"
        Pfloors.style.borderColor = "red"
      } else if(Number(Pfloors.value) <= 0){
        ok = false
        err = "Number of floors should not be less than equal to zero"
        Pfloors.style.borderColor = "red"
      }
    }
  }
  if(!ok){
    e.preventDefault()
    let Perror = document.getElementsByClassName("Perror")[0]
    Perror.innerHTML = err
    ScrollTrigger.refresh()
  } else{
    let cover = document.getElementsByClassName("cover")[0]
    cover.style.display = "flex"
    ScrollTrigger.refresh()
    locoScroll.scrollTo(locoScroll.el.scrollHeight)
    document.body.style.overflowY = 'hidden'
  }
}
form.addEventListener("submit", submitit)