import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";

export class ChatRoom extends Room<MyRoomState> {
   maxMessages: number = 100;

  onCreate (options: any) {
    this.setState(new MyRoomState());
    this.onMessage("message", (client, message) => {
      console.log("ChatRoom received message from", client.sessionId, ":", message);
      this.broadcast("message", `${client.sessionId}: ${message}`);
      this.state.messages.push(`${client.sessionId}: ${message}`);
      if (this.state.messages.length > this.maxMessages) {
        this.state.messages.shift();
      }
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
