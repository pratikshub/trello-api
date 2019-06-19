let key = 'b15cd266cff4107fb914ae08ff3fa96b';
let token = 'd9c2b0cd9abcd9150dbcac22dfad5c8ab15e06667ec6298c274065d46ff4e40e';
let listid = '5d09bd3783ab92349ebbbe77';

function fetchUrl(url){
    return fetch(url).then(element => element.json() )
}
async function fetchListCard(listid,key,token){
    let data=await fetchUrl(`https://api.trello.com/1/lists/${listid}/cards?${key}&token=${token}`);
    console.log(data)
   
}
fetchListCard(listid,key,token);