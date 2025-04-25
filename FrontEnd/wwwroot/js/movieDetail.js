document.addEventListener("DOMContentLoaded", () => {
    const movieDetails = document.getElementById("movieDetails");
    const searchInput = document.getElementById("searchInput");
    const errorMessage = document.getElementById("errorMessage");
    const loadingSkeleton = document.getElementById("loadingSkeleton");
    const languageSelector = document.getElementById('language-selector');
    const translatableElements = document.querySelectorAll('.translatable');
    const originalLanguage = 'es';
    const projectId = 'multilingual-457918'; // Reemplaza con tu ID de proyecto
    const apiKey = 'TAIzaSyAEUOvc5pgLaRKiTlOnP6Blzol9BHbyv4E'; // Reemplaza con tu clave de API

    languageSelector.addEventListener('change', function () {
        const targetLanguage = this.value;
        const textsToTranslate = [];
        const elementsToTranslate = [];

        translatableElements.forEach(element => {
            const originalText = element.textContent;
            if (originalText) {
                textsToTranslate.push(originalText);
                elementsToTranslate.push(element);
            }
        });

        if (textsToTranslate.length > 0) {
            fetch(`https://translate.googleapis.com/v3beta1/projects/${projectId}/locations/global:translateText?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: textsToTranslate,
                    mimeType: 'text/plain',
                    sourceLanguageCode: originalLanguage,
                    targetLanguageCode: targetLanguage
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.translations && data.translations.length === elementsToTranslate.length) {
                        data.translations.forEach((translation, index) => {
                            elementsToTranslate[index].textContent = translation.translatedText;
                        });
                    } else {
                        console.error('Número de traducciones no coincide con el número de elementos:', data);
                    }
                })
                .catch(error => {
                    console.error('Error al traducir:', error);
                });
        }
    });


    async function getMovieDetails(title) {
        try {
            if (!title) throw new Error("El título está vacío");

            movieDetails.classList.add("hidden");
            errorMessage.classList.add("hidden");
            loadingSkeleton.classList.remove("hidden");

            const token = localStorage.getItem('token');
            const url = `http://backendcorebackdata.runasp.net/api/Cinema/movie?title=${encodeURIComponent(title)}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("❌ Película no encontrada. Intenta con otro título.");
            }

            const movie = await response.json();

            // Validación adicional en caso que el backend devuelva un objeto vacío
            if (!movie || !movie.title) {
                throw new Error("⚠️ No se encontró información para esa película.");
            }

            renderMovieDetails(movie);

        } catch (error) {
            console.error("Error fetching movie details:", error);
            loadingSkeleton.classList.add("hidden");
            movieDetails.classList.add("hidden");
            errorMessage.classList.remove("hidden");
            errorMessage.innerHTML = `
            ${error.message}
        `;

            lucide.createIcons(); // Recargar íconos si usás lucide
        }
    }


    function renderMovieDetails(movie) {
        const {
            title, year, rated, released, runtime, genre, director,
            writer, actors, plot, language, country, awards,
            poster, ratings, metascore, imdbRating
        } = movie;

        const getMetascoreClass = (score) => {
            const numScore = parseInt(score);
            if (numScore >= 75) return 'score-high';
            if (numScore >= 50) return 'score-medium';
            return 'score-low';
        };

        const getStarRating = (rating) => {
            let numericRating = 0;
            if (rating.includes('/')) {
                const [value, total] = rating.split('/');
                numericRating = (parseFloat(value) / parseFloat(total)) * 10;
            } else if (rating.includes('%')) {
                numericRating = parseFloat(rating) / 10;
            } else {
                numericRating = parseFloat(rating) * 2;
            }

            numericRating = Math.min(Math.max(numericRating, 0), 10);
            const fullStars = Math.floor(numericRating / 2);
            const hasHalfStar = numericRating % 2 >= 0.5;
            let starsHTML = '';

            for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                    starsHTML += '<i data-lucide="star" class="star star-full"></i>';
                } else if (i === fullStars && hasHalfStar) {
                    starsHTML += '<i data-lucide="star" class="star star-half"></i>';
                } else {
                    starsHTML += '<i data-lucide="star" class="star star-empty"></i>';
                }
            }

            return starsHTML;
        };

        const genreBadgesHTML = genre.split(', ').map(g =>
            `<span class="genre-badge translatable">${g}</span>`
        ).join('');

        const allRatingsHTML = ratings.map(r => `
        <div class="rating-card">
            <div class="rating-source translatable">${r.source}</div>
            <div class="stars-container">
                <div class="rating-stars">
                    ${getStarRating(r.value)}
                </div>
                <span class="rating-value">${r.value}</span>
            </div>
        </div>
    `).join('');

        movieDetails.innerHTML = `
        <div class="poster-wrapper">
            <div class="poster-container">
                <img src="${poster}" alt="${title}" class="movie-poster">
            </div>
        </div>

        <div class="movie-info">
            <h2 class="movie-title translatable">
                ${title} <span class="movie-year">(${year})</span>
            </h2>

            <div class="ratings-section">
                <div class="ratings-container">
                    ${imdbRating ? `
                    <div class="rating-item">
                        <span class="rating-source translatable">IMDB</span>
                        <div class="stars-container">
                            <div class="rating-stars">
                                ${getStarRating(imdbRating)}
                            </div>
                            <span class="rating-value">${imdbRating}</span>
                        </div>
                    </div>
                    ` : ''}

                    ${metascore ? `
                    <div class="rating-item">
                        <span class="rating-source translatable">Metascore</span>
                        <span class="metascore ${getMetascoreClass(metascore)}">${metascore}</span>
                    </div>
                    ` : ''}
                </div>
            </div>

            <div class="movie-details-grid">
                <div class="detail-item"><i data-lucide="film" class="detail-icon"></i><span class="detail-label translatable">Rated:</span> <span class="detail-value translatable">${rated}</span></div>
                <div class="detail-item"><i data-lucide="calendar" class="detail-icon"></i><span class="detail-label translatable">Released:</span> <span class="detail-value translatable">${released}</span></div>
                <div class="detail-item"><i data-lucide="clock" class="detail-icon"></i><span class="detail-label translatable">Runtime:</span> <span class="detail-value translatable">${runtime}</span></div>
                <div class="detail-item"><i data-lucide="tag" class="detail-icon"></i><span class="detail-label translatable">Genre:</span><div class="genre-badges">${genreBadgesHTML}</div></div>
                <div class="detail-item"><i data-lucide="user" class="detail-icon"></i><span class="detail-label translatable">Director:</span> <span class="detail-value translatable">${director}</span></div>
                <div class="detail-item"><i data-lucide="edit" class="detail-icon"></i><span class="detail-label translatable">Writer:</span> <span class="truncate translatable">${writer}</span></div>
                <div class="detail-item"><i data-lucide="users" class="detail-icon"></i><span class="detail-label translatable">Actors:</span> <span class="truncate translatable">${actors}</span></div>
                <div class="detail-item"><i data-lucide="languages" class="detail-icon"></i><span class="detail-label translatable">Language:</span> <span class="detail-value translatable">${language}</span></div>
                <div class="detail-item"><i data-lucide="flag" class="detail-icon"></i><span class="detail-label translatable">Country:</span> <span class="detail-value translatable">${country}</span></div>
                <div class="detail-item"><i data-lucide="award" class="detail-icon"></i><span class="detail-label translatable">Awards:</span> <span class="detail-value translatable">${awards}</span></div>
            </div>

            <div class="plot-section">
                <div class="plot-header">
                    <i data-lucide="book-open" class="detail-icon"></i>
                    <span class="detail-label translatable">Plot:</span>
                </div>
                <p class="plot-content translatable">${plot}</p>
            </div>

            ${ratings.length > 1 ? `
            <div class="all-ratings">
                <h3 class="all-ratings-title translatable">All Ratings</h3>
                <div class="ratings-grid">${allRatingsHTML}</div>
            </div>
            ` : ''}
        </div>
    `;

        loadingSkeleton.classList.add("hidden");
        errorMessage.classList.add("hidden");
        movieDetails.classList.remove("hidden");

        lucide.createIcons(); // Iniciar íconos
    }

    searchInput.addEventListener('input', (event) => {
        const title = event.target.value.trim();
        if (title.length >= 3) {
            getMovieDetails(title);
        }
    });

    getMovieDetails("Inception"); // Inicial
});
