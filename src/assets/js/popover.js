$(function(e) {
    'use strict';
    $(document).on('click', function(e) {
        $('[data-bs-toggle="popover"]').each(function() {
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                (($(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false 
            }
        });
    });
});