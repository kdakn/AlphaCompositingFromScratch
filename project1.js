//Globals
let toCheckIfAlphaIsChanged = [];
let foreGroundAlphaMustBeChangedOnlyOnce = true;
let ifAlphaChanged = false;
//Globals End

function composite(BackGround, ForeGround, ForeGroundOpacity, ForeGroundPosition) {
    var bgData = BackGround.data;
    var fgData = ForeGround.data;
    var width = BackGround.width;
    var height = BackGround.height;
    var widthFore = ForeGround.width;
    var heightFore = ForeGround.height;
    
    //Please write your code here according to comments
    //My Interpretions: 
    //1)First of all, the foreground images rgb color channel values should overwrite the existing background image rgb color channels. This is what it is needed to be done for the cup image.
    //2)Secondly, since the TEDU logo will partly overwrite the cup rgb channel values it should use rgba channel where a is indicating the alpha values for transparency or opacity 

    //Start Count Background Size and Foreground Size 
    let counter; //count the first occurrence of the non-black pixel.
    for(counter = 0; counter<heightFore*widthFore*4; counter++)
        if(ForeGround.data[counter] != 0) break;

    let foreSize = 0, backSize = 0;
    for(let i = 0; i<width*height*4-3; i++)
        if(BackGround.data[i] != 0 || BackGround.data[i+1] != 0 || BackGround.data[i+2] != 0 || BackGround.data[i+3] != 0 ) 
        backSize++;
        
    for(let i = 0; i<widthFore*heightFore*4-3; i++)
        if(ForeGround.data[i] != 0 || ForeGround.data[i+1] != 0 || ForeGround.data[i+2] != 0 || ForeGround.data[i+3] != 0 ) 
        foreSize++;
    //End Counting Background Size and Foreground Size 


    //Start Arrange Foreground Pixels Opacity According to the Bar
    toCheckIfAlphaIsChanged.push(ForeGroundOpacity);
    if(toCheckIfAlphaIsChanged.length > 500)
        toCheckIfAlphaIsChanged = toCheckIfAlphaIsChanged.slice(-2);
    
    if(toCheckIfAlphaIsChanged.length != 0 && (toCheckIfAlphaIsChanged[toCheckIfAlphaIsChanged.length-2] != toCheckIfAlphaIsChanged[toCheckIfAlphaIsChanged.length-1])) //Means alpha changed.
        ifAlphaChanged = true;
    for(let i = 0; ifAlphaChanged && i<widthFore*heightFore*4-3; i+4){ //Bu tekrar tekrar baştan çağırılmamalı çünkü alpha değeri 0<alpha<1 olunca sürekli çarparsak
        //alpha değeri ile (mesela 0.3 ile) alpha değeri değişmese bile resim kayboluyor.
        ForeGround.data[i+3] = ForeGround.data[i+3] * ForeGroundOpacity;
        ifAlphaChanged = false;
    }
    //End Arrange Foreground Pixels Opacity According to the Bar


    //Start Compositing Images
    const endFg = heightFore * widthFore * 4-4;
    let ifg = counter ; // pointer for foreground pixels
    let ibg = (ForeGroundPosition.y * width + ForeGroundPosition.x+(width*height/4+width/2)) * 4; //Ortaya hizalamqak için.

    while( backSize > foreSize && ifg < endFg){
        /* ForeGround.data[ifg+3] = ForeGround.data[ifg+3] * ForeGroundOpacity; */ // Bu buraya da yazılmamalı çünkü eğer ki while içerisinde olursa
        //html kodunda bir while daha olduğundan devamlı azalacak image hareket ettirildiğinden. Bu nedenle while dışına yazılmalı.

         if(ForeGround.data[ifg] != 0 || ForeGround.data[ifg+1] != 0 || ForeGround.data[ifg+2] != 0 || ForeGround.data[ifg+3] != 0){ 
            /* ForeGround.data[ifg+3] = ForeGround.data[ifg+3] * ForeGroundOpacity; */ //don't write it in here. Because code enters this condition,
            //when foreground pixels not fully opaque (<255) so, the image transparency with the bar is no being desirable.
            let alpha = ForeGroundOpacity;
            let cred = alpha * ForeGround.data[ifg] + (1-alpha)* BackGround.data[ibg]
            let cgreen = alpha * ForeGround.data[ifg+1] + (1-alpha)* BackGround.data[ibg+1]
            let cblue = alpha * ForeGround.data[ifg+2] + (1-alpha)* BackGround.data[ibg+2]
            let calpha = ForeGround.data[ifg+3] + (1-alpha)* BackGround.data[ibg+3];
            BackGround.data[ibg] = cred;
            BackGround.data[ibg+1] = cgreen;
            BackGround.data[ibg+2] = cblue;
            BackGround.data[ibg+3] = calpha; //background pixeli background saydam olunca foreground olsun diye.
        }
   
        if ((ifg/4) % widthFore == 0)  // Optimize etmek için DEĞİL. ifg pointerı kupayı taraken bir satırı bitirdiyse diğer satıra geçecek. Backgrounddan daha küçük olan foreler için.
            ibg += (width - widthFore) * 4;
            
        ibg += 4;
        ifg += 4;
        
    }  
    //End Compositing Images
}