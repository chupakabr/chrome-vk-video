/* (c) 2011, Valeriy Chevtaev, http://chupakabr.ru */

if (!ru) { var ru = {}; }
if (!ru.chupakabr) { ru.chupakabr = {}; }
if (!ru.chupakabr.kontaktVideo) { ru.chupakabr.kontaktVideo = {}; }

ru.chupakabr.kontaktVideo.run = function() {
	var player1 = document.getElementById('player');
	var player2 = document.getElementById('video_player');
	var player = false;
	if (player1) {
		player = player1;
	} else if (player2) {
		player = player2;
	} else {
		alert('Контейнер с видео не найден. Обратитесь пожалуйста к разработчикам плагина.');
	}
	
	if (player) {
		var ver = null;
		var vtag = null;
		var vkid = null;
		var host = null;
		var uid = null;
		
		for (var i = 0; i < player.attributes.length; i++) {
			p = player.attributes[i];	// Get param
			if (p.name == 'flashvars') {
				// Variables found, try to get it

				// 0 (old)
				// overstretch=false&vid=&host=195.218.182.34&vtag=3b501d2a&vkoid=-5146796&vkid=85347831
				//var matches = p.value.match(/vtag=([^&]+)&vkoid=([^&]+)&vkid=([^&]+)&/);

				// 1
				// 2010-01-21: http://cs12302.vkontakte.ru/u1331341/video/97529fa2cd.flv FROM:
				// &vid=&host=12302&vtag=97529fa2cd&ltag=l_056f2c79&vkid=138573252&uid=1331341&link=http://vkontakte.ru/video4604810_138587595&md_title=%D0%92%D0%95%D0%A7%D0%95&folder_id=7877350&md_author=%3Ca+class%3D%22memLink%22+href%3D%22%2Fid4604810%22%3E%D0%98%D1%80%D0%B8%D0%BD%D0%B0+Konokradka+%D0%98%D0%BB%D1%8E%D0%BD%D0%B8%D0%BD%D0%B0%3C%2Fa%3E&in_process=false&hd=
				
				// 2
				// 2009-12-30 NEW: vid=&host=93.186.224.208&vtag=115d43fca9f6-&ltag=35c65286&vkid=968508&uid=
				
				// 3 2011-07-13&host=http%3A%2F%2Fcs12418.vkontakte.ru%2F&is_ext=0&is_vk=0&
				// ltag=l_3410066e&mp4_to_flv=1&no_flv=0&oid=330871&uid=55266615&vid=160274546&vkid=143490762&vtag=352484eb9b
				
				//2: var matches = p.value.match(/(uid=([^&]*)|)&.*host=([^&]+)&vtag=([^&]+)&ltag=([^&]+)&vkid=([^&]+)&.*&no_flv=([^&]+)/);
				var matches = p.value.match(/host=([^&]+).*&ltag=([^&]+).*&no_flv=([^&]+).*&uid=([^&]*).*&vkid=([^&]+)&vtag=([^&]+)/);
				//alert(matches.length);
				if (matches && matches.length > 0) {
					ver = 1;
					//2:
//					uid = matches[2];
//					host = matches[3];
//					vtag = matches[4];
//					ltag = matches[5];
//					vkid = matches[6];
//					noflv = matches[7];
					//3:
					host = decodeURIComponent(matches[1]);
					ltag = matches[2];
					noflv = matches[3];
					uid = matches[4];
					vkid = matches[5];
					vtag = matches[6];
					
					//alert('1='+matches[1]+',2:'+matches[2]+',3:'+matches[3]+',4:'+matches[4]+',5:'+matches[5]+',6:'+matches[6]+',7:'+matches[7]);
				}
				break;
			}
		}

		//alert('vtag='+vtag+', vkid='+vkid+', host='+host+', uid='+uid+', no_flv='+noflv);
		if (ver && vtag && vkid && host) {
			// Use AJAX if all goes fine

			//var getVideoLink = "http://vkadre.ru/get_video?version="+ver+"&vtag="+vtag+"&vkid="+vkid;
			//2010-01-21: http://cs12302.vkontakte.ru/u1331341/video/97529fa2cd.flv FROM:

			// 2009-12-30 NEW: Link generation
			
			var getVideoLink = "";
			var videoExt = noflv == '0' ? 'flv' : '240.mp4';
			if (host.search(/^[\d]+$/) != -1) {
				// Method 1-1
				//alert(1);
				getVideoLink = "http://cs"+host+".vkontakte.ru/u"+uid+"/video/"+vtag+"."+videoExt;
			} else if (uid && uid != '0') {
				// Method 1-3
				//alert(2);
				getVideoLink = host+"/u"+uid+"/video/"+vtag+'.'+videoExt;
			} else {
				// Method 1-2
				//alert(3);
				getVideoLink = "http://"+host+"/assets/videos/"+vtag+vkid+".vk."+videoExt;
			}
			
//			alert('URL='+getVideoLink);
			
			document.location = getVideoLink;
		} else {
			// Second attemp with another method
			var ver = null;
			var vtag = null;
			var vkid = null;
			var host = null;
		
			for (var i = 0; i < player.attributes.length; i++) {
				p = player.attributes[i];	// Get param
				if (p.name == 'flashvars') {
					// Variables found, try to get it
					// overstretch=false&vid=&host=195.218.182.34&vtag=3b501d2a&vkoid=-5146796&vkid=85347831
					var matches = p.value.match(/vtag=([^&]+)&vkoid=([^&]+)&vkid=([^&]+)&/);
					if (matches && matches.length > 0) {
						ver = 1;
						vtag = matches[1];
						vkid = matches[3];
					}
					break;
				}
			}
			
			if (ver && vtag && vkid) {
				// Use AJAX
				var getVideoLink = "http://vkadre.ru/get_video?version="+ver+"&vtag="+vtag+"&vkid="+vkid;
	
				var httpRequest = new XMLHttpRequest();
				if (httpRequest) {
					httpRequest.overrideMimeType('text/xml');
					httpRequest.onreadystatechange = function() {
						try {
							if (httpRequest.readyState == 4) {
							    // Everything is good, the response is received
							    if (httpRequest.status == 200) {
								    // Done!
								    var xmldoc = httpRequest.responseXML;
									var videoLoc = xmldoc.getElementsByTagName('location').item(0);
									document.location = videoLoc.firstChild.data;
								} else {
								    // There was a problem with the request
								    alert('Ошибка (1) при загрузке видео');
								}
							}
						} catch( e ) {
							// ignore
						}
					};
					httpRequest.open('GET', getVideoLink, true);	// asynchronous call
					httpRequest.send(null);
				} else {
					alert('Ошибка AJAX');
				}
			} else {
				alert('Ошибка (2) при загрузке видео');
			}
		}
	} else {
		//alert('На данной странице видео не найдено');
	}
};

ru.chupakabr.kontaktVideo.startsWith = function(s1,s2) {
	return (s1.match("^"+s2)==s2);
};

ru.chupakabr.kontaktVideo.run();
