const handleThemeUpdate = (cssVars) => {
    const root = document.querySelector(':root');
    const keys = Object.keys(cssVars);
    keys.forEach(key => {
        root.style.setProperty(key, cssVars[key]);
    });
}

function dynamicPrimaryColor(primaryColor) {
    'use strict'
    
    primaryColor.forEach((item) => {
        item.addEventListener('input', (e) => {
            const cssPropName = `--primary-${e.target.getAttribute('data-id')}`;
            const cssPropName1 = `--primary-${e.target.getAttribute('data-id1')}`;
            const cssPropName2 = `--primary-${e.target.getAttribute('data-id2')}`;
            handleThemeUpdate({
                [cssPropName]: e.target.value,
                // 95 is used as the opacity 0.95  
                [cssPropName1]: e.target.value + 95,
                [cssPropName2]: e.target.value,
            });
        });
    });
}

function dynamicPrimaryBackground(bgColor) {
    bgColor.forEach((item) => {
        item.addEventListener('input', (e) => {
            const cssPropName3 = `--dark-${e.target.getAttribute('data-id3')}`;
            const cssPropName4 = `--dark-${e.target.getAttribute('data-id4')}`;
            handleThemeUpdate({
                [cssPropName3]: e.target.value+ 'dd',
                [cssPropName4]: e.target.value,
            });
        });
    });
}

(function() {
    'use strict'

    // Light theme color picker 
    const dynamicPrimaryLight = document.querySelectorAll('input.color-primary-light');
    
    const dynamicBackground = document.querySelectorAll('input.background-primary-light');

    // themeSwitch(LightThemeSwitchers);
    dynamicPrimaryColor(dynamicPrimaryLight);
    dynamicPrimaryBackground(dynamicBackground);

    localStorageBackup();
        
})();

function localStorageBackup() {
    'use strict'

    // if there is a value stored, update color picker and background color
    // Used to retrive the data from local storage
    if (localStorage.slicaprimaryColor) {
        document.getElementById('colorID').value = localStorage.slicaprimaryColor;
        document.querySelector('html').style.setProperty('--primary-bg-color', localStorage.slicaprimaryColor);
        document.querySelector('html').style.setProperty('--primary-bg-hover', localStorage.slicaprimaryHoverColor);
        document.querySelector('html').style.setProperty('--primary-bg-border', localStorage.slicaprimaryBorderColor);
    }

    if (localStorage.slicabgColor) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        document.body.classList.remove('light-menu');
        document.body.classList.remove('dark-menu');
        document.body.classList.remove('color-menu');
        document.body.classList.remove('light-header');
        document.body.classList.remove('dark-header');
        document.body.classList.remove('color-header');
        $('#myonoffswitch2').prop('checked', true);
        $('#myonoffswitch1').prop('checked', false);
        $('#myonoffswitch5').prop('checked', true);
        $('#myonoffswitch8').prop('checked', true);
        document.getElementById('bgID').value = localStorage.slicathemeColor;
        document.querySelector('html').style.setProperty('--dark-body', localStorage.slicabgColor);
        document.querySelector('html').style.setProperty('--dark-theme', localStorage.slicathemeColor);
    }

    if(localStorage.slicalightMode){
        document.querySelector('body')?.classList.add('light-mode');
		document.querySelector('body')?.classList.remove('dark-mode');
        $('#myonoffswitch1').prop('checked', true);
        $('#myonoffswitch3').prop('checked', true);
        $('#myonoffswitch6').prop('checked', true);
    }

    if(localStorage.slicadarkMode){
        document.querySelector('body')?.classList.remove('light-mode');
		document.querySelector('body')?.classList.add('dark-mode');
        $('#myonoffswitch2').prop('checked', true);
        $('#myonoffswitch5').prop('checked', true);
        $('#myonoffswitch8').prop('checked', true);
    }

    if(localStorage.slicahorizontal){
        document.querySelector('body').classList.add('horizontal')
    }

    if(localStorage.slicahorizontalHover){
        document.querySelector('body').classList.add('horizontal-hover')
    }

    if(localStorage.slicartl){
        document.querySelector('body').classList.add('rtl')
    }

    if(localStorage.slicaclosedmenu){
        document.querySelector('body').classList.add('closed-menu')
    }

    if(localStorage.slicaicontextmenu){
        document.querySelector('body').classList.add('icontext-menu')
    }

    if(localStorage.slicasideiconmenu){
        document.querySelector('body').classList.add('sideicon-menu')
    }

    if(localStorage.slicahoversubmenu){
        document.querySelector('body').classList.add('hover-submenu')
    }

    if(localStorage.slicahoversubmenu1){
        document.querySelector('body').classList.add('hover-submenu1')
    }

    if(localStorage.slicadoublemenu){
        document.querySelector('body').classList.add('double-menu')
    }

    if(localStorage.slicadoublemenutabs){
        document.querySelector('body').classList.add('double-menu-tabs')
    }

    if(localStorage.slicadefaultlogo){
        document.querySelector('body').classList.add('default-logo')
    }

    if(localStorage.slicacenterlogo){
        document.querySelector('body').classList.add('center-logo')
    }

    if(localStorage.slicabodystyle){
        document.querySelector('body').classList.add('body-style1')
    }

    if(localStorage.slicaboxedwidth){
        document.querySelector('body').classList.add('layout-boxed')
    }

    if(localStorage.slicascrollable){
        document.querySelector('body').classList.add('scrollable-layout')
    }

    if(localStorage.slicalightmenu){
        document.querySelector('body').classList.add('light-menu')
    }

    if(localStorage.slicacolormenu){
        document.querySelector('body').classList.add('color-menu')
    }

    if(localStorage.slicadarkmenu){
        document.querySelector('body').classList.add('dark-menu')
    }

    if(localStorage.slicalightheader){
        document.querySelector('body').classList.add('light-header')
    }

    if(localStorage.slicacolorheader){
        document.querySelector('body').classList.add('color-header')
    }

    if(localStorage.slicadarkheader){
        document.querySelector('body').classList.add('dark-header')
    }
}

// triggers on changing the color picker
function changePrimaryColor() {
    'use strict'
    checkOptions();

    var userColor = document.getElementById('colorID').value;
    localStorage.setItem('slicaprimaryColor', userColor);
    // to store value as opacity 0.95 we use 95
    localStorage.setItem('slicaprimaryHoverColor', userColor + 95);
    localStorage.setItem('slicaprimaryBorderColor', userColor);

    names()
}

function changeBackgroundColor() {

    var userColor = document.getElementById('bgID').value;
    localStorage.setItem('slicabgColor', userColor + 'dd');
    localStorage.setItem('slicathemeColor', userColor);
    names();

    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    document.body.classList.remove('light-menu');
    document.body.classList.remove('dark-menu');
    document.body.classList.remove('color-menu');
    document.body.classList.remove('light-header');
    document.body.classList.remove('dark-header');
    document.body.classList.remove('color-header');
    $('#myonoffswitch2').prop('checked', true);
    $('#myonoffswitch1').prop('checked', false);
    $('#myonoffswitch5').prop('checked', true);
    $('#myonoffswitch8').prop('checked', true);
}


// to check the value is hexa or not
const isValidHex = (hexValue) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hexValue)

const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, "g"))
    // convert hex value to 256
const convertHexUnitTo256 = (hexStr) => parseInt(hexStr.repeat(2 / hexStr.length), 16)
    // get alpha value is equla to 1 if there was no value is asigned to alpha in function
const getAlphafloat = (a, alpha) => {
        if (typeof a !== "undefined") { return a / 255 }
        if ((typeof alpha != "number") || alpha < 0 || alpha > 1) {
            return 1
        }
        return alpha
    }
    // convertion of hex code to rgba code 
function hexToRgba(hexValue, alpha) {
    'use strict'

    if (!isValidHex(hexValue)) { return null }
    const chunkSize = Math.floor((hexValue.length - 1) / 3)
    const hexArr = getChunksFromString(hexValue.slice(1), chunkSize)
    const [r, g, b, a] = hexArr.map(convertHexUnitTo256)
    return `rgba(${r}, ${g}, ${b}, ${getAlphafloat(a, alpha)})`
}


let myVarVal

function names() {
    'use strict'

    let primaryColorVal = getComputedStyle(document.documentElement).getPropertyValue('--primary-bg-color').trim();

    //get variable
    myVarVal = localStorage.getItem("slicaprimaryColor")  || primaryColorVal;


    // index1 charts
    if(document.querySelector('#AreaChart1') !== null){
        index1();
    }

    if(document.querySelector('#salesStats') !== null){
        salesStats();
    }

    if(document.querySelector('#customerStats') !== null){
        customerStats();
    }

    if(document.querySelector('#circle1') !== null){
        circle();
    }

    // if(document.querySelector('#newusers') !== null){
    //     newusers();
    // }

    // index2 charts
    if(document.querySelector('#chart') !== null){
        project();
    }

    if(document.querySelector('#stacked-bar') !== null){
        stackedbar();
    }

    if(document.querySelector('#countrysales') !== null){
        countrySales();
    }

    // index3 charts
    if(document.querySelector('#crypto') !== null){
        crypto();
    }

    if(document.querySelector('#echart-1') !== null){
        echart1();
    }

    // index4 charts
    if(document.querySelector('#active-users') !== null){
        activeUsers();
    }

    if(document.querySelector('#devices') !== null){
        devices();
    }

    // index5 charts
    if(document.querySelector('#profits') !== null){
        profits();
    }

    if(document.querySelector('#leads') !== null){
        leads();
    }



    let colorData1 = hexToRgba(myVarVal || primaryColorVal , 0.1)
    document.querySelector('html').style.setProperty('--primary-1', colorData1);

    let colorData2 = hexToRgba(myVarVal || primaryColorVal , 0.2)
    document.querySelector('html').style.setProperty('--primary-2', colorData2);

    let colorData3 = hexToRgba(myVarVal || primaryColorVal , 0.3)
    document.querySelector('html').style.setProperty('--primary-3', colorData3);

    let colorData4 = hexToRgba(myVarVal || primaryColorVal , 0.4)
    document.querySelector('html').style.setProperty('--primary-4', colorData4);

    let colorData5 = hexToRgba(myVarVal || primaryColorVal , 0.5)
    document.querySelector('html').style.setProperty('--primary-5', colorData5);

    let colorData6 = hexToRgba(myVarVal || primaryColorVal , 0.6)
    document.querySelector('html').style.setProperty('--primary-6', colorData6);

    let colorData7 = hexToRgba(myVarVal || primaryColorVal , 0.7)
    document.querySelector('html').style.setProperty('--primary-7', colorData7);

    let colorData8 = hexToRgba(myVarVal || primaryColorVal , 0.8)
    document.querySelector('html').style.setProperty('--primary-8', colorData8);

    let colorData9 = hexToRgba(myVarVal || primaryColorVal , 0.9)
    document.querySelector('html').style.setProperty('--primary-9', colorData9);

    let colorData05 = hexToRgba(myVarVal || primaryColorVal , 0.05)
    document.querySelector('html').style.setProperty('--primary-05', colorData05);

}

names()

