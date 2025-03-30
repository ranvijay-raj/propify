let page = 1;
let fetchingData = false;
let infiniteNews = document.getElementsByClassName("infinitenews")[0]
let language = "en"
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      fetchNews();
    }
  });
async function fetchNews() {
  if (fetchingData) return; // If already fetching data, exit
  fetchingData = true;
  let data
  const apiKey = 'rkHT9PgXsR8yNhR7ydM-iIYzn2K9dGlRCXyA6yIe-gWvSEKR'; // Replace with your actual API key (for demonstration purposes only)
  const url = `https://api.currentsapi.services/v1/latest-news?language=${language}&country=IN&category=business,finance,technology&page_size=10&page_number=${page}&apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    data = await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
  data.news.forEach((element) => {
    infiniteNews.innerHTML += `
       <div class="news">
            <img src="${element.image}" alt="news image">
            <div class="content">
              <h2>${element.title}</h2>
              <label>${element.description}</label>
              <br>
              <label><a href="${element.url}" target="blank" style="text-decoration: none;color: slateblue;">Read More</a></label>
            </div>
        </div>
    `
  });
  page++;
  fetchingData = false;
}
fetchNews()
let languageC = document.getElementsByClassName("language")[0]
let hindi = document.getElementsByClassName("hindi")[0]
let english = document.getElementsByClassName("english")[0]
hindi.addEventListener("click", ()=>{
  hindi.classList.remove("notmarked")
  english.classList.add("notmarked")
  language = "hi"
  infiniteNews.innerHTML = ""
  fetchNews()
})
english.addEventListener("click", ()=>{
  english.classList.remove("notmarked")
  hindi.classList.add("notmarked")
  language = "en"
  infiniteNews.innerHTML = ""
  fetchNews()
})