function getCookie(cname) {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');

    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();

    d.setTime(d.getTime() + (exdays*24*60*60*1000));

    const expires = "expires="+ d.toUTCString();

    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const cookieBanner = document.querySelector('#cookie-banner');
const hasCookieConsent = getCookie('cookies-consent');

if (!hasCookieConsent) {
    cookieBanner.classList.remove('hidden');
}

const consentCta = cookieBanner.querySelector('#consent-cookies');

consentCta.addEventListener('click', () => {
    cookieBanner.classList.add('hidden');
    setCookie('cookies-consent', 1, 365);
});

window.transitionToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href
    }, 300)
}

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
})

window.addEventListener("beforeunload", function(event) {
	document.querySelector('body').style.opacity = 0
});

window.onunload = function(){}; 