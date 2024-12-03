import { Component, OnInit } from '@angular/core';
import { WebSocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public inputValue: string = '';
  public data: any[] = [];
  public connectionStatus: boolean = false;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    // Subscribe to WebSocket messages
    this.webSocketService.getMessages().subscribe((message) => {
      switch (message.event) {
        case 'updateData':
          this.data = message.data;
          break;
        case 'error':
          console.error('Server error:', message.message);
          break;
        default:
          console.warn('Unknown event:', message.event);
      }
    });

    // Monitor connection status
    this.webSocketService.getConnectionStatus().subscribe((status) => {
      this.connectionStatus = status;
    });
  }

  /**
   * Add new data
   */
  addData(): void {
    if (this.inputValue.trim()) {
      this.webSocketService.sendMessage('createData', {
        value: this.inputValue,
      });
      this.inputValue = '';
    }
  }

  /**
   * Delete a data entry
   * @param id ID of the data to delete
   */
  deleteData(id: string): void {
    this.webSocketService.sendMessage('deleteData', { id });
  }
}
