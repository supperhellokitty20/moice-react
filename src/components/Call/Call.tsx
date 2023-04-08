import React from "react"; import { useState, useEffect,useRef } from "react";
import { Layout } from "../Layout/Layout";
import { Button, Input, Card, CardBody, CardHeader, CardFooter, Heading } from "@chakra-ui/react";
import Peerjs from 'peerjs'
import { DataConnection } from "peerjs"; 
import { IChatMessage,ChatMessage } from "../ChatMessage/ChatMessage";
// let peer: PeerJs;
export const Call = () => {
    const [curId , setCurId] = useState<string>('');
    const [inputValue , setInputValue] = useState<string>('');
    const [connStatus , setConnStatus] = useState<boolean>(false) ;
    const dataConnRef =  useRef<DataConnection>();
    //Store message 
    const [messagesData , setMessagesData] = useState<IChatMessage[]>([]) ;
    const peerInstance = useRef<Peerjs>() ;
    // const [messages, setMessages] = useState<IChatMessage[]>([]);
    const appendMessage = React.useCallback((message:string , fromMe:boolean)=>{ 
        console.log('Append message called') ;
        const newMessage = {
            id : crypto.randomUUID(),
            time: new Date().toLocaleTimeString(),
            message: message,
            fromMe: fromMe 
        }
        console.log('new message',newMessage)
        return setMessagesData((prevMessages)=>[...prevMessages,newMessage]) ;
},[]); 
;

    useEffect(()=>{ 
        const peer = new Peerjs() ;
        peer.on('open',(id)=>{ 
            setCurId(id) ;
        }) ;
        //Recv connection from other peer
        peer.on('connection',(conn) => { 
            conn.on('data',(data)=>{ 
                console.log('data recieved :',data) ; 
                console.log('Messages data: ',messagesData) ;
                typeof data ==='string' ? 
                appendMessage(data,false):console.log('Data not supported')  ;
            })
            dataConnRef.current = conn ;
            setConnStatus(true) ;
            conn.on('close',()=>{ 
                setConnStatus(false) ;

            })
        }) ;
        peerInstance.current = peer ; 
    },[]) 
    const handleSendMessage = (message:string) => {
        dataConnRef.current?.send(message) ;
        appendMessage(message,true) ;
    }
    const connectToPeer = () => {
        console.log("Input",inputValue) ;
        if(peerInstance.current && inputValue){
            const conn = peerInstance.current.connect(inputValue)  ;
            conn.on('open' ,() => { 
                setConnStatus(true) ;
            })
            dataConnRef.current = conn ; 
            conn.on('data' , (data) => { 
                console.log('data',data) ;
                //Recv message from other peer
                typeof data ==='string' ? 
                appendMessage(data,false):console.log('Data not supported')  ;
            }) ;
            conn.on('close',()=>{ 
                setConnStatus(false) ;
            })

        }
    }
    const disconnect =  React.useCallback(()=>{
        dataConnRef.current?.close() ;
        setConnStatus(false) ;

     },[dataConnRef.current]); 
    return (
        <Layout>
            <>
                <Card align='center'>
                    <CardHeader>
                        <Heading>Moice</Heading>
                    </CardHeader>
                    <CardBody>
                            <p>Peer id :{curId}</p>
                            <span>Connection status: </span>
                            {connStatus? <span>Connected</span> : <span>Not connected</span>}
                            <Input 
                            placeholder="Input your peer id here" 
                            value = {inputValue}
                            onChange = {(e) => {
                                setInputValue(e.target.value);
                            }} 
                            />
                    </CardBody>
                    <CardFooter>
                        <Button onClick={connectToPeer} disabled={!connStatus}>
                            Connect to your peer 
                        </Button>
                        <Button onClick={disconnect}>Disconnect</Button>
                    </CardFooter>
                </Card>
                <ChatRoom sendMessage={handleSendMessage} messages={messagesData}/>
            </>
        </Layout>
    )
}

function ChatRoom(props: {
    messages:IChatMessage[],
    sendMessage:(message:string)=>void,
})
{
    console.log('Messages sent to Chat Rooom:',props.messages) ;
    const [inputValue, setInputValue] = React.useState<string>("");
   const handleSendMessage = () => { 
        if(inputValue) { 
            props.sendMessage(inputValue) ;
            setInputValue("") ;
        }
   }
    return (
        <> 
        <Card> 
            <CardHeader>
                <Heading>Chat room</Heading>
            </CardHeader>
            <CardBody>
            {   
                props.messages.map((message) => { 
                return  <ChatMessage {...message} key={message.id} />
                })
            }
            </CardBody>            
            <CardFooter>
                <Input  value={inputValue} onChange={
                    (e) => {
                        setInputValue(e.target.value);
                    }
                } placeholder="Hello world"/>
                <Button onClick={handleSendMessage}>Send</Button>
            </CardFooter>
        </Card>
        </>
    );
}