let productData;

jQuery(initialise);

function initialise() {
    $("#search-form").on("submit", (e) => {
        e.preventDefault();
        searchByQuery();
    });

    const urlParams = new URLSearchParams(window.location.search);
    getProductByID(urlParams.get("id"));
}

async function getProductByID(id) {
    await fetch(`https://fakestoreapi.com/products/${id}`)
        .then(response => response.json())
        .then(data => createProductDetailsPage(data));
}

function searchByQuery() {
    const query = $("#search-input").val();
    console.log(query);
    if (query.length != 0) {
        window.location.href = "pesquisa.html" + "?query=" + query.toLowerCase();
    }
}

function createProductDetailsPage(product) {
    console.log(product);
    if (product == null) {
        console.log("ID not valid");
        $("title").text("ID not valid");
        $("body").html("404");
    }

    productData = {
        id: product.id,
        name: product.title,
        img: product.image,
        price: product.price,
        rating: product.rating.rate,
        ratingCount: product.rating.count,
        description: product.description,
        category: product.category,
    }

    $("title").text(productData.name);

    $("#top-product-category").text(productData.category);
    $("#top-product-category").click(() => {
        const urlParams = new URLSearchParams();
        urlParams.set("category", productData.category);
        window.location.href = "index.html?category=" + urlParams.get("category");
    });
    $("#product-img").attr("src", productData.img);
    $("#product-id").text("ID:" + productData.id);
    $("#product-name").text(productData.name);
    $("#product-price").text("$" + productData.price);
    $("#product-rating-stars-container").append(ratingToStars(productData.rating));
    $("#product-rating").text(`${productData.rating} (${productData.ratingCount})`);
    $("#product-main-brand").text(productData.brand);
    $("#description-holder").html(productData.description);

    $("#product-category").text(productData.category);
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
