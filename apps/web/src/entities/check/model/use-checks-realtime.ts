'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { ENV_CONFIG } from '@/shared/config';
import type { Check } from './types';

export interface ChecksRealtimeEvent {
  workspaceId: string;
  monitorId: string;
  check: Check;
  monitor: {
    id: string;
    lastCheckAt: string;
    lastStatus: string | null;
    lastLatencyMs: number | null;
  };
}

interface UseChecksRealtimeParams {
  workspaceId?: string;
  onEvent: (event: ChecksRealtimeEvent) => void;
}

const useChecksRealtime = ({ workspaceId, onEvent }: UseChecksRealtimeParams) => {
  useEffect(() => {
    if (!workspaceId) {
      return;
    }

    const socket = io(`${ENV_CONFIG.API_ORIGIN}/chat`, {
      withCredentials: true,
      transports: ['websocket'],
    });

    const subscribe = () => {
      socket.emit('checks.subscribe', { workspaceId });
    };

    socket.on('connect', subscribe);
    socket.on('checks.result', onEvent);

    return () => {
      socket.off('connect', subscribe);
      socket.off('checks.result', onEvent);
      socket.disconnect();
    };
  }, [workspaceId, onEvent]);
};

export { useChecksRealtime };
