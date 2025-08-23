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
 setTimeout(() => {
    const flash = document.getElementById('flash-message');
    if(flash){
      flash.classList.remove('show'); // bootstrap fade
      flash.classList.add('hide');
      setTimeout(() => flash.remove(), 500); // remove after fade
    }
  }, 1500);