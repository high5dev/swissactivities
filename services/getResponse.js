import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "X-Auth-Token": `api-key ${process.env.GET_RESPONSE_API_KEY}`,
    "content-type": "application/json",
    "Accept": "application/json",
  },
});

export async function createContact(data) {
    return  axiosInstance.post('https://api.getresponse.com/v3/contacts', {
        name: data.name,
        email: data.email,
        campaign: {
          campaignId: 'jzagN',
        },
        ipAddress: data.ip,
        customFieldValues: [
          {
            customFieldId: "pohO7L",
            value: [data.locale]
          }
        ]
      }).catch(e => {
        console.log("getresponse error, err= ", e)
      });
}