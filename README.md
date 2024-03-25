## development instructions:
to build TS into a bundled JS file automatically: `webpack`
then just open index.html (need to refresh when code change is made)

probably need to do `npm install --save-dev webpack webpack-cli typescript ts-loader` first

## todos

- [x] basic UI skeleton
- [x] tooltips to show cost/power/effect
- [x] end turn and deal with action points
- [ ] play new sandwiches with bread
- [ ] add ingredient to sandwich, apply if condiment
- [ ] close sandwich: get points and apply effects
- [ ] start screen where you can choose a deck
- [ ] AI opponent
- [ ] networking opponent

extension:
- [ ] edit cards on the fly (debug screen)
- [ ] ai to determine best cards/decks; elo