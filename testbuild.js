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
    check: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="21px" height="21px" viewBox="0 0 20 20" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">        <g transform="translate(-646, -200)"><g transform="translate(100, 100)"><g transform="translate(544, 98)">                    <g><polygon points="0 0 24 0 24 24 0 24"/><path d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M9.29,16.29 L5.7,12.7 C5.31,12.31 5.31,11.68 5.7,11.29 C6.09,10.9 6.72,10.9 7.11,11.29 L10,14.17 L16.88,7.29 C17.27,6.9 17.9,6.9 18.29,7.29 C18.68,7.68 18.68,8.31 18.29,8.7 L10.7,16.29 C10.32,16.68 9.68,16.68 9.29,16.29 Z" fill="#26bd7e"/></g></g></g></g></g></svg>`,
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
  a(cont,[['id','local_political_search_cont'],['style',`position: fixed; top: ${rect.top}px; left: ${rect.left}px; z-index: ${new Date().getTime()}; width: ${rect.width}px; background: transparent; font-size: 12px;`]]);
  document.body.appendChild(cont);

  var head = ele('div');
  a(head, [    ['style', `font-size: 1.2em; display: grid; grid-template-columns: 1fr 29px; width: 100%; background: #0a1114; border: 1.6px solid #0a1114; border-top-left-radius: 0.4em; border-top-right-radius: 0.4em; cursor: move;`]  ]);
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
  a(cbod, [['style', `display: grid; grid-template-columns: ${Math.floor(rect.width*.33)}px ${Math.floor(rect.width*.66)}px; grid-gap: 5px; background: #122026; padding 6px;`]]);
  cont.appendChild(cbod);

  var search_cont = ele('div');
  a(search_cont,[['style',`display: grid; grid-template-rows: 36px 36px; grid-gap: 5px; padding: 6px;`]]);
  cbod.appendChild(search_cont);
  
  var zip_search = ele('input');
  a(zip_search,[['id','zip_code_search_input'],['placeholder','Zip-Code'],['maxlength','5'],['style',`font-size: 1.2em; padding: 6px; border: 1px solid #fff; border-radius: .4em; background: #fff; width: 100%;`]]);
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
  a(sel_all,[['selection','none'],['style','width: 5ch; box-shadow: -2px -2px 0.5px 0.5px #172b33; border: 1px solid transparent; border-radius: .2em; background: #122026; color: #fff; cursor: pointer']]);
  opt_cont.appendChild(sel_all);
  sel_all.innerText = 'none';
  sel_all.onclick = selectAllOptions;

  type_options.forEach(t=> createOptionTypeCard(t,opt_cont));
  
  var search_btn = ele('div');
  a(search_btn,[['style',`text-align: center; font-size: 1.3em; padding: 6px; border: 1px solid #transparent; border-radius: .4em; background: #26bd7e; color: #fff; width: 100%; cursor: pointer;`]]);
  search_cont.appendChild(search_btn);
  search_btn.onclick = initBallotSearch;
  search_btn.innerText = 'Search';
}

async function initBallotSearch(){
  var zip = gi(document,'zip_code_search_input').value;
  if(zip && /\d{5}/.test(zip)){
   this.innerText = 'Searching...';
    var types = Array.from(cn(document,'type_data_objects')).filter(t=> t.getAttribute('selection') == 'on').map(t=> t.getAttribute('type'))
    var search_obj = { zip: zip, options: { types: types} };
    await searchBallotBy(search_obj,fileArray);
    this.innerText = 'Search';
  }else{
    alert('please enter a valid zipcode, asshole.');
  }
}

function createOptionTypeCard(d,ref){
  var cont = ele('div');
  a(cont,[['style',`display: grid; grid-template-columns: 30px 1fr; grid-gap: 4px;`]]);
  ref.appendChild(cont);

  var check = ele('div');
  a(check,[['class','type_data_objects'],['type',d],['selection','on'],['style',`cursor: pointer;`]])
  cont.appendChild(check);
  check.innerHTML = svgs.check;
  check.onclick = typeOptionSelector;

  var text = ele('div');
  a(text,[['style',`background: #122026; font-size: 1.3em; color: #fff; padding 6px; tranistion: all 1s;`]]);
  cont.appendChild(text);
  text.innerText = d;
}

function selectAllOptions(){
  var selection = this.getAttribute('selection');
  if(selection == 'all'){
     Array.from(cn(document,'type_data_objects')).forEach(r=> {
       a(tn(r,'path')[0],[['fill','#26bd7e']]);
       a(r,[['selection','on']]);
     });
     a(this,[['selection','none']]);
     this.innerText = 'none';
  }else{
     Array.from(cn(document,'type_data_objects')).forEach(r=> {
       a(tn(r,'path')[0],[['fill','#e21212']]);
       a(r,[['selection','off']]);
     });
     a(this,[['selection','all']]);
     this.innerText = 'all';
  }
}

function typeOptionSelector(){
  var selection = this.getAttribute('selection');
  if(selection == 'on'){
    a(tn(this,'path')[0],[['fill','#e21212']]);
    a(this,[['selection','off']]);
  }else{
    a(tn(this,'path')[0],[['fill','#26bd7e']]);
    a(this,[['selection','on']]);
  }
}
createLocalPoliticsSearchHTML()

