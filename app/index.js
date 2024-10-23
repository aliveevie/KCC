import { Web5 } from "@web5/api";


const {did, web5} = await Web5.connect({
  didCreateOptions: {
    // Use community DWN instance hosted on Google Cloud
    dwnEndpoints: ['https://dwn.gcda.xyz']
  },
  registration: {
    onSuccess: () => {
      /*
      Registration succeeded, set a local storage value to indicate the user 
      is registered and registration does not need to occur again
      */
     console.log("Registraction Succeed!")
    },
    onFailure: (error) => {
      /* 
      Registration failed, display an error message to the user, and pass in 
      the registration object again to retry next time the user connects
      */
    },
  },
})

export function issuerDid(){
  return did;
}