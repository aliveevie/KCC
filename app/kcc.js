import { VerifiableCredential } from "@web5/credentials";


const known_customer_credential = await VerifiableCredential.create({
    issuer: 'did:dht:64gtb9k9g1m31wcszrr6yc4fadyttmtmyk7bapabm8fq8jts71py', // Issuer's DID URI
    subject: 'did:dht:rr1w5z9hdjtt76e6zmqmyyxc5cfnwjype6prz45m6z1qsbm8yjao', // Customer's DID URI 
    expirationDate: '2026-05-19T08:02:04Z',
    data: {
      countryOfResidence: "US", // 2 letter country code
      tier: "Gold", // optional KYC tier
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
        "kind": "document_verification",
        "checks": ["passport", "utility_bill"]
      },
      {
        "kind": "sanction_screening",
        "checks": ["PEP"]
      }
    ]
  });

  console.log(known_customer_credential);

  const vc_jwt_employment = await known_customer_credential.sign({ did: 'did:dht:64gtb9k9g1m31wcszrr6yc4fadyttmtmyk7bapabm8fq8jts71py' });

  console.log(vc_jwt_employment);