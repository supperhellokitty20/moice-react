import React from 'react';

export interface IChatMessage{ 
    id?: string ;  
    message: string ;
    time: string ; 
    fromMe:boolean ;
}
export const ChatMessage:React.FC<IChatMessage> = ({id,time,message,fromMe}:IChatMessage) => {
  return (
    <div className="chat-message">
      { 
        fromMe ?( 
          <span>ME: {time} : {message}</span>
        ) : <span>Peer:{time}:{message}</span>

      }
    </div>
  );
}
