
import * as SignalR from '@microsoft/signalr';

export class LiveHub {
    private path: string;
  
    public hub: SignalR.HubConnection | null = null;
  
    constructor(path: string) {
      this.path = path;
    }
  
    public connect() {
      return this.disconnect()
        .then(() => {
          this.hub = new SignalR.HubConnectionBuilder()
            .withUrl(this.path)
            .build();
          return this.hub.start();
        });
    }
  
    public on(event: string, callback: (...args: any[]) => void) {
      return this.hub?.on(event, callback);
    }
  
    public off(event: string, callback: (...args: any[]) => void) {
      return this.hub?.off(event, callback);
    }
  
    public invoke(event: string, ...args: any[]) {
        this.hub?.invoke(event, ...args);
    }

    public disconnect() {
      if (this.hub) {
        return this.hub.stop();
      }
      return Promise.resolve();
    }
}
