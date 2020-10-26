function smoothScroll(target, duration) {
    var target = document.querySelector(target);
    // console.log(target);
    var targetPosition = target.getBoundingClientRect().top;
    // console.log(targetPosition);
    var startPosition = window.pageYOffset;
    // console.log(startPosition);
    var distance = targetPosition - startPosition;
    var startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        // console.log(startTime);
        var timeElapsed = currentTime - startTime;
        var run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
        console.log('timeElapsed : ' + timeElapsed + ' duration : ' + duration);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

//smoothScroll('.section2', 1000);
var section1 = document.querySelector(".section1");
var section2 = document.querySelector(".section2");

section1.addEventListener("click", function () {
    smoothScroll('.section2', 1000);
});
section2.addEventListener("click", function () {
    smoothScroll('.section1', 1000);
});