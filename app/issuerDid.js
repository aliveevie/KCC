// Step 1: a) Create the DID
import { DidDht } from '@web5/dids';
import { Web5 } from "@web5/api";
import { VerifiableCredential } from '@web5/credentials';

const aliceDid = 'did:dht:rr1w5z9hdjtt76e6zmqmyyxc5cfnwjype6prz45m6z1qsbm8yjao'


// Create a DID for the issuer and publish it to the network
const issuerDid = await DidDht.create({ publish: true });
console.log(`Issuer DID: ${issuerDid.uri}`);

// Step 1: b) Setup a DWN;

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
     console.log("DWN Creation was success!")
    },
    onFailure: (error) => {
      /* 
      Registration failed, display an error message to the user, and pass in 
      the registration object again to retry next time the user connects
      */
    },
  },
})


// step 2: Issue Alice a KCC
const alice_kcc = await VerifiableCredential.create({
  issuer: issuerDid, // Issuer's DID URI
  subject: aliceDid, // Customer's DID URI 
  expirationDate: '2028-05-19T08:02:04Z',
  data: {
    countryOfResidence: "NG", // 2 letter country code
    tier: "Best", // optional KYC tier
    jurisdiction: { 
      country: "US" // optional 2 letter country code where IDV was performed
    }
  },
  credentialSchema: [
    {
      id: "https://vc.schemas.host/kcc.schema.json", // URL to the schema used
      type: "JsonSchema", // Format type of the schema used for the KCC
    }
  ],
  // (optional) Evidence describing the due diligence performed to verify the identity of the known customer
  evidence: [
    {
      "kind": "Devpost_Participation",
      "checks": ["passport", "utility_bill"]
    },
    {
      "kind": "sanction_screening",
      "checks": ["PEP"]
    }
  ]
});

const aliceJWT = await vc.sign({ did: issuerDid });
console.log(aliceJWT);

const protocolDefinition = {
    "protocol": "https://social-media.xyz",
    "published": true,
    "types": {
      "post": {
        "schema": "https://social-media.xyz/schemas/postSchema",
        "dataFormats": ["text/plain"]
      },
      "reply": {
        "schema": "https://social-media.xyz/schemas/replySchema",
        "dataFormats": ["text/plain"]
      },
      "image": {
        "dataFormats": ["image/jpeg"]
      },
      "caption": {
        "schema": "https://social-media.xyz/schemas/captionSchema",
        "dataFormats": ["text/plain"]
      }
    },
    "structure": {
      "post": {
        "$actions": [
          {
            "who": "anyone",
            "can": ["create", "read"]
          }
        ],
        "reply": {
          "$actions": [
            {
              "who": "recipient",
              "of": "post",
              "can": ["create"]
            },
            {
              "who": "author",
              "of": "post",
              "can": ["create"]
            }
          ]
        }
      },
      "image": {
        "$actions": [
          {
            "who": "anyone",
            "can": ["create", "read"]
          }
        ],
        "caption": {
          "$actions": [
            {
              "who": "anyone",
              "can": ["read"]
            },
            {
              "who": "author",
              "of": "image",
              "can": ["create"]
            }
          ]
        },
        "reply": {
          "$actions": [
            {
              "who": "author",
              "of": "image",
              "can": ["read"]
            },
            {
              "who": "recipient",
              "of": "image",
              "can": ["create"]
            }
          ]
        }
      }
    }
}

const { protocol, status } = await web5.dwn.protocols.configure({
    message: {
      definition: protocolDefinition
    }
});

//sends protocol to remote DWNs immediately (vs waiting for sync)
await protocol.send(issuerDid.uri).then(() => {
    console.log("Protocols install success!")
})


// step 4: Obtain permission to write to alice Did's;

const response = await fetch(`https://vc-to-dwn.tbddev.org/authorize?issuerDid=${issuerDid.uri}`);

// Wait for the response JSON to resolve
const data = await response.json();

// Log the data
console.log(data);



export { issuerDid };