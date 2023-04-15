const scriptPath = document.currentScript.src.replace('index.js', '');

// document.addEventListener('DOMContentLoaded', init);

const navSlide = () => {
    const ham = document.querySelector('.ham');
    const nav = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    ham.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        links.forEach((link, idx) => {
            link.style.animation = link.style.animation ? '' : `fade 0.5s ease-in forwards ${idx / 6 + 0.5}s`;
        });
        ham.classList.toggle('trigger');
    });
}



const slideText = () => {
    const quotes = document.querySelectorAll('.quote');
    quotes[0].classList.add('active-quote');
    let i = 0;
    setInterval(() => {
        quotes[i].classList.remove('active-quote');
        i++;
        if (i >= quotes.length) {
            i = 0;
        }
        quotes[i].classList.add('active-quote');
    }, 5 * 1000);
}


const heroBG = (numberOfBGs) => {
    const bg = document.querySelector('.home-background');
    let i = 0;
    bg.classList.add(`background${i}`);
    setInterval(() => {
        bg.classList.remove(`background${i}`);
        i++;
        if (i >= numberOfBGs) {
            i = 0;
        }
        bg.classList.add(`background${i}`);
    }, 8 * 1000);

    // adding background video on load
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (isLandscape) {
        const video = document.createElement('video');
        video.classList.add('header_background_video');
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        const source = document.createElement('source');
        source.src = `${scriptPath}../assets/videos/video_360_c.mp4`;
        source.type = 'video/mp4';
        video.appendChild(source);
        video.load();
        video.oncanplaythrough = function () {
            bg.appendChild(video);
        };
    }
}

const loadMenu = () => {
    fetch(`${scriptPath}../data/menu.json`)
        .then(response => response.json())
        .then(menu => {
            menu.forEach(category => {
                const {
                    title,
                    abbreviation: abbr,
                    emoji,
                    items
                } = category;
                const menuContent = document.querySelector(`.${abbr}-section > .menu-container > .menu-content`);
                const contentHeading = document.createElement('h1');
                contentHeading.innerHTML = `${title} <span>${emoji}</span>`;
                menuContent.appendChild(contentHeading);
                const list = document.createElement('ul');
                items.forEach(item => {
                    const listItem = document.createElement('li');
                    const itemTitle = document.createElement('h2');
                    itemTitle.innerText = item.title;
                    const itemDescription = document.createElement('p');
                    itemDescription.innerText = item.description;
                    listItem.appendChild(itemTitle);
                    listItem.appendChild(itemDescription);
                    list.appendChild(listItem);
                });
                menuContent.appendChild(list);
            });
        })
        .catch(err => console.log(err));
}

function initMap() {
    fetch(`${scriptPath}../data/map_styles.json`)
        .then(response => response.json())
        .then(styles => {
            const map = new google.maps.Map(document.getElementById("map"), {
                center: {
                    lat: 23.221787856849705,
                    lng: 77.43922306318788
                },
                // mapId: 'eaa3f8762d750c2d',
                scrollwheel: 0,
                scaleControl: 1,
                draggable: 1,
                panControl: 1,
                streetViewControl: 0,
                mapTypeControl: false,
                styles: styles['light']
            });
            const markersData = [{
                    title: "Hoshangabad Road",
                    lat: 23.181604802533037,
                    lng: 77.45629591969394,
                    address: "Shop No.: 6, A Block, Surendra Landmark"
                },
                {
                    title: "Kolar Road",
                    lat: 23.183796997510427,
                    lng: 77.41750618416212,
                    address: "No 03, Mandakini Housing Society"
                },
                {
                    title: "MP Nagar",
                    lat: 23.232993449309767,
                    lng: 77.43153937710215,
                    address: "R-53, In front of DB City - Mall, Zone-II"
                },
                {
                    title: "Indrapuri",
                    lat: 23.250368282790006,
                    lng: 77.46591135356374,
                    address: "Service Rd, Jubali Gate, Sector C"
                },
                {
                    title: "New Market",
                    lat: 23.2328422837375,
                    lng: 77.40377246508328,
                    address: "Unit no. SA 101, A wing, Shrishti C.B.D, Gammon Square"
                }
            ];
            const i = new google.maps.LatLngBounds();
            const r = new google.maps.InfoWindow();
            markersData.forEach((markerData, idx) => {
                const position = new google.maps.LatLng(markerData.lat, markerData.lng);
                i.extend(position);
                const marker = new google.maps.Marker({
                    position,
                    map,
                    title: markerData.title,
                    icon: `${scriptPath}../assets/img/pin_light_small.png`
                });
                google.maps.event.addListener(
                    marker,
                    "click",
                    (function (e, t) {
                        return function () {
                            r.setContent(`<div>${t.title}</div><span>${t.address}</span>`);
                            r.open(map, e);
                        };
                    })(marker, markerData));
                map.fitBounds(i);
            });

            const p = google.maps.event.addListener(map, "bounds_changed", function () {
                this.setZoom(13.2);
                google.maps.event.removeListener(p);
            });
        });
}

const parallex = (selector, speed) => {
    const element = document.querySelector(selector);
    const posY = element.getBoundingClientRect().top;
    window.addEventListener("scroll", () => {
        element.style.transform = `translateY(${(window.scrollY - posY) * speed}px)`;
        element.style.transition = `1.5s all ease`;
    });
}

const executeHomeFunctions = () => {
    slideText();
    heroBG(4);
}

const executeMenuFunctions = () => {
    loadMenu();
}

const executeContactFunctions = () => {
    parallex('.salad', 0.09);
}

const executeDisclaimerFunctions = () => {
    parallex('.beetroot', 0.09);
}

const executeAboutFunctions = () => {
    parallex('.grapes', 0.09);
}

const executePrivacyFunctions = () => {
    parallex('.coconut', 0.1);
    parallex('.pumpkin', -0.1);
}

const home = document.querySelector('body.home');
if (home) {
    home.onload = executeHomeFunctions;
}

const menu = document.querySelector('body.menu');
if (menu) {
    menu.onload = executeMenuFunctions;
}

const contact = document.querySelector('body.contact');
if (contact) {
    contact.onload = executeContactFunctions;
}

const disclaimer = document.querySelector('body.disclaimer_attribute');
if (disclaimer) {
    disclaimer.onload = executeDisclaimerFunctions;
}

const about_us = document.querySelector('body.about');
if (about_us) {
    about_us.onload = executeAboutFunctions;
}

const privacy = document.querySelector('body.privacy');
if (privacy) {
    privacy.onload = executePrivacyFunctions;
}

if (document.querySelector('.ham')) {
    navSlide()
};


setTimeout(function () {
    const es = document.querySelector('a.eapps-link');
    es.remove();
}, 2000);