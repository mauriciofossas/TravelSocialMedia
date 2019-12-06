import $ from "jquery";
const rootUrl = process.env.NODE_ENV === 'development' ?
                'http://localhost:8080/' :
                'http://ec2-3-19-142-173.us-east-2.compute.amazonaws.com:8080/';

const get = async (url) => {
  const res = await fetch(rootUrl + url, {
    method: 'GET',
  });
  return res.json();
}

const post = async (url, data) => {
  const res =  await $.ajax(rootUrl + url, {
    method: 'POST',
    xhrFields: {
      withCredentials: true
    },
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data)
  });
  return res;
}

export {get, post};
export default {get, post};
