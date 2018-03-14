// SOME GLUE CODE CONNECTING THIS PAGE TO THE STAGE
stage=null;
interval=null;
gameTimer=null;
displayTimer=null;
user=null;
pass=null;

function setupGame(){
    // Allow user to move with keyboard
    stage=new Stage(20,20,"stage");
    stage.initialize();

    $("body").keydown(keyboardHandler);
    handleModals();
    startGame();
}

function handleModals() {

    // Handles all leaderboard event handler via front end.
    $("#clickLeaderboard").on("click", function(){
        getHighScores();
        $("#leaderboardView").removeClass("hidden");
    });
    $("#goGame").on("click",function(){
        $("#leaderboardView").addClass("hidden");
    });

    // Handles all profile event handler via front end.
    $("#clickProfile").on("click", function(){
        getProfile();
        $("#profileView").removeClass("hidden");
    });

    $("#updateProfile").on("click",function(){

        var newUserId = $("#userid").val();
        var oldPass = $("#oldPass").val();
        var newPass = $("#newPass").val();
        var confirmPass = $("#confirmPass").val();

        if (oldPass == user && newPass == confirmPass) {
            updateProfile(newUserId,newPass);
            $("#profileView").addClass("hidden");
        } else {
            buttonError("updateProfile");
        }

        if (oldPass == "" && newPass == "" && confirmPass=="") {
            $("#profileView").addClass("hidden");
        }
    });

}

function updateProfile(newId,newPassword) {
    user_authentication = user+':'+pass;
    $.ajax({
        method: "PUT",
        data: {id: newId, pass: newPassword},
        headers: {'Authentication': window.btoa(user_authentication)},
        url: "/user/updateProfileId/"+user
    }).done(function(data){
        if (data.profile != false) {
            for (i = 0; i < data.profile.length; i++) {
                $("#userid").val(data.profile[i].id);
            }
        } else {
        }
    }).fail(function(err){
        console.log(err.status);
    });
}

function getProfile() {
    user_authentication = user+':'+pass;
    $.ajax({
        method: "GET",
        headers: {'Authentication': window.btoa(user_authentication)},
        url: "/user/getProfile/" + user
    }).done(function(data){
        console.log(data);
        if (data.profile != false) {
            // var row;
            // $("#leaderboardTable").empty();
            // $("#leaderboardTable").append("<tr><th>User</th><th>Time</th></tr>");
            for (i = 0; i < data.profile.length; i++) {
                $("#userid").val(data.profile[i].id);

                console.log(data.profile[i]);
                // row = "<tr><td>" + data.highscores[i].id + "</td><td>"+ data.highscores[i].time +"</td></tr>";
                // $("#leaderboardTable").append(row);
            }
        } else {
            console.log("NO DATA YET");
        }
    }).fail(function(err){
        console.log(err.status);
    });
}

function getHighScores() {
    $.ajax({
        method: "GET",
        url: "/api/getHighScores/"
    }).done(function(data){
        console.log(data);
        if (data.highscores != false) {
            var row;
            $("#leaderboardTable").empty();
            $("#leaderboardTable").append("<tr><th>User</th><th>Time</th></tr>");
            for (i = 0; i < data.highscores.length; i++) {
                // console.log(data.highscores[i]);
                row = "<tr><td>" + data.highscores[i].id + "</td><td>"+ data.highscores[i].time +"</td></tr>";
                $("#leaderboardTable").append(row);
            }
        } else {
            console.log("NO DATA YET");
        }
    }).fail(function(err){
        console.log(err.status);
    });
}

function startGame(){
    // YOUR CODE GOES HERE
    displayTimer = setInterval(showTime, 1000);
    gameTimer = setInterval(moveMonsters, 2000);
}
function pauseGame(){
    // YOUR CODE GOES HERE
    clearInterval(gameTimer);
}

function showTime() {
    var time = new Date();
    var elapsed = time - stage.actors[0].elapsedTime;
    var stringTime =  stage.actors[0].getCompletionTime(elapsed);
    $("#timeDisplay").html(stringTime);
}

function moveMonsters() {
    stage.step();
}

function find(new_x,new_y){
        stage.player.move(new_x, new_y,stage.width);
        // stage.step(current_x,current_y,new_x,new_y);
}

function keyboardHandler(event) {

    var x = event.which;
    switch(x){
        //NorthWest
        case 81:
            find(-1,-1);
            break;
        //North
        case 87:
            find(0,-1);
            break;
        //NorthEast
        case 69:
            find(1,-1);

            break;
        //West
        case 65:
            find(-1,0);
            break;
        //East
        case 68:
            find(1,0);
            break;
        //SouthWest
        case 90:
            find(-1,1)
            break;
        //South
        case 88:
            find(0,1)
            break;
        //SouthEast
        case 67:
            find(1,1);
            break;
    }
}

function showRegisterInfo() {
    $(".inactive").removeClass("inactive");
    $(".sign_in_tab").addClass("inactive");
    $("#ui_login").fadeOut("50");
    $("#ui_register").fadeIn("100");
}

function showLoginInfo() {
    $(".inactive").removeClass("inactive");
    $(".register_in_tab").addClass("inactive");
    $("#ui_register").fadeOut("50");
    $("#ui_login").fadeIn("100");
}
function buttonSuccess(id) {
    $("#" + id).addClass("btn-success");
    setTimeout( function() { $("#" + id).removeClass("btn-success") }, 1000 );
}

function buttonError(id) {
    $("#" + id).addClass("btn-error");
    setTimeout( function() { $("#" + id).removeClass("btn-error") }, 1000 );
}

function register() {

    var valid = true;
    if ($("#user_signup").val() == "") {
        valid = false;
        $("#user_signup").addClass("invalid");
        $("#user_signup_error").html("Username required");
    }

    if ($("#pass_signup").val() == "") {
        valid = false;
        $("#pass_signup").addClass("invalid");
        $("#pass_signup_error").html("Password required");
    }

    if (valid) {
        // digest = base64encode(hmac("sha256",$("#pass_signup").val(), "POST+/api/register/"));
        $.ajax({
            method: "POST",
            url: "/api/register/",
            data: { user: $("#user_signup").val(), pass: $("#pass_signup").val() }
        }).done(function(data){
            if (data.register_status != false) {
                user = $("#user_signup").val();
                pass = $("#pass_signup").val();
                $(".home_divs").hide();
                $("#warhouse_game").show();
                $(".navbar").show();
                setupGame();
            } else {
                buttonError("registerSubmit");
                $("#register_errors").html("Username already exists");
            }
        }).fail(function(err){
            buttonError("registerSubmit");
            console.log(err.status);
        });

    } else {
        buttonError("registerSubmit");
    }

}

// YOUR CODE GOES HERE
function login() {

    var valid = true;

    if ($("#user_field").val() == "") {
        valid = false;
        $("#user_field").addClass("invalid");
        $("#user_error").html("Username required");
    }

    if ($("#pass_field").val() == "") {
        valid = false;
        $("#pass_field").addClass("invalid");
        $("#pass_error").html("Password required");
    }

    if (valid) {
        // user_authentication = $("#user_field").val()+':'+$("#pass_field").val()
        $.ajax({
            method: "POST",
            url: "/api/login/",
            // headers: {'Authentication': window.btoa(user_authentication)},
            data: { user: $("#user_field").val(), pass: $("#pass_field").val() }
        }).done(function(data){
            if (data.login_status != false) {
                buttonSuccess();
                user = $("#user_field").val();
                pass = $("#pass_field").val();
                $(".home_divs").hide();
                $("#warhouse_game").show();
                // $(".headerNav").show();
                $(".navbar").show();
                console.log(data.errors);
                setupGame();
            } else {
                buttonError("loginSubmit");
                $("#login_errors").html("Incorrect User/Pass. Please Try Again");
            }
        }).fail(function(err){
            console.log(err.status);
        });
    } else {
        buttonError("loginSubmit");
    }
}


$(function(){

    // Default show login view
    $("#ui_login").show();

    $(".form-control").on("keypress", function(){
        if ($(this).hasClass("invalid")) {
            $(this).removeClass("invalid");
        }
    });

    // Intercept form and prevent it from submitting. Instead log in the username via ajax.
    $("#ui_login").submit(function(event){
        event.preventDefault();
        login();
    });

    $("#ui_register").submit(function(event){
        event.preventDefault();
        register();
    });

    $("#registerSubmit").on('click',function(){
        register();
    });

    // If user clicked on the login tab
    $(".sign_in_tab").on('click',function(){
        showLoginInfo();
    });

    // If user clicked on the register tab
    $(".register_in_tab").on('click',function(){
        showRegisterInfo();
    });
});
