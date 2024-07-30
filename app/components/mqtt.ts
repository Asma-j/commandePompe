

declare module 'react-native-mqtt' {
    export interface ClientOptions {
      uri: string;
      clientId:string;
      username?: string;
      password:string;
      port?: number;
  
    }
  
    export class MqttClient {
      constructor(options: ClientOptions);
  
      connect(): void;
      disconnect(): void;
      publish(topic: string, message: string): void;
      subscribe(topic: string): void;
      on(event: 'connect' | 'message', callback: (...args: any[]) => void): void;
  
    }
  

  }
  