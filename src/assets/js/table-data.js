$(function(e) {
	$('#examples1').DataTable();
	
	$('#example2').DataTable( {
		"scrollY":        "200px",
		"scrollCollapse": true,
		"paging":         false
	}); 
	$('#example3').DataTable( {
		responsive: {
			details: {
				display: $.fn.dataTable.Responsive.display.modal( {
					header: function ( row ) {
						var data = row.data();
						return 'Details for '+data[0]+' '+data[1];
					}
				} ),
				renderer: $.fn.dataTable.Responsive.renderer.tableAll( {
					tableClass: 'table'
				} )
			}
		}
	});
	var table = $('#example').DataTable( {
		lengthChange: false,
		buttons: [ 'copy', 'excel', 'pdf', 'colvis' ]
	} );
	table.buttons().container()
		.appendTo( '#example_wrapper .col-md-6:eq(0)');
		
	//sample datatable	
	$('#example-2').DataTable();
	
	//Details display datatable
	$('#example-1').DataTable( {
		responsive: {
			details: {
				display: $.fn.dataTable.Responsive.display.modal( {
					header: function ( row ) {
						var data = row.data();
						return 'Details for '+data[0]+' '+data[1];
					}
				} ),
				renderer: $.fn.dataTable.Responsive.renderer.tableAll( {
					tableClass: 'table'
				} )
			}
		}
	} );

	//______Form Input Datatable 
	$('#form-input-datatable').DataTable({
		language: {
			searchPlaceholder: 'Search...',
			sSearch: '',
		},
		responsive: true,
		columnDefs: [{
			orderable: false,
			targets: [1,2,3]
		}]
		
	});

	//______Select2 
	$('.select2').select2({
		minimumResultsForSearch: Infinity,
	});

	$('#form-input-datatable').on('draw.dt', function() {
		$('.select2').select2({
			minimumResultsForSearch: Infinity,
			placeholder: 'Choose one',
		});
	});
});