$("document").ready(function () {
    var urlParams = new URLSearchParams(window.location.search)

    switch (urlParams.get('sort')) {
        case "top":
            $(".sort-top").addClass('active');
            break;
        case "new":
            $(".sort-new").addClass('active');
            break;
        case "old":
            $(".sort-old").addClass('active');
            break;
        default:
            $(".sort-top").addClass('active');
    }
})