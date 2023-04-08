import React from "react";
import {
    Button,
    Input,
    Card,
    CardBody, 
    CardHeader, 
    CardFooter, 
    Heading
} from "@chakra-ui/react";
import { ChatMessage ,IChatMessage} from "../ChatMessage/ChatMessage";
import { DataConnection } from "peerjs";
import { text } from "stream/consumers";

export function ChatRoom(props: {
    dataConnection: React.MutableRefObject<DataConnection | undefined>,
    messages: IChatMessage[]  })
{
    const [inputValue, setInputValue] = React.useState<string>("");
    const [connected, setConnected] = React.useState<boolean>(false);
    const sendMessage =() => { 

        console.log("Send message");
        console.log(inputValue) ;
        if(props.dataConnection.current){
            props.dataConnection.current.send(inputValue) ;
        }        
        setInputValue('') ;
    }
    return (
        <Card> 
            <CardHeader>
                <Heading>Chat room</Heading>
            </CardHeader>
            <CardBody>
            </CardBody>            
            <CardFooter>
                <Input  value={inputValue} onChange={
                    (e) => {
                        setInputValue(e.target.value);
                    }
                } placeholder="Hello world"/>
                <Button onClick={sendMessage}>Send</Button>
            </CardFooter>
        </Card>
    );
}