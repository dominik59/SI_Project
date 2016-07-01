/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
category=[];

$('document').ready(function(){
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
        search_answear("czesc");
        //add_category("dddd","ccc");
        console.log('witaj , witam Cie ' + search_answear("czesc"));
        console.log(findRepeat('witaj , witam Cie czesc ' + search_answear("witaj"), 2));
        are_strings_similar("sprawozdanie","sprawozdanie",5);
        
        
    }
});

    function findRepeat(input, minFreq) {
        var toCheck = [], zdanie = [], arq;
        for (var i = 0; i < input.length; i++){

            arq = input[i];
            if (arq == " "){

                toCheck.push(zdanie.join(""));
                zdanie = [];
            } else {

                zdanie.push(arq);
            }
        }
        
        toCheck.push(zdanie.join(""));

        var repeat = [];
        var count = [];

        for (var l = 0; l < toCheck.length; l ++){
            count[l] = 0;
        }

        var toAdd = true;

        for (var j = 0; j < toCheck.length; j++){

            for (var k = 0; k < repeat.length; k++){
                if (toCheck[j] == repeat[k]){
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
        var input_string_keys=[];
        var input_string_values=[];
        var comparsion_string_keys=[];
        var comparsion_string_values=[];
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
        console.log((parseFloat(percentage)/parseFloat(input_string.length))*100.0);
        console.log(input_string_keys);
        console.log(input_string_values);
    }

    function search_answear(input)
    {
        var position_in_category=find_pattern(input);
        //console.log(find_pattern(input)); 
        if(position_in_category==-1)
        {
            return "nie znaleziono takiego pytania";
        }
        else
        {
            return get_template(position_in_category);
        }
        
    }
    
    function find_pattern(input)
    {
        var counter = -1;
        for(var i=0;i<category.length;i++)
        {
            //console.log(category[i].childNodes[1].childNodes[0].textContent);
            if(category[i].childNodes[1].childNodes[0].textContent.toLowerCase()==input.toLowerCase())
            {
                counter = i;
            }
            
        }
        return counter;
    }
    function get_template(which_element)
    {
        //console.log(category[which_element].childNodes[3].childNodes[0].textContent);
        return category[which_element].childNodes[3].childNodes[0].textContent;
    }
    
    function add_category(pattern,template)
    {
        var temp_xml_category = actual_xml.createElement("category");
        var temp_xml_pattern = actual_xml.createElement("pattern");
        var temp_xml_template = actual_xml.createElement("template");
        var temp_xml_pattern_text = actual_xml.createTextNode(pattern.toUpperCase());
        var temp_xml_template_text = actual_xml.createTextNode(template);
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
});


