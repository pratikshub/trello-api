let key = 'b15cd266cff4107fb914ae08ff3fa96b';
let token = 'd9c2b0cd9abcd9150dbcac22dfad5c8ab15e06667ec6298c274065d46ff4e40e';
let listid = '5d09bd3783ab92349ebbbe77';

function fetchUrl(url) {
    return fetch(url).then(element => element.json())
}
async function fetchCheckListId(listid, key, token) {
    let data = await fetchUrl(`https://api.trello.com/1/lists/${listid}/cards?${key}&token=${token}`);
    return data.reduce((acc, element) => {
        // console.log(element.id)
        acc.push(element['id']);
        return acc;
    }, []);
}
async function fetchChecklistItem() {
    let idChecklists = await fetchCheckListId(listid, key, token);
    idChecklists.forEach(async (element) => {
        url = `https://api.trello.com/1/cards/${element}/checklists?${key}'&token=${token}`;
        let checklist = await fetchUrl(url);
        // console.log(...checklist);
        checklist.forEach(ele => {
            displayItems(ele, element)
        })
    })

}
function displayItems(element, card_Id) {
    element['checkItems'].forEach(async (item) => {
        let html = `<li class="list-group-item">
    <input type="checkbox" class=${item.state} ${item.state === "complete" ? "checked" : null} data-state="${item.state}" card-id=${card_Id} checkitem-Id=${item.id}>
    <span class=${item.state} id="itemName">${item.name}</span>
    <button class="btn btn-danger" id='delete' card-id=${card_Id} checkitem-Id=${item.id}>X</button>
    </li>
    `
        $('.list-group').append(html);
    });
    $(document).on('change', 'input:checkbox', updateData);
    $(document).on('click', 'button', deleteData);
    $(document).on('')

}
fetchChecklistItem();

async function updateData(event) {
    event.preventDefault();
    let cardId = $(this).attr('card-id');
    let itemId = $(this).attr('checkitem-Id');
    let state = this.checked ? "complete" : "incomplete";
    let updateRequest = await fetch(`https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?state=${state}&key=${key}&token=${token}`, { method: 'PUT' })
        .catch(error => console.log(error));
        console.log(updateRequest)
    if (updateRequest.status === 200) {
        $(this).siblings('#itemName').attr('class', state)
    }

}
async function deleteData(event) {
    event.preventDefault();
    let cardId = $(this).attr('card-id');
    let itemId = $(this).attr('checkitem-Id');
   let deleteRequest=await  fetch(`https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?key=${key}&token=${token}`, { method: 'DELETE' })
   .catch(error => console.log(error));
    if (deleteRequest.status === 200) {
    $(this).parent().remove();}
}

