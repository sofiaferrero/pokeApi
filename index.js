// Nodes

const pokeImg = document.querySelector("#poke-img");
const pokedescription = document.querySelector("#desc");
const pokeDmg = document.querySelector("#dmg");
const pokeDef = document.querySelector("#dfs");
const pokeVel = document.querySelector("#vel");
const pokeSpecial = document.querySelector("#dfsSpecial");
const pokeName = document.querySelector("#poke-name");
const pokePS = document.querySelector("#ps");
const pokemonsList = document.querySelector("#pokemons");

//API

const BASE_API = "https://pokeapi.co/api/v2/";
const pokemons_API = `${BASE_API}/pokemon`;
const api = axios.create({
    baseURL: "https://pokeapi.co/api/v2/"
});


// variables

let currentPokemon;
let sprites = [];
let currentSprite = 0;
let listPokemons = "";

// Funciones

const fetchData = (API) => {
    return fetch(API)
    .then(res => res.json())
    .then(data => data);
}

async function searchPokemon () {
    event.preventDefault();
    const input = event.target.search;
    const {data} = await api(`pokemon/${input.value}`);
    printPokemon(data.name);
}

const writeDescription = (API, node) => {
    fetchData(API).then((specie) => {
        node.textContent = specie.flavor_text_entries[0].flavor_text;
    });
}

async function printPokemon(pokemon){
    const {data} = await api(`pokemon/${pokemon}`);
    if (sprites.length > 0){
        sprites = [];
    }
    currentPokemon = data;
    pokeImg.src = data.sprites.front_default;
    pokePS.textContent = data.stats[0].base_stat;
    pokePS.style.width = `${data.stats[0].base_stat}px`;
    pokeDmg.textContent = data.stats[1].base_stat;
    pokeDmg.style.width = `${data.stats[1].base_stat}px`;
    pokeDef.textContent = data.stats[2].base_stat;
    pokeDef.style.width = `${data.stats[2].base_stat}px`;
    pokeVel.textContent = data.stats[5].base_stat;
    pokeVel.style.width = `${data.stats[5].base_stat}px`;
    pokeSpecial.textContent = data.stats[4].base_stat;
    pokeSpecial.style.width = `${data.stats[4].base_stat}px`;
    const name = data.name;
    const nameMay = name.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());
    pokeName.textContent = nameMay;
    writeDescription(data.species.url, pokedescription);
    const pokeSprites = currentPokemon.sprites;
    for (const key in pokeSprites) {
        if (typeof pokeSprites[key] === "string") {
            sprites.push(pokeSprites[key]);
        }
    }
    window.scrollTo(0,150);
}

async function printPokemons(API){
    const loader = document.createElement("li");
    loader.innerHTML = "Está cargando...";
    pokemonsList.append(loader);

    const {data} = await api(API);
    listPokemons = data;
    data.results.map((pokemon) => {
        loader.remove();
        const listItem = document.createElement("li");
        fetchData(pokemon.url).then((details) => {
            listItem.classList.add(details.types[0].type.name);
            listItem.innerHTML = `
            <div>
            <img src =${details.sprites.front_default} alt= ${details.name}>
            <button onclick=printPokemon(${details.id}) class="pokemons-button">Show Pokemon</button>
            </div>
            <div>
                <h3>${details.name}</h3>
                ${details.types.map((type) => `<span> ${type.type.name}</span>`)}
                <p id=${details.name}></p>
            </div>
            `
            const detailPokemons = document.querySelector(`#${details.name}`);
            writeDescription(details.species.url, detailPokemons);
        });
        window.scrollTo(0,400);
        pokemonsList.appendChild(listItem);
    });
}

const nextImg = () => {
    if (currentSprite === sprites.length -1){
        currentSprite = 0;
    } else {
        currentSprite++;
    }
    pokeImg.src = sprites[currentSprite];
}

const prevImg = () => {
    if(currentSprite === 0){
        currentSprite = sprites.length -1;
    } else {
        currentSprite--;
    }
    pokeImg.src = sprites[currentSprite];
}

const nextPokemon = () => {
    printPokemon(currentPokemon.id + 1);
}

const prevPokemon = () => {
    if(currentPokemon.id === 1){
        currentPokemon.id = 250;
    }
    printPokemon(currentPokemon.id -1);
}

const nextPokemons = () => {
    pokemonsList.innerHTML = "";
    fetchData(listPokemons.next).then(newData => {
        printPokemons(newData.next);
    })
}

const prevPokemons = () => {
    pokemonsList.innerHTML = "";
    fetchData(listPokemons.next).then(newData => {
        printPokemons(newData.previous);
    })
}

printPokemon(1);
printPokemons("pokemon?limit=15&offset=0");
