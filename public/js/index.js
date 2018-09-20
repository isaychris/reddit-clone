$("document").ready(function () {

    $(".thumbnail").on('error', function () {
        $(this).attr('src', '../images/image.png');
    });

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
        alert("attempting to save")
        let query = $(this).parent().parent().parent().parent()
        let ref = query.data('ref')
        let that = $(this)
        console.log($(this).text());
        console.log(ref);

        if ($(this).text() == "save") {
            alert('calling ajax')
            $.ajax({
                type: "put",
                url: `/save/post/${ref}`,
                success: function (result) {
                    that.text('unsave');
                }
            });
        } else {
            $.ajax({
                type: "put",
                url: `/unsave/post/${ref}`,
                success: function (result) {
                    that.text('save');
                }
            });
        }
        return false;

    })
});