let key = 'b15cd266cff4107fb914ae08ff3fa96b';
let token = 'd9c2b0cd9abcd9150dbcac22dfad5c8ab15e06667ec6298c274065d46ff4e40e';
let listid = '5d09bd3783ab92349ebbbe77';


async function fetchUrl(url) {
    try {
        let data = await fetch(url);
        return data.json();
    }
    catch (error) {
        console.log(error)
    }
}
async function fetchCardId(listid, key, token) {
    try {
        let data = await fetchUrl(`https://api.trello.com/1/lists/${listid}/cards?${key}&token=${token}`);
        return data.reduce((acc, element) => {
            acc.push(element['id']);
            return acc;
        }, []);
    }
    catch (error) {
        console.log(error)
    }
}
async function fetchChecklistItem() {
    try {
        let idChecklists = await fetchCardId(listid, key, token);
        idChecklists.forEach(async (element) => {
            url = `https://api.trello.com/1/cards/${element}/checklists?${key}'&token=${token}`;
            let checklist = await fetchUrl(url);
            console.log(checklist)
            checklist.forEach(ele => {
                displayItems(ele)
            })
        })
    }
    catch (error) {
        console.log(error)
    }
}
function displayItems(element) {
    let card_Id = element.idCard;
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
    $(document).on('keyup', 'input:text', adddata)

}
fetchChecklistItem();

async function updateData(event) {
    event.preventDefault();
    let cardId = $(this).attr('card-id');
    let itemId = $(this).attr('checkitem-Id');
    let state = this.checked ? "complete" : "incomplete";
    try {
        let updateRequest = await fetch(`https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?state=${state}&key=${key}&token=${token}`, { method: 'PUT' });
        if (updateRequest.status === 200) {
            $(this).siblings('#itemName').attr('class', state)
        }

    }
    catch (error) {
        console.log(error)
    }
}
async function deleteData(event) {
    event.preventDefault();
    let cardId = $(this).attr('card-id');
    let itemId = $(this).attr('checkitem-Id');
    try {
        let deleteRequest = await fetch(`https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}?key=${key}&token=${token}`, { method: 'DELETE' })
        if (deleteRequest.status === 200) {
            $(this).parent().remove();
        }
    }
    catch (error) {
        console.log(error)
    }


}
function adddata() {
    event.preventDefault();
    let defaultcard = '5d09bdadaad9ed65f8d04df2';
    let card_Id = '5d09bd46c02ead88bf8eb5cb'
    $(this).keyup(async function (event) {
        if (event.keyCode === 13) {
            let check = $(this).val();
            $(this).val('')
            try {
                let addRequest = await fetch(`https://api.trello.com/1/checklists/${defaultcard}/checkItems?name=${check}&key=${key}&token=${token}`, { method: 'POST' })
                let item = await addRequest.json();
                console.log(item);
                if (addRequest.status === 200) {
                    let html = `<li class="list-group-item">
                <input type="checkbox" class=${item.state} ${item.state === "complete" ? "checked" : null} data-state="${item.state}" card-id=${card_Id} checkitem-Id=${item.id}>
                <span class=${item.state} id="itemName">${item.name}</span>
                <button class="btn btn-danger" id='delete' card-id=${card_Id} checkitem-Id=${item.id}>X</button>
                </li>
                `
                    $('.list-group').append(html);
                }
            }
            catch (error) {
                console.log(error)
            }
        }
    });
}


