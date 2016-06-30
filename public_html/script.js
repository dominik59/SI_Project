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
       // alert(1);
        var users = xml.getElementsByTagName("category");
        for(var i = 0; i < users.length; i++) {
            var user = users[i];
            console.log(user);
            category.push(user);            
        }
        search_answear("czesc");
        
    }
});
    function search_answear(input)
    {
        var position_in_category=find_pattern(input);
        console.log(find_pattern(input)); 
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
            console.log(category[i].childNodes[1].childNodes[0].textContent);
            if(category[i].childNodes[1].childNodes[0].textContent.toLowerCase()==input.toLowerCase())
            {
                counter = i;
            }
            
        }
        return counter;
    }
    function get_template(which_element)
    {
        console.log(category[which_element].childNodes[3].childNodes[0].textContent);
        return category[which_element].childNodes[3].childNodes[0].textContent;
    }
});


