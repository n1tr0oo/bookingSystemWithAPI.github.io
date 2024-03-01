const newsBtn = document.getElementById('newsBtn');
const newsTopic = document.getElementById("newsTopic");
const resultContainer2 = document.getElementById("resultContainer2");


newsBtn.addEventListener('click' , retrieve)

function retrieve(e){

    resultContainer2.innerHTML = ''

  e.preventDefault()
  
  const apikey = '95b86f2b06e845b5ae90d757da645c86'
  const topic = newsTopic.value;
  
  let url = `https://newsapi.org/v2/everything?q=${topic}&apiKey=${apikey}`
  
  fetch(url).then((res)=>{
    return res.json()
  }).then((data)=>{
    console.log(data)
    data.articles.slice(0,10).forEach(article =>{
        let div = document.createElement('div')
        div.setAttribute('class', 'border-bottom')
      let a = document.createElement('a');
      a.setAttribute('href' , article.url);
      a.setAttribute('target' , '_blank');
      a.textContent = article.title;
      div.appendChild(a);
      resultContainer2.appendChild(div);
      
    })
  })
}