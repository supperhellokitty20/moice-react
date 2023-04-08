import React from 'react';

export interface IChatMessage{ 
    id?: string ;  
    message: string ;
    time: string ; 
    fromMe:boolean ;
}
export const ChatMessage:React.FC<IChatMessage> = (props) => {
  return (
    <div className="chat-message">
       <span>{props.time}</span>
       <span>{props.message}</span>
    </div>
  );
}
