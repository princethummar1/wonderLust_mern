// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()



//Flash - Time Out 
document.addEventListener('DOMContentLoaded', () => {
  // Select all toast elements on the page
  const allToasts = document.querySelectorAll('.toast.show');

  allToasts.forEach(toast => {
    // Wait for 5 seconds before starting the fade-out
    setTimeout(() => {
      // Add the fade-out class to trigger the CSS animation
      toast.classList.add('fade-out');
      
      // After the animation is complete, remove the element entirely
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
      
    }, 3000); // 5000 milliseconds = 5 seconds
  });
});





  document.addEventListener('DOMContentLoaded', () => {
  const scrollContainer = document.getElementById('filter-scroll-container');
  const leftArrow = document.getElementById('filter-arrow-left');
  const rightArrow = document.getElementById('filter-arrow-right');

  if (!scrollContainer) return; // Exit if the container isn't on the page

  const handleArrowVisibility = () => {
    // Check if there is content to scroll
    const isScrollable = scrollContainer.scrollWidth > scrollContainer.clientWidth;
    
    if (!isScrollable) {
      leftArrow.style.display = 'none';
      rightArrow.style.display = 'none';
      return;
    }

    // Show/hide left arrow
    if (scrollContainer.scrollLeft > 0) {
      leftArrow.style.display = 'flex';
    } else {
      leftArrow.style.display = 'none';
    }

    // Show/hide right arrow
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    if (scrollContainer.scrollLeft >= maxScrollLeft - 5) { // -5 for buffer
      rightArrow.style.display = 'none';
    } else {
      rightArrow.style.display = 'flex';
    }
  };

  // Event listener for clicking the right arrow
  rightArrow.addEventListener('click', () => {
    // Scroll by 75% of the container's width for a nice page-like scroll
    scrollContainer.scrollBy({ left: scrollContainer.clientWidth * 0.75, behavior: 'smooth' });
  });

  // Event listener for clicking the left arrow
  leftArrow.addEventListener('click', () => {
    scrollContainer.scrollBy({ left: -scrollContainer.clientWidth * 0.75, behavior: 'smooth' });
  });

  // Update arrow visibility when the user scrolls the container
  scrollContainer.addEventListener('scroll', handleArrowVisibility);
  
  // Also check on window resize
  window.addEventListener('resize', handleArrowVisibility);

  // Initial check when the page loads
  handleArrowVisibility();
});