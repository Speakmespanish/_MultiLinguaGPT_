document.addEventListener("DOMContentLoaded", () => {
    const movieDetailsContainer = document.getElementById("movieDetails");
    const searchInput = document.getElementById("searchInput");

    async function getMovieDetails(title) {
        try {
            if (!title) throw new Error("El título está vacío");

            const token = localStorage.getItem('token'); // Asegúrate de tenerlo almacenado
            const url = `http://backendcorebackdata.runasp.net/api/Cinema/movie?title=${encodeURIComponent(title)}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`No se encontró la película (Código: ${response.status})`);
            }

            const movie = await response.json();
            renderMovieDetails(movie);
        } catch (error) {
            console.error("Error fetching movie details:", error);
            movieDetailsContainer.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    }

    function renderMovieDetails(movie) {
        const {
            title, year, rated, released, runtime, genre, director,
            writer, actors, plot, language, country, awards,
            poster, ratings, metascore, imdbRating
        } = movie;

        movieDetailsContainer.innerHTML = `
            <div class="movie-poster">
                <img src="${poster}" alt="${title}">
            </div>
            <div class="movie-info">
                <h2>${title} (${year})</h2>
                <p><strong>Rated:</strong> ${rated}</p>
                <p><strong>Released:</strong> ${released}</p>
                <p><strong>Runtime:</strong> ${runtime}</p>
                <p><strong>Genre:</strong> ${genre}</p>
                <p><strong>Director:</strong> ${director}</p>
                <p><strong>Writer:</strong> ${writer}</p>
                <p><strong>Actors:</strong> ${actors}</p>
                <p><strong>Language:</strong> ${language}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Awards:</strong> ${awards}</p>
                <p><strong>Plot:</strong> ${plot}</p>
                <p><strong>Metascore:</strong> ${metascore}</p>
                <p><strong>IMDB Rating:</strong> ${imdbRating}</p>
                <h3>Ratings:</h3>
                <ul>
                    ${ratings.map(r => `<li><strong>${r.source}:</strong> ${r.value}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    searchInput.addEventListener('input', (event) => {
        const title = event.target.value.trim();
        if (title.length >= 3) {
            getMovieDetails(title);
        }
    });

    // Puedes mostrar una película sugerida al cargar si quieres
    getMovieDetails("Inception");
});
