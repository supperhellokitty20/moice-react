import React from "react"; import { useState, useEffect,useRef } from "react";
import { Layout } from "../Layout/Layout";
import { Button, Input, Card, CardBody, CardHeader, CardFooter, Heading } from "@chakra-ui/react";
import Peerjs from 'peerjs'
import { ChatRoom } from "../ChatRoom/ChatRoom";
import { DataConnection } from "peerjs"; 
import { IChatMessage } from "../ChatMessage/ChatMessage";
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
    useEffect(()=>{ 
        const peer = new Peerjs() ;
        peer.on('open',(id)=>{ 
            setCurId(id) ;
        }) ;
        //Recv connection from other peer
        peer.on('connection',(conn) => { 
            conn.on('data',(data)=>{ 
                console.log('data',data) ; 
                if(typeof data === 'string') { 
                    const newMessage = { 
                        id : crypto.randomUUID(),
                        time: new Date().toLocaleTimeString(),
                        message: data,
                        fromMe: false
                    }
                    setMessagesData([...messagesData,newMessage]) ;
                }
            })
            dataConnRef.current = conn ;
            setConnStatus(true) ;
            conn.on('close',()=>{ 
                setConnStatus(false) ;

            })
        }) ;
        peerInstance.current = peer ; 
    },[]) 
    const connectToPeer = () => {
        console.log(inputValue) ;
        if(peerInstance.current && inputValue){
            const conn = peerInstance.current.connect(inputValue)  ;
            conn.on('open' ,() => { 
                setConnStatus(true) ;
                dataConnRef.current = conn ;
                conn.send('Hi') ;
            })
            dataConnRef.current = conn ; 
            conn.on('data' , (data) => { 
                console.log('data',data) ;
                //Recv message from other peer
                if(typeof data === 'string') { 
                    const newMessage = { 
                        id : crypto.randomUUID(),
                        time: new Date().toLocaleTimeString(),
                        message: data,
                        fromMe:false 
                    }
                    setMessagesData([...messagesData,newMessage]) ;
                }
            }) ;
            conn.on('close',()=>{ 
                setConnStatus(false) ;
            })
        }
    }
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
                    </CardFooter>
                </Card>
                { 
                    messagesData? messagesData.map((item)=>{ 
                        return ( <p key={item.id}>{item.message}</p>) ;
                    }) : <p>No message</p>
                }
                <ChatRoom dataConnection={dataConnRef} messages={messagesData}></ChatRoom>
            </>
        </Layout>
    )
}
