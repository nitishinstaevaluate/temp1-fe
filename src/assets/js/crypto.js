$(function(e) {

    // datatable
	$('#cryptocurrencies').DataTable();

    // Select2 
	$('.select2').select2({
		minimumResultsForSearch: Infinity,
	});
    
})