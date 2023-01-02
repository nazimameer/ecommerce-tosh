function catvalid(scope){
    const name = document.getElementById('name')
    const image = document.getElementById('formFile')
    if(name.value === ""){
        document.getElementById('nameError').innerHTML = "This field is required";
        return false
    }else{
        document.getElementById('nameError').innerHTML = "";
    }

    if(image.value === ""){
        document.getElementById('imageError').innerHTML = 'This field is required'
        return false
    }else{
        document.getElementById('imageError').innerHTML = ''

    }
return true
} 

function addproductvalid(scope){
    const name = document.getElementById('name')
    const price = document.getElementById('price')
    const stock = document.getElementById('stock')
    const File = document.getElementById('formFile')

    if(name.value === ""){
        document.getElementById('nameError').innerHTML = 'This field is required'
        return false
    }else{
        document.getElementById('nameError').innerHTML = ''

    }

    if(price.value === ""){
        document.getElementById('priceError').innerHTML = 'This field is required'
        return false
    }else{
        document.getElementById('priceError').innerHTML = ''

    }

    if(stock.value === ""){
        document.getElementById('stockError').innerHTML = 'This field is required'
        return false
    }else{
        document.getElementById('stockError').innerHTML = ''

    }

    if(File.value === ""){
        document.getElementById('fileError').innerHTML = 'This field is required'
        return false
    }else{
        document.getElementById('fileError').innerHTML = ''

    }

}