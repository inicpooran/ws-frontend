import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket!: WebSocket;
  private readonly serverUrl = 'ws://localhost:3000';
  private isConnected = new BehaviorSubject<boolean>(false);
  private messages = new Subject<any>();

  constructor() {
    this.connect();
  }

  /**
   * Establish a WebSocket connection
   */
  private connect(): void {
    this.socket = new WebSocket(this.serverUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
      this.isConnected.next(true);
    };

    this.socket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        this.messages.next(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.warn('WebSocket connection closed. Reconnecting...');
      this.isConnected.next(false);
      setTimeout(() => this.connect(), 5000);
    };
  }

  /**
   * Send a message to the WebSocket server
   * @param event Event name
   * @param data Event data
   */
  sendMessage(event: string, data: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ event, data }));
    } else {
      console.warn('Cannot send message. WebSocket is not connected.');
    }
  }

  /**
   * Get messages as an observable
   */
  getMessages(): Observable<any> {
    return this.messages.asObservable();
  }

  /**
   * Get connection status as an observable
   */
  getConnectionStatus(): Observable<boolean> {
    return this.isConnected.asObservable();
  }
}
