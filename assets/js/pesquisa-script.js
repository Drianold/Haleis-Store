let productsData = [];

$(document).ready(initialise);

function initialise() {
    $("#search-form").on("submit", (e) => {
        e.preventDefault();
        searchByQuery();
    });
    const urlParams = new URLSearchParams(window.location.search);
    getProductsByQuery(urlParams.get("query"));
    $("title").text("Search: " + urlParams.get("query"));
}

async function getProductsByQuery(query, page_items=40) {
    await fetch(`https://diwserver.vps.webdock.cloud/products/search?query=${query}&page_items=${page_items}`)
        .then( response => response.json() )
        .then( data => createProductsList(data));
}

function searchByQuery() {
    const query = $("#search-input").val();
    console.log(query);
    if (query.length != 0) {
        window.location.href = "pesquisa.html" + "?query=" + query.toLowerCase();
    }
}

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
