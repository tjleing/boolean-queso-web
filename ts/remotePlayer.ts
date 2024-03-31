import { Player } from "./player";

// so the concept for the remote player is they send an endturn
// event with all of the actions they plan on taking, and then
// at this point we actually start enacting them.  and it's
// symmetrical too, which is cool
export class RemotePlayer extends Player {

}