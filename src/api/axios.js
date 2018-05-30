import axios from 'axios';

function setRequestTime(){
  let newTimestamp = new Date().getTime();
  let requestTime = parseInt(newTimestamp/1000);
  return requestTime;
}

function setFormRequestParams(apiParams,params){
  let requestObj = Object.assign(apiParams,params);
   //console.log('requestObj',requestObj); 
   //console.log('params',JSON.stringify(params)); 
  let requestParams = '';
  for(let item in requestObj){
      if(requestObj[item] == null){
          delete requestObj[item];
      } 
  }
 
  
  for(let item in requestObj){
    requestParams += `${item}=${requestObj[item]}&`;
  }
  requestParams = requestParams.substring(0,requestParams.length-1);
  return requestParams;
}

//let base = 'list/wallet/web/api';
//let base = 'http://192.168.2.109:3307/wallet/web/api';
//let base = 'http://118.190.132.240:3307/wallet/web/api';
let base = '/wallet/web/api';


let apiParams = {
  api_type:'WalletApi',
  api_version:1,
  api_requesttime:setRequestTime(),
  api_sign:'test'
};





export const requestApi = params => { 
  let requestParams = setFormRequestParams(apiParams,params);
  return axios.post(`${base}?${requestParams}`)
  .then(res => res.data); 
};
