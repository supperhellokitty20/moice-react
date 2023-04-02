import React, { useEffect, useState } from "react";
import { Button,Card,CardHeader,CardBody,CardFooter, Heading,Input} from "@chakra-ui/react";
import PeerJs  from 'peerjs';
import { Layout } from "../Layout/Layout";
let peer: PeerJs;
export const Receive= () => { 
    const [availablePeer, setPeer] = useState<PeerJs>(peer);
    const [peerId, setPeerId] = useState<string>('');
    useEffect(() => {
        console.log('peerId', peerId);
    }, [peerId]);
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
            <Card align='center'>
                <CardHeader>
                    <Heading>Receive</Heading>
                </CardHeader>
                <CardBody>
                    <p>Peer id: {peerId}</p>
                    <span>Connection status :</span>
                    <span>Now send this code to your peer</span>
                </CardBody>
                <CardFooter>
                    <Button onClick={createNewPeerId}>
                        Create new peer Id 
                    </Button>
                </CardFooter>
            </Card>
        </Layout>
    );
} 
