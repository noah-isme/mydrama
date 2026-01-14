import { useState, useEffect, useCallback, useRef } from 'react';

interface VideoState {
  bookId: string;
  episode: number;
  time: number;
  playing: boolean;
}

interface ChatMessage {
  message: string;
  name: string;
  timestamp: number;
}

interface Reaction {
  emoji: string;
  participantId: string;
  id: string;
}

interface WatchPartyState {
  isConnected: boolean;
  roomId: string | null;
  isLeader: boolean;
  participantId: string | null;
  participantCount: number;
  dramaName: string | null;
  messages: ChatMessage[];
  reactions: Reaction[];
  error: string | null;
}

interface UseWatchPartyReturn extends WatchPartyState {
  createRoom: (bookId: string, episode: number, dramaName: string, userName?: string) => void;
  joinRoom: (roomId: string, userName?: string) => void;
  leaveRoom: () => void;
  syncState: (state: Partial<VideoState>) => void;
  sendChat: (message: string) => void;
  sendReaction: (emoji: string) => void;
}

const WS_URL = 'ws://localhost:3001';

export function useWatchParty(
  videoRef: React.RefObject<HTMLVideoElement>,
  onSyncReceived?: (state: VideoState) => void
): UseWatchPartyReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<WatchPartyState>({
    isConnected: false,
    roomId: null,
    isLeader: false,
    participantId: null,
    participantCount: 0,
    dramaName: null,
    messages: [],
    reactions: [],
    error: null,
  });

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setState(s => ({ ...s, isConnected: true, error: null }));
    };

    ws.onclose = () => {
      setState(s => ({
        ...s,
        isConnected: false,
        roomId: null,
        isLeader: false,
        participantCount: 0,
      }));
    };

    ws.onerror = () => {
      setState(s => ({ ...s, error: 'Connection failed' }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleMessage(msg);
      } catch (e) {
        console.error('WatchParty message parse error:', e);
      }
    };
  }, []);

  const handleMessage = useCallback((msg: Record<string, unknown>) => {
    switch (msg.type) {
      case 'room_created':
        setState(s => ({
          ...s,
          roomId: msg.roomId as string,
          isLeader: true,
          participantId: msg.participantId as string,
          participantCount: 1,
        }));
        break;

      case 'room_joined':
        setState(s => ({
          ...s,
          roomId: msg.roomId as string,
          isLeader: false,
          participantId: msg.participantId as string,
          participantCount: msg.participantCount as number,
          dramaName: msg.dramaName as string,
        }));
        if (msg.videoState && onSyncReceived) {
          onSyncReceived(msg.videoState as VideoState);
        }
        break;

      case 'participant_joined':
        setState(s => ({ ...s, participantCount: msg.count as number }));
        break;

      case 'participant_left':
        setState(s => ({ ...s, participantCount: msg.count as number }));
        break;

      case 'sync':
        if (msg.state && onSyncReceived) {
          onSyncReceived(msg.state as VideoState);
        }
        break;

      case 'promoted_to_leader':
        setState(s => ({ ...s, isLeader: true }));
        break;

      case 'chat':
        setState(s => ({
          ...s,
          messages: [...s.messages.slice(-49), {
            message: msg.message as string,
            name: msg.name as string,
            timestamp: msg.timestamp as number,
          }],
        }));
        break;

      case 'reaction':
        const reactionId = `${msg.participantId}-${Date.now()}`;
        setState(s => ({
          ...s,
          reactions: [...s.reactions, {
            emoji: msg.emoji as string,
            participantId: msg.participantId as string,
            id: reactionId,
          }],
        }));
        setTimeout(() => {
          setState(s => ({
            ...s,
            reactions: s.reactions.filter(r => r.id !== reactionId),
          }));
        }, 3000);
        break;

      case 'error':
        setState(s => ({ ...s, error: msg.message as string }));
        break;
    }
  }, [onSyncReceived]);

  const send = useCallback((data: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const createRoom = useCallback((bookId: string, episode: number, dramaName: string, userName?: string) => {
    connect();
    setTimeout(() => {
      send({ type: 'create_room', bookId, episode, dramaName, name: userName || 'Host' });
      setState(s => ({ ...s, dramaName }));
    }, 500);
  }, [connect, send]);

  const joinRoom = useCallback((roomId: string, userName?: string) => {
    connect();
    setTimeout(() => {
      send({ type: 'join_room', roomId, name: userName || 'Guest' });
    }, 500);
  }, [connect, send]);

  const leaveRoom = useCallback(() => {
    send({ type: 'leave_room' });
    wsRef.current?.close();
    setState({
      isConnected: false,
      roomId: null,
      isLeader: false,
      participantId: null,
      participantCount: 0,
      dramaName: null,
      messages: [],
      reactions: [],
      error: null,
    });
  }, [send]);

  const syncState = useCallback((videoState: Partial<VideoState>) => {
    if (state.isLeader) {
      send({ type: 'sync', state: videoState });
    }
  }, [state.isLeader, send]);

  const sendChat = useCallback((message: string) => {
    send({ type: 'chat', message });
  }, [send]);

  const sendReaction = useCallback((emoji: string) => {
    send({ type: 'reaction', emoji });
  }, [send]);

  useEffect(() => {
    if (!state.isLeader || !state.roomId || !videoRef.current) return;

    const video = videoRef.current;
    let syncTimeout: NodeJS.Timeout;

    const handleTimeUpdate = () => {
      clearTimeout(syncTimeout);
      syncTimeout = setTimeout(() => {
        syncState({
          time: video.currentTime,
          playing: !video.paused,
        });
      }, 1000);
    };

    const handlePlay = () => syncState({ playing: true, time: video.currentTime });
    const handlePause = () => syncState({ playing: false, time: video.currentTime });
    const handleSeeked = () => syncState({ time: video.currentTime, playing: !video.paused });

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      clearTimeout(syncTimeout);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [state.isLeader, state.roomId, videoRef, syncState]);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return {
    ...state,
    createRoom,
    joinRoom,
    leaveRoom,
    syncState,
    sendChat,
    sendReaction,
  };
}
