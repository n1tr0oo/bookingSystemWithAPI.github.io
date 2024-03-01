const cryptoBtn = document.getElementById('cryptoBtn');

cryptoBtn.addEventListener('click', async function (event) {
  const crypto = document.getElementById("cryptoName").value;
  fetch(`/${crypto}`)
  .then(response => response.json())
  .then(data => {
    const resultContainer = document.getElementById('resultContainer');
    
    resultContainer.innerHTML = `<div class="d-flex flex-column ml-3  border-bottom">
                                <span>Crypto Name:${data.data[crypto].name}</span>
                                <small>Crypto Price:${(data.data[crypto].quote.USD.price).toFixed(2)} USD</small>
                                </div>`
  })
});
       