import { Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(4010, { transports: ['websocket', 'polling'], cors: {origin: '*'} })
export class Chat {
  @WebSocketServer()
  server: Server;
  logger = new Logger();

  @SubscribeMessage('send')
  handleSend(@MessageBody() data: string): void {
		this.logger.verbose(data);
		this.server.emit('receive', data);
  }
}
