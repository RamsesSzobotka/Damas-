'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface UseWebSocketOptions {
  onOpen?: (event: Event) => void
  onMessage?: (event: MessageEvent) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  reconnectInterval?: number
  maxReconnects?: number
}

interface UseWebSocketReturn {
  send: (data: object) => void
  isConnected: boolean
  reconnect: () => void
}

export function useWebSocket(
  url: string | null,
  options?: UseWebSocketOptions,
): UseWebSocketReturn {
  const {
    onOpen,
    onMessage,
    onClose,
    onError,
    reconnectInterval = 3000,
    maxReconnects = 5,
  } = options ?? {}

  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptRef = useRef(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onOpenRef = useRef(onOpen)
  const onMessageRef = useRef(onMessage)
  const onCloseRef = useRef(onClose)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onOpenRef.current = onOpen
  }, [onOpen])

  useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const cleanup = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.onopen = null
      wsRef.current.onmessage = null
      wsRef.current.onclose = null
      wsRef.current.onerror = null

      if (
        wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING
      ) {
        wsRef.current.close()
      }

      wsRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!url) return

    cleanup()

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = (event) => {
      setIsConnected(true)
      reconnectAttemptRef.current = 0
      onOpenRef.current?.(event)
    }

    ws.onmessage = (event: MessageEvent) => {
      let parsedData: unknown = event.data
      try {
        parsedData = JSON.parse(event.data as string)
      } catch {
        // Not JSON — pass raw data as-is
      }

      const customEvent = { ...event, data: parsedData } as MessageEvent
      onMessageRef.current?.(customEvent)
    }

    ws.onclose = (event) => {
      setIsConnected(false)
      onCloseRef.current?.(event)

      if (reconnectAttemptRef.current < maxReconnects) {
        reconnectAttemptRef.current++
        reconnectTimerRef.current = setTimeout(() => {
          connect()
        }, reconnectInterval)
      }
    }

    ws.onerror = (event) => {
      onErrorRef.current?.(event)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  useEffect(() => {
    connect()
    return () => {
      cleanup()
    }
  }, [connect, cleanup])

  const send = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])

  const reconnect = useCallback(() => {
    reconnectAttemptRef.current = 0
    connect()
  }, [connect])

  return { send, isConnected, reconnect }
}
