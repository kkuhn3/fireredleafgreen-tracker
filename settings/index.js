function launch() {
	let url = "../?"
	if (PNAME.value && APORT.value) {
		url = url + "&name=" + PNAME.value;
		url = url + "&port=" + APORT.value;
	}
	url = url + "&hi=" + HI.value;
	url = url + "&ko=" + KO.value;
	url = url + "&r3=" + R3.value;
	url = url + "&vgr=" + VGR.value;
	url = url + "&vgc=" + VGC.value;
	url = url + "&r2r=" + R2R.value;
	url = url + "&r2c=" + R2C.value;
	url = url + "&vrr=" + VRR.value;
	url = url + "&vrc=" + VRC.value;
	url = url + "&e4r=" + E4R.value;
	url = url + "&e4c=" + E4C.value;
	url = url + "&ccr=" + CCR.value;
	url = url + "&ccc=" + CCC.value;
	url = url.replace("?&", "?");
	window.open(url, "_self");
}