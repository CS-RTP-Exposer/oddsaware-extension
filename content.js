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
    const cost = parseFloat(wrapper.querySelector('.currency-value').innerText);
    const items = wrapper.querySelectorAll('.w-50');

    let totalRtp = 0;
    let totalPercentage = 0;

    console.log('Cost:', cost);

    items.forEach(item => {

      const itemValues = item.innerText.split('\n');
      const percentage = parseFloat(itemValues[0].substring(0, itemValues[0].length - 1)) / 100;
      const value = parseFloat(itemValues[itemValues.length - 1].replace(',', ''));

      console.log('Percentage:', percentage);
      console.log('Value:', value);

      totalPercentage += percentage;
      totalRtp += value * percentage;
    });

    const rtp = (totalRtp / cost) * 100;
    console.log('RTP:', rtp);
    console.log('Total percentage:', totalPercentage);

    const siblingElement = wrapper.querySelector('img.align-self-center');
    
    const existingRtp = wrapper.querySelector('.custom-rtp');
    if (existingRtp) existingRtp.remove();

    // Maak RTP-weergave element
    const rtpElement = document.createElement('div');
    rtpElement.className = 'custom-rtp';
    rtpElement.style.marginTop = '8px';
    rtpElement.style.fontWeight = 'bold';
    rtpElement.style.color = totalPercentage !== 1 ? 'red' : rtp >= 100 ? 'green' : rtp >= 80 ? 'orange' : 'red';
    rtpElement.innerText = totalPercentage !== 1 ? `Total percentage is not 100%` : `RTP: ${rtp.toFixed(2)}%`;

    // Voeg het RTP-element toe onder de afbeelding
    siblingElement.insertAdjacentElement('afterend', rtpElement);


  }
});


