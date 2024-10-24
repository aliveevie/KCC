import { Web5 } from '@web5/api';
import { VerifiableCredential } from '@web5/credentials';

// Alice's DID (predefined in this case)
const aliceDid = 'did:dht:rr1w5z9hdjtt76e6zmqmyyxc5cfnwjype6prz45m6z1qsbm8yjao';

try {
    // Step 1: Set up the DWN and Create the Issuer DID
    console.log("Step 1: Setting up the DWN and creating the Issuer DID...");
    
    const { did, web5 } = await Web5.connect({
        didCreateOptions: {
            dwnEndpoints: ['https://dwn.gcda.xyz'],  // Using the community DWN instance
        },
        registration: {
            onSuccess: () => console.log("DWN Creation and Issuer DID setup was successful!"),
            onFailure: (error) => console.error("DWN Creation failed:", error),
        },
    });

   // const issuerDidUri = issuerDid.uri;
    console.log(`Issuer DID URI: ${did}`);
    console.log("Successfully done with Step 1.");

    // Step 2: Issue Alice a Known Customer Credential (KCC)
    console.log("Step 2: Issuing a Known Customer Credential (KCC) to Alice...");

    const aliceKcc = await VerifiableCredential.create({
        issuer: did,  // Issuer's DID URI created by Web5.connect
        subject: aliceDid,  // Alice's DID
        expirationDate: '2028-05-19T08:02:04Z',  // Expiration date for the credential
        data: {
            countryOfResidence: "NG",  // 2-letter country code
            tier: "Best",  // Optional KYC tier
            jurisdiction: { country: "US" }  // Jurisdiction where the KYC was performed
        },
        credentialSchema: [
            {
                id: "https://vc.schemas.host/kcc.schema.json",  // KCC schema URL
                type: "JsonSchema"  // Schema type
            }
        ],
        evidence: [
            { kind: "Devpost_Participation", checks: ["passport", "utility_bill"] },
            { kind: "sanction_screening", checks: ["PEP"] }
        ]
    });

    // Sign the VC using the issuer DID
    const { did: bearerDid } = await web5.agent.identity.get({ didUri: did });
    const aliceJWT = await aliceKcc.sign({ did: bearerDid });
    console.log('Issued and Signed Alice KCC:', aliceKcc);
    console.log("Successfully done with Step 2.");

    // Step 3: Install Protocols on the DWN
    console.log("Step 3: Installing Protocols on the DWN...");

    const protocolDefinition = {
        protocol: "https://social-media.xyz",
        published: true,
        types: {
            post: {
                schema: "https://social-media.xyz/schemas/postSchema",
                dataFormats: ["text/plain"]
            },
            reply: {
                schema: "https://social-media.xyz/schemas/replySchema",
                dataFormats: ["text/plain"]
            },
            image: {
                dataFormats: ["image/jpeg"]
            },
            caption: {
                schema: "https://social-media.xyz/schemas/captionSchema",
                dataFormats: ["text/plain"]
            }
        },
        structure: {
            post: {
                $actions: [
                    { who: "anyone", can: ["create", "read"] }
                ],
                reply: {
                    $actions: [
                        { who: "recipient", of: "post", can: ["create"] },
                        { who: "author", of: "post", can: ["create"] }
                    ]
                }
            },
            image: {
                $actions: [
                    { who: "anyone", can: ["create", "read"] }
                ],
                caption: {
                    $actions: [
                        { who: "anyone", can: ["read"] },
                        { who: "author", of: "image", can: ["create"] }
                    ]
                },
                reply: {
                    $actions: [
                        { who: "author", of: "image", can: ["read"] },
                        { who: "recipient", of: "image", can: ["create"] }
                    ]
                }
            }
        }
    };

    const { protocol, status } = await web5.dwn.protocols.configure({
        message: { definition: protocolDefinition },
    });

    // Send protocol to remote DWNs
    await protocol.send(did);
    console.log("Protocols installed successfully!");
    console.log("Successfully done with Step 3.");

    // Step 4: Obtain permission to write to Alice's DWN
    console.log("Step 4: Obtaining permission to write to Alice's DWN...");
    const response = await fetch(`https://vc-to-dwn.tbddev.org/authorize?issuerDid=${did}`);
    const data = await response.json();
    console.log('Authorization response:', data);
    console.log("Successfully done with Step 4.");

    // Step 5: Save the signed VC JWT as a private record in Alice's DWN
    console.log("Step 5: Saving the signed VC JWT as a private record in Alice's DWN...");

    const { record } = await web5.dwn.records.create({
        data: aliceJWT,  // The signed VC JWT
        message: {
            schema: 'https://vc.schemas.host/kcc.schema.json',  // Use the KCC schema from the Verifiable Credential
            dataFormat: 'application/vc+jwt',  // The format of the data (VC JWT)
            recipient: aliceDid,  // Alice's DID as the recipient
            accessControl: {  // Access control to make it a private record
                allow: [
                    {
                        action: 'read',  // Allow Alice to read the record
                        who: 'did:' + aliceDid  // Alice's DID
                    }
                ]
            }
        }
    });

    // Send the private record to Alice's DWN
    await record.send(aliceDid);
    console.log('Private record sent to Alice\'s DWN successfully!');
    console.log("Successfully done with Step 5.");

} catch (error) {
    console.error("Error during execution:", error);
}
