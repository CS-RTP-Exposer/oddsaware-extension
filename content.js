function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Luister naar klik op de gewenste <a class="img-container">
document.addEventListener('click', async (event) => {
  const anchor = event.target.closest('a.img-container');
  if (anchor) {
    console.log('Kist geklikt, klaar om response te vangen');
    
    await sleep(1000); // Wacht 1 seconde om te zorgen dat de DOM is geladen

    const wrapper = document.querySelector('.box-details-side-caption');
    const cost = wrapper.querySelector('.currency-value').innerText;
    const items = wrapper.querySelectorAll('.w-50');

    let totalRtp = 0;

    items.forEach(item => {

      const itemValues = item.innerText.split('\n');
      const percentage = itemValues[0].substring(0, itemValues[0].length - 1) / 100;
      const value = itemValues[itemValues.length - 1].replace(',', '');

      totalRtp += value * percentage;
    });

    const rtp = (totalRtp / cost) * 100;
    console.log('RTP:', rtp);

  }
});


