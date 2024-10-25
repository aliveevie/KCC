export async function delayedVerifyJWT(web5, did, aliceJWT) {
    // Wait for at least 40 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 40000));

    // Execute the query
    const verifyResponse = await web5.dwn.records.query({
        from: did,  // `did` is the DID you're querying from
        message: {
            filter: {
                schema: 'https://vc.schemas.host/kcc.schema.json',  // Schema used for storing the record
                dataFormat: 'application/vc+jwt',  // Data format of the record
            },
        },
    });

    // Log the entire response to see if any records are returned
    console.log("Query Response:", verifyResponse);

    if (verifyResponse?.records && verifyResponse.records.length > 0) {
        // Access the records from the response
        const records = verifyResponse.records;
        let aliceStoredJwt = null;

        // Debugging log to check the initial value of aliceJWT
        console.log("Original Alice JWT for Comparison:", aliceJWT);

        for (const record of records) {
            // Await the record's data text to compare it with aliceJWT
            const recordData = await record.data.text();

            // Debug logs to check each record's data and compare it with aliceJWT
            console.log("Retrieved Record Data for Comparison:", recordData);

            if ('eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6b3NzZGo0ZHdkYXhreW9jeWJxeHp0NzQ3NmJiOXF1YW53MTV6cmtoemppZDRpY2NzOHdxeSMwIn0.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vdzNpZC5vcmcvdmMvc3RhdHVzLWxpc3QvMjAyMS92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImlkIjoidXJuOnV1aWQ6ZDEzNmE4OTYtYTI4Ny00MjQ4LWEyMWUtNWM4YmM2NzJjMGE2IiwiaXNzdWVyIjoiZGlkOmRodDpvc3NkajRkd2RheGt5b2N5YnF4enQ3NDc2YmI5cXVhbncxNXpya2h6amlkNGljY3M4d3F5IiwiaXNzdWFuY2VEYXRlIjoiMjAyNC0xMC0yNVQxNDoxMToyMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDpkaHQ6cnIxdzV6OWhkanR0NzZlNnptcW15eXhjNWNmbndqeXBlNnByejQ1bTZ6MXFzYm04eWphbyIsImNvdW50cnlPZlJlc2lkZW5jZSI6Ik5HIiwidGllciI6IkJlc3QiLCJqdXJpc2RpY3Rpb24iOnsiY291bnRyeSI6IlVTIn19LCJleHBpcmF0aW9uRGF0ZSI6IjIwMjgtMDUtMTlUMDg6MDI6MDRaIiwiY3JlZGVudGlhbFNjaGVtYSI6W3siaWQiOiJodHRwczovL3ZjLnNjaGVtYXMuaG9zdC9rY2Muc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYSJ9XSwiZXZpZGVuY2UiOlt7ImtpbmQiOiJEZXZwb3N0X1BhcnRpY2lwYXRpb24iLCJjaGVja3MiOlsicGFzc3BvcnQiLCJ1dGlsaXR5X2JpbGwiXX0seyJraW5kIjoic2FuY3Rpb25fc2NyZWVuaW5nIiwiY2hlY2tzIjpbIlBFUCJdfV19LCJuYmYiOjE3Mjk4NjU0ODAsImp0aSI6InVybjp1dWlkOmQxMzZhODk2LWEyODctNDI0OC1hMjFlLTVjOGJjNjcyYzBhNiIsImlzcyI6ImRpZDpkaHQ6b3NzZGo0ZHdkYXhreW9jeWJxeHp0NzQ3NmJiOXF1YW53MTV6cmtoemppZDRpY2NzOHdxeSIsInN1YiI6ImRpZDpkaHQ6cnIxdzV6OWhkanR0NzZlNnptcW15eXhjNWNmbndqeXBlNnByejQ1bTZ6MXFzYm04eWphbyIsImlhdCI6MTcyOTg2NTQ4MCwiZXhwIjoxODQyMzM2MTI0fQ.aE4OaWlboI_gZBKkYsQAkrk5WRBgOn2490OEzsXFvbmbqeVI98Vn4SHBx71kECDXYtSlojD02IAdqr0MXqpdBA' === recordData) {
                console.log("Match Found!");
                aliceStoredJwt = recordData;
                break; // Optional: Exit loop after finding the match
            }
        }

        // Check if a matching JWT was found and log the result
        if (aliceStoredJwt) {
            console.log("Final Match Found! Retrieved Signed VC JWT:", aliceStoredJwt);
            console.log("Comparison Result:", aliceJWT === aliceStoredJwt);
        } else {
            console.log("No matching record found for the provided JWT.");
            console.log("Original Alice JWT (for debugging):", aliceJWT);
        }
    } else {
        console.log("No records found matching the query criteria.");
    }
}
