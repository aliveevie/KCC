// did:dht
import { DidDht } from '@web5/dids';

//did:jwk
import { DidJwk } from '@web5/dids';
import { Web5 } from '@web5/api';


// Creates a DID using the DHT method and publishes the DID Document to the DHT
const didDht = await DidDht.create({ publish: true });
// console.log(didDht);

// DID and its associated data which can be exported and used in different contexts/apps
const portableDid = await didDht.export();
console.log(portableDid);

// DID string
// const did = didDht.uri;

// DID Document
const didDocument = JSON.stringify(didDht.document);

const {did, web5} = await Web5.connect({
  didCreateOptions: {
    // Use community DWN instance hosted on Google Cloud
    dwnEndpoints: ['https://dwn.gcda.xyz']
  },
  registration: {
    onSuccess: () => {
      /*
      Registration succeeded, set a local storage value to indicate the user 
      is registered and registration does not need to occur again
      */
     console.log("Registraction Succeed!")
    },
    onFailure: (error) => {
      /* 
      Registration failed, display an error message to the user, and pass in 
      the registration object again to retry next time the user connects
      */
    },
  },
})

export function issuerDid(){
  return did.uri;
}