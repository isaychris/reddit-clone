$("document").ready(function () {
    $("#change-password").click(function () {
        let password = prompt("Enter a new password:")

        if (password) {
            $.ajax({
                type: "put",
                url: `/settings/change/password`,
                data: {
                    password: `${password}`
                }
            }).done(function () {
                alert("Your password has been changed.")
            }).catch(function () {
                alert("Unable to change password.")
            })
        }
    })


    $("#delete-account").click(function () {
        let input = confirm("Are you sure you want to delete your account?")

        if (input) {
            $.ajax({
                type: "delete",
                url: `/settings/delete/account`
            }).done(function (res) {
                alert("Your account has been deleted.")
                location.href = "/logout"
            }).catch(function (res) {
                alert("Unable to delete account.")
            })
        }
    })


})