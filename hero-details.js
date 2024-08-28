document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const heroName = urlParams.get('name');

    if (!heroName) {
        document.querySelector('.container').innerHTML = '<p>No hero name provided.</p>';
        return;
    }

    // Fetch data from API again
    fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
        .then(response => response.json())
        .then(data => {
            const hero = data.find(h => h.name === heroName);

            if (hero) {
                document.getElementById('heroImage').src = hero.images.xs;
                document.getElementById('heroName').textContent = hero.name;
                document.getElementById('heroFullName').textContent = hero.biography.fullName;
                document.getElementById('heroIntelligence').textContent = hero.powerstats.intelligence;
                document.getElementById('heroStrength').textContent = hero.powerstats.strength;
                document.getElementById('heroRace').textContent = hero.appearance.race;
                document.getElementById('heroGender').textContent = hero.appearance.gender;
                document.getElementById('heroHeight').textContent = hero.appearance.height[0];
                document.getElementById('heroWeight').textContent = hero.appearance.weight[0];
                document.getElementById('heroPlaceOfBirth').textContent = hero.biography.placeOfBirth;
                document.getElementById('heroAlignment').textContent = hero.biography.alignment;
            } else {
                document.querySelector('.container').innerHTML = '<p>Hero not found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching hero data:', error);
            document.querySelector('.container').innerHTML = '<p>Failed to load hero data.</p>';
        });
});