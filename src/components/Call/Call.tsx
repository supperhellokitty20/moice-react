import React from "react"; import { useState, useEffect, useRef, useCallback } from "react";
import { Layout } from "../Layout/Layout";
import {
    Button,
    Input,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Heading,
    Box,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import Peerjs from 'peerjs'
import Peer, { DataConnection, MediaConnection } from "peerjs";
import { IChatMessage, ChatMessage } from "../ChatMessage/ChatMessage";
import { ArrowLeftIcon } from "@chakra-ui/icons";
// let peer: PeerJs;
export const Call = () => {
    const [curId, setCurId] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');
    const [connStatus, setConnStatus] = useState<boolean>(false);
    const dataConnRef = useRef<DataConnection>();
    //Store message 
    const [messagesData, setMessagesData] = useState<IChatMessage[]>([]);
    const peerInstance = useRef<Peerjs>();
    const appendMessage = React.useCallback((message: string, fromMe: boolean) => {
        console.log('Append message called');
        const newMessage = {
            id: crypto.randomUUID(),
            time: new Date().toLocaleTimeString(),
            message: message,
            fromMe: fromMe
        }
        console.log('new message', newMessage)
        return setMessagesData((prevMessages) => [...prevMessages, newMessage]);
    }, []);

    useEffect(() => {
        const peer = new Peerjs();
        peer.on('open', (id) => {
            setCurId(id);
        });
        //Recv connection from other peer
        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                console.log('data recieved :', data);
                console.log('Messages data: ', messagesData);
                typeof data === 'string' ?
                    appendMessage(data, false) : console.log('Data not supported');
            })
            dataConnRef.current = conn;
            setConnStatus(true);
            conn.on('close', () => {
                setConnStatus(false);

            })
        });
        peerInstance.current = peer;
    }, [])
    const handleSendMessage = (message: string) => {
        dataConnRef.current?.send(message);
        appendMessage(message, true);
    }
    const connectToPeer = () => {
        console.log("Input", inputValue);
        if (peerInstance.current && inputValue) {
            const conn = peerInstance.current.connect(inputValue);
            conn.on('open', () => {
                setConnStatus(true);
            })
            dataConnRef.current = conn;
            conn.on('data', (data) => {
                console.log('data', data);
                //Recv message from other peer
                typeof data === 'string' ?
                    appendMessage(data, false) : console.log('Data not supported');
            });
            conn.on('close', () => {
                setConnStatus(false);
            })

        }
    }
    const disconnect = React.useCallback(() => {
        dataConnRef.current?.close();
        setConnStatus(false);
    }, [dataConnRef.current]);

    return (
        <Layout>
            <>
                <Card align='center'>
                    <CardHeader>
                        <Heading>Moice</Heading>
                    </CardHeader>
                    <CardBody>
                        <p>Peer id :{curId}</p>
                        {
                            connStatus ? <span>Connected to {dataConnRef.current?.peer}</span> :
                                <>
                                    <span>Not connected</span>
                                    <Input
                                        placeholder="Input your peer id here"
                                        value={inputValue}
                                        onChange={(e) => {
                                            setInputValue(e.target.value);
                                        }}
                                    />
                                </>
                        }
                    </CardBody>
                    <CardFooter>
                        {
                            connStatus && peerInstance ? (
                                <>
                                    <Button onClick={disconnect}>Disconnect</Button>
                                    <Box>
                                        <ChatRoom sendMessage={handleSendMessage} messages={messagesData} />
                                        <VideoChat peerInstance={peerInstance.current!} peerId={dataConnRef.current?.peer}></VideoChat>
                                    </Box>

                                </>) :
                                <Button onClick={connectToPeer}>Connect to your peer</Button>
                        }
                    </CardFooter>
                </Card>
            </>
        </Layout>
    )
}
/**
 * TODO : Current implementation only allow  user must have to open a webcam stream first in order to  work
 * , need fix to make it more seamless like once user click on call , it will automatically open webcam stream and send it to peer 
 * @param props 
 * @returns 
 */
function VideoChat(props: {
    peerInstance: Peerjs,
    peerId: string | undefined
}) {
    console.log("Peer instance", props.peerInstance);
    console.log("Other Peer id ", props.peerId);

    const selfVideo = useRef<HTMLVideoElement>(null);
    const peerVideo = useRef<HTMLVideoElement>(null);
    const mediaConn = useRef<MediaConnection>();
    const [mediaDeviceNotFound, setMediaDeviceNotFound] = useState<boolean>(false);
    const [selfMediaStream, setSelfMediaStream] = useState<MediaStream>();
    const [peerMediaStream, setPeerMediaStream] = useState<MediaStream>();
    const [inComingCall, setIncomingCall] = useState<boolean>();
    const getUserMed = async () => {
        let constraints = {
            audio: true,
            video: {
                width: 1280,
                height: 720
            }
        };

        await navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            showVideo(stream, selfVideo.current!, true)
            setSelfMediaStream(stream);
        }).catch((err) => {
            console.error("Error", err)
            setMediaDeviceNotFound(true);
        }
        )
    }
    //Open self cam on mount 

    function showVideo(stream: MediaStream, video: HTMLVideoElement, muted: boolean) {
        video.srcObject = stream;
        video.volume = muted ? 0 : 1;
        video.onloadedmetadata = function (e) {
            video.play();
        };
    }
    const anwserCall = async (call:MediaConnection)=>  { 
        call.answer(selfMediaStream);
        setIncomingCall(false);
        //Handle stream when peer answers
        mediaConn.current = call ;
        call.on('stream', (stream) => {
            console.log('Incoming peer stream');
            showVideo(stream, peerVideo.current!, true);
            setPeerMediaStream(stream);
            console.log("Peer media stream: ", peerMediaStream);
        })
        call.on('close',()=>{  
            console.log('Call ended');
            endCall() ;
        })  ;
    }
    props.peerInstance.on('call', async (call) => {
        console.log('Incoming call from peer');
        // await getUserMed(); 
        mediaConn.current = call ;
        setIncomingCall(true);
        if (!selfMediaStream) {
            console.error('No self media stream');
            return
        }
        anwserCall(call);
        call.on('close',()=> { 
            console.log('Call ended');
            endCall() ;
        })
        console.log('Answering call with my stream', selfMediaStream);
        // showStream(call,peerVideo.current!) ;
    })
    // const  handlePeerDisconnect = () => {
    //     console.log("Peer disconnect");
    //     mediaConn.current?.close();
    //     const peerTracks = peerMediaStream?.getTracks();
    //     peerTracks?.forEach((track) => {track.stop()}) ; 
    //     setPeerMediaStream(undefined);
    // }  
    const endCall = () => { 
        console.log("Ending call");
        const tracks = selfMediaStream?.getTracks();
        tracks?.forEach((track) => {
            track.stop();
        }) ;
        const peerTracks = peerMediaStream?.getTracks();
        peerTracks?.forEach((track) => {track.stop()}) ; 
        mediaConn.current?.close();
    }
    const callPeer = async () => {
        if (typeof props.peerId === 'string') {
            // await getUserMed() ;
            //Answer with our media stream 
            const call = props.peerInstance.call(props.peerId, selfMediaStream!);
            mediaConn.current = call ;
            // showVideo(selfMediaStream!, selfVideo.current!, true);
            console.log("Calling peeer with my stream", selfMediaStream);
            if (call) {
                call.on('stream', (stream) => {
                    console.log('incoming stream');
                    setPeerMediaStream(stream) ;
                    showVideo(stream, peerVideo.current!, true);
                })
                // showStream(call,peerVideo.current!) ;
            } else {
                console.error("Cant call peer");
            }

        } else {
            console.log('Peer id not found');
        }
    };
    const AlertDeviceNotFound:React.FC = () => { 
        return ( 
            <Alert status='error'>
                <AlertIcon />
                No media device found
            </Alert>
        )

    }
    return (
        <>
            <Card>
                <CardHeader>
                    <Heading>Video Chat</Heading>
                </CardHeader>
                <CardBody>
                    {
                        inComingCall && (
                            <>
                                <Alert status="success">Incoming call</Alert>
                                <Button colorScheme='green' >Accept Call</Button>
                            </>
                        )
                    }
                    {
                        mediaDeviceNotFound && (
                           <AlertDeviceNotFound/>
                        )
                    }
                    <Heading>You</Heading>
                    <video ref={selfVideo} autoPlay muted></video>
                    <Heading>Peer</Heading>
                    { 
                        typeof peerMediaStream==undefined ?<span>No media stream from peer</span>:<></>
                    }
                    <video ref={peerVideo} autoPlay muted></video> 
                </CardBody>
                <CardFooter>
                    {
                        !selfMediaStream ? (
                            <Button colorScheme="blue" onClick={getUserMed}>Open Cam</Button>
                        ) : (
                            <>
                                <Button colorScheme="blue" onClick={callPeer}>Call</Button>
                                <Button colorScheme='red' onClick={endCall}>End Call</Button>
                            </>
                        )
                    }

                </CardFooter>
            </Card>
        </>
    )
}


function ChatRoom(props: {
    messages: IChatMessage[],
    sendMessage: (message: string) => void,
}) {
    console.log('Messages sent to Chat Rooom:', props.messages);
    const [inputValue, setInputValue] = React.useState<string>("");
    const handleSendMessage = () => {
        if (inputValue) {
            props.sendMessage(inputValue);
            setInputValue("");
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
                            return <ChatMessage {...message} key={message.id} />
                        })
                    }
                </CardBody>
                <CardFooter>
                    <Input value={inputValue} onChange={
                        (e) => {
                            setInputValue(e.target.value);
                        }
                    } placeholder="Hello world" />
                    <Button onClick={handleSendMessage}>Send</Button>
                </CardFooter>
            </Card>
        </>
    );
}