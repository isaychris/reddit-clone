$("document").ready(function () {
    $("time").each(function (index) {
        $(this).text(moment($(this).attr('title')).fromNow())
    });

    $(".auth-req").click(function (e) {
        if ($("#auth").text() == "false") {
            alert("You must be logged in to do that.")
            e.stopImmediatePropagation();
            return false;
        }
    });
});