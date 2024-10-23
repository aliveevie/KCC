import did from './issuerDid.js';

// const issuerDidUri = 'did:dht:taqpsopukzrqq48rweaonqqp6ehf4mjpdb1k9bzkucqsboz4m4ty'
// const response  = await fetch(`https://vc-to-dwn.tbddev.org/authorize?issuerDid=${issuerDidUri}`);

// const data = await response.json();

// console.log(data)
const { did: issuerDidUri } = did;
console.log(issuerDidUri);