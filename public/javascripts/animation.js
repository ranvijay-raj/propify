gsap.to(".imgContainer", {
    top: "0",
    duration: 2,
    stagger: 2,
    ease: Expo.easeInOut,
    repeat: -1
})
gsap.from('#nav', {
    top: "-10%",
    duration: 1,
    ease: Expo.easeInOut
})
const tabs = document.getElementsByClassName("tab")
const tabC = Array.from(tabs)
tabC.forEach((tab) => {
    tab.addEventListener("click", (e)=>{
        tabs[0].classList.remove("active")
        tabs[1].classList.remove("active")
        tabs[2].classList.remove("active")
        tab.classList.add("active")
        localStorage.setItem("todo", tab.innerHTML)
    })
});
gsap.to('#nav', {
    backgroundColor: '#3d5af1',
    scrollTrigger: {
      trigger: '#text-cointainer',
      scroller: ".full",
      start: 'top 0%',
      scrub: true
    }
});
gsap.from('#register form', {
    opacity: 0,
    scale: 0,
    scrollTrigger: {
      trigger: '#register',
      scroller: ".full",
      start: 'top 16%'
    }
});
const aboutButton = document.getElementById("about-btn");
const contactButton = document.getElementById("contact-btn")
const scroll = (elem)=>{
  locoScroll.scrollTo(elem);
  ScrollTrigger.create({
    trigger: elem,
    start: 'top 0%'
  });
}
aboutButton.addEventListener("click", ()=>{
  scroll("#about")
})
contactButton.addEventListener("click", ()=>{
  scroll("#contact")
})