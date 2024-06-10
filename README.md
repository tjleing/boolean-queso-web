## development instructions:
to build TS into a bundled JS file automatically: `webpack`
then run a live server (I'm using VS code Live Server extension)

probably need to do `npm install --save-dev webpack webpack-cli typescript ts-loader` first

###
local todos
- add score div and sandwich closing logic to com player
  - I think then the PR is done?
  - oh maybe refactor constructDOM etc (including sandwich closing...) there's a lot of common stuff there
  - sandwich close animation

## todos

- [x] basic UI skeleton
- [x] tooltips to show cost/power/effect
- [x] end turn and deal with action points
- [x] refactor to game class with different players possible; handle event state machine
- [x] animate ingredients added (needs to be extended to non-local player cards too)
- [x] play new sandwiches with bread
- [x] add ingredient to sandwich
  - [x] apply effect if condiment
- [ ] close sandwich: get points and apply effects
- QOL:
  - [ ] move played ingredients between sandwiches
  - [ ] hover sandwich ingredients to see what they do
  - [ ] they should probably also have a UI to see at least the power stats and like an expected total power on complete of the sandwich
  - [ ] need to disable dragging while anims are playing
- [ ] start screen where you can choose a deck
- [x] AI opponent
- [ ] networking opponent

extension:
- [ ] edit cards on the fly (debug screen)
- [ ] ai to determine best cards/decks; elo
