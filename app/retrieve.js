export async function retrieveRecordDetails(web5, yourDid, recordId) {
    try {
        // Query the DWN for the specific recordId
        const response = await web5.dwn.records.query({
            from: yourDid, // Authorized DID
            message: {
                filter: { recordId: recordId },
            },
        });

        // Check if the response contains records
        if (response.records && response.records.length > 0) {
            const record = response.records[0]; // Access the first matching record

            // Extract and display the relevant information
            const storedDid = record._connectedDid || 'DID not found';
            const author = record._author || 'Author not found';
            const authorization = record._authorization || 'Authorization details not found';
            const encodedDataBlob = record._encodedData;

            // Decode authorization payload if available
            let authorizationPayload = null;
            if (authorization && authorization.signature && authorization.signature.payload) {
                const decodedPayload = Buffer.from(authorization.signature.payload, 'base64').toString('utf-8');
                authorizationPayload = JSON.parse(decodedPayload);
                console.log(authorizationPayload)
            }

            // Check if the record's data is private by examining encryption or access properties
            const isPrivate = !!record._encryption || (authorizationPayload?.permissions?.includes("private"));

            // Convert encoded data (JWT) to text if it's not encrypted
            let decodedData = null;
            if (!isPrivate && encodedDataBlob) {
                decodedData = await encodedDataBlob.text(); // Decode JWT if not private
            } else {
                console.log("Data is private or encrypted.");
            }

            // Log the retrieved details
            console.log("Retrieved Record Details:");
            console.log("Connected DID:", storedDid);
            console.log("Author:", author);
            console.log("Authorization:", authorizationPayload);
            console.log("Record ID:", recordId);
            console.log("Is Private:", isPrivate);
            if (decodedData) console.log("Decoded JWT Data:", decodedData);
            else console.log("JWT Data is private or encrypted and cannot be displayed.");

            // Return details in an object format for further use if needed
            return {
                did: storedDid,
                author: author,
                authorization: authorizationPayload,
                isPrivate: isPrivate,
                jwtData: decodedData,
            };
        } else {
            console.log("Record not found or unauthorized access.");
            return null; // Return null if no records were found
        }
    } catch (error) {
        console.error("Error retrieving detailed record information:", error);
        return null;
    }
}
