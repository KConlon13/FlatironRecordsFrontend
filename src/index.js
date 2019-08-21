document.addEventListener("DOMContentLoaded", (e) => {

    const labelUrl = "http://localhost:3000/api/labels"
    const artistUrl = "http://localhost:3000/api/artists"
    const labelContainer = document.getElementById("label-container")

    
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
                <h2 class="artistName">${artist.name}</h2>
                <p>Genre: ${artist.genre}</p>
                <p>Bio: ${artist.biography}</p>
                <img src=${artist.imageUrl} class="artist-image"/>
                <br>
                <p>Likes:</p>
                <p class="likes" data-id=${artist.id}>${artist.likes}</p> 
                <button data-id=${artist.id} class="like-btn">Like Artist</button>
                <br>    
                <p>Hate their new music?</p>
                <button data-id=${artist.id} class="delete-btn">Drop Artist</button>
                `)
            })
        }) 
    }
    
    function renderLabel(label){
        labelContainer.insertAdjacentHTML("beforeend", `
        <div class="labelCard" data-id=${label.id}>
        <h2 class="labelName">${label.name}</h2>
        <p>${label.description}</p>
        <h3 class="artistList">Artists:</h3>
        <div id="label-artists" data-id=${label.id}></div>
        <div class="add-artist-container">
            <form class="add-artist-form" data-id=${label.id} style="">
            <h3>Sign an Artist to ${label.name}:</h3>
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
    }
    
    // Create New Artist
    labelContainer.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log(e.target)
        let newArtistLabelId = e.target.dataset.id
        fetch(`${artistUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: e.target.artist.value,
                genre: e.target.genre.value,
                biography: e.target.biography.value,
                imageUrl: e.target.image.value,
                likes: 0,
                label_id: newArtistLabelId
            })
        })
        .then(response => response.json())
        .then(artist => {
            console.log(artist)
            const labelArtists = document.querySelector(`#label-artists[data-id="${newArtistLabelId}"]`)
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
            <p>Hate their new music?</p>
            <button data-id=${artist.id} class="delete-btn">Drop Artist</button>
            `)

            e.target.artist.value = ""
            e.target.genre.value = ""
            e.target.biography.value = ""
            e.target.image.value = ""
        })
    })  


    /// Delete Button 
    labelContainer.addEventListener("click", (e) => {
        let id = e.target.dataset.id
        if (e.target.className === "delete-btn"){
            let deleteConfirmation = confirm("Are you sure you want to drop this artist?")
            if (deleteConfirmation === true){
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
            }
            
        //// Patch for likes button 
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