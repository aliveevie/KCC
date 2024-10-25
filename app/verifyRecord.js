import fs from 'fs';
import path from 'path';

export async function delayedVerifyJWT(web5, did, aliceJWT) {
    // Wait for at least 40 seconds before proceeding
    await new Promise(resolve => setTimeout(resolve, 40000));

    // Execute the query
    const verifyResponse = await web5.dwn.records.query({
        from: did,
        message: {
            filter: {
                schema: 'https://vc.schemas.host/kcc.schema.json',
                dataFormat: 'application/vc+jwt',
            },
        },
    });

    // Log the entire response to see if any records are returned
    console.log("Query Response:", verifyResponse);

    if (verifyResponse?.records && verifyResponse.records.length > 0) {
        const savedJWT = 'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6b3NzZGo0ZHdkYXhreW9jeWJxeHp0NzQ3NmJiOXF1YW53MTV6cmtoemppZDRpY2NzOHdxeSMwIn0.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vdzNpZC5vcmcvdmMvc3RhdHVzLWxpc3QvMjAyMS92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImlkIjoidXJuOnV1aWQ6ZDEzNmE4OTYtYTI4Ny00MjQ4LWEyMWUtNWM4YmM2NzJjMGE2IiwiaXNzdWVyIjoiZGlkOmRodDpvc3NkajRkd2RheGt5b2N5YnF4enQ3NDc2YmI5cXVhbncxNXpya2h6amlkNGljY3M4d3F5IiwiaXNzdWFuY2VEYXRlIjoiMjAyNC0xMC0yNVQxNDoxMToyMFoiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDpkaHQ6cnIxdzV6OWhkanR0NzZlNnptcW15eXhjNWNmbndqeXBlNnByejQ1bTZ6MXFzYm04eWphbyIsImNvdW50cnlPZlJlc2lkZW5jZSI6Ik5HIiwidGllciI6IkJlc3QiLCJqdXJpc2RpY3Rpb24iOnsiY291bnRyeSI6IlVTIn19LCJleHBpcmF0aW9uRGF0ZSI6IjIwMjgtMDUtMTlUMDg6MDI6MDRaIiwiY3JlZGVudGlhbFNjaGVtYSI6W3siaWQiOiJodHRwczovL3ZjLnNjaGVtYXMuaG9zdC9rY2Muc2NoZW1hLmpzb24iLCJ0eXBlIjoiSnNvblNjaGVtYSJ9XSwiZXZpZGVuY2UiOlt7ImtpbmQiOiJEZXZwb3N0X1BhcnRpY2lwYXRpb24iLCJjaGVja3MiOlsicGFzc3BvcnQiLCJ1dGlsaXR5X2JpbGwiXX0seyJraW5kIjoic2FuY3Rpb25fc2NyZWVuaW5nIiwiY2hlY2tzIjpbIlBFUCJdfV19LCJuYmYiOjE3Mjk4NjU0ODAsImp0aSI6InVybjp1dWlkOmQxMzZhODk2LWEyODctNDI0OC1hMjFlLTVjOGJjNjcyYzBhNiIsImlzcyI6ImRpZDpkaHQ6b3NzZGo0ZHdkYXhreW9jeWJxeHp0NzQ3NmJiOXF1YW53MTV6cmtoemppZDRpY2NzOHdxeSIsInN1YiI6ImRpZDpkaHQ6cnIxdzV6OWhkanR0NzZlNnptcW15eXhjNWNmbndqeXBlNnByejQ1bTZ6MXFzYm04eWphbyIsImlhdCI6MTcyOTg2NTQ4MCwiZXhwIjoxODQyMzM2MTI0fQ.aE4OaWlboI_gZBKkYsQAkrk5WRBgOn2490OEzsXFvbmbqeVI98Vn4SHBx71kECDXYtSlojD02IAdqr0MXqpdBA';
        const records = verifyResponse.records;
        let aliceStoredJwt = null;

        console.log("Original Alice JWT for Comparison:", aliceJWT);

        for (const record of records) {
            const recordData = await record.data.text();

            if (savedJWT === recordData) {
                console.log("Match Found!");
                aliceStoredJwt = recordData;

                // Get the recordId
                const _recordId = record.id;

                // Define the path to save the _recordId
                const projectFolderPath = path.join(__dirname, 'project_folder');
                const recordIdFilePath = path.join(projectFolderPath, 'recordId.txt');

                // Ensure the project folder exists
                if (!fs.existsSync(projectFolderPath)) {
                    fs.mkdirSync(projectFolderPath);
                }

                // Save the _recordId to a file
                fs.writeFileSync(recordIdFilePath, _recordId, 'utf8');
                console.log(`Record ID saved to ${recordIdFilePath}`);

                break;
            }
        }

        if (aliceStoredJwt) {
            console.log("Final Match Found! Retrieved Signed VC JWT:", aliceStoredJwt);
        } else {
            console.log("No matching record found for the provided JWT.");
            console.log("Original Alice JWT (for debugging):", aliceJWT);
        }
    } else {
        console.log("No records found matching the query criteria.");
    }
}
