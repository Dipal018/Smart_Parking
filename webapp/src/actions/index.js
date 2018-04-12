import axios from 'axios';
const data = [1,2,3,4,5];

export function getData(){
    return (dispatch) => {
        //Make API Call
        //For this example, I will be using the sample data in the json file
        //delay the retrieval [Sample reasons only]
        axios.get(`https://afternoon-peak-89776.herokuapp.com/api/records`)
            .then(res => {
                console.log(res);
                dispatch({type: 'DATA_AVAILABLE', data:res});
            })
        // setTimeout(() => {
            
        // }, 1000);
 
    };
}