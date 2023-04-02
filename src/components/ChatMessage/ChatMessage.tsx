import React from 'react';

export function ChatMessage(props: { message: string ,photoURL?:string}) {
  return (
    <div className="chat-message">
        <p>{props.message}</p>
    </div>
  );
}
