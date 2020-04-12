/*
requires zipcode JSON file uploaded and named variable as "fileArray"
*/
var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var rando = (n) => Math.round(Math.random() * n);
var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);
var a = (l, r) => r.forEach(a => attr(l, a[0], a[1]));
var unqHsh = (a,o) => a.filter(i=> o.hasOwnProperty(i) ? false : (o[i] = true));

async function getRepsByLatLng(obj){
  var res = await fetch(`https://api4.ballotpedia.org/elected_officials?long=${obj.lng}&lat=${obj.lat}`);
  if(res.status == 200){
    var d = await res.json();
    var districts = d && d.data && d.data.filter(r=> r.elected_officials).length && d.data.filter(r=> r.elected_officials)[0].elected_officials && d.data.filter(r=> r.elected_officials)[0].elected_officials.districts ? d.data.filter(r=> r.elected_officials)[0].elected_officials.districts : [];
    return districts;
  }else{
    return {};
  }
}

function getLatLngByZip(zip,file_ref){
  var coord = fileArray.filter(z=> z.zip == zip);
  return coord[0] ? coord[0] : null;
}

async function searchBallotBy(obj, file_ref){
  var options = obj.options;
  var coord = getLatLngByZip(obj.zip, file_ref);
  console.log(['coord',coord]);
  if(coord){
   var res = await getRepsByLatLng(coord);
   var filtered = options && options.types && options.types.length ? res.filter( f=> options.types.some( t=> new RegExp(t.replace(/\W+/g,'\\W+'),'i').test(f.type) ) ) : res;
   console.log(filtered);
   console.log(res);
  }else{
   console.log('you are a failure');
  }
}


var svgs = {
    close: `<svg x="0px" y="0px" viewBox="0 0 100 100"><g style="transform: scale(0.85, 0.85)" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(2, 2)" stroke="#e21212" stroke-width="8"><path d="M47.806834,19.6743435 L47.806834,77.2743435" transform="translate(49, 50) rotate(225) translate(-49, -50) "/><path d="M76.6237986,48.48 L19.0237986,48.48" transform="translate(49, 50) rotate(225) translate(-49, -50) "/></g></g></svg>`,
    check: `<svg width="10px" height="10px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 80.588 61.158" style="enable-background:new 0 0 80.588 61.158;" xml:space="preserve"><path style="fill:#26bd7e;" d="M29.658,61.157c-1.238,0-2.427-0.491-3.305-1.369L1.37,34.808c-1.826-1.825-1.826-4.785,0-6.611  c1.825-1.826,4.786-1.827,6.611,0l21.485,21.481L72.426,1.561c1.719-1.924,4.674-2.094,6.601-0.374  c1.926,1.72,2.094,4.675,0.374,6.601L33.145,59.595c-0.856,0.959-2.07,1.523-3.355,1.56C29.746,61.156,29.702,61.157,29.658,61.157z  "/></svg>`,
};

  function aninCloseBtn() {
    var l1 = tn(this, 'path')[0];
    var l2 = tn(this, 'path')[1];
    l1.style.transform = "translate(49px, 50px) rotate(45deg) translate(-49px, -50px)";
    l1.style.transition = "all 233ms";
    l2.style.transform = "translate(49px, 50px) rotate(135deg) translate(-49px, -50px)";
    l2.style.transition = "all 233ms";
  }
  
  function anoutCloseBtn() {
    var l1 = tn(this, 'path')[0];
    var l2 = tn(this, 'path')[1];
    l1.style.transform = "translate(49px, 50px) rotate(225deg) translate(-49px, -50px)";
    l1.style.transition = "all 233ms";
    l2.style.transform = "translate(49px, 50px) rotate(225deg) translate(-49px, -50px)";
    l2.style.transition = "all 233ms";
  }
  
  function dragElement() {
    var el = this.parentElement;
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(this.id)) document.getElementById(this.id).onmousedown = dragMouseDown;
    else this.onmousedown = dragMouseDown;
  
    function dragMouseDown(e) {
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      el.style.top = (el.offsetTop - pos2) + "px";
      el.style.left = (el.offsetLeft - pos1) + "px";
      el.style.opacity = "0.85";
      el.style.transition = "opacity 700ms";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      el.style.opacity = "1";
    }
  }

function createLocalPoliticsSearchHTML(){
  if(gi(document,'local_political_search_cont')) gi(document,'local_political_search_cont').outerHTML = '';
  
  var rect = {top: 100, left: 10, width: 600};
  var cont = ele('div');
  a(cont,[['id','local_political_search_cont'],['style',`border-radius: 0.4em; border: 1px solid transparent; position: fixed; top: ${rect.top}px; left: ${rect.left}px; z-index: ${new Date().getTime()}; width: ${rect.width}px; background: transparent; font-size: 12px;`]]);
  document.body.appendChild(cont);

  var head = ele('div');
  a(head, [    ['style', `font-size: 1.2em; display: grid; grid-template-columns: 1fr 29px; width: 100%; background: #122026; border: 1.6px solid transparent; border-top-left-radius: 0.4em; border-top-right-radius: 0.4em; cursor: move; box-shadow: 3px 3px 5px rgb(11, 19, 23,0.6), -3px -3px 5px rgba(25, 47, 56, 0.6);`]  ]);
  cont.appendChild(head);
  head.onmouseover = dragElement;

  var txt = ele('div');
  a(txt, [  ['style', `color: #fff; font-size: 1em; border-radius: 0.5em; padding: 4px;`]  ]);
  head.appendChild(txt);
  txt.innerText = 'Local Search';

  var cls = ele('div');
  a(cls, [    ['style', `width: 34px; height: 34px; cursor: pointer;`]  ]);
  head.appendChild(cls);
  cls.innerHTML = svgs.close;
  cls.onmouseenter = aninCloseBtn;
  cls.onmouseleave = anoutCloseBtn;
  cls.onclick = () => cont.outerHTML = '';

  var cbod = ele('div');
  a(cbod, [['style', `display: grid; grid-template-columns: ${Math.floor(rect.width*.33)}px ${Math.floor(rect.width*.66)}px; grid-gap: 5px; background: #122026; padding 6px; box-shadow: 3px 3px 5px rgb(11, 19, 23,0.6), -3px -3px 5px rgba(25, 47, 56, 0.6);`]]);
  cont.appendChild(cbod);

  var search_cont = ele('div');
  a(search_cont,[['style',`display: grid; grid-template-rows: 36px 36px; grid-gap: 5px; padding: 6px;`]]);
  cbod.appendChild(search_cont);
  
  var zip_search = ele('input');
  a(zip_search,[['id','zip_code_search_input'],['placeholder','Zip-Code'],['maxlength','5'],['style',`font-size: 1.2em; padding: 6px; border: 1px solid transparent; border-radius: .4em; background: transparent; width: 100%; box-shadow: inset 2px 2px 4px rgb(11, 19, 23,0.6), inset -2px -2px 4px    rgba(25, 47, 56, 0.5);`]]);
  search_cont.appendChild(zip_search);

/* 
  TODO: need to loop through all zipcodes and identify all of the possible type options 
  --ballotpedia types--
*/
  var type_options = ['State Legislative (Upper)','State Legislative (Lower)','Country','Congress','State','County','City','School District','Judicial District','County subdivision','Special District']; 

  var opt_cont = ele('div');
  a(opt_cont,[['style',`display: grid; grid-template-rows: auto; grid-gap: 5px; padding: 6px;`]]);
  cbod.appendChild(opt_cont);
  
  var sel_all = ele('div');
  a(sel_all,[['selection','none'],['style','text-align: center; width: 21px; box-shadow: 3px 3px 5px rgb(11, 19, 23,0.6), -3px -3px 5px    rgba(25, 47, 56, 0.5); border: 1px solid transparent; border-radius: .2em; background: #122026; color: #fff; cursor: pointer']]);
  opt_cont.appendChild(sel_all);
  sel_all.innerText = '-';
  sel_all.onclick = selectAllOptions;
  type_options.forEach(t=> createOptionTypeCard(t,opt_cont));
  
  var search_btn = ele('div');
  a(search_btn,[['style',`text-align: center; font-size: 1.3em; padding: 6px; border: 1px solid #transparent; border-radius: .4em; background: transparent; color: #26bd7e; width: 100%; cursor: pointer; box-shadow: 3px 3px 5px rgb(11, 19, 23,0.6), -3px -3px 5px    rgba(25, 47, 56, 0.7);`]]);
  search_cont.appendChild(search_btn);
  search_btn.onclick = initBallotSearch;
  search_btn.innerText = 'Search';
}

async function initBallotSearch(){
  var zip = gi(document,'zip_code_search_input').value;
  if(zip && /\d{5}/.test(zip)){
   this.innerText = 'Searching...';
    var types = Array.from(cn(document,'type_data_objects')).filter(t=> t.getAttribute('selection') == 'on').map(t=> t.getAttribute('type'))
console.log(types)
    var search_obj = { zip: zip, options: { types: types} };
    await searchBallotBy(search_obj,fileArray);
    this.innerText = 'Search';
  }else{
    alert('please enter a valid zipcode, asshole.');
  }
}

function createOptionTypeCard(d,ref){
  var cont = ele('div');
  a(cont,[['style',`display: grid; grid-template-columns: 21px 1fr; grid-gap: 4px; transition: all 111ms;`]]);
  ref.appendChild(cont);

  var check = ele('div');
  a(check,[['class','type_data_objects'],['type',d],['selection','on'],['style',`text-align: center; width: 18px; height: 18px; box-shadow: 3px 3px 5px rgb(11, 19, 23,0.6), -3px -3px 5px rgba(25, 47, 56, 0.5); border: 1px solid transparent; border-radius: .2em; background: #122026; color: #fff; cursor: pointer;`]]);
  cont.appendChild(check);
  check.innerHTML = svgs.check;
  check.onclick = typeOptionSelector;

  var text = ele('div');
  a(text,[['style',`background: #122026; font-size: 1em; color: #fff; padding 6px; tranistion: all 1s;`]]);
  cont.appendChild(text);
  text.innerText = d;
}

function selectAllOptions(){
  var selection = this.getAttribute('selection');
  if(selection == 'all'){
     Array.from(cn(document,'type_data_objects')).forEach(r=> {
       r.innerHTML = svgs.check;
       r.style.boxShadow = '3px 3px 5px rgb(11, 19, 23,0.6), -3px -3px 5px    rgba(25, 47, 56, 0.5)';
       r.onmouseenter = ()=> {};
       r.onmouseleave = ()=> {};
       a(r,[['selection','on']]);
     });
     a(this,[['selection','none']]);
     this.style.boxShadow = '3px 3px 5px rgb(11, 19, 23,0.6), -3px -3px 5px    rgba(25, 47, 56, 0.5)';
     this.innerText = '-';
  }else{
     Array.from(cn(document,'type_data_objects')).forEach(r=> {
       r.innerHTML = svgs.close;
       r.style.boxShadow = 'inset 2px 2px 4px rgb(11, 19, 23,0.6), inset -2px -2px 4px    rgba(25, 47, 56, 0.5)';
       r.onmouseenter = aninCloseBtn;
       r.onmouseleave = anoutCloseBtn;
       a(r,[['selection','off']]);
     });
     a(this,[['selection','all']]);
     this.style.boxShadow = 'inset 2px 2px 4px rgb(11, 19, 23,0.6), inset -2px -2px 4px    rgba(25, 47, 56, 0.5)';
     this.innerText = '+';
  }
}

function typeOptionSelector(){
  var selection = this.getAttribute('selection');
  if(selection == 'on'){
    this.style.boxShadow = 'inset 2px 2px 4px rgb(11, 19, 23,0.6), inset -2px -2px 4px    rgba(25, 47, 56, 0.5)';
    this.innerHTML = svgs.close;
    this.onmouseenter = aninCloseBtn;
    this.onmouseleave = anoutCloseBtn;
    a(this,[['selection','off']]);
  }else{
     this.style.boxShadow = '3px 3px 5px rgb(11, 19, 23,0.6), -3px -3px 5px    rgba(25, 47, 56, 0.5)';
     this.innerHTML = svgs.check;
     this.onmouseenter = ()=> {};
     this.onmouseleave = ()=> {};
    a(this,[['selection','on']]);
  }
}
createLocalPoliticsSearchHTML()
