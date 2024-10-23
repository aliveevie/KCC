const issuerDidUri = 'did:dht:9dd3km7f736jjgqgkffaq4m8x8t4i9n8ju7nfnp6f3ebnicbjtko';

const response = await fetch(`https://vc-to-dwn.tbddev.org/authorize?issuerDid=${issuerDidUri}`);

// Wait for the response JSON to resolve
const data = await response.json();

// Log the data
console.log(data);
