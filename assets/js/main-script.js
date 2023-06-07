let productsData = [];

$(document).ready(initialise);

function initialise() {
    getAllProducts();
}

async function getAllProducts(page=1, page_items=20) {
    await fetch(`https://diwserver.vps.webdock.cloud/products?page=${page}&page_items=${page_items}`)
        .then( response => response.json() )
        .then( data => createProductsList(data.products) );
}

// async function getProductByID(id) {
//     await fetch("https://diwserver.vps.webdock.cloud/products/" + id)
//         .then( response => response.json() )
//         .then( data => TODO);
// }

// async function getCategories() {
//     await fetch("https://diwserver.vps.webdock.cloud/products/categories")
//         .then( response => response.json() )
//         .then( data => TODO);
// }

// async function getProductsInCategory(category) {
//     await fetch("https://diwserver.vps.webdock.cloud/products/category/" + category)
//         .then( response => response.json() )
//         .then( data => TODO);
// }

// async function getProductsByQuery(query) {
//     await fetch("https://diwserver.vps.webdock.cloud/products/search?query=" + query)
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

    var $row = $("<div>").addClass("row");
    $row.append(
        productsData.map((pi, index) => {
            $cardWrapper = $("<div>").addClass("col-4 col-sm-3 col-lg-2");

            $card = $("<div>").addClass("card");
            $cardImg = $("<img>").addClass("card-img-top").attr("src", pi.image);
            $cardBody = $("<div>").addClass("card-body");
            $cardTitle = $("<h5>").addClass("card-title").text(pi.title);
            $cardText = $("<p>").addClass("card-text").html(pi.price);

            $cardBody.append([$cardTitle, $cardText]);
            $card.append([$cardImg, $cardBody]);
            $cardWrapper.append($card);

            $cardWrapper.click(() => {
                window.location.href = "detalhes.html" + "?id=" + pi.id;
            });
            return $cardWrapper;
        })
    )
    $("#products-container").append($row);
}
