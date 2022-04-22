'use strict';

///////////////////////////////////////
// Modal window
const btnScroll=document.querySelector('.btn--scroll-to');
const sect1=document.querySelector('#section--1');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabsContent=document.querySelectorAll('.operations__content');
//we select the tabs container to be able to addEventListener efficiently
const tabsContainer=document.querySelector('.operations__tab-container')
const tabs=document.querySelectorAll('.operations__tab');
const nav=document.querySelector('.nav');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
}); 
//////////////////////////////////////////////////////
//page navigation
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
//I'll check if the event really has the "nav__link" class
if(e.target.classList.contains('nav__link')){
  const id=e.target.getAttribute('href');
  document.querySelector(id).scrollIntoView({behavior:'smooth'});
};
});
//////////////////////////////////////////////////////
//tabed component
tabsContainer.addEventListener('click',function(e){
// the problem here when I click on the number  01 or 02 or 03 it will return the span 
//but whatever I wanna click on I wanna get the button element to do this I will use closest method

const clicked=e.target.closest('.operations__tab');

//the second problem is I have attached the event handler to the conatiner right!! what if I click on the conatanier
// what will happen??  const clicked=e.target.closest('.operations__tab'); the clicked will be null why??
//coz I ve clicked on the conatainer so the contaner wiil be the e.target an dwhen closest method search on ".operations__tab"
//it won't find it the stack remmember so how can I prevent that ??
//so the clicked will be null right so 
if(!clicked) {return};
//I ll remove the active class from all the tabs before adding it to the the clicked element
tabs.forEach(tab=>tab.classList.remove('operations__tab--active'));
clicked.classList.add('operations__tab--active');
tabsContent.forEach(content=>content.classList.remove('operations__content--active'));
//or I can do this clicked.dataset.tab
document.querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`).classList.add('operations__content--active');







})
// fade animation //////////////////////////////////////////////////////////////////////
const handleHover=function(e,opacity){
  if(e.target.classList.contains('nav__link')){
    const link=e.target;
    const siblings=link.closest('.nav').querySelectorAll('.nav__link');
    const logo=link.closest('.nav').querySelector('img');
    siblings.forEach(el=>{
      if(el!==link){
        el.style.opacity=this;
      }
    }
    );
    logo.style.opacity=this;
  }
}
//the problem that I ve encountered : I cannot send the event like this 
// nav.addEventListener('mouseover',handleHover(e,0.5)) it won't work

// nav.addEventListener('mouseover',function(e){
//   handleHover(e,0.5);
// });

// nav.addEventListener('mouseout',function(e){
 //handleHover(e,1);});

// I can improve my code to looks like a pro we ll use bind method
nav.addEventListener('mouseover',handleHover.bind(0.5));
nav.addEventListener('mouseout',handleHover.bind(1));

//nav stiky ////////////////////////////////////////////////////////////////
// const initCoor=sect1.getBoundingClientRect();
// console.log(initCoor);
//  window.addEventListener('scroll',function(){
//    console.log(window.scrollY);
//    if(window.scrollY>initCoor.top){
//    nav.classList.add('sticky')}
//    else{nav.classList.remove('sticky');}
//  });
 //nav Sticky with the intersection api ///////////////////////////////////
// const obsCallBack=function(entries,observer){
// entries.forEach(entry=>console.log(entry));
// };
// const obsOptions={
//   root: null, //with what the tagert will intersect
//  threshold: 0.1 //the percentage of intersection
// };
//  const observer=new IntersectionObserver(obsCallBack,obsOptions)
// observer.observe(sect1);//observing the target which is the section 1
const header=document.querySelector('.header');
const navHeight=nav.getBoundingClientRect().height;
const obsOptions={
  root:null, // it's the viewport
  threshold:0,
  rootMargin:`-${navHeight}px`,
};
const stickyCallBack=function(entries){
  const [entry]=entries; //we ve destructed the array
  (!entry.isIntersecting)?nav.classList.add('sticky'):nav.classList.remove('sticky');
}
const observer=new IntersectionObserver(stickyCallBack,obsOptions);
observer.observe(header);


//////////////////////////////////////////////////////////////////////////
//Reveal Sections
const callBack=function(entries,observerSection){
  const [entry]=entries;
  if(!entry.isIntersecting) return //why we do this because observer will trigger this function by default at the begining
  entry.target.classList.remove('section--hidden');
  //now after we do the work we have stop the observer from observing that is helpful for the performance
  observerSection.unobserve(entry.target);


};

const observerSection=new IntersectionObserver(callBack,
  {root:null,
threshold:0.15});

const allSections=document.querySelectorAll('.section');
allSections.forEach(function(section){
  observerSection.observe(section);
  //section.classList.add('section--hidden');
});


////////////////////////////////////////////////////////////////////////////
//Lazy Loading Images //////////

const imagesTargets=document.querySelectorAll('img[data-src]');
const lazyLoading=function(entries,observer){
const [entry]=entries;
if(!entry.isIntersecting) return;
entry.target.src=entry.target.dataset.src;    //here an assignment happened
//here I will listen to the loading of the image from the local to the browser
entry.target.addEventListener('load',function(){
  entry.target.classList.remove('lazy-img');
});
observer.unobserve(entry.target);
}
const imagesTargetsObserver=new IntersectionObserver(lazyLoading,{root:null,threshold:1});
imagesTargets.forEach(img=>
imagesTargetsObserver.observe(img));

///////////////////////////////////////////////////////////////////////////
//Building slides
///Refactore our code  we did all this code why to implement the slider just
const sliders=function(){
const slides=document.querySelectorAll('.slide');
const slider=document.querySelector('.slider');
const btnRight=document.querySelector('.slider__btn--right');
const btnLeft=document.querySelector('.slider__btn--left');
const dotConatainer=document.querySelector('.dots'); // selecting the dots container why?? to insert the dot button dynamicaly
let curSlide=0;
const maxSlides=slides.length; //to know where the next button on the slides should stop



/////Functions /////////////////////////////////////
const init=function(){
  goToSlide(0);
  createDots();
  activeDot(0) //to look active when we reload the page
};

const createDots=function(){
  slides.forEach((_,i)=>dotConatainer.insertAdjacentHTML('beforeend',
  `<button class="dots__dot" data-slide="${i}"> </button>`)
  );
};

const activeDot=function(slide){
document.querySelectorAll('.dots__dot').forEach(dot=>dot.classList.remove('dots__dot--active'));
document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
};

const goToSlide=function(slide){
  slides.forEach((s,i)=>s.style.transform=`translateX(${100 * (i-slide)}%)`);
};

const nextSlide=function(){
  if(curSlide===(maxSlides-1)){
    curSlide=0;
  }else{
    curSlide++;
  }
  goToSlide(curSlide);
  activeDot(curSlide);
  
};
const prevSlide=function(){
if(curSlide===0){curSlide=maxSlides-1;}
else{curSlide--;};
goToSlide(curSlide);
activeDot(curSlide);
};

init();
//Event handlers////////////////

btnLeft.addEventListener('click',prevSlide);
btnRight.addEventListener('click',nextSlide);
//I ll listen to the keyboard events to implement the arrow left and arrow right
document.addEventListener('keydown',function(e){
  (e.key=='ArrowLeft') && prevSlide();
  (e.key==='ArrowRight') && nextSlide();
});
//listen to the dots

dotConatainer.addEventListener('click',function(e){

if(e.target.classList.contains('dots__dot')) {
  // i could use this   e.target.getAttribute('data-slide');
//  dots.forEach(dot=>{
//      if(dot!==e.target) {                                   //this logic I'll repeat it 
//       dot.classList.remove('dots__dot--active')}});         // in all the arrowLeft && the arrowRight
//      e.target.classList.add('dots__dot--active');           // and the button left && button right
    const {slide}=e.target.dataset;                          // so I need to think for a function to do this
    activeDot(slide);
   //or you can destruct it directly why because the dataset return an object of datset with a properties 
    goToSlide(slide);

  // I all add the class of the active dot 

};


});
};
sliders();

// slider.style.transform=`scale(0.5)`;
// slider.style.overflow=`visible`;

/*
document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click',function(e){
    e.preventDefault();
    const id=el.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  })
})*/


console.log(document.documentElement);

const head=document.querySelector('.header');
console.log(document.body);

const message=document.createElement('div');

message.classList.add('cookie-message');

message.innerHTML='we use cookies to improve analytics <button class="btn btn--close--cookie">Got it !</button>';
head.prepend(message);


document.querySelector('.btn--close--cookie').addEventListener('click',function(){
message.remove();


});

const logo=document.querySelector('.nav__logo');

console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);



logo.alt="graichi brahim";
console.log(logo.alt);

//I can create an attribute
logo.setAttribute('graichi','brahim');
console.log(logo.graichi);
console.log(logo);





btnScroll.addEventListener('click',function(e){

  //getBoundingClientRect() gives you the coordinates of your element
const btnCoor=btnScroll.getBoundingClientRect();
const secCoor=sect1.getBoundingClientRect();
console.log(btnCoor);
console.log(secCoor);

//the coordinates of the current scrolling
console.log('current scrolling : ',window.pageXOffset,window.pageYOffset);
//to get the width and height of the document

console.log(document.documentElement.clientHeight,document.documentElement.clientWidth);

//I will implement the scrolling To
//the smooth scrolling we neead to pass an object like this 
window.scrollTo(
  {
    left:secCoor.left,top:
    secCoor.top+window.pageYOffset,
    behavior:'smooth'});

});
/*
const h1=document.querySelector('h1');
const alertEventHandler=function(e){
  alert('you re reading the heading');
  
  //and we remove this event 
  h1.removeEventListener('mouseenter',alertEventHandler);
  
  };
h1.addEventListener('mouseenter',alertEventHandler);

// Bubbling event
const randomInt=(min,max)=>Math.floor(Math.random()*(max-min+1)+min);
const randomColor=()=>`rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;
 // e.Target says to us where the event is originated

document.querySelector('.nav__link').addEventListener('click',function(e){
  this.style.backgroundColor=randomColor();
  console.log(e.currentTarget);

});
document.querySelector('.nav__links').addEventListener('click',function(e){
  this.style.backgroundColor=randomColor();
  console.log(e.target);
  console.log(e.currentTarget);

});
//listen in Capturing phase we add the third parameter ,true 
document.querySelector('.nav').addEventListener('click',function(e){
  this.style.backgroundColor=randomColor();
  console.log(e.target);
  console.log(e.currentTarget);

},true);

//selecting the children && parents of  an element//////////////////////////////////////////

console.log(document.querySelector('h1').children);
console.log(document.querySelector('h1').childNodes);
document.querySelector('h1').firstElementChild.style.color='white';
document.querySelector('h1').lastElementChild.style.color='orangered';

console.log(document.querySelector('h1').parentNode);
console.log(document.querySelector('h1').parentElement);


//now I 'll select the closest parent element
document.querySelector('h1').closest('.header').style.background='var(--gradient-secondary)';

*/