sap.ui.jsview("view.main", {

    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf shine-so.main
     */
    getControllerName: function() {
        return "view.main";
    },

    handlePress: function(oController, tileID) {
        var url = '';
        switch (tileID) {
            case 1:
                url = "../user-ui/index.html";
                break;
            case 2:
                url = "../tiny-ui/index.html";
                break;
        }
        window.location = url;
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf launchpad.main
     */
    createContent: function(oController) {
        var view = this;

        var app = new sap.m.App({
            initialPage: "home"
        });

        var userTile = new sap.m.StandardTile({
            icon: "sap-icon://account",
            info: sap.app.i18n.getText("USER"),
            infoState: "None",
            removable: false,
            press: function(oEvent) {
                view.handlePress(oController, 1);
            }
        });
        userTile.addStyleClass('templateTileClass');
        userTile.addStyleClass('ucClass');
        
        var tinyworldTile = new sap.m.StandardTile({
            icon: "sap-icon://map",
            info: sap.app.i18n.getText("TINYWORLD"),
            infoState: "None",
            removable: false,
            press: function(oEvent) {
                view.handlePress(oController, 2);
            }
        });
        tinyworldTile.addStyleClass('templateTileClass');
        tinyworldTile.addStyleClass('twClass')
        
        var oLink1 = new sap.ui.commons.Link({
	    text: "Source code",
	    tooltip: "Click to download Source code"
	    
		});
	    oLink1.setHref("/epm.zip");
       
        var items = [
            userTile, tinyworldTile
        ];
        // create tile container
        var tileContainer = new sap.m.TileContainer({
            tileDelete: function(evt) {
                var tile = evt.getParameter("tile");
                evt.getSource().removeTile(tile);
            },
            tiles: items
        });

        var titleLabel = new sap.m.Label({
            design: sap.m.LabelDesign.Bold,
            text: 'Teched Demo: CAP Application'
        });

        var page = new sap.m.Page("home", {
            // title: "Home",
            icon: 'images/SAPLogo.gif',
            customHeader: new sap.m.Bar({
                // enableFlexBox: true,
                contentMiddle: [new sap.m.Image({
                        height: '26px',
                        src: 'images/SAPLogo.gif',
                    }),
                    // label
		
                 titleLabel
                ],
            }),             
          
            content: [tileContainer],
            enableScrolling: false
        });
        app.addPage(page);
        return app;
    }
});