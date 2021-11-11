/**
 * Get the unique order id from URL
 * Or alert error message
 * @function
 */
function getOrderId() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has("id")) {
        let id = urlParams.get("id")
        window.addEventListener("load", function () {
                const orderId = document.getElementById("orderId");
                orderId.innerHTML += `<br>` + id;
        });
    } else {
        alert("Something went wrong");
    }  
}
getOrderId();