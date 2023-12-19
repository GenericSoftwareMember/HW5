# HW5
Link to GitHub Repository: https://github.com/GenericSoftwareMember/HW5
URL to application: https://genericsoftwaremember.github.io/HW5/

Write-Up:

Not working -
  - The bonus squares do not function
  - The submit button does not clear the board nor give new tiles.
  - The tiles are not forced to be placed directly next to one another, they are instead placed anywhere within the board.

Partially working -
  - The tiles can be dragged and shifted. However, they are not correctly placed on the tile-container nor the board. They may also move to spots above the tile-container or below the board. It is also quite jittery.
  - The submit button calculates the scores of the tiles placed within the board-container. However, the tiles being dragged onto the board are not reliable and may sometimes return to the tile-container.

Fully working -
  - The reset button fully works, it acts akin to refreshing the page.
  - The tiles are randomly generated based on the amount of tiles stored within the tileValues
