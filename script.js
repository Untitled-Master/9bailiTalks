document.getElementById('searchButton').addEventListener('click', function() {
    const searchSentence = document.getElementById('searchInput').value.trim();
    if (searchSentence) {
        const words = searchSentence.split(/\s+/); // Split the sentence into words
        Promise.all(words.map(word => 
            fetch(`https://amazigh.moroccanlanguages.com/_next/data/mw6RNaf5NVj2Olt2jzNz2/english/${encodeURIComponent(word)}.json?req_word=${encodeURIComponent(word)}`)
                .then(response => response.json())
                .then(data => data.pageProps.word)
                .catch(error => {
                    console.error(`Error fetching data for word "${word}":`, error);
                    return null; // Return null if there's an error
                })
        ))
        .then(results => displayResults(results))
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('results').innerHTML = '<p>Error fetching data.</p>';
        });
    } else {
        alert('Please enter a sentence.');
    }
});

function displayResults(wordDataArray) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (wordDataArray.length > 0) {
        // Collect the first am_word from each wordData
        const amWords = wordDataArray.map(wordData => {
            if (wordData && wordData.definitions.length > 0 && wordData.definitions[0].am_words.length > 0) {
                return wordData.definitions[0].am_words[0].am_word;
            }
            return '';
        }).filter(amWord => amWord !== ''); // Filter out empty values

        // Reconstruct the sentence
        const reconstructedSentence = amWords.join(' ');

        // Display the reconstructed sentence in the modal
        document.getElementById('reconstructedSentence').textContent = reconstructedSentence;
        $('#resultModal').modal('show');

        if (reconstructedSentence === '') {
            resultsDiv.innerHTML = '<p>No results found.</p>';
        }
    } else {
        resultsDiv.innerHTML = '<p>No results found.</p>';
    }
}
