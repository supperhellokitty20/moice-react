import React from "react";
import { useState, useEffect } from "react";
import { Layout } from "../Layout/Layout";
import { Button, Input, Card, CardBody, CardHeader, CardFooter, Heading } from "@chakra-ui/react";
import PeerJs from 'peerjs';
import { ChatRoom } from "../ChatRoom/ChatRoom";
let peer: PeerJs;
export const Call = () => {
    const [availablePeer, setPeer] = useState<PeerJs>(peer);
    const [peerId, setPeerId] = useState<string>('');
    const createNewPeerId = () => {
        peer = new PeerJs();
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            setPeerId(id);
        });
        setPeer(peer);
    }
    return (
        <Layout>
            <>
                <Card align='center'>
                    <CardHeader>
                        <Heading>Call</Heading>
                    </CardHeader>
                    <CardBody>
                        <p>Peer id: {peerId}</p>
                        <span>Connection status: </span>
                        <Input placeholder="Input your peer id here" />
                    </CardBody>
                    <CardFooter>
                        <Button onClick={createNewPeerId}>
                            Create new peer Id
                        </Button>
                        <Button>
                            Connect to your peer
                        </Button>
                    </CardFooter>
                </Card>
                <ChatRoom></ChatRoom>
            </>
        </Layout>
    )
}
