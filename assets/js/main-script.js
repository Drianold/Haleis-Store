let productsData = [];

jQuery(initialise);

function initialise() {
    $("#search-form").on("submit", (e) => {
        e.preventDefault();
        searchByQuery();
    });
    getCategories();

    const urlParams = new URLSearchParams(window.location.search);
    const p = 1;

    checkPageNavigation(p);

    if (urlParams.has("category")) {
        $("title").text("Hal'eis - " + urlParams.get("category"));
        $("#category-button").text("Category: " + urlParams.get("category"));
        getProductsInCategory(urlParams.get("category"));
    } else {
        getAllProducts();
    }
}

async function getCategories() {
    await fetch("https://fakestoreapi.com/products/categories")
        .then(response => response.json())
        .then(data => createCategoriesDropdown(data));
}

async function getAllProducts() {
    await fetch(`https://fakestoreapi.com/products`)
        .then(response => response.json())
        .then(data => {
            createProductsList(data);
            checkPageNavigation(data.current_page, data.total_pages);
        });
}        

async function getProductsInCategory(category) {
    await fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then( response => response.json() )
        .then( data => {
            createProductsList(data);
            checkPageNavigation(data.current_page, data.total_pages);
        });
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
                category: product.category
            };
        });
    console.log(productsData);

    $(".loading-div").remove();

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

function createCategoriesDropdown(categories) {
    console.log(categories);

    $("#category-item-all").on("click", (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("category");
        urlParams.delete("page");
        window.location.search = urlParams;
    });

    $("#category-list").append(
        categories.map((c) => {
            $li = $("<li>").append(
                $("<a>").addClass("dropdown-item").text(c)
            );
            $li.click((e) => {
                e.preventDefault();
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.set("category", c);
                urlParams.delete("page");
                window.location.search = urlParams;
            });
            return $li;
        })
    );
}

function checkPageNavigation(current_page) {
    const urlParams = new URLSearchParams(window.location.search);
    
    $("#nav-page-actual").off("click");
    $("#nav-page-actual a").text(current_page);
    $("#nav-page-start").addClass("disabled").off("click");
    $("#nav-page-previous").addClass("disabled").off("click");
    $("#nav-page-next").addClass("disabled").off("click");
    $("#nav-page-end").addClass("disabled").off("click");
}
