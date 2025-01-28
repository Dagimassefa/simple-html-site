document.getElementById('search-input')?.addEventListener('keyup', async (e) => {
    const input = (e.target as HTMLInputElement).value.trim();

    if (input.length < 2) return; 

    try {
        const res = await fetch(`http://localhost:3001/comments?q=${input}`);
        const json = await res.json();

        const $results = document.getElementById('results');
        if ($results) {
            $results.innerHTML = json.length > 0 
                ? json.map((comment: any) => `<li>${comment.name}</li>`).join('')
                : '<li>No results found</li>';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
