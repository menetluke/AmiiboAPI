	window.onload = init;
	
	function init(){
        //adds functions to search and reset buttons
		document.querySelector("#search").onclick = getData;
        document.querySelector("#reset").onclick = reset;

        //retrieves user's last search term, uses 'mario' if none is detected
        const nameField = document.querySelector("#searchterm");
        const prefix = "lpm3720-";
        let nameKey = prefix + "amiibo";
        const storedName = localStorage.getItem(nameKey);
        if(storedName){
            nameField.value = storedName;
            getData();
        }
        else{
            nameField.value = "mario";
        }
        //updates localStorage when a new term is entered
        nameField.onchange = e=>{ localStorage.setItem(nameKey, e.target.value); };
	}
	
    

	function getData(){
		//main entry point to web service
		const SERVICE_URL = "https://www.amiiboapi.com/api/amiibo/?";

		//builds URL string
		let url = SERVICE_URL;
		
		//parse user entered term to search
		let term = document.querySelector("#searchterm").value.trim();
		term = encodeURIComponent(term);

        //adds name search tag and search term 
        //only if user has entered a term
        if(term.length > 0){
            url+="name=" + term;
        }
		
        //adds game series tag and selected value 
        //only if user has selected an option
        let gameSeries = document.querySelector("#gameSeries");
        if(gameSeries.value.length > 1){
            url+="&gameseries=" + gameSeries.value;
        }

        //adds amiibo series tag and selected value 
        //only if user has selected an option
        let amiiboSeries = document.querySelector("#amiiboSeries");
        if(amiiboSeries.value.length > 1){
            url+="&amiiboSeries=" + amiiboSeries.value;
        }

        //if a name is not entered, show no results
        if(term.length < 1 && gameSeries.value.length < 1 && amiiboSeries.value.length < 1){
            url+="name=";
        }

		//updates UI
		document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;
		
		//calls web service, prepares to download file
		$.ajax({
		  dataType: "json",
		  url: url,
		  data: null,
		  success: jsonLoaded,
          error: jsonFailed
		});
		
	}
	
    //function empties the search bar and restores dropdowns to 'any'
    function reset(){
        document.querySelector("#searchterm").value = "";
        document.querySelector("#gameSeries").querySelector(`option[value='']`).selected = true;
        document.querySelector("#amiiboSeries").querySelector(`option[value='']`).selected = true;
    }

    //function prints an error message if no results were found
	function jsonFailed(){
        document.querySelector("#content").innerHTML = "Sorry, there were no results for this search. "
    }

	function jsonLoaded(obj){
        //empties out the content area before loading in new results
        document.querySelector("#content").innerHTML = "";
		let results = obj.amiibo;
        //to stop search from overloading itself, caps results off at 30
        if(results.length>30){
            results = results.slice(0,30);
        }
        //prints each result's image, name, series and type
        for(let i = 0; i<results.length; i++){
            let result = results[i];
		    let bigString = "";
		    bigString += `  <h3>${result.name}</h3>
                        <img src="${result.image}" title="${result.character}" />
                        <p>Game Series: ${result.gameSeries}</p>
                        <p>Amiibo Series: ${result.amiiboSeries}</p>
                        <p>Type: ${result.type}</p>`;

		    //display results to user
		    document.querySelector("#content").innerHTML += bigString;
        }
		
	}	
	