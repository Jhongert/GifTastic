var sports = ["baseball", "boxing", "diving", "football", "golf", "gymnastics", "hockey",
			"nascar", "nba", "parkour", "rowing", "formula one", "horse racing",
			"martial arts", "rock climbing", "roller skating", "skateboarding"
	];

var url = "http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=";



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

		var term = $(this).val();
		var term = term.replace(/\s/g, "+");
		var queryURL = url + term;
		
		$.ajax({
      		url: queryURL,
      		method: "GET"
    		}).done(function(response) {
    			var result = response.data;

    			 for(var i = 0; i < result.length; i++){
    			 	var image = result[i].images.fixed_height_still.url;
    			 	var gif = result[i].images.fixed_height.url;
    				
    				var div = $("<div>");
    				//div.css("width", result[i].images.fixed_height.width + "px");
    				div.addClass("imgHolder");

    				var p = $("<p>");
    				p.text("Rating: " + result[i].rating);

    				var img = $("<img>");
    			 	img.addClass("image").attr({src: image, "data-gif": gif, "data-play": false, "data-img": image});
    			 	div.append(p);
    			 	div.append(img);
    			 	$("#images").append(div);	

      			}
    	});
	});

	$("#images").on("click", ".image", function(){
		var thisImg = $(this);

		var play = thisImg.data("play");

		if(!play){
			thisImg.attr("src", thisImg.data("gif"));
			thisImg.data("play", true);
		}else{
			thisImg.attr("src", thisImg.data("img"));
			thisImg.data("play", false);
		}
	});

	$("#add").click(function(){
		var text = $("input[type=text]").val();
		text = text.trim().toLowerCase();
		if(text == ""){
			alert("You have to type a sport");
		} else{
			if(sports.indexOf(text) == -1){
				var btn = $("<button>");
				btn.addClass("btn");
				btn.val(text).text(text);
				$("#buttons").append(btn);
				$("input[type=text]").val("");
				sports.push(text);
			} else{
				alert("The sport that you typed already exist.");
			}
		}
	});


});