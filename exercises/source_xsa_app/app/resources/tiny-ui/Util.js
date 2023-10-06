var oFirstDialog;

function openFirstDialog() {

  if (oFirstDialog) {

     oFirstDialog.open();

  } else {

     oFirstDialog = new sap.ui.commons.Dialog({

         width: "400px", // sap.ui.core.CSSSize

         height: "550px", // sap.ui.core.CSSSize

         title: "Country Details", // string

         applyContentPadding: true, // boolean

         modal: true, // boolean

         content: [new sap.ui.commons.form.SimpleForm({

            content: [

               new sap.ui.core.Title({ text: "Country Name" }),

               new sap.ui.commons.Label({ text: "name"}),

               new sap.ui.commons.TextField({ value: "", id: "name" }),

               new sap.ui.commons.Label({ text: "partof" }),

               new sap.ui.commons.TextField({ value: "", id: "partof" })

            ]

         })] // sap.ui.core.Control

  });

     oFirstDialog.addButton(new sap.ui.commons.Button({

         text: "OK",

         press: function() {

            var name = sap.ui.getCore().byId("name").getValue();

            var partof = sap.ui.getCore().byId("partof").getValue();

            var payload = {};

            payload.name = name;

            payload.partof = partof;

            var insertdata = JSON.stringify(payload);

         

            $.ajax({

               type: "POST",

               url: "/country/country.xsjs",

               contentType: "application/json",

               data: insertdata,

               dataType: "json",

               crossDomain: true,

               success: function(data) {

                  oFirstDialog.close();

                  sap.ui.getCore().byId("tinytab").getModel().refresh(true);

                  alert("Data inserted successfully");

               },

               error: function(data) {

                  var message = JSON.stringify(data);

                  alert(message);

               }

            });

         }

   }));

   oFirstDialog.open();

}

}

$(function() {
	$.ajax({
		type: "GET",
		url: "/",
		headers: {"X-Csrf-Token": "Fetch"},
		cache: false,
		success: function(res, status, xhr) {
			var sHeaderCsrfToken = "X-Csrf-Token";
			var sCsrfToken = xhr.getResponseHeader(sHeaderCsrfToken);

			// for POST, PUT, and DELETE requests, add the CSRF token to the header
			$(document).ajaxSend(function(event, jqxhr, settings) {
				if (settings.type==="POST" || settings.type==="PUT" || settings.type==="DELETE") {
					jqxhr.setRequestHeader(sHeaderCsrfToken, sCsrfToken);
				}
			});
		}
	});
});