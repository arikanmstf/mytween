/**
    *** myTween javascript OpenLayers plugin ***
        Author  : Mustafa Arıkan
        Version : 1.4.0
        Release : 27.08.2014
        Contact : arikan134@gmail.com
        Web     : mustafaarikan.net
        Git     : github.com/arikanmstf

    *** Requirements ***
        OpenLayers   : 2.13

    ~check sample.html

**/
OpenLayers.myTween = OpenLayers.Class(OpenLayers.Strategy,{
	m : {} , //OpenLayers.Map
	fs : {} , // Array ~  OpenLayers.Feature
	to: [], // Array ~ {ll:OpenLayers.LonLat,id:integer}
	toTemp: [], // Array ~ {ll:OpenLayers.LonLat,id:integer}
	s : false, // init set ~ Bool
	
	init :function(opts){
		if(this.s)return;
		
		var _s = this;
		this.m = opts.m;
		this.fs = opts.fs;
		for(var i=0;i<this.fs.length;i++){
			this.fs[i].animBuffer = new Array();
			this.fs[i].ii = 0;
			this.fs[i].am = this.fs[i].marker;
			this.fs[i].moving = false;
		}
		_s.m.events.register('zoomend',_s.m,function (evt) {
				_s.pause();
				_s.resume();
		});
		
		this.s=true;
	},
	beforeStart:function(){
		var _s = this,fs = this.fs,to=this.toTemp;
		for(var i=0;i<fs.length;i++){
			for(var ii=0;ii<to.length;ii++){
				if(fs[i].device_id == to[ii].id /*&& fs[i].signal_id != to[ii].signal_id*/ ){
					fs[i].animBuffer.push(to[ii].ll);
					fs[i].signal_id = to[ii].signal_id;
					
				}
			}
		};
		
	},
	move:function(f){
				var _s = this;
				if(f.moving)return;
				if(f.animBuffer.length-1 < f.ii ){
					return
				};	
				var from = _s.m.getLayerPxFromLonLat( f.marker.lonlat);
				var from_px = [from.x,from.y];
				f.tween = new OpenLayers.Tween(OpenLayers.Easing.Linear.easeIn);
				var to = _s.m.getLayerPxFromLonLat(f.animBuffer[f.ii]);
				var to_px = [to.x,to.y];
					
				var callbacks = {
					eachStep: function(value) {
						f.moving=true;
						var px = new OpenLayers.Pixel(value[0],value[1]);
						f.marker.moveTo(px);
						if(f.am)f.am.moveTo(px);
						if(f.popup){
							f.popup.hide();
							f.popup.lonlat = _s.m.getLonLatFromLayerPx(px);
							f.popup.updatePosition();
						}
						if(f.popup2){
							f.popup2.show();
							f.popup2.lonlat = _s.m.getLonLatFromLayerPx(px);
							f.popup2.updatePosition();
						}
						f.lonlat = f.marker.lonlat = f.am.lonlat =  _s.m.getLonLatFromLayerPx(px);
					},
					done : function(){
						//f.lonlat = f.marker.lonlat = f.am.lonlat =  f.animBuffer[f.ii];
						
						f.moving=false;
						_s.move(f);
						
					}
				}
				f.tween.start(from_px, to_px, 500, {callbacks: callbacks});
				f.ii++;
			},
	start:function(){
		var _s = this,fs = this.fs;
		_s.beforeStart();
		for(var i=0;i<fs.length;i++){

			var f = fs[i];
			_s.move(f);
			
		}
	},
	pause:function(){
		
		
		var _s=this;fs = this.fs;
		for(var i=0;i<=fs.length-1;i++){
			if(_s.isSet(fs[i].tween) ) {
				fs[i].tween.stop();
				fs[i].moving = false;
			}
		};
	},
	resume:function(){
		this.start();
		return;
		
		/*var _s=this;fs = this.fs;
		for(var i=0;i<=fs.length-1;i++){
			if(_s.isSet(fs[i].tween) ){
				/*
				if(fs[i].ii >= 2 )fs[i].ii -=2 ;
				else if(fs[i].ii >=1)fs[i].ii--;
				else break;
				
				fs[i].ii--;
				_s.move(fs[i]);
			}
		};*/
	},
	stop:function(){
	
	},
	addDestination:function(x){
		this.to.push(x);
		this.toTemp.push(x);
	},
	reset:function(){
		this.toTemp = new Array();
	},
	isSet: function (foo) {
			return (typeof foo != 'undefined'); 
		}
	
	
});