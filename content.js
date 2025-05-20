function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Luister naar klik op de gewenste <a class="img-container">
document.addEventListener('click', async (event) => {
  const anchor = event.target.closest('a.img-container');
  if (anchor) {
    console.log('Kist geklikt, klaar om response te vangen');

    let wrapper = document.querySelector('.box-details-side-caption');
    let cost = null;
    let items = null;

    while(wrapper === null) {
      wrapper = document.querySelector('.box-details-side-caption');
      await sleep(10);
    }

    while(cost === null || items === null) {
      cost = parseFloat(wrapper.querySelector('.currency-value').innerText.replace(',', ''));
      items = wrapper.querySelectorAll('.w-50');
      await sleep(10);
    }

    let totalRtp = 0;
    let totalPercentage = 0;
    let doublePercentage = 0;

    console.log('Cost:', cost);

    items.forEach(item => {

      const itemValues = item.innerText.split('\n');
      const percentage = parseFloat(itemValues[0].substring(0, itemValues[0].length - 1)) / 100;
      const value = parseFloat(itemValues[itemValues.length - 1].replace(',', ''));

      console.log('Percentage:', percentage);
      console.log('Value:', value);

      totalPercentage += percentage;
      totalRtp += value * percentage;

      if (value >= 2 * cost) {
        doublePercentage += percentage;
      }

    });

    const rtp = (totalRtp / cost) * 100;
    totalPercentage = Math.round(totalPercentage);

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

    // Optionally display it in the DOM too:
    const doubleMoneyElement = document.createElement('div');
    doubleMoneyElement.style.marginBottom = '8px';
    doubleMoneyElement.style.fontWeight = 'bold';
    doubleMoneyElement.style.color = doublePercentage >= 0.5 ? 'green' : 'red';
    doubleMoneyElement.innerText = `Chance to double: ${(doublePercentage * 100).toFixed(2)}%`;

    // Voeg het RTP-element toe onder de afbeelding
    siblingElement.insertAdjacentElement('afterend', doubleMoneyElement);
    siblingElement.insertAdjacentElement('afterend', rtpElement);

  }
});


