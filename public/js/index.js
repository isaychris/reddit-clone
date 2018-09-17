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


    $(".save-post").click(function () {
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')
        console.log($(this).text());

        if ($(this).text() == "save") {
            $.ajax({
                type: "put",
                url: `/save/post/${ref}`,
            });
            $(this).text('unsave');

        } else {
            $.ajax({
                type: "put",
                url: `/unsave/post/${ref}`,

            });
            $(this).text('save');
        }
        return false;
    })
});