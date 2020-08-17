window.addEventListener('DOMContentLoaded', function () {

    'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }
    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }
    info.addEventListener('click', function(event){
        let target = event.target;
        if(target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if(target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    // Timer 

    let deadline = '2020-09-01';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60) % 60),
            hours = Math.floor((t/(1000*60*60)));

        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock (id, endtime) {
        let timer = document.getElementById(id), 
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);
            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('timer', deadline);

    //Modal 

    let more = document.querySelector('.more'), 
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function() {
        overlay.style.display = 'block';
        this.classList.add('.more-splash');
        document.body.style.overflow = 'hidden';
    })

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        more.classList.remove('.more-splash');
        document.body.style.overflow = '';
    })

    // Slider

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

    
    showSlides(slideIndex); 

    function showSlides(n){

        if(n > slides.length){
            slideIndex = 1;
        }
        if (n < 1){
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = 'none');
        // for(let i = 0; i < slides.length; i++){
        //     slides[i].style.display = 'none';
        // }
        dots.forEach((item) => item.classList.remove('dot-active'));

        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides (n) {
        showSlides(slideIndex += n);
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', function(){
        plusSlides(-1);
    });

    next.addEventListener('click', function(){
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', function(event){
        for(let i = 0; i < dots.length+1; i++) {
            if(event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });

    //  Form

    let message = {
        loading: `<img src='https://i.gifer.com/8lPR.gif'>, Загрузка...`,
        success: `Спасибо! Скоро мы с вами свяжемся!`,
        failure: `<img src='https://i.gifer.com/Ox9f.gif'>, Что-то пошло нет так...`
    };

    let form = document.querySelector(".main-form"),
        contactForm = document.querySelector("#form"),
        input = document.getElementsByTagName("input"),
        statusMessage = document.createElement("div");

    statusMessage.classList.add("status");

    function sendForm(elem) {
        elem.addEventListener("submit", function (e) {
            e.preventDefault();
            elem.appendChild(statusMessage);

            let formData = new FormData(elem);

            function postData(data) {
                return new Promise(function (resolve, reject) {
                    let request = new XMLHttpRequest();

                    request.open("POST", "server.php");

                    request.setRequestHeader(
                        "Content-Type",
                        "application/json; charset=utf-8"
                    );

                    request.onreadystatechange = function () {
                        if (request.readyState < 4) {
                            resolve();
                        } else if (request.readyState === 4) {
                            if (request.status == 200 && request.status < 3) {
                                resolve();
                                // statusMessage.textContent = message.success;
                            } else {
                                reject();
                            }
                        }
                    };
                    request.send(data);
                });
            } // End postData

            function clearInputs() {
                [...input].forEach(elem => (elem.value = ""));
            }
            postData(formData)
                .then(() => (statusMessage.innerHTML = message.loading))
                .then(() => (statusMessage.innerHTML = message.success))
                .catch(() => (statusMessage.innerHTML = message.failure))
                .then(clearInputs);
        });
    }

    sendForm(form);
    sendForm(contactForm);

    // Validation number phone

    const inputsPhone = document.querySelectorAll('input[name="phone"]'),
        inputsCounter = document.querySelectorAll('.counter-block-input');

    // function onlyNumber(input) {
    //     input.onkeydown = function () {
    //         return (this.value = this.value.replace(/[^0-9]/g, ""));
    //     };
    // }
    function onlyNumber(input) {
        input.onkeydown = function () {
            return (this.value = this.value.replace(/[^0-9]/g, ""));
        };
    }
    [...inputsPhone].forEach(elem => onlyNumber(elem));
    [...inputsCounter].forEach(elem => onlyNumber(elem));

    // Calc 

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        counter = document.querySelector('.counter'),
        personsSum = 0,
        daysSum = 0,
        total = 0;

    totalValue.textContent = 0;

    function calcTotal() {
        let person = +persons.value,
            days = +restDays.value,
            city = +place.value;
        if ((person == '' || days == '') || (person == 0 || days == 0)) {
            totalValue.textContent = 0;
        } else {
            totalValue.textContent = (days + person) * 2000 * city;
        }
    }

    counter.addEventListener('input', function (event) {
        let target = event.target;

        if (target && target.classList.contains('counter-block-input')) {
            calcTotal();
        }
        if (target && target.options) {
            calcTotal();
        }
    });
});