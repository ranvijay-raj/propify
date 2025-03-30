const refresh = () =>{
  var swiper = new Swiper("#final .mySwiper", {
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
};
ScrollTrigger.refresh()
      const component = document.querySelectorAll(".components")
      const input = document.querySelector("nav input")
      component[0].addEventListener("click", ()=>{
    window.location.href = "/"
  })
  component[1].addEventListener("click", ()=>{
    window.location.href = "/search"
  })
  input.addEventListener("click", ()=>{
      window.location.href = "/search"
  })
  gsap.to("#sort", {
    opacity: 1,
    scrollTrigger: {
    trigger: '#toTop',
    scroller: ".full",
    start: 'top 0',
    scrub: true
  }
  })
  document.querySelector("#toTop").addEventListener("click", ()=>{
    locoScroll.scrollTo(0)
  })