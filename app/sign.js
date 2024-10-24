import { Web5 } from "@web5/api";

const { web5, did: myDid } = await Web5.connect();


const { record } = await web5.dwn.records.create({
    data: 'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpkaHQ6bmJ4b3FxaDV4M2luNXE2czl3bXdmbXo0dDQ4ejRlMTVpaHp0YnppN2o5eTF5cjd6c2o4eSMwIn0.eyJ2YyI6eyJpZCI6InVybjp1dWlkOjEyMzQiLCJpc3N1YW5jZURhdGUiOiIyMDI0LTEwLTIzVDIyOjQzOjE1Ljk4NVoiLCJpc3N1ZXIiOiJkaWQ6ZGh0Om5ieG9xcWg1eDNpbjVxNnM5d213Zm16NHQ0OHo0ZTE1aWh6dGJ6aTdqOXkxeXI3enNqOHkiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRpZDpleGFtcGxlOnN1YmplY3QxMjMiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoiU29mdHdhcmUgRW5naW5lZXIifX0sIm5iZiI6MTcyOTcyMzM5NSwianRpIjoidXJuOnV1aWQ6MTIzNCIsImlzcyI6ImRpZDpkaHQ6bmJ4b3FxaDV4M2luNXE2czl3bXdmbXo0dDQ4ejRlMTVpaHp0YnppN2o5eTF5cjd6c2o4eSIsInN1YiI6ImRpZDpleGFtcGxlOnN1YmplY3QxMjMiLCJpYXQiOjE3Mjk3MjMzOTV9.piGWoax6Gismjh4ri9y9rkzHjcDMz7pKE7T5MA7qxxJxD-8lGSHd_YIo-cuZFjAUXwcP465QdwWXeI2VQbtrDw',
    message: {
      schema: 'EmploymentCredential',
      dataFormat: 'application/vc+jwt',
    },
  });
  
  // (optional) immediately send record to users remote DWNs
  const { status } = await record.send('did:dht:9dd3km7f736jjgqgkffaq4m8x8t4i9n8ju7nfnp6f3ebnicbjtko');