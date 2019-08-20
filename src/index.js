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
                <p>Likes:</p>
                <p class="likes" data-id=${artist.id}>${artist.likes}</p> 
                <button data-id=${artist.id} class="like-btn">Like Artist</button>
                <br>    
                <button data-id=${artist.id} class="delete-btn">Drop Artist</button>
                `)
            })
        }) // maybe change artist.likes to 0
    }
    
    function renderLabel(label){
        labelContainer.insertAdjacentHTML("beforeend", `
        <div class="labelCard" data-id=${label.id}>
        <h2>${label.name}</h2>
        <p>${label.description}</p>
        <h3>Artists:</h3>
        <div id="label-artists" data-id=${label.id}></div>
        <div class="add-artist-container">
            <form class="add-artist-form" data-id=${label.id} style="">
            <h3>Sign an Artist to ${label.name}!</h3>
            <input type="text" name="artist" value="" placeholder="Artist Name" class="input-text">
            <br>
            <input type="text" name="genre" value="" placeholder="Artist's Genre" class="input-text">
            <br>
            <input type="text" name="biography" value="" placeholder="Artist's Bio" class="input-text">
            <br>
            <input type="text" name="image" value="" placeholder="Artist's Image URL" class="input-text">
            <br>
            <input type="submit" name="submit" value="Add New Artist" class="submit">
            </form>
        </div>
        </div>
        `)
        allLabels.push(label)
    }
    
    // Create New Artist

    // const labelCard = document.querySelector(`.labelCard[data-id="${label.id}"]`)

    labelContainer.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log(e.target.dataset.id)
        // let id = e.target.dataset.id

    })


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
    //             imageUrl: form.image.value     
    //         })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data)
    //         form.reset()
    //     })
    // }



    /// Delete Button (works!)
    labelContainer.addEventListener("click", (e) => {
        let id = e.target.dataset.id

        if (e.target.className === "delete-btn"){
            e.target.parentNode.remove()
            fetch(`http://localhost:3000/api/artists/${id}`, {
                method: "DELETE"
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(function(error) {
                console.error(error)
            }) 
            
        //// Patch for likes button here (works!)
        } else if (e.target.className === "like-btn"){

            let pleaseWork = document.querySelector(`p.likes[data-id="${id}"]`)
            parseInt(pleaseWork.innerText++)
            fetch(`http://localhost:3000/api/artists/${id}`, {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }, 
                body: JSON.stringify({
                    "likes": pleaseWork.innerText
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
        }

    })



})