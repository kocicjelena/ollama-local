import axios from "axios";

export const createPromptNoStream = async (data:any) => {
 //console.log(data, 'data ');
 const {model, prompt} = data;
 //console.log('sending to api/generae data',data.data);
  const postUrl = "/api/generate";
  const postData = {
    model,
    prompt
  };
  try {
    const response = await axios.post(
      postUrl,
      data.data,
       {
        headers: {
            'Content-Type': 'application/json',
      //    Authorization: `Bearer ${token}`,
        },
      },  
    ).then(response => { 
      //console.log(response,'create prompt response', response);
      return response.data;
    })
    .catch(error => {
        //console.log(error.response, error.config,'err create');
    });
    if(response)
    return response;
  } catch (error: Error | any) {
    //console.log(error,'er');
    return null;
  }
};