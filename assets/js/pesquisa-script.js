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
    $("#search-input").val(urlParams.get("query"));
}

async function getProductsByQuery(query, page_items=100) {
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
    productsData = products.map((product) => {
            return {
                id: product.id,
                name: product.title,
                img: product.image,
                price: product.price,
                rating: product.rating.rate,
                ratingCount: product.rating.count,
                description: product.description,
                category: product.category,
                displayCategories: product.displayCategories,
                brand: product.brandName,
                season: product.season,
                usage: product.usage,
                gender: product.gender,
                articleNumber: product.articleNumber,
                baseColour: product.baseColour,
                year: product.year,
                articleType: product.articleType
            };
        });
    console.log(productsData);

    if (productsData.length != 0) {
        $(".loading-div").remove();
    } else {
        $(".loading-div .loading-wrapper").remove();
    }

    const urlParams = new URLSearchParams(window.location.search);
    $("#results").text(" " + productsData.length +" results for: " + urlParams.get("query"));

    var $row = $("<div>").addClass("row");
    $row.append(
        productsData.map((pi, index) => {
            $col = $("<div>").addClass("col-12 col-md-6 col-lg-4 mb-3");
            $cardWrapper = $("<div>").addClass("home-card-wrapper h-100");
            
            $cardImgWrapper = $("<div>").addClass("home-card-img-wrapper");
            $cardInfoWrapper = $("<div>").addClass("home-card-info p-3");

            $cardFavChkWrapper = $("<div>").addClass("home-card-fav-chk-wrapper position-relative");
            $cardFavChk = $("<div>").addClass("home-card-fav-chk toggle position-absolute translate-center top-0 end-0 mt-2 me-2");
            $cardFavChkInput = $("<input>").attr("id", pi.id + "heart-check").addClass("fav-chk").attr("type", "checkbox");
            $cardFavChkLabel = $("<label>").attr("id", pi.id + "heart").addClass("fav-chk-label bi-heart-fill").attr("for", pi.id + "heart-check");

            $cardImg = $("<img>").addClass("home-card-img").attr("src", pi.img);

            $cardTitle = $("<h5>").addClass("home-card-title").text(pi.name);
            $cardPrice = $("<div>").addClass("home-card-price fs-5").text("$" + pi.price);
            $cardRatingContainer = $("<div>").addClass("home-card-rating-container mt-2");
            $cardStarsContainer = $("<div>").addClass("home-card-rating-stars-container d-inline").append(ratingToStars(pi.rating));
            $cardRating = $("<span>").addClass("home-card-rating ").text(` ${pi.rating} (${pi.ratingCount})`);


            $cardFavChk.append([$cardFavChkInput, $cardFavChkLabel]);
            $cardFavChkWrapper.append([$cardFavChk, $cardImg]);
            $cardImgWrapper.append($cardFavChkWrapper);

            $cardRatingContainer.append([$cardStarsContainer, $cardRating]);
            $cardInfoWrapper.append([$cardTitle, $cardPrice, $cardRatingContainer]);

            $cardWrapper.append([$cardImgWrapper, $cardInfoWrapper]);

            $cardWrapper.click(() => {
                window.location.href = "detalhes.html" + "?id=" + pi.id;
            });

            $col.append($cardWrapper);
            return $col;
        })
    );
    $("#products-container").append($row);
}

function ratingToStars(rating) {
    const fullstars = Math.floor(rating);
    const halfstars = Math.ceil(rating) - fullstars;
    const emptystars = 5 - (halfstars + fullstars);
    
    let stars = [];

    for (let i = 0; i < fullstars; i++)
        stars.push($("<span>").addClass("star bi-star-fill"));

    for (let i = 0; i < halfstars; i++)
        stars.push($("<span>").addClass("star bi-star-half"));

    for (let i = 0; i < emptystars; i++)
        stars.push($("<span>").addClass("star bi-star"));

    return stars;
}
