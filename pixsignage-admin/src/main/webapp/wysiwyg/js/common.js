function create_error_div(fieldname, error_message, flag){
    if(flag == undefined){
        flag = true;
    }
    var error_div = document.createElement('div');
    $(error_div).attr('class', 'text-error');
    $(error_div).html(error_message);
    fieldname.addClass('focus-error-element');
    
    if(flag){
        fieldname.attr('style', 'float: left;');
        fieldname.after(error_div);
    } else {
        $(error_div).attr('style', 'float: right; margin-left: 113px; margin-top: -35px; position: absolute; text-align: left;')
        fieldname.parents('td').append(error_div);
    }
}

function formatString(string,max_length,strval,endval){
    var start = 19;
    var end = 13;    
    if(strval !=undefined){
        start = strval;
    }    
    if(endval !=undefined){
        end = endval;
    }
    
    if(strval == undefined && endval == undefined){
        if(max_length<25 && max_length>10 ){
            start = 10;
            end = 5;
        }
        if(max_length<=10){
            start = 3;
            end = 3;
        }
    }else{
        start = strval;
        end = endval;
    }
    
    
    if (string.length > max_length){
        string = string.slice(0, start) + '...' + string.slice(end * (-1));    
    }    
    return string;
}