import { Web5 } from "@web5/api";
import { issuerDid } from "./issuerDid";

const { web5, did: myDid } = await Web5.connect();


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