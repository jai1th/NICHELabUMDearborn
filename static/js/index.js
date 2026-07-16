window.HELP_IMPROVE_VIDEOJS = false;

// Light / dark theme toggle. The initial theme is set pre-paint by the inline
// script in <head>; this just flips it and remembers the choice.
function toggleTheme() {
    var root = document.documentElement;
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Left section-nav rail: highlight the section currently in view (scrollspy).
// Clicking a link relies on the anchor + CSS `scroll-behavior: smooth` to scroll.
function setupSectionNav() {
    const navLinks = Array.prototype.slice.call(
        document.querySelectorAll('.section-nav a[href^="#"]')
    );
    if (!navLinks.length) return;

    const sections = [];
    navLinks.forEach(function (link) {
        const section = document.getElementById(link.getAttribute('href').slice(1));
        if (section) sections.push(section);
    });
    if (!sections.length) return;

    function setActive(id) {
        navLinks.forEach(function (link) {
            const active = link.getAttribute('href') === '#' + id;
            link.classList.toggle('is-active', active);
            if (active) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    // A thin band across the vertical middle of the viewport decides the active
    // section: whichever section crosses it is highlighted.
    const observer = new IntersectionObserver(function (entries) {
        let best = null;
        entries.forEach(function (entry) {
            if (entry.isIntersecting &&
                (!best || entry.boundingClientRect.top < best.boundingClientRect.top)) {
                best = entry;
            }
        });
        if (best) setActive(best.target.id);
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });

    // Default to the first section until the observer resolves the real one.
    setActive(sections[0].id);
}

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

$(document).ready(function() {
    // Check for click events on the navbar burger icon

    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);
	
    bulmaSlider.attach();
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();

    // Setup left section-nav scrollspy
    setupSectionNav();

})
