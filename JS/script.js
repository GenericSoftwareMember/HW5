/*
Name: Kevin Sree
Email: kevinsree@student.uml.edu
File: script.js
*/

// Tile values and their corresponding scores
const tileValues = {
    'A': {'value': 1, 'amount': 9},
    'B': {'value': 3, 'amount': 2},
    'C': {'value': 3, 'amount': 2},
    'D': {'value': 2, 'amount': 4},
    'E': {'value': 1, 'amount': 12},
    'F': {'value': 4, 'amount': 2},
    'G': {'value': 2, 'amount': 3},
    'H': {'value': 4, 'amount': 2},
    'I': {'value': 1, 'amount': 9},
    'J': {'value': 8, 'amount': 1},
    'K': {'value': 5, 'amount': 1},
    'L': {'value': 1, 'amount': 4},
    'M': {'value': 3, 'amount': 2},
    'N': {'value': 1, 'amount': 5},
    'O': {'value': 1, 'amount': 8},
    'P': {'value': 3, 'amount': 2},
    'Q': {'value': 10, 'amount': 1},
    'R': {'value': 1, 'amount': 6},
    'S': {'value': 1, 'amount': 4},
    'T': {'value': 1, 'amount': 6},
    'U': {'value': 1, 'amount': 4},
    'V': {'value': 4, 'amount': 2},
    'W': {'value': 4, 'amount': 2},
    'X': {'value': 8, 'amount': 1},
    'Y': {'value': 4, 'amount': 2},
    'Z': {'value': 10, 'amount': 1}
  };

// Global variables
const tilesContainer = document.getElementById('tile-container');
const scoreInput = document.getElementById('score');

// Generates a random tile from available tile values based on their amounts
function generateRandomTile() {
    const letters = [];
    // Create an array of letters based on their amount
    Object.keys(tileValues).forEach(letter => {
        for (let i = 0; i < tileValues[letter].amount; i++) {
            letters.push(letter);
        }
    });
    // Select a random letter from the array
    return letters[Math.floor(Math.random() * letters.length)];
}

// Creates a tile element with specified letter
function createTileElement(letter) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    const imagePath = `Images/Scrabble_Tiles/Scrabble_Tile_${letter}.jpg`;
    tile.draggable = true;
    tile.setAttribute('id', `tile-${letter}`); // Unique ID for each tile

    const img = new Image();
    img.onload = function() {
        tile.style.backgroundImage = `url(${imagePath})`;
    };
    img.onerror = function() {
        const placeholderPath = 'Images/Scrabble_Tiles/Scrabble_Tile_Blank.jpg';
        tile.style.backgroundImage = `url(${placeholderPath})`;
    };
    img.src = imagePath;

    tile.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', letter);
        event.dataTransfer.setData('text/identifier', tile.id); // Set identifier data
    });

    return tile;
}

// Generates and displays a set of tiles on the container
function generateAndDisplayTiles() {
    for (let i = 0; i < 7; i++) {
        const randomTile = generateRandomTile();
        const tileElement = createTileElement(randomTile);
        tilesContainer.appendChild(tileElement);
    }
}

// Function to calculate the total score of tiles on the board
function calculateTotalScore() {
    const boardTiles = document.querySelectorAll('#board-container .tile');
    totalScore = 0;

    boardTiles.forEach(tile => {
        const letter = tile.id.split('-')[1]; // Extract letter from the tile ID

        if (tileValues[letter]) {
            totalScore += tileValues[letter].value;
        }
    });

    scoreInput.value = totalScore;
}

// Event listeners setup and initialization
document.addEventListener('DOMContentLoaded', function() {

    // Restart game event listener
    document.getElementById('restart-game').addEventListener('click', function() {
        window.location.reload();
    });

    // Submit word event listener for calculating the score
    document.getElementById('submit-word').addEventListener('click', calculateTotalScore);

    // Generate and display initial set of tiles
    generateAndDisplayTiles();

    const boardContainer = document.getElementById('board-container');

    // Dragover event listener for the board container
    boardContainer.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    // Drop event listener for the board container
    boardContainer.addEventListener('drop', function(event) {
        event.preventDefault();
        const draggedLetter = event.dataTransfer.getData('text/plain');
        const tileId = event.dataTransfer.getData('text/identifier');
        const draggedTile = document.getElementById(tileId);
    
        if (draggedTile && draggedTile.classList.contains('tile')) {
            // Clone the dragged tile instead of moving it directly
            const newTile = draggedTile.cloneNode(true);
            newTile.style.position = 'absolute';
    
            const rect = boardContainer.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
    
            newTile.style.left = offsetX + 'px';
            newTile.style.top = offsetY + 'px';
    
            // Remove the existing dragged tile from the tiles container
            draggedTile.parentNode.removeChild(draggedTile);
    
            boardContainer.appendChild(newTile);
    
            // Add drag functionality to the newly placed tile
            newTile.addEventListener('dragstart', function(event) {
                event.dataTransfer.setData('text/plain', draggedLetter);
                event.dataTransfer.setData('text/identifier', newTile.id);
            });
    
            // Enable the tile to be dragged back
            newTile.addEventListener('dragend', function(event) {
                newTile.parentNode.removeChild(newTile);
                const originalTile = createTileElement(draggedLetter);
                tilesContainer.appendChild(originalTile);
            });
        }
    });  

    // Drop event listener for the tiles container
    tilesContainer.addEventListener('drop', function(event) {
        event.preventDefault();
        const draggedElement = event.dataTransfer.getData('text/plain');
    
        // Check if the dragged element is a div with the class 'tile'
        const draggedTile = document.getElementById(draggedElement);
        if (!draggedTile || !draggedTile.classList.contains('tile')) {
            return; // If it's not a tile, don't proceed
        }
    
        const existingTiles = tilesContainer.getElementsByClassName('tile');
        if (existingTiles.length >= 7) {
            return; // If already 7 tiles, don't add more
        }
    
        let tileExists = false;
        for (let tile of existingTiles) {
            if (tile.textContent === draggedElement) {
                tileExists = true;
                break;
            }
        }
        if (!tileExists) {
            const newTileElement = createTileElement(draggedElement);
            tilesContainer.appendChild(newTileElement);
        }
    });

    // Dragstart event listener for reordering tiles
    tilesContainer.addEventListener('dragstart', function(event) {
        const draggedElement = event.target;

        event.dataTransfer.setData('text/plain', draggedElement.textContent);
        event.dataTransfer.effectAllowed = 'move';
        draggedElement.classList.add('dragging');
    });

    // Dragover event listener for reordering tiles
    tilesContainer.addEventListener('dragover', function(event) {
        event.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        const bounding = event.target.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;
        if (event.clientY - offset > 0) {
            event.target.parentNode.insertBefore(draggingElement, event.target.nextElementSibling);
        } else {
            event.target.parentNode.insertBefore(draggingElement, event.target);
        }
    });

    // Dragend event listener for reordering tiles
    tilesContainer.addEventListener('dragend', function(event) {
        const draggingElement = document.querySelector('.dragging');
        draggingElement.classList.remove('dragging');
    });
    
});