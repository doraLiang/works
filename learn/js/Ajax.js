/**
 * Created with JetBrains WebStorm.
 * User: Admin
 * Date: 16-2-27
 * Time: 下午2:34
 * To change this template use File | Settings | File Templates.
 */
function newAjax(url,funsucc,funfail){
    if(window.XMLHttpRequest){
        xhr=new XMLHttpRequest();
    }else{
        xhr=new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('GET',url,true);
    xhr.send();
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4 && xhr.status==200){
            funsucc(xhr.responseType);
        }else{
            if(funfail){
                funfla(xhr.status);
            }
        }
    }
}