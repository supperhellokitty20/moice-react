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
import { ChatMessage } from "../ChatMessage/ChatMessage";

export function ChatRoom() {
    const message ="Hello world" ;
    // const sendMessage = async(e:any)=> { 
    //     e.preventDefault();
    //     console.log("Send message");
    // }
    const [inputValue, setInputValue] = React.useState<string>("");
    const sendMessage =() => { 
        console.log("Send message");
        console.log(inputValue) ;
        setInputValue('') ;
    }
    return (
        <Card> 
            <CardHeader>
                <Heading>Chat room</Heading>
            </CardHeader>
            <CardBody>
                <ChatMessage message={inputValue}></ChatMessage>
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