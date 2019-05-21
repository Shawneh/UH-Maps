document.addEventListener('DOMContentLoaded', buildMap());

// List of partners to be used in
// buildPartnerContainer()

var partnerList = [{
        name: 'The Fit and Food Connection',
        logo: './assets/images/FitFoodConnection.png',
        link: 'https://fitandfoodconnection.org/'
    }, {
        name: 'St. Louis Metro Market',
        logo: './assets/images/MetroMarket.png',
        link: 'https://www.stlmetromarket.com/'
    }, {
        name: 'St. Patrick Center',
        logo: './assets/images/StPatrickCenter.png',
        link: 'http://stpatrickcenter.org/'
}];

function buildMap() {
    require([
    'esri/views/MapView',
    'esri/widgets/Legend',
    'esri/widgets/Expand',
    'esri/WebMap'
    ], function (MapView, Legend, Expand, WebMap) {
        var webmap = new WebMap({
            portalItem: {
                id: '0ced23678d1f4084b0ec31d3e91a4b35'
            }
        });
        var view = new MapView({
            container: 'viewDiv',
            map: webmap,
            zoom: 11,
            center: [-90.25, 38.65], // [longitude, latitude]
            popup: {
                dockEnabled: true,
                dockOptions: {
                  // Disables the dock button from the popup
                  buttonEnabled: false,
                  // Ignore the default sizes that trigger responsive docking
                  breakpoint: false,
                  location: 'top-right'
                }
              }
        });
        
        view.when(() => {

            var featureLayer1 = webmap.layers.getItemAt(0);
            var featureLayer2 = webmap.layers.getItemAt(5);
            
            // Boolean value that stores if legend expand
            // was expanded - for the resize event listener
            var legendWasExpanded;

            var legend = new Expand({
                content: new Legend({
                    view: view,
                    style: 'classic',
                    layerInfos: [{
                        layer: featureLayer1,
                        title: 'Low Food Access, Low Income Area'
                    }, {
                        layer: featureLayer2,
                        title: 'Farm Location'
                    }]
                }),
                view: view,
                expandTooltip: 'Layer Information',
                expanded: checkDeviceWidth('legend')
            });
            view.ui.add(legend, 'bottom-left');

            window.addEventListener('resize', () => {
                if (window.innerWidth < 545 && legend.expanded) {
                    legendWasExpanded = true;
                    legend.collapse();
                }
            
                if (window.innerWidth >= 545 && !legend.expanded) {
                    if (legendWasExpanded) {
                        legend.expand();
                    }
                }
            })

        }).then(() => {

            var partnerContainer = buildPartnerContainer();
            // Boolean value that stores if sponsor expand
            // was expanded - for the resize event listener

            var sponsorWasExpanded;

            var sponsors =  new Expand({
                content: partnerContainer,
                view: view,
                expandTooltip: 'Partners',
                expanded: checkDeviceWidth('partner')
            });
            view.ui.add(sponsors, 'bottom-right');
            
            window.addEventListener('resize', () => {
                if (window.innerWidth < 800 && sponsors.expanded) {
                    sponsorWasExpanded = true;
                    sponsors.collapse();
                }
            
                if (window.innerWidth >= 800 && !sponsors.expanded) {
                    if (sponsorWasExpanded) {
                        sponsors.expand();
                    }
                }
            })
        });
    });
}

function buildPartnerContainer() {

    // Build the elements of the container
    var container = document.createElement('div');
    container.classList = 'esri-legend esri-widget--panel esri-widget';

    var containerTitle = document.createElement('h3');
    containerTitle.classList = 'esri-widget__heading esri-legend__service-label';
    containerTitle.innerHTML = 'Our Partners';

    var containerMainDiv = document.createElement('div');
    containerMainDiv.classList = 'esri-legend__service';

    var containerLayer = document.createElement('div');
    containerLayer.classList = 'esri-legend__layer';

    var containerLayerTable = document.createElement('div');
    containerLayerTable.classList = 'esri-legend__layer-table' 
    containerLayerTable.classList += 'esri-legend__layer-table--size-ramp'

    var containerLayerBody = document.createElement('div');
    containerLayerBody.classList = 'esri-legend__layer-body'

    for(var partner of partnerList) {
        var containerLayerRow = document.createElement('div');
        containerLayerRow.classList = 'esri-legend__layer-row';
        
        var containerLayerRowImg =  document.createElement('img');
        containerLayerRowImg.classList = 'partner-img'
        containerLayerRowImg.src = partner.logo;
        containerLayerRowImg.width = '48';

        var containerLayerRowName = document.createElement('a');
        containerLayerRowName.classList = 'partner-link';
        containerLayerRowName.href = partner.link;
        containerLayerRowName.innerHTML = partner.name;
        containerLayerRowName.target = '_top';

        containerLayerRow.appendChild(containerLayerRowImg);
        containerLayerRow.appendChild(containerLayerRowName);
        containerLayerBody.appendChild(containerLayerRow);
    }

    // Build out Container Structure / Hierarchy
    containerLayerTable.appendChild(containerLayerBody);
    containerLayer.appendChild(containerLayerTable);
    containerMainDiv.appendChild(containerTitle);
    containerMainDiv.appendChild(containerLayer);
    container.appendChild(containerMainDiv);

    // Return the newly created container
    return container;
}

function checkDeviceWidth(panelName) {
    switch(panelName) {
        case 'legend':
            return window.innerWidth >= 600 ? true : false;
        case 'partner':
            return window.innerWidth >= 800 ? true : false;
        default:
            return false;
    }
}