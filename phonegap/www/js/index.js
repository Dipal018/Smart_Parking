var app = {
    // Application Constructor
    initialize: function() {
    },
};

function initializeForm(){
    if(localStorage.getItem("name")){
        document.getElementById("name").value = localStorage.getItem("name");
    }

    if(localStorage.getItem("email")){
        document.getElementById("email").value = localStorage.getItem("email");
    }
    if(localStorage.getItem("phone")){
        document.getElementById("phone").value = Number(localStorage.getItem("phone"));
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function registerUser() {
    if (!localStorage.getItem("count")) {
        localStorage.setItem("count", 1);
    } 
    else{
        localStorage.setItem("count", Number(localStorage.getItem("count"))+ 1);
    }
    var name = document.getElementById("name").value;
    var spot = document.getElementById("spot").value;
    var phone = null;
    var email = null;
    var flag = true;
    if(!document.getElementById("email").value){
        if(!document.getElementById("phone").value){
            flag = false
            document.getElementById("errfn").innerHTML = "Please enter either email or phone number to receive parking alerts!!!";
        }else{
            phone = document.getElementById("phone").value;
        }
    }else{
        email = document.getElementById("email").value;
        phone = document.getElementById("phone").value;
    }
    if(flag){
        //console.log(phone);
        $.get("https://afternoon-peak-89776.herokuapp.com/api/user?spot="+spot+"&name="+name+"&email="+email+"&phone="+phone, function(data, status){
            console.log(data);
            if(!data.value){
                //alert(data);
                var text = document.getElementById("modalText");
                text.innerHTML = data;
                var span = document.getElementsByClassName("close")[0];
                span.onclick = function() {
                    modal.style.display = "none";
                }
                var modal = document.getElementById('myModal');
                modal.style.display = "block";
            }
            else{
                console.log(data);
                localStorage.setItem("name", name);
                localStorage.setItem("email", email);
                localStorage.setItem("phone", phone);
                localStorage.setItem("timeParked", data.value.createDate);
                document.location.href='main.html';
            }
        });
    }
}

function initializeMain() {
    document.getElementById("helloText").innerHTML= "Hello "+localStorage.getItem("name")+", remaining time for your parking spot is :";
    var date = new Date(localStorage.getItem("timeParked"));
    var newDateObj = new Date(date.getTime() + 4*60000);
    localStorage.setItem("timeRemain",newDateObj);
            $("#getting-started").html("");
             $("#getting-started").countdown(newDateObj, function(event) {
                $(this).text(
                event.strftime('%Mmins %Ssec')
                );
            });
            $("#getting-started").countdown(newDateObj).on('finish.countdown',function(event) {
                $(this).text(
                    "Time Over"
                    );
             });
}

function initialize(){
    
    if(localStorage.getItem("timeRemain")){
        var date = new Date(localStorage.getItem("timeRemain"));
        var curr = new Date();
        console.log(curr)
        console.log(date)
        if(date  > curr){
            console.log("here")
            document.location.href='main.html';
        }
    }
}
