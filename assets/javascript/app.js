//array to hold the buttons
var sports = ["baseball", "boxing", "diving", "football", "golf", "gymnastics", "hockey",
			"nba", "parkour", "rowing", "formula one", "horse racing",
			"martial arts", "rock climbing", "roller skating", "skateboarding"
	];

//query url
var url = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=12&q=";
var gifs = [];

//function to create buttons
function createButtons(){
	var buttons = $("#buttons");
	for(var i = 0; i < sports.length; i++){
		buttons.append("<button class='btn' value='"+ sports[i] + "'>" + sports[i] + "</button>");
	}
}

$(document).ready(function(){
	createButtons();

	$("#buttons").on("click", ".btn", function(){
		$("#images").empty();
		
		var term = $(this).val(); //value of the clicked button
		var queryURL = url + term; //to create the query 
		
		$.ajax({
      		url: queryURL,
      		method: "GET"
    		}).done(function(response) {
    			
    			var result = response.data;

    			for(var i = 0; i < result.length; i++){
    			 	var image = result[i].images.fixed_width_still.url; //URL to the image
    			 	var gif = result[i].images.fixed_width.url; //URL to the gif


					var li = $("<li class='itemList'>");	//to create a div

					//To create a p and add the rating
					var p = $("<p>");
    				p.text("Rating: " + result[i].rating);
    				li.append(p);

    				var div = $("<div class='imgHolder'>");

    				//To create a image, add class and attr
    				var img = $("<img class='gif'>");
    				img.attr({src: image, "data-gif": gif, "data-play": false, "data-still": image});
    				div.append(img);

    				li.append(div);
    				$("#images").append(li);

    				
    				//Prefetch gif images
    			 	gifs[i] = new Image();
    			 	gifs[i].src = gif;
      			}	
    		});
	});

	$("#images").on("click", ".gif", function(){
		var thisImg = $(this); //image that was clicked

		//get attribute data-play from the image
		//data-play is true when the image is a gif
		//and false when is a static image
		var play = thisImg.data("play"); 

		//if play is false then change the image for the gif version 
		//and change data-play attribute to true
		if(!play){
			thisImg.attr("src", thisImg.data("gif"));
			thisImg.data("play", true);
		}else{
			//if play is true then change the gif for the static image 
			//and change data-play attribute to false
			thisImg.attr("src", thisImg.data("still"));
			thisImg.data("play", false);
		}
	});

	$("#add").click(function(){
		var text = $("input[type=text]").val(); //get text from text input
		text = text.trim().toLowerCase(); //remove spaces and convert it to lowercase
		if(text == ""){
			$("#msg").text("You have to enter a sport.").slideDown();
			setTimeout("$('#msg').slideUp()",3000);
			
		} else{
			//if the input is not already in the array
			var index = sports.indexOf(text);
			if( index == -1){ 
				var btn = $("<button>"); 		//create the button
				btn.addClass("btn"); 			//add clase btn
				btn.val(text).text(text); 		//add text
				$("#buttons").append(btn); 		//add the button to the list
				$("input[type=text]").val(""); 	//empty the input
				sports.push(text); 				//add new button to array
				$("#msg").text("The button has been added.").slideDown();
				setTimeout("$('#msg').slideUp()",3000);
			} else{
				$("#msg").text("This sport already exist.").slideDown();
				$("#buttons .btn:eq(" + index + ")").addClass("glowing");
				setTimeout(function(){
					$('#msg').slideUp();
					$("#buttons .btn:eq(" + index + ")").removeClass("glowing");
				}, 3000);
			}
		}
	});
});