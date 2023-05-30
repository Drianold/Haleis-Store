// const productsListEL = $("#products-list");

let productsData = [];

$(document).ready(initialise);

function initialise() {
    getAllProducts();
}

async function getAllProducts(page=1) {
    await fetch("http://diwserver.vps.webdock.cloud:8765/products?page=" + page)
        .then( response => response.json() )
        .then( data => createProductsList(data.products) );
}

// async function getProductByID(id) {
//     await fetch("http://diwserver.vps.webdock.cloud:8765/products/" + id)
//         .then( response => response.json() )
//         .then( data => TODO);
// }

// async function getCategories() {
//     await fetch("http://diwserver.vps.webdock.cloud:8765/products/categories")
//         .then( response => response.json() )
//         .then( data => TODO);
// }

// async function getProductsInCategory(category) {
//     await fetch("http://diwserver.vps.webdock.cloud:8765/products/category/" + category)
//         .then( response => response.json() )
//         .then( data => TODO);
// }

// async function getProductsByQuery(query) {
//     await fetch("http://diwserver.vps.webdock.cloud:8765/products/search?query=" + query)
//         .then( response => response.json() )
//         .then( data => TODO);
// }


function createProductsList(products) {
    productsData = products.map((di) => {
            return {
                id: di.id,
                title: di.title,
                price: di.price,
                category: di.category,
                description: di.description,
                image: di.image
            };
        });
    console.log(productsData);
    
    // var $productsElList = $("<div>", {id: "foo", "class": "a"});
    // $div.click(function(){ /* ... */ });
 
    var $row = $("<div>").addClass("row");
    $row.append(
        productsData.map((pi, index) => {
            $cardWrapper = $("<div>").addClass("col-6 col-sm-4 col-lg-3");

            $card = $("<div>").addClass("card");
            $cardImg = $("<img>").addClass("card-img-top").attr("src", pi.image);
            $cardBody = $("<div>").addClass("card-body");
            $cardTitle = $("<h5>").addClass("card-title").text(pi.title);
            $cardText = $("<p>").addClass("card-text").html(pi.price);

            $cardBody.append([$cardTitle, $cardText]);
            $card.append([$cardImg, $cardBody]);
            $cardWrapper.append($card);
            return $cardWrapper;
        })
    )
    $("#products-container").append($row);

}
