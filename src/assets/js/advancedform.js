(function($) {
	"use strict";
	
		//accordion-wizard
		var options = {
			mode: 'wizard',
			autoButtonsNextClass: 'btn btn-primary float-end',
			autoButtonsPrevClass: 'btn btn-info',
			stepNumberClass: 'badge rounded-pill badge-primary me-1',
			onSubmit: function() {
			  alert('Form submitted!');
			  return true;
			}
		}
		$( "#form" ).accWizard(options);
		
})(jQuery);      