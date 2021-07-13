var index = 0;
var hell;

$.getJSON('book.json', (hell) => {
    console.log(hell);
    var html = "";
    hell.forEach((obj) => {
        var author = obj.author;

        var title = obj.title

        html += `
        <div class="text-center  mx-lg-2 col-lg-2 col-4 mb-4">
            <img height="120px" width="90px" src="${obj.image}"
                class="hoverable" style="border-radius: 10px;" alt=""> <br>
            <p class=" text-muted small" style="font-size: 12px; height: 14px; overflow-y:hidden; ">
            &mdash;	${author}</p>
            <p class="mb-0 pb-0" style="height: 50px; overflow:hidden;">${title}</p>
            <del class="mt-0 pt-0 text-muted " style="font-size: 14px;">&#8377; ${obj.originalPrice}</del>
            <h6 style="font-weight: bold;" class="mb-0"> &#8377; ${obj.price}</h6>
            <button class="btn btn-sm btn-purple text-center px-2" style=" border-radius: 3px;">
                
                    <span style="font-size: 9px ;word-wrap:break-word; white-space: nowrap !important;"><i class="mr-2 fa fa-cart-plus" aria-hidden="true"></i>Add to cart </span>
            </button>
            <div class="offset-3 col-6 justify-content-center border-bottom border-secondary " style="border-bottom-width:thin;"></div>
        </div>
        `;
    })
    $("#main_body_content").html(html)
})
$.getJSON('a.json', (data) => {
    console.log(data);
    var html = '';
    var cssHtml = "";

    data.data.forEach((obj) => {
        cssHtml += `
            .cat_color_${index}{
                border-color:${obj.color} !important;
                color:${obj.color} !important;
                
            }
            .cat_color_active_${index}{
                color:white !important;
                background-color:${obj.color} !important;
            }
        `;
        html += `<div class="item">
            <a name="" id="category_nav_${index}" onclick="category_active(${index})" class=" btn btn-outline-light btn-md rounded-pill cat_color_${index}" style="word-wrap:break-word; white-space: nowrap !important;"  href="#" role="button">${obj.title}</a>
        </div>`
        index += 1
    })
    $("#style_category_color").html(cssHtml)
    $("#category_data").html(html)
    $("#category_nav_0").removeClass(" btn-outline-light cat_color_0");
    $("#category_nav_0").addClass("btn-light cat_color_active_0");
})

function category_active(id) {
    for (let x = 0; x < index; x++) {
        $('#category_nav_' + x).removeClass(" btn-light cat_color_active_" + x);
        $('#category_nav_' + x).addClass(" btn-outline-light cat_color_" + x);
    }
    $("#category_nav_" + id).removeClass(" btn-outline-light cat_color_" + id);
    $("#category_nav_" + id).addClass("btn-light cat_color_active_" + id)
}