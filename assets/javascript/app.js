//array to hold the buttons
var sports = ["baseball", "boxing", "diving", "football", "golf", "gymnastics", "hockey",
			"basketball", "parkour", "rowing", "formula one", "horse racing",
			"martial arts", "rock climbing", "roller skating", "skateboarding"
	];

//query url
var url = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=12&q=";

//array to prefetch the gif
var gifs = [];

//this function create a button
//this function is called from createButtons function and from add button click event
function createBtn(value){
	var buttons = $("#buttons");
	buttons.append("<button class='btn' value='"+ value + "'>" + value + "</button>");
}

//this function loop the array sports and call createBtn to create each button
function createButtons(arr){
	for(var i = 0; i < arr.length; i++){
		createBtn(arr[i]);
	}
}

//function to show messages when we add a new sport, when the sport already exist
//or when we try to add a sport with a empty input
function showMsg(msg){
	$("#msg").text(msg).slideDown(); //show the message
	setTimeout("$('#msg').slideUp()", 3000); //hide the div after 3 sec
}

$(document).ready(function(){
	createButtons(sports); //create buttons

	//click event for buttons
	$("#buttons").on("click", ".btn", function(){
		
		var term = $(this).val(); //value of the clicked button
		var queryURL = url + term; //Add the seach term to the query 
		
		//create a h1 with the selected sport
		var header = $("<h1>");
		header.text(term.toUpperCase());
		$("#images").show()
			.empty()
			.append(header);

		//ajax request
		$.ajax({
      		url: queryURL,
      		method: "GET"
    		}).done(function(response) {
    			
    			var result = response.data;

    			//loop through the response object
    			for(var i = 0; i < result.length; i++){

    			 	var image = result[i].images.fixed_width_still.url; //static image url
    			 	var gif = result[i].images.fixed_width.url; //gif url


					var li = $("<li class='listItem'>"); //Create a li element and add class listItem

					//Create a p element, add text with the rating and append it to the li element
					var p = $("<p>");
    				p.text("Rating: " + result[i].rating);
    				li.append(p);

    				//Create a div with class imgHolder, container for the image
    				var div = $("<div class='imgHolder'>");

    				//Create a image, add class, attr and append it to the div element
    				var img = $("<img class='image'>");
    				img.attr({src: image, "data-gif": gif, "data-play": false, "data-still": image});
    				div.append(img);

    				//append the div to li emenent
    				li.append(div);

    				//append li element to his parent ul with id = images
    				$("#images").append(li);

    				
    				//Prefetch gif images
    				//This allows the gif to play faster when we click a image
    			 	gifs[i] = new Image(); //Create a new html image
    			 	gifs[i].src = gif; //assign the gif url to its src attribute
      			}	
    		});
	});

	//click event for images
	$("#images").on("click", ".image", function(){
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

	//click event for add button
	$("#add").click(function(){
		var text = $("input[type=text]").val(); //get the text from text input
		text = text.trim().toLowerCase(); //remove spaces and convert it to lowercase
		var msg = "";

		if(text == ""){ //check if the imput is empty, if it is, we will display a message
			msg = "You have to enter a sport.";	
			
		} else { //if the input is not empty

			//check if the input exist in the array
			var index = sports.indexOf(text);

			if( index == -1){ 					//the input is not in the array
				createBtn(text);				//create a button

				$("input[type=text]").val(""); 	//empty the input
				sports.push(text); 				//add new button to array

				msg = "The sport has been added.";

			} else { //if the input exist in the array(if there is a button with that value)

				msg = "This sport already exist."

				//add a class to highlight the button with that value 
				$("#buttons .btn:eq(" + index + ")").addClass("glowing");

				//after 3 sec remove the class from the button
				setTimeout(function(){
					$("#buttons .btn:eq(" + index + ")").removeClass("glowing");
				}, 3000);
			}
		}
		showMsg(msg); //show the message
	});
});