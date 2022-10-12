$(document).ready(function() {
    let count = 0;
    let data = [
        {
            name: "name",
            val: "",
            text: "Please enter your name",
        },
        {
            name: "email",
            val: "",
            text: "Please enter your email address",
            check: function () {
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return regex.test(this.val);
            },
            validationMessage: "Please enter a valid email address"
        },
        {
            name: "phone",
            val: "",
            text: "Please enter your phone number",
            validationMessage: "Please enter a valid phone number"
        },
        {
            name: "message",
            val: "",
            text: "Please enter an optional message"
        },
        {
            name: "summary"
        },
        {
            name: "confirm",
            val: ""
        }
    ];

    $("#div-terminal").terminal(function(command) {
        if (command === "test"){
            $("#fname").val("test");
            $("#btn-submit").click();
        }

        if (data.length >= count){
            item = data[count];
            if (item.name === "summary"){
                if (command === "Y" || command === "y"){
                    $("#name").val(data[0].val);
                    $("#email").val(data[1].val);
                    $("#phone").val(data[2].val);
                    $("#message").val(data[3].val);
                    $.ajax({
                        url: '/contact_send',
                        data: $('form').serialize(),
                        type: 'POST',
                        success: function(response){
                            console.log(response);
                        },
                        error: function(error){
                            console.log(error);
                        }
                    })
                    this.echo("Thank you for sending your information. I will be in touch with you soon.")
                }
                else{
                    this.echo("Feel free to correct the info in the nearby form, or you can additionally type the name of the input and then the value.")
                    this.echo("As an example if you would like to correct your name, you could type 'name alex' and enter.")
                }
            }
            else if (item.name === "message"){
                item.val = command;
                $("#" + item.name).val(item.val);
                for(var i=0; i < data.length; i++){
                    let name = data[i].name;
                    let val = data[i].val;
                    if (data[i].text){
                        this.echo("for your " + name + ", you have: " + val);
                    }
                }
                this.echo("Is this information correct? (Y)/(N)");
                count++;
            }
            else{
                item.val = command;
                let isValid = true;
                if (item.name === "name"){
                    isValid = isMinLength(item.val);
                }
                else if (item.name === "email"){
                    isValid = isEmail(item.val);
                }
                else if (item.name === "phone"){
                    isValid = isPhone(item.val);
                }

                if (isValid){
                    count++;
                }
                else{
                    this.echo(item.validationMessage || item.text);
                }

                $("#" + item.name).val(item.val);
                let nextItem = data[count];
                if (nextItem && nextItem.text){
                    this.echo(nextItem.text);
                }
            }
        }
    }, 
    { 
        greetings: "Please enter your name",
        prompt: '>', 
        name: 'gporter' 
    }
    );

    $("#btn-save").off("click").on("click", function(){
        if (validate()){
            $("#btn-save").prop("disabled", true);
            $.ajax({
                url: '/contact_send',
                data: $('form').serialize(),
                type: 'POST',
                success: function(response){
                    $("#btn-save").prop("disabled", false);
                    $("#span-submit-line").text("Thank you for sending your information. I will be in touch with you soon.");
                },
                error: function(error){
                    console.log(error);
                }
            });
        }
        else{
            $("#name").trigger("change");
            $("#email").trigger("change");
            $("#phone").trigger("change");
        }
    });


    $("#email").on("change", function(){
        $("#email-valid").html('');
        if (!isEmail($(this).val())){
            let msg = "<span style='color:red;'>Please enter a valid email address</span>"
            $("#email-valid").append(msg);
        }
    });

    $("#phone").on("change", function(){
        $("#phone-valid").html('');
        if (!isPhone($(this).val())){
            let msg = "<span style='color:red;'>Please enter a valid phone number</span>"
            $("#phone-valid").append(msg);
        }
    });

    $("#name").on("change", function(){
        $("#name-valid").html('');
        if (!isMinLength($(this).val())){
            let msg = "<span style='color:red;'>Please enter your name</span>"
            $("#name-valid").append(msg);
        }
    });

    function isEmail(email){
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    function isMinLength(val){
        if (val){
            if (val.length >= 1){
                return true;
            }
        }
        return false;
    }

    function isPhone(val){
        var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (filter.test(val)) {
            return true;
        }
        else {
            return false;
        }
    }

    function validate(){
        if (!isMinLength($("#name").val())){
            return false;
        }
        if (!isEmail($("#email").val())){
            return false;
        }
        if (!isPhone($("#phone").val())){
            return false;
        }
        return true;
    }
});