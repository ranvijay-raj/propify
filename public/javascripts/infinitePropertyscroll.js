let page = 1; // Initial page number
let fetchingData = false; // Flag to prevent simultaneous requests
const queryString = new URLSearchParams(window.location.search)
const eventEmitter = new EventTarget();
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    // User has scrolled to the bottom
    fetchData(undefined);
  }
});
if (queryString.get("t") == "PERSON") {
  sort.style.display = "none" 
}
async function fetchData(sort) {
  if (fetchingData) return; // If already fetching data, exit
  fetchingData = true; // Set flag to indicate data fetching in progress
  const response = await fetch(`/api/properties?page=${page}&type=${queryString.get("t")}&search=${queryString.get("q")}&sort=${sort}`);
  const { properties, moreDataAvailable, user} = await response.json();
  const dataList = document.getElementById('final');
  ScrollTrigger.refresh()
  properties.forEach((property) => {
    ScrollTrigger.refresh()
    if (property.price > 10000000 || property.price == 10000000) {
      property.price = `${(property.price / 10000000).toFixed(2)} cr.`
    } else if (property.price > 100000 || property.price == 100000) {
      property.price = `${(property.price / 100000).toFixed(2)} lac.`
    } else {
      property.price = `${property.price}`
    }
    if (queryString.get("t") !== "PERSON") {
        if (property.sold == "no") {
          ScrollTrigger.refresh()
            dataList.innerHTML += `
              <div class="resultedDiv flex border">
                <div class="swiper mySwiper">
                  <div class="swiper-wrapper">
                  ${
                    property.media.map((media)=>{
                      return `<div class="swiper-slide">
                        ${
                          (media.includes("mp4")) ? `<video controls muted>
                            <source src="${media}" type="video/mp4">
                          </video>` : `<img src="${media}">`
                        }
                      </div>`
                    }).join("")
                  }   
                  </div>
                  <div class="swiper-button-next"></div>
                  <div class="swiper-button-prev"></div>
                  <div class="swiper-pagination"></div>
                </div>
                <div class="details flex">
                  <div class="flex" style="justify-content: space-between; width: 100%;"><h5 style="margin: 0 auto;" onclick="location.href='/profile/${property.owner._id}'">${property.owner.fullName}</h5> <div class="svg" style="height: auto; width: auto;"><svg xmlns="http://www.w3.org/2000/svg" data-objectid="${property._id}" width="26" height="26" fill="currentColor" style="color: ${(user !== "no need" && user.wishlist.includes(property._id)) ? "red" : "black"}; margin-right: 2vw" class="bi bi-heart-fill" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                  </svg></div></div>
                  <h4 style="text-transform: capitalize;">${property.title}</h4>
                  <div class="flex prices border" onclick="window.location.href ='/property?id=' + '${property._id}'">
                    <div class="price flex">
                      <h4 style="font-weight: 500;">Price</h4>
                      <h2>₹${property.price}</h2>
                    </div>
                    <div class="price flex">
                      <h4 style="font-weight: 500;">Area</h4>
                      <h2>${property.area} sqft.</h2>
                    </div>
                    ${
                      (property.type !== "PLOT/LAND") ? `<div class="price flex">
                      <h4 style="font-weight: 500;">Inclusions</h4>
                      <h2><i class="fa-solid fa-bed"></i> ${property.inclusions[0].bedroom}</h2>
                      <h2><i class="fa-solid fa-kitchen-set"></i> ${property.inclusions[0].kitchen}</h2>
                      <h2><i class="fa-solid fa-bath"></i> ${property.inclusions[0].bathroom}</h2>
                    </div>` : ``
                    }
                  </div>
                  <div class="contacthim flex">
                    <button class="flex border"  onclick="viewNumber('${property.owner.mobile}', 'true', '${property._id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                    </svg> View Number</button>
                  </div>
                </div>
              </div>`
              ScrollTrigger.refresh()
        }
    }
    else{
      ScrollTrigger.refresh()
      dataList.innerHTML += `
      <div class="person" onclick="window.location.href='/profile/${property._id}'">
      <img src="${property.dp}" alt="">
      <div style="display: flex;justify-content: center;align-items: center;flex-direction: column;">
         <h2>${property.fullName}</h2>
         <label style="color: silver;font-weight: bold;font-size: medium;">${property.property.length} Properties</label>
      </div>
      </div>
      ` 
      ScrollTrigger.refresh() 
    }
  });
  if (!moreDataAvailable) {
    window.removeEventListener('scroll', fetchData);
    eventEmitter.dispatchEvent(new Event('workDone'));
  }
  page++; // Increment page number for next fetch
  fetchingData = false; // Reset flag
}
fetchData(undefined)