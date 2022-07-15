function elog(message) {
    // Creating a XHR object
    let xhr = new XMLHttpRequest();

    // listen for `load` event
    xhr.onload = () => {
        console.log(`Data Loaded: ${xhr.status} ${xhr.response}`);
    };

    // listen for `error` event
    xhr.onerror = () => {
        console.error('Request failed.');
    }

    let url = "http://localhost:3000/log";
    // open a connection
    // Set the request header i.e. which type of content you are sending
    xhr.open("POST", url);
    xhr.setRequestHeader('Content-type', 'application/json');

    //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8;application/json');

    // Converting JSON data to string
    let data = JSON.stringify({ "message": message});

    // Sending data with the request
    xhr.send(data);
}
