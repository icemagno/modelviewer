
let viewer = null;
let camera = null;
let scene = null;

$( document ).ready(function() {
	initMap();
	
	const ws = new SockJS( "/ws" );
	var stompClient = Stomp.over(ws);
	stompClient.debug = null;

	var thisheaders = {
        "Origin": "*",
        "withCredentials": 'false',
	};	 
	 
	stompClient.connect( thisheaders , (frame) => {
		console.log('WebSocket Conected.');  

		stompClient.subscribe('/particle', (message) => {
			let payload = JSON.parse( message.body );
		});

	});		


});


function addModels(){

	let posIgrejaGloria = Cesium.Cartesian3.fromDegrees( -43.175360761783937,-22.921573274076817, 58 );
	let oriIgrejaGloria = this.getOrientation( 258, posIgrejaGloria );
	let igreja = viewer.entities.add({
		name : 'igreja',
		position: posIgrejaGloria, 
		orientation: oriIgrejaGloria,
		model: {
			uri: '/models/Igreja_da_Gloria.glb',
			minimumPixelSize : 10,
			maximumScale : 50,
		},
	});	
	igreja.model.scale = 20;
	igreja.model.heightReference = Cesium.HeightReference.CLAMP_TO_TERRAIN;



	let posTheatroDaPaz = Cesium.Cartesian3.fromDegrees( -48.4937346, -1.4529537, -7 ); // lon,lat,altura
	let oriTheatroDaPaz = this.getOrientation( 65, posTheatroDaPaz );
	let theatro = viewer.entities.add({
		name : 'theatro',
		position: posTheatroDaPaz, 
		orientation: oriTheatroDaPaz,
		model: {
			uri: '/models/Teatro_da_Paz.glb',
			minimumPixelSize : 10,
			maximumScale : 50,
		},
	});	
	theatro.model.scale = 30;
	theatro.model.heightReference = Cesium.HeightReference.CLAMP_TO_TERRAIN;


	viewer.flyTo(igreja);

}



async function initMap(){
	
		Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzM2FmZWE0ZC02Mjk5LTQ4YjMtOTBkZS1lZTA2YmY1NmNlYjkiLCJpZCI6OTA0MCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1MzI2MDU2Nn0.7vt1o0l_yVOie6CCpPbPo91PaMmkZpdmqibvlFxpnpw';

		baseOsmProvider = new Cesium.OpenStreetMapImageryProvider({
		    url : 'https://a.tile.openstreetmap.org/'
		});
			
		map01 = new Cesium.UrlTemplateImageryProvider({
		    url : 'https://stamen-tiles-d.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png',
		});	
			
		map02 = new Cesium.UrlTemplateImageryProvider({
		    url : 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
		});	

		map03 = new Cesium.UrlTemplateImageryProvider({
		    url : 'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
		});	

		viewer = new Cesium.Viewer('cesiumContainer',{
			sceneMode : Cesium.SceneMode.SCENE3D,
			timeline: false,
			animation: false,
			baseLayerPicker: false,
			skyAtmosphere: false,
			fullscreenButton : false,
			geocoder : false,
			homeButton : false,
			infoBox : false,
			skyBox : false,
			sceneModePicker : true,
			selectionIndicator : false,
			navigationHelpButton : false,
		    imageryProvider: baseOsmProvider,
		    requestRenderMode : false,
		    
		    terrainProvider: await Cesium.CesiumTerrainProvider.fromUrl(
		      Cesium.IonResource.fromAssetId(1), {
		        requestVertexNormals: true
		    }),
			  		    
  		    
  		    contextOptions: { 
			  requestWebgl2: true,
			  webgl: {
				alpha: true,
			  }
			},			
		});
		
		/*
		const tileset = viewer.scene.primitives.add(
	      new Cesium.Cesium3DTileset({
	          url: Cesium.IonResource.fromAssetId(96188)
	      })
		);
		*/		
	
		camera = viewer.camera;
		scene = viewer.scene;
		canvas = viewer.canvas;

		scene.highDynamicRange = false; // HDR
		scene.globe.enableLighting = false;
		scene.screenSpaceCameraController.enableLook = false;
		scene.screenSpaceCameraController.enableCollisionDetection = true;
		scene.screenSpaceCameraController.inertiaZoom = 0;
		scene.screenSpaceCameraController.inertiaTranslate = 0;
		scene.screenSpaceCameraController.inertiaSpin = 0;
		scene.globe.depthTestAgainstTerrain = true;
		scene.pickTranslucentDepth = false;
		scene.useDepthPicking = false;
		scene.globe.tileCacheSize = 50;
		ellipsoid = viewer.scene.globe.ellipsoid;
		

		var imageryLayers = scene.imageryLayers;
		var helper = new Cesium.EventHelper();
		var totalTilesToLoad = 0;
		helper.add( viewer.scene.globe.tileLoadProgressEvent, function (event) {
			if( event > totalTilesToLoad ) totalTilesToLoad = event;
			if (event == 0) {
				$("#activeLayerContainer").height('90vh');
				var totalHeight= $("#activeLayerContainer").height() - 110 + 'px' ;
				$('#layerContainer').height( totalHeight );
			} else {
				//
			}
		});	

		
		imageryLayers.layerShownOrHidden.addEventListener(function (event) {
			//
		});
		imageryLayers.layerAdded.addEventListener(function (event) {
			//
		});
		imageryLayers.layerRemoved.addEventListener(function (event) {
			//
		});	
		
		// -18.813/
		var initialPosition = Cesium.Cartesian3.fromDegrees(-42, -19, 4000000);
		var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(0, -90, 0);
		scene.camera.setView({
		    destination: initialPosition,
		    orientation: initialOrientation,
		    endTransform: Cesium.Matrix4.IDENTITY
		});	
		

		viewer.scene.light = new Cesium.DirectionalLight({
			direction: viewer.scene.camera.directionWC,
		});
		
		viewer.scene.preRender.addEventListener(function (scene, time) {
			viewer.scene.light.direction = Cesium.Cartesian3.clone(
				viewer.scene.camera.directionWC,
				viewer.scene.light.direction
			);
		});	
		showHint();
		addModels();
};


function showHint(){
	let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
	handler.setInputAction(function (movement) {

		const cartesian = viewer.camera.pickEllipsoid(
			movement.position,
			scene.globe.ellipsoid,
		);

		if (cartesian) {
			const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
			const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(15);
			const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(15);
			console.log("Lon: " + longitudeString + " Lat: " + latitudeString);
		} else {
			//
		}
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

}


function getOrientation( he, position ){
	he = he - 90;
	//if( he < 0 ) he = 360 - he;
	const heading = Cesium.Math.toRadians( he );
	const pitch = 0;
	const roll = 0;
	const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
	const orientation = Cesium.Transforms.headingPitchRollQuaternion(
		position,
		hpr
	);
	return orientation;  	
}