import known_customer_credential from "./kcc";

const vc_jwt_employment = await known_customer_credential.sign({ did: 'did:dht:64gtb9k9g1m31wcszrr6yc4fadyttmtmyk7bapabm8fq8jts71py' });

console.log(vc_jwt_employment);