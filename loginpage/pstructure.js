document.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;

  // Get all parallax images
  const parallaxImages = document.querySelectorAll('.parallax-image');

  // Loop through each parallax images
  parallaxImages.forEach((image) => {
    // Get the speed of the parallax effect for this image
    const speed = image.dataset.speed;

    // Calculate the offset based on the scroll position and the speed
    const offset = scrollPosition * speed;

    // Update the background position of the image
    image.style.backgroundPosition = `center ${offset}px`;

    // Calculate the opacity based on the scroll position
    const opacity = 1 - scrollPosition / (document.body.scrollHeight - window.innerHeight);

    // Update the opacity of the image
    image.style.opacity = opacity;
  });
});
