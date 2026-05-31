"use client";

import { useEffect, useRef, useState, useCallback, useMemo, RefObject } from "react";
import type { AgentMessage, AssistantMessage, TextContent } from "@/lib/types";

interface Props {
  messages: AgentMessage[];
  streamingMessage: Partial<AgentMessage> | null;
  scrollContainer: RefObject<HTMLDivElement | null>;
  messageRefs: RefObject<(HTMLDivElement | null)[]>;
  onHighlight: (allMsgIndex: number) => void;
}

const MINIMAP_WIDTH = 36;

function getMessagePreview(msg: AgentMessage | Partial<AgentMessage>): string {
  if (msg.role === "user") {
    const content = msg.content;
    if (typeof content === "string") return content.slice(0, 200);
    if (Array.isArray(content)) {
      return (content as { type: string; text?: string }[])
        .filter((b) => b.type === "text" && b.text)
        .map((b) => b.text!)
        .join("\n")
        .slice(0, 200);
    }
    return "";
  }
  if (msg.role === "assistant") {
    const blocks = (msg as Partial<AssistantMessage>).content ?? [];
    const text = blocks
      .filter((b): b is TextContent => b.type === "text")
      .map((b) => b.text)
      .join(" ");
    if (text) return text.slice(0, 200);
    const toolNames = blocks
      .filter((b) => b.type === "toolCall")
      .map((b) => (b as { type: string; toolName: string }).toolName);
    if (toolNames.length) return toolNames.join(", ");
    return "";
  }
  return "";
}

function getNodeColor(msg: AgentMessage | Partial<AgentMessage>): { bg: string; border: string } {
  if (msg.role === "user") {
    return { bg: "rgba(107,140,255,0.18)", border: "rgba(107,140,255,0.7)" };
  }
  return { bg: "rgba(107,140,255,0.08)", border: "rgba(107,140,255,0.35)" };
}

function hasTextContent(msg: AgentMessage | Partial<AgentMessage>): boolean {
  if (msg.role === "user") return true;
  if (msg.role === "assistant") {
    const blocks = (msg as Partial<AssistantMessage>).content ?? [];
    return blocks.some((b) => b.type === "text");
  }
  return false;
}

interface NodeInfo {
  topRatio: number;   // 0–1 within total scroll height
  heightRatio: number;
  msg: AgentMessage | Partial<AgentMessage>;
  index: number;
}

export function ChatMinimap({ messages, streamingMessage, scrollContainer, messageRefs, onHighlight }: Props) {
  const [scrollRatio, setScrollRatio] = useState(0);
  const [viewportRatio, setViewportRatio] = useState(1);
  const [visible, setVisible] = useState(false);
  const [nodes, setNodes] = useState<NodeInfo[]>([]);
  const [minimapHovered, setMinimapHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mouseYRatio, setMouseYRatio] = useState<number | null>(null);
  const draggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollContainer.current;
    if (!el) return;
    el.scrollBy({ top: e.deltaY, behavior: "auto" });
  }, [scrollContainer]);

  const allMessages = useMemo(
    () => (streamingMessage ? [...messages, streamingMessage] : messages) as (AgentMessage | Partial<AgentMessage>)[],
    [messages, streamingMessage]
  );
  const allMessagesRef = useRef(allMessages);
  allMessagesRef.current = allMessages;

  // Mapping: allMsgIndex → refIdx (messageRefs uses refIdx, not allMsgIndex)
  const msgIndexToRefIdx = useMemo(() => {
    const map = new Map<number, number>();
    let r = 0;
    allMessages.forEach((msg, i) => {
      if (msg.role === "user" || msg.role === "assistant") {
        map.set(i, r++);
      }
    });
    return map;
  }, [allMessages]);

  // Extract user messages for history panel display
  const userMessages = useMemo(() => {
    return allMessages
      .map((m, i) => ({ msg: m, allMsgIndex: i }))
      .filter(item => item.msg.role === "user");
  }, [allMessages]);

  const updatePositionsRef = useRef<() => void>(null!);

  // Jump to a specific user message position — precise top alignment
  const jumpToMessage = useCallback((allMsgIndex: number) => {
    const el = scrollContainer.current;
    if (!el) return;
    const refIdx = msgIndexToRefIdx.get(allMsgIndex);
    const refs = messageRefs.current;
    if (refIdx !== undefined && refs && refs[refIdx]) {
      const target = refs[refIdx]!;
      const delta = target.getBoundingClientRect().top - el.getBoundingClientRect().top;
      el.scrollTo({ top: el.scrollTop + delta, behavior: "smooth" });
    } else {
      const estimatedTop = (allMsgIndex / allMessages.length) * (el.scrollHeight - el.clientHeight);
      el.scrollTo({ top: estimatedTop, behavior: "smooth" });
    }
  }, [scrollContainer, messageRefs, allMessages.length, msgIndexToRefIdx]);
  updatePositionsRef.current = () => {
    const scrollEl = scrollContainer.current;
    if (!scrollEl) return;

    const totalH = scrollEl.scrollHeight;
    const clientH = scrollEl.clientHeight;
    const scrollable = totalH - clientH;

    setVisible(scrollable > 20);
    if (scrollable <= 0) {
      setScrollRatio(0);
      setViewportRatio(1);
    } else {
      setScrollRatio(scrollEl.scrollTop / scrollable);
      setViewportRatio(clientH / totalH);
    }

    // Build node positions — only user messages
    const refs = messageRefs.current;
    const newNodes: NodeInfo[] = [];
    let refIndex = 0;

    const allMessages = allMessagesRef.current;
    const userMsgCount = allMessages.filter(m => m.role === "user").length;
    for (let i = 0; i < allMessages.length; i++) {
      const msg = allMessages[i];
      // Track refIndex for ALL rendered messages to keep alignment
      if (msg.role === "user" || msg.role === "assistant") {
        const el = refs?.[refIndex];
        refIndex++;
        if (msg.role !== "user") continue;

        if (el && totalH > 0) {
          const elRect = el.getBoundingClientRect();
          const containerRect = scrollEl.getBoundingClientRect();
          const top = elRect.top - containerRect.top + scrollEl.scrollTop;
          const h = elRect.height;
          newNodes.push({
            topRatio: top / totalH,
            heightRatio: h / totalH,
            msg,
            index: newNodes.length,
          });
        } else {
          // No DOM ref, add with placeholder position
          const ratio = newNodes.length / Math.max(userMsgCount, 1);
          newNodes.push({
            topRatio: ratio,
            heightRatio: 0.01,
            msg,
            index: newNodes.length,
          });
        }
      }
    }
    setNodes(newNodes);
  };

  const updatePositions = useCallback(() => updatePositionsRef.current(), []);

  useEffect(() => {
    const el = scrollContainer.current;
    if (!el) return;
    el.addEventListener("scroll", updatePositions, { passive: true });
    const ro = new ResizeObserver(updatePositions);
    ro.observe(el);
    // Also observe the scroll content for height changes
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    updatePositions();
    return () => {
      el.removeEventListener("scroll", updatePositions);
      ro.disconnect();
    };
  }, [scrollContainer, updatePositions]);

  // Re-measure when message count changes (new messages arrive)
  useEffect(() => {
    const t = setTimeout(updatePositions, 50);
    return () => clearTimeout(t);
  }, [messages.length, updatePositions]);

  const scrollToMinimapRatio = useCallback((viewportTopRatio: number) => {
    const el = scrollContainer.current;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable <= 0) return;
    const clamped = Math.max(0, Math.min(1 - viewportRatio, viewportTopRatio));
    el.scrollTop = (clamped / (1 - viewportRatio)) * scrollable;
  }, [scrollContainer, viewportRatio]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!visible) return;

    draggingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = (e.clientY - rect.top) / rect.height;
    const grabOffset = clickRatio - scrollRatio * (1 - viewportRatio);
    const insideBox = grabOffset >= 0 && grabOffset <= viewportRatio;
    const offset = insideBox ? grabOffset : viewportRatio / 2;

    scrollToMinimapRatio(clickRatio - offset);

    const onMove = (ev: MouseEvent) => {
      if (!draggingRef.current) return;
      const r = (ev.clientY - rect.top) / rect.height;
      scrollToMinimapRatio(r - offset);
    };
    const onUp = () => {
      draggingRef.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [visible, viewportRatio, scrollRatio, scrollToMinimapRatio]);



  const clearHideTimer = () => { if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; } };
  const startHideTimer = () => { setMinimapHovered(false); };

  return (
    <div
      style={{
        width: pinned ? 356 : MINIMAP_WIDTH,
        flexShrink: 0,
        position: "relative",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        userSelect: "none",
        borderLeft: "1px solid var(--border)",
        background: pinned ? "var(--bg)" : "var(--bg-panel)",
        transition: "width 0.25s ease, background 0.25s",
        overflow: "hidden",
      }}
    >
      {/* History panel — fills remaining width when visible, collapses to 0 width */}
      <div style={{
        flex: pinned ? 1 : 0,
        alignSelf: pinned ? "stretch" : "auto",
        overflow: "hidden",
        opacity: pinned ? 1 : 0,
        transition: "flex 0.25s ease, opacity 0.15s ease",
      }}>
        {userMessages.length > 0 && <div style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRight: pinned ? "1px solid var(--accent)" : "none",
        }}>
          {/* Header */}
          <div style={{
            padding: "6px 12px",
            background: "var(--bg-panel)",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
            fontSize: 10, color: "var(--text-dim)", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.07em",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>
              </svg>
              Your Messages
            </span>
            <span style={{ fontSize: 9, fontWeight: 400, opacity: 0.6 }}>{userMessages.length} messages</span>
          </div>
          {/* Scrollable message list */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
          }}>
            {userMessages.map((item, i) => {
              const preview = getMessagePreview(item.msg);
              if (!preview) return null;
              const color = getNodeColor(item.msg);
              return (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 6,
                  padding: "3px 12px 3px 10px",
                  fontSize: 10,
                  color: "var(--text)",
                  lineHeight: 1.4,
                  cursor: "pointer",
                  borderLeft: `2px solid ${color.border}`,
                  margin: "1px 8px",
                  borderRadius: 4,
                  transition: "background 0.1s",
                }}
                  onClick={() => { jumpToMessage(item.allMsgIndex); onHighlight(item.allMsgIndex); }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-subtle)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{
                    fontSize: 8,
                    color: "var(--accent)",
                    fontWeight: 600,
                    flexShrink: 0,
                    minWidth: 22,
                    padding: "1px 4px",
                    borderRadius: 3,
                    background: "rgba(107,140,255,0.08)",
                    textAlign: "center",
                  }}>#{i + 1}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{preview}</span>
                </div>
              );
            })}
          </div>
        </div>}
      </div>

      {/* Trigger handle — always visible, on the right edge */}
      <div
        ref={containerRef}
        onMouseEnter={() => { if (!pinned) { clearHideTimer(); setMinimapHovered(true); } }}
        onMouseLeave={() => { if (!pinned) startHideTimer(); }}
        onClick={() => {
          if (userMessages.length > 0) {
            setPinned(v => !v);
          }
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          width: MINIMAP_WIDTH,
          flexShrink: 0,
          alignSelf: "center",
          height: 100,
          minHeight: 100,
          borderRadius: pinned ? "12px 0 0 12px" : 12,
          margin: pinned ? "0" : 0,
          background: (minimapHovered || pinned) && nodes.length > 0
            ? "linear-gradient(180deg, var(--accent), var(--teal))"
            : "var(--bg-subtle)",
          border: `1px solid ${(minimapHovered || pinned) && nodes.length > 0 ? "transparent" : "var(--border)"}`,
          opacity: nodes.length > 0 ? 1 : 0.3,
          cursor: nodes.length > 0 ? "pointer" : "default",
          transition: "all 0.2s ease",
          transform: (minimapHovered || pinned) ? "scale(1.05)" : "scale(1)",
          boxShadow: (minimapHovered || pinned) && nodes.length > 0
            ? "0 2px 10px rgba(107,140,255,0.25)"
            : "none",
        }}
      >
        {/* Chevron indicator */}
        <svg
          width="8" height="8" viewBox="0 0 10 10" fill="none"
          stroke={minimapHovered && nodes.length > 0 ? "#fff" : "var(--text-dim)"}
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          style={{
            transition: "stroke 0.15s, transform 0.2s",
            transform: minimapHovered ? "translateX(-1px)" : "translateX(0)",
          }}
        >
          <polyline points={`${pinned ? "2 2 5 5 2 8" : "6 2 3 5 6 8"}`} />
        </svg>
        {/* Dots line */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{
            width: 3, height: 3, borderRadius: "50%",
            background: minimapHovered && nodes.length > 0 ? "rgba(255,255,255,0.5)" : "var(--text-dim)",
            transition: "background 0.15s",
          }} />
          <div style={{
            width: 3, height: 3, borderRadius: "50%",
            background: minimapHovered && nodes.length > 0 ? "rgba(255,255,255,0.8)" : "var(--text-dim)",
            transition: "background 0.15s",
          }} />
          <div style={{
            width: 3, height: 3, borderRadius: "50%",
            background: minimapHovered && nodes.length > 0 ? "rgba(255,255,255,0.5)" : "var(--text-dim)",
            transition: "background 0.15s",
          }} />
        </div>
        {/* Chevron indicator bottom */}
        <svg
          width="8" height="8" viewBox="0 0 10 10" fill="none"
          stroke={minimapHovered && nodes.length > 0 ? "#fff" : "var(--text-dim)"}
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          style={{
            transition: "stroke 0.15s, transform 0.2s",
            transform: minimapHovered ? "translateX(-1px)" : "translateX(0)",
          }}
        >
          <polyline points={`${pinned ? "2 2 5 5 2 8" : "6 2 3 5 6 8"}`} />
        </svg>
      </div>
    </div>
  );
}

// Hook to create a stable array of refs for messages
export function useMessageRefs(count: number): RefObject<(HTMLDivElement | null)[]> {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  refs.current = Array(count).fill(null).map((_, i) => refs.current[i] ?? null);
  return refs;
}
