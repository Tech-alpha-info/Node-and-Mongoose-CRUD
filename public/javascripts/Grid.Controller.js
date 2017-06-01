



var templateText = "";


var app = angular.module('TemplateManagerApp', ['ngAnimate', 'ui.grid', 'ui.grid.moveColumns', 'ui.grid.selection', 
    'ui.grid.resizeColumns', 'ui.bootstrap', 'ui.grid.edit', 'ngToast']) 





app.controller('MainCtrl', MainCtrl);
app.controller('RowEditCtrl', RowEditCtrl);
app.controller('trixCtrl', trixCtrl);
app.service('RowEditor', RowEditor);






// Config for the Toast control
app.config(['ngToastProvider', function (ngToastProvider) {
    ngToastProvider.configure({
        animation: 'slide' 
    });
}]);







MainCtrl.$inject = ['$scope', '$http', '$modal', 'RowEditor', 'uiGridConstants', 'ngToast'];
function MainCtrl($scope, $http, $modal, RowEditor, uiGridConstants, ngToast) {
    
   
    var TemplateController = this;

	TemplateController.editRow = RowEditor.editRow;

	TemplateController.TemplateGrid = {
		enableRowSelection : true,
		enableRowHeaderSelection : false,
		multiSelect : false,
		enableSorting : true,
		enableFiltering : true,
		enableGridMenu : true,
		rowTemplate : "<div ng-dblclick=\"grid.appScope.TemplateController.editRow(grid, row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
	};

    TemplateController.TemplateGrid.columnDefs = [ 
        {
		field : 'name',
		enableSorting : true,
		enableCellEdit : false
	}, {
        field : 'category',
        enableSorting : true,
        enableCellEdit : false
    }, {
            field : 'created',
            type: 'date', 
            cellFilter: 'date:\'dd-MM-yyyy HH:MM:ss\'',
		    enableSorting : true,
		    enableCellEdit : false
        }, 

        {
            name: 'Actions', 
            enableSorting : false,
            enableFiltering : false,
            cellTemplate: '<button class="btn btn-primary btn-md" ng-click="grid.appScope.EditRowButton(row)">Edit</button>'  +
                           '&nbsp;' + 
                          '<button class="btn btn-primary btn-md" ng-click="grid.appScope.DeleteRowButton(row)">Remove</button>'
        }
      
    ];
    
   
    
    // Load all the records in to the Grid...
    $http.get("/templateManagerApi")
    .then(function (response) {
        
     
        if (response.data.success) {
            TemplateController.TemplateGrid.data = response.data.model;
           
        } else {
            console.log(response.data.message);
        }
        
	}, function errorCallback(response) {
        console.log("Error: " + response);
    });
    
    
    

  
    
    // Addrow function - adding a new record 
	$scope.addRow = function() {
		var newRecord = {
			"category" : "Sales",
			"name" : "",
			"template" : ""
		};
		var rowTmp = {};
		rowTmp.entity = newRecord;
		TemplateController.editRow($scope.TemplateController.TemplateGrid, rowTmp);
    };
    
    

    

    // Remove button in action column of Grid
    $scope.DeleteRowButton = function (row) {
        
        var index = $scope.TemplateController.TemplateGrid.data.indexOf(row.entity);
        var id = row.entity._id;
        
        $http.delete('/TemplateManagerApi/' + id).then(function (response) {
            
            if (response.data.success == true) {
                $scope.TemplateController.TemplateGrid.data.splice(index, 1);
                
                ShowNotify("Record Removed.", "success");

            } else {
                
                ShowNotify("Record Could not be Removed.", "danger");
                console.log("Delete action failed - " + response.data.message);
            }
        });

    }

    // Edit button in action column of Grid
    $scope.EditRowButton = function (row) {  
         TemplateController.editRow($scope.TemplateController.TemplateGrid, row);   
    };



    
    
    // Display a notification pop up...
    function ShowNotify(message, type) {
        ngToast.create({
            className: type,
            content: message
        });
    }



}





// Init the Rich text trix control...
trixCtrl.$inject = ['$scope', '$http', '$rootScope'];
function trixCtrl($scope, $http, $rootScope) { 

  
    document.querySelector("trix-editor").value = templateText;

    var events = ['trixInitialize', 'trixChange', 'trixSelectionChange', 'trixFocus', 'trixBlur', 'trixFileAccept', 'trixAttachmentAdd', 'trixAttachmentRemove'];


}














// Row Edit opens a modal window with the edit.html view...
RowEditor.$inject = [ '$http', '$rootScope',  '$modal', 'ngToast'];
function RowEditor($http, $rootScope, $modal, ngToast) 
{
    
    var service = {};
	service.editRow = editRow;

    function editRow(grid, row) {
        
        templateText = row.entity.template;
    
        var modalInstance = $modal.open({

            templateUrl : '/edit',
            controller : ['$http', '$modalInstance', 'grid', 'row', 'ngToast',  RowEditCtrl],
            controllerAs : 'TemplateController',
            windowClass: 'template-modal-md',
            resolve : {
                
                grid : function () {
                    return grid;
                },
                row : function () {
                    return row;
                }
            }
        });
	}

	return service;
}









// Row Edit functions...
function RowEditCtrl($http, $modalInstance, grid, row, ngToast) {
    

	var TemplateController = this;
	TemplateController.entity = angular.copy(row.entity);
    TemplateController.Save = Save;
    TemplateController.SubmitSave = SubmitSave;
    
    
    function SubmitSave(valid)
    {
        console.log(valid);

        if (!valid) {
            ShowNotify("Inputs are not quite right! Please check...", "danger");
        } else {
            Save();
        }
      
    }
    

    
    function Save() {
        
       
        var editedTemplatetext = GetTemplateText();

        // New record to be created...
		if (!row.entity._id) {
		
			row.entity = angular.extend(row.entity, TemplateController.entity);
            row.entity.template = editedTemplatetext;
            
            // Save to DB...
            $http.post('/templateManagerApi/', row.entity).then(function (response) {
                
                if (response.data.success == true) {

                    ShowNotify("Record Created.", "success");
                
                    
                    // Add new row to grid...
                    var PersistedData = grid.data;
                    PersistedData.push(response.data.model);
                    grid.data = PersistedData;

                } else {

                    ShowNotify("Record Could not be Created.", "danger");
                    console.log("Create action failed - " + response.data.message);
                }
                 
            });


        } else {

            row.entity = angular.extend(row.entity, TemplateController.entity);
            row.entity.template = editedTemplatetext;

            $http.put('/templateManagerApi/', row.entity).then(function (response) {
                
                if (response.data.success == true) {
                 
                    ShowNotify("Record Updated.", "success");
                  
                } else {

                    ShowNotify("Record Could not be Updated.", "danger");
                    console.log("Update action failed - " + response.data.message);
                }

                 
            });

         }
        

        $modalInstance.close(row.entity);

	}
    
    

    
    // Display a notification pop up...
    function ShowNotify(message, type) {
        ngToast.create({
            className: type,
            content: message
        });
    }

    
}






/* Utility Functions  */


// Return the template text either from the rich text or plain text input (whichever is currently shown)
function GetTemplateText() {
    var useRichText = false;
    var trixtext = "";
    
    useRichText = document.getElementById("RichTextRadio").checked;
    
    if (useRichText) {
        trixtext = document.querySelector("trix-editor").value;
    } else {
        trixtext = document.getElementById("plainTextEditor").value;
    }
    
    return trixtext;
}





// Switch between the plain text input and the rich text editor...
function ChangeEditType(value) {
    
  
    if (value == 'PlainText') {
        
        ToggleElement("TemplatePlain", true);
        ToggleElement("TemplateRich", false);

        var trixtext = document.querySelector("trix-editor").value;
        var plainTextElement = document.getElementById('plainTextEditor');
        plainTextElement.value = trixtext;
            
    } else {


        ToggleElement("TemplatePlain", false);
        ToggleElement("TemplateRich", true);
        
        var plainText = document.getElementById('plainTextEditor').value;
        document.querySelector("trix-editor").value = plainText;

    }
}




// Show or hide an element...
function ToggleElement(element, show) {
    
    var div = document.getElementById(element);
    if (!show) {
        div.style.display = 'none';
    }
    else {
        div.style.display = 'block';
    }
}


