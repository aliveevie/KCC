import { DidDht } from '@web5/dids';
import { VerifiableCredential } from '@web5/credentials';
import { known_customer_credential } from "./kcc.js";

// Step 1: Create a proper DID for the employer using DidDht or similar
const didDhtEmployer = await DidDht.create({ publish: true });

// Step 2: Define the employer DID with the necessary methods
const employer = didDhtEmployer; // This will have the required getSigner() method

// Step 3: Create the Verifiable Credential or use an existing one (known_customer_credential)
const vc = new VerifiableCredential({
  id: 'urn:uuid:1234', // Example credential ID
  issuanceDate: new Date().toISOString(), // Issuance date
  issuer: employer.uri, // The DID of the issuer (employer)
  credentialSubject: {
    id: 'did:example:subject123',
    name: 'John Doe',
    role: 'Software Engineer'
  },
});

// Step 4: Sign the VC using the employer DID
const vc_jwt_employment = await vc.sign({ did: employer });

// Step 5: Log the signed VC JWT for employment
console.log(vc_jwt_employment);
