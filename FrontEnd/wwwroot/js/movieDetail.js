document.addEventListener("DOMContentLoaded", () => {
    const movieGrid = document.getElementById("movieGrid")
    const movies = Array(8).fill({ title: "Movie" })

    movies.forEach((movie) => {
        const movieElement = document.createElement("div")
        movieElement.className = "movie-item"

        const posterElement = document.createElement("div")
        posterElement.className = "movie-poster"

        const titleElement = document.createElement("div")
        titleElement.className = "movie-title"
        titleElement.textContent = movie.title

        movieElement.appendChild(posterElement)
        movieElement.appendChild(titleElement)
        movieGrid.appendChild(movieElement)
    })

    const backBtn = document.getElementById("backBtn")
    backBtn.addEventListener("click", () => {
        console.log("Back button clicked")
        // Add navigation logic here
    })
})

