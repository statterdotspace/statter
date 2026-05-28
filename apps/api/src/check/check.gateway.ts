import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { WsExceptionFilter } from '../core/filters/ws-exception.filter';
import { WorkspaceService } from '../workspace/workspace.service';
import { WsJwtAuthGuard } from './guards/ws-jwt-auth.guard';
import { Server, Socket } from 'socket.io';
import { CheckRealtimeEvent } from './events/check-result-ingested.event';

interface CheckSubscriptionPayload {
  workspaceId: string;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const workspaceRoom = (workspaceId: string) => `workspace:${workspaceId}`;

@WebSocketGateway({
  namespace: '/chat',
  transports: ['websocket'],
  allowUpgrades: false,
  cors: { origin: true, credentials: true },
})
@UseFilters(WsExceptionFilter)
@UseGuards(WsJwtAuthGuard)
export class CheckGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(CheckGateway.name);

  @WebSocketServer()
  private server!: Server;

  constructor(private readonly workspaceService: WorkspaceService) {}

  handleConnection(client: Socket): void {
    this.logger.debug(`Client connected to checks gateway: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.debug(`Client disconnected from checks gateway: ${client.id}`);
  }

  @SubscribeMessage('checks.subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CheckSubscriptionPayload
  ) {
    const workspaceId = payload?.workspaceId;

    if (!workspaceId || !UUID_REGEX.test(workspaceId)) {
      throw new WsException('workspaceId is required and must be a valid UUID');
    }

    const userId = this.extractUserId(client);
    const membership = await this.workspaceService.findMembership(workspaceId, userId);
    if (!membership) {
      throw new WsException('You are not a member of this workspace');
    }

    await client.join(workspaceRoom(workspaceId));

    return { success: true };
  }

  emitCheckResult(payload: CheckRealtimeEvent): void {
    if (!this.server) {
      return;
    }

    this.server.to(workspaceRoom(payload.workspaceId)).emit('checks.result', payload);
  }

  private extractUserId(client: Socket): string {
    const userId = (client.data as { userId?: unknown }).userId;
    if (typeof userId !== 'string' || !userId) {
      throw new WsException('Unauthorized');
    }

    return userId;
  }
}
