function supportsSessionStorage() {
    try {
        return 'sessionStorage' in window && window['sessionStorage'] !== null;
    } catch (e) {
        return false;
    }
}

function isExist(key, id) {
    return getListFromStorage(key).indexOf(id) > -1;

}

function isEmpty(key) {
    return getListFromStorage(key).length === 0;

}

function pushToList(key, data) {
    if (!supportsSessionStorage())
        return false;
    if (key === null || data === null)
        return false;
    var list = getListFromStorage(key);
    if (list.indexOf(data) === -1) {
        list.push(data);
        sessionStorage.setItem(key, JSON.stringify(list));
        return true;
    }
    return false;
}

function removeFromList(key, data) {
    if (!supportsSessionStorage())
        return false;
    if (key === null || data === null)
        return false;
    var list = getListFromStorage(key, data);
    var index = list.indexOf(data);
    if (index > -1) {
        list.splice(index, 1);
        sessionStorage.setItem(key, JSON.stringify(list));
        return true;
    }
    return false;
}

function getListFromStorage(key) {
    if (!supportsSessionStorage())
        return false;
    var data = JSON.parse(sessionStorage.getItem(key));
    if (data === null)
        data = [];
    return data;
}

function invalidateSession() {
    if (!supportsSessionStorage())
        return false;
    sessionStorage.clear();
    return true;
}