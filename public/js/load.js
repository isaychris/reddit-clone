$("document").ready(function () {

    if ($("#auth").text() == "true") {
        $.ajax({
            type: "get",
            url: `/check/states/posts/`,
            success: function (data) {
                $(".post").each(function (index) {

                    for (let ele of data) {
                        if (ele.ref == $(this).data("ref")) {
                            if (ele.vote == "up") {
                                $(this).find(".upvote-post").addClass("up-enabled")
                            } else if (ele.vote == "down") {
                                $(this).find(".downvote-post").addClass("down-enabled")
                            }

                            if (ele.saved == true) {
                                $(this).find(".save-post").text("unsave")
                            }
                        }
                    }
                });
            }
        }).then(function () {
            $.ajax({
                type: "get",
                url: `/check/states/comments/`,
                success: function (data) {
                    $(".comment").each(function (index) {

                        for (let ele of data) {
                            if (ele.ref == $(this).data("ref")) {
                                if (ele.vote == "up") {
                                    $(this).find(".upvote-comment").addClass("up-enabled")
                                } else if (ele.vote == "down") {
                                    $(this).find(".downvote-comment").addClass("down-enabled")
                                }

                                if (ele.saved == true) {
                                    $(this).find(".save-comment").text("unsave")
                                }
                            }
                        }
                    });
                }
            })
        })
    }
})