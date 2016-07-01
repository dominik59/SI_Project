/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$('document').ready(function(){
    category=[];

    $.ajax({
    type: "GET",
    url: "xml1.aiml",
    dataType: "xml",
    success: function (xml) {

        // Parse the xml file and get data
        var xmlDoc = $.parseXML(xml),
            $xml = $(xmlDoc);
            actual_xml=xml;
       // alert(1);
        var users = xml.getElementsByTagName("category");
        for(var i = 0; i < users.length; i++) {
            var user = users[i];
            console.log(user);
            category.push(user);
        }
        console.log(category);
            //add_category("ddd","asaa");
    }
});

    function isCity(position) {

        if (position != -1) {
            if (category[position].childNodes[3].childNodes[0].textContent == "Miasto") {
                document.getElementById('robot').src="Infobot_render1.png";
                return 1;
            } else {

                return -1;
            }
        } else {
            
            return -1;
        }

    }

    function findRepeat(input, minFreq) {
        var toCheck = [], zdanie = [], arq;
        for (var i = 0; i < input.length; i++){

            arq = input[i];
            if (arq == " "){                
                if(zdanie.length!=0)
                toCheck.push(zdanie.join(""));
                zdanie = [];
            } else {                
                zdanie.push(arq);
            }
        }
        
        toCheck.push(zdanie.join(""));
        //console.log(toCheck.indexOf("!"));
        while(toCheck.indexOf("!")!=-1 || toCheck.indexOf("!")!=-1 || toCheck.indexOf("?")!=-1)
        {
            if(toCheck.indexOf("!")!=-1)
            {
                toCheck.splice(toCheck.indexOf("!"),1);
            }
            if(toCheck.indexOf(",")!=-1)
            {
                toCheck.splice(toCheck.indexOf(","),1);
            }
            if(toCheck.indexOf("?")!=-1)
            {
                toCheck.splice(toCheck.indexOf("?"),1);
            }
        }
        //console.log(toCheck);
        
        var repeat = [];
        var count = [];

        for (var l = 0; l < toCheck.length; l ++){
            count[l] = 0;
        }

        var toAdd = true;

        for (var j = 0; j < toCheck.length; j++){

            for (var k = 0; k < repeat.length; k++){
                if (are_strings_similar(toCheck[j], repeat[k],80)){
                    toAdd = false;
                    count[k] += 1;
                    break;
                }
            }

            if (toAdd == true){

                repeat.push(toCheck[j]);
                count[j] += 1;
            } else {
                
                toAdd = true;
            }
        }

        var wynik = [];
        for (var o = 0; o < count.length; o++){
            if (count[o] >= minFreq){
                wynik.push(toCheck[o]);
            }
        }

        return wynik;
    }
    
    function are_strings_similar(input_string,comparsion_string,similarity_percentage)
    {
        if(comparsion_string.length==1)
            return false;
        var input_string_keys=[];
        var input_string_values=[];        
        for (var i=0;i<input_string.length;i++)
        {
            var letter=input_string[i];
            if(input_string_keys.indexOf(letter)!=-1)
            {
                continue;
            }
            for(var k=0;k<comparsion_string.length;k++)
            {
                if(comparsion_string[k]==letter)
                {
                    if(input_string_keys.indexOf(letter)!=-1)
                    {
                        if(input_string_values[input_string_keys.indexOf(letter)]!=null)
                        {
                            input_string_values[input_string_keys.indexOf(letter)]+=1;
                        }
                        else
                        {
                            input_string_values[input_string_keys.indexOf(letter)]=1;
                        }
                            
                    }
                    else
                    {
                        input_string_keys.push(letter);
                        input_string_values[input_string_keys.indexOf(letter)]=1;
                    }
                }
            }
        }
        var percentage=0.0;
        for(var i = 0; i<input_string_values.length;i++)
        {
            percentage+=input_string_values[i];
        }
        percentage=(parseFloat(percentage)/parseFloat(comparsion_string.length))*100.0;
        if(percentage>=similarity_percentage && 100-similarity_percentage+100>=percentage)
        {
            //console.log(percentage);
            //console.log(input_string_keys);
            //console.log(input_string_values);
            return true;            
        }
        else
        {   //console.log(percentage);
            return false;
        }
        
    }
    function generateCity(){

        while (true){

            var position = Math.floor((Math.random() * category.length) + 1);

            if (category[position].childNodes[3].childNodes[0].textContent == "Miasto"){

                return category[position].childNodes[1].childNodes[0].textContent;
            }
        }
    }

    var cityQuestion = 0;
    var city;

    function Save(input) {

        add_category(city+"TAK",input)
    }

    function cityLogic(input) {

        if (cityQuestion == 1){

            if (input.toUpperCase() == "NIE"){

                var answer = 'Naprawde mi przykro :( Znajdziemy cos innego, moze ';
                var city = generateCity();

                answer += city;
                gcseCallback(city);
                cityQuestion = 1;

                return answer;
            } else if (input.toUpperCase() == "TAK"){

                cityQuestion = 2;
                return 'Ciesze sie, a co szczegolnie?';
            } else {

                return 'Naprawde chce wiedziec! :(';
            }
        } else if (cityQuestion == 2) {

            Save(input);
            cityQuestion = 0;
            return "Dziekuje za odpowiedz zapamietam! ";
        }

        return " ";
    }


    function search_answear(input)
    {
        //alert(1);
        
        var answer = cityLogic(input);

        if (answer != " "){

            return answer;
        }


        var position_in_category=find_pattern(input);
        if (isCity(position_in_category) != -1){
            cityQuestion = 1;
            city = input;
            gcseCallback(input);
            return "Podoba Ci sie?";
        }
        else
        {
            if (position_in_category == -1) {
                if (iDontNow(input) != -1) {

                    return generateFromHistoric();
                } else {

                    return "Przepraszam nie rozumiem";
                }
            }

            return get_template(search_for_max_question_compatibility(input,50));
        }
//        var position_in_category=find_pattern(input);
//        //console.log(find_pattern(input)); 
//        if(position_in_category==-1)
//        {
//            return -1;
//        }
//        else
//        {
            
            //return get_template(position_in_category);
//        }
        
    }
    
    /**
     * 
     * @param {type} input jest to parametr który zawiera wartość wprowadzoną przez użytkownika
     * @param {type} compatibility_percentage jest to warość progowa, w której określa się zbliżoność pytania użytkownika do tego występującego w bazie
     * @returns {unresolved} zwraca pytanie z bazy które najbardziej odpowiada frazie wprowadzonej przez użytkownika
     */
    function search_for_max_question_compatibility(input,compatibility_percentage)
    {
        var value_of_max_compatibility_element=[];
        var pos_of_elem_with_max_compatibility=-1;
        for(var i = 0; i<category.length;i++)
        {
            if(i==0){
                var temp = findRepeat(input.toLowerCase() + " " + get_pattern(i),2);
                if(temp.length!=0)
                {                   
                    value_of_max_compatibility_element=temp;
                    pos_of_elem_with_max_compatibility=i;
                }
            }
            else 
            {
                var temp = findRepeat(input.toLowerCase() + " " + get_pattern(i),2);                
                if(temp.length>value_of_max_compatibility_element.length)
                {
                    value_of_max_compatibility_element=temp;
                    pos_of_elem_with_max_compatibility=i;
                }                              
            }
        
        }
        var toCheck = [], zdanie = [], arq;
        for (var i = 0; i < input.length; i++){

            arq = input[i];
            if (arq == " "){                
                if(zdanie.length!=0)
                toCheck.push(zdanie.join(""));
                zdanie = [];
            } else {                
                zdanie.push(arq);
            }
        }
        
        toCheck.push(zdanie.join(""));
        //console.log(toCheck.indexOf("!"));
        while(toCheck.indexOf("!")!=-1 || toCheck.indexOf("!")!=-1 || toCheck.indexOf("?")!=-1)
        {
            if(toCheck.indexOf("!")!=-1)
            {
                toCheck.splice(toCheck.indexOf("!"),1);
            }
            if(toCheck.indexOf(",")!=-1)
            {
                toCheck.splice(toCheck.indexOf(","),1);
            }
            if(toCheck.indexOf("?")!=-1)
            {
                toCheck.splice(toCheck.indexOf("?"),1);
            }
        }
        if(toCheck[0]=="co"&&toCheck[1]=="jest")
        {
            if(find_pattern(input)==-1)
            {
                return -1;
            }
        }
        console.log(value_of_max_compatibility_element);
        var equation=(value_of_max_compatibility_element.length/toCheck.length)*100;
        if(equation>=compatibility_percentage&&100-compatibility_percentage+100>=equation)
        {
            //return get_pattern(pos_of_elem_with_max_compatibility);
            return pos_of_elem_with_max_compatibility;
        }
        else
        {
            return -1;   
        }
        //return get_pattern(pos_of_elem_with_max_compatibility);
    }

    function iDontNow(input) {

        if (input.toUpperCase() == "NIE WIEM"){

            return true;
        }else {

            return false;
        }
    }

    function generateFromHistoric() {

        while (true){

            var position = Math.floor((Math.random() * category.length) + 1);

            if (category[position].childNodes[3].childNodes[0].textContent == "Miasto"){

                var city = category[position].childNodes[1].childNodes[0].textContent.toUpperCase();

                for(var i=0;i<category.length;i++)
                {
                    console.log(category[i].childNodes[1].childNodes[0].textContent);
                    if(category[i].childNodes[1].childNodes[0].textContent.toUpperCase()==city+"TAK")
                    {
                        return "Moze " + city + " ludzie zachwalaja to miejsce za "+category[i].childNodes[3].childNodes[0].textContent;
                    }
                }
                return "Moze" + city;
            }
        }

    }

    function find_pattern(input)
    {
        for(var i=0;i<category.length;i++)
        {
            //console.log(category[i].childNodes[1].childNodes[0].textContent);
            if(category[i].childNodes[1].childNodes[0].textContent.toLowerCase()==input.toLowerCase())
            {
                return i;
            }
        }

        return -1;
    }
    
    function get_pattern(which_one)
    {
        return category[which_one].childNodes[1].childNodes[0].textContent.toLowerCase();
    }

    function get_template(which_element)
    {
        if(which_element==-1)
        {
            return -1;
        }
        else
        {
            return category[which_element].childNodes[3].childNodes[0].textContent;
        }
        //console.log(category[which_element].childNodes[3].childNodes[0].textContent);
        
    }
    
    function add_category(pattern,template)
    {
        var temp_xml_category = actual_xml.createElement("category");
        var temp_xml_pattern = actual_xml.createElement("pattern");
        var temp_xml_template = actual_xml.createElement("template");
        var temp_xml_pattern_text = actual_xml.createTextNode(pattern.toUpperCase()+"\n");
        var temp_xml_template_text = actual_xml.createTextNode(template+"\n");
        temp_xml_pattern.appendChild(temp_xml_pattern_text);
        temp_xml_template.appendChild(temp_xml_template_text);                
        temp_xml_category.appendChild(temp_xml_pattern);
        temp_xml_category.appendChild(temp_xml_template);
        $(actual_xml).find("aiml").append(temp_xml_category);
        //console.log(actual_xml);
        $.ajax({   					 // te {{ }} są po to, by generator pominal to przy dokumentacji
               type:"POST",               
	       url: 'saving_xml.php',  //the script to call to get data          
	       data: {xml:(new XMLSerializer()).serializeToString(actual_xml)},   			
	                              			//you can insert url argumnets here to pass to api.php
	                                        //for example "id=5&parent=6"
	      dataType: 'xml',                 //data format      
	      success: function(data)           //on recieve of reply
	      {
	        
	      } 
	    });
    }
    function focuse(){

        var x = document.getElementById("textInput");
        x.value = "";
    }

    function noFocuse() {
        var x = document.getElementById("textInput");
        x.value = "Naprawde napisz cos ...";
    }

    function communicate(event) {
        var x = event.which;
        if (x == 13){
            var text = document.getElementById("textInput");
            console.log(text.value);
            server();
            text.value = "";
        }
    }

    // glowna metoda do komunikacji gdzie bedzie zainplementowana logika naszego robota
    function server() {                
        var odpowiedz = document.getElementById("info");
        console.log(document.getElementById("textInput").value);
        odpowiedz.innerHTML = search_answear(document.getElementById("textInput").value);
    }
    
    function gcseCallback(toSearch) {
        if (document.readyState != 'complete')
            return google.setOnLoadCallback(gcseCallback, true);

        google.search.cse.element.render({gname:'gsearch', div:'results', tag:'searchresults-only', attributes:{linkTarget:'', disableWebSearch:"true"}});
        var element = google.search.cse.element.getElement('gsearch');
        element.execute(toSearch);

    };
    (function() {
        var cx = '015850841452003814373:jaqkxpwmmba';
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
            '//www.google.com/cse/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
    })();
    
    $( ".user" ).keypress(function() {
        communicate(event);
    });
    $( ".user" ).click(function() {
        focuse();
        document.getElementById('robot').src="Infobot_render.png";
    });
    $( ".user" ).focusout(function() {
        noFocuse();
    });
    $( ".gsc-results-close-btn" ).click(function() {
        document.getElementById('robot').src="Infobot_render.png";
    });
    
});


