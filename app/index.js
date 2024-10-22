// did:dht
import { DidDht } from '@web5/dids'

//did:jwk
import { DidJwk } from '@web5/dids'


// Creates a DID using the DHT method and publishes the DID Document to the DHT
const didDht = await DidDht.create({ publish: true });
// console.log(didDht);

// DID and its associated data which can be exported and used in different contexts/apps
const portableDid = await didDht.export();
console.log(portableDid);

// DID string
const did = didDht.uri;

// DID Document
const didDocument = JSON.stringify(didDht.document);
