document.addEventListener("DOMContentLoaded", (e) => {

    const labelContainer = document.getElementById("label-container")
    const allLabels = []
    const labelUrl = "http://localhost:3000/api/labels"
    const artistUrl = "http://localhost:3000/api/artists"
    const form = document.getElementById("add-artist-form")
    
    /// Label Get Fetch
    fetch(labelUrl)
    .then(response => response.json())
    .then(data => {
        renderAllLabels(data)
    })
    
    function renderAllLabels(data){
        data.forEach(label => {
            renderLabel(label)
            const labelArtists = document.querySelector(`#label-artists[data-id="${label.id}"]`)

            label.artists.forEach(artist => {
                labelArtists.insertAdjacentHTML("beforeend", `
                <div class="artistCard" data-id=${artist.id}>
                <h2>${artist.name}</h2>
                <p>Genre: ${artist.genre}</p>
                <p>Bio: ${artist.biography}</p>
                <img src=${artist.imageUrl} class="artist-image"/>
                <br>
                <button data-id=${artist.id} class="delete-btn">Drop Artist</button>
                `)
            })
        })
    }
    
    function renderLabel(label){
        labelContainer.insertAdjacentHTML("beforeend", `
        <div class="labelCard" data-id=${label.id}>
        <h2>${label.name}</h2>
        <p>${label.description}</p>
        <button data-id=${label.id} class="delete-btn">Dissolve Label</button>
        <h3>Artists:</h3>
        <div id="label-artists" data-id=${label.id}></div>
        </div>
        `)
        allLabels.push(label)
    }
    
    // Create New Artist
    // form.addEventListener("submit", (e)=> {
    //     e.preventDefault()
    //     console.log("I've been clicked!")
    //     createArtist(e.target)
    // })

    // function createArtist(form){
    //     debugger
    //     return fetch(`${artistUrl}`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json"
    //         },
    //         body: JSON.stringify({
    //             name: form.artist.value,
    //             genre: form.genre.value,
    //             biography: form.biography.value,
    //             imageUrl: form.image.value,
    //             labelId: form.label.value        
    //         })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data)
    //         form.reset()
    //     })
    // }

    /// Delete Button, deletes but does not persist
    labelContainer.addEventListener("click", (e) => {
        let id = e.target.dataset.id

        if (e.target.className === "delete-btn"){
            e.target.parentNode.remove()
            fetch(`http://localhost:3000/artists/${id}`, {
                method: "DELETE"
            })
        }
    })



})