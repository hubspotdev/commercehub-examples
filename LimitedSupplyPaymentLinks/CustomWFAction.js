const hubspot = require('@hubspot/api-client');
const axios = require('axios');

exports.main = async (event, callback) => {
    const hubspotClient = new hubspot.Client({
        accessToken: process.env.Token
    });

    const objectId = 13186533908; // Provided object ID
    const objectType = "2-29650916"; // Provided object type

    try {
        // Get the current value of the spots_left property
        const currentProperties = await hubspotClient.crm.objects.basicApi.getById(objectType, objectId, ['spots_left']);
        const spotsLeft = currentProperties.properties.spots_left;

        // Decrease the spots_left value by 1
        const newSpotsLeft = Math.max(0, spotsLeft - 1); // Ensure it doesn't go below 0

        // Prepare the data for the PATCH request
        const data = {
            properties: {
                spots_left: newSpotsLeft
            }
        };

        // Make the PATCH request to update the spots_left property
        await axios({
            method: 'patch',
            url: `https://api.hubapi.com/crm/v3/objects/${objectType}/${objectId}`,
            headers: { 'Authorization': `Bearer ${process.env.Token}`, 'Content-Type': 'application/json' },
            data: JSON.stringify(data)
        }).then((response) => {
            console.log(`Successfully updated spots_left to ${newSpotsLeft}`);
        }).catch((error) => {
            console.log(error.response.data);
            throw new Error(error.response.data.message);
        });

        callback({
            outputFields: {
                newSpotsLeft: newSpotsLeft
            }
        }); // end callback

    } catch (e) {
        e.message === 'HTTP request failed' ?
            console.error(JSON.stringify(e.response, null, 2)) :
            console.error(e)
    }
};
