var wrapper = document.querySelector('.wrapper');

wrapper.addEventListener('scroll', function() {
  var scrollPosition = wrapper.scrollTop;

  var images = document.querySelectorAll('.wrapper > .background, .wrapper > .background1 , .wrapper > .background2 .wrapper > .background3, .wrapper > .background4, .wrapper > .background5, .wrapper > .background6, .wrapper > .background7');

  images.forEach(function(image) {
    var imageTop = image.offsetTop;
    var newOpacity = Math.max(1 - (scrollPosition - imageTop) / 1000, 0);
    image.style.opacity = newOpacity;
  });
});