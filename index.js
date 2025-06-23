// Across
function conIdToString(id) {
	if (idToString[id]) {
		return idToString[id];
	}
	return id;
}
function addClassName(div, className) {
	if (!div.classList.contains(className)) {
		div.classList.add(className);
	}
}
function addOnClick() {
	for (let location of document.getElementsByClassName("location")) {
		location.onclick = function() {locationOnClick(location);};
		location.onmouseenter = function() {locationOnHover(location);};
		location.onmouseleave = function() {locationOnUnHover(location);};
	}
	for (let item of document.getElementsByClassName("item")) {
		item.onclick = function() {itemOnClick(item);};
		item.onmouseenter = function() {itemOnHover(item);};
		item.onmouseleave = function() {itemOnUnHover();};
	}
	for (let setting of document.getElementsByClassName("setting")) {
		setting.onmouseenter = function() {itemOnHover(setting);};
		setting.onmouseleave = function() {itemOnUnHover();};
	}
	for (let group of document.getElementsByClassName("group")) {
		group.onclick = function() {groupOnClick(group);};
		group.onmouseenter = function() {locationOnHover(group);};
		group.onmouseleave = function() {locationOnUnHover(group);};
	}
}
function isIntLessThan(check, max) {
	let intValue = parseInt(check, 10);
	return Number.isInteger(intValue) && intValue <= max && intValue >= 0;
}

// Locations
function locationOnHover(location) {
	const locationStyle = window.getComputedStyle(location);
	idViewer.style.top = locationStyle.top;
	idViewer.style.display = "block";
	idViewer.innerHTML = conIdToString(location.id);
	const idStyle = window.getComputedStyle(idViewer);
	const kantoStyle = window.getComputedStyle(map);
	if (parseInt(locationStyle.left, 10) > parseInt(kantoStyle.width, 10) / 2) {
		idViewer.style.left = parseInt(locationStyle.left, 10) - parseInt(idStyle.width, 10) - 36 + "px";
	}
	else {
		idViewer.style.left = parseInt(locationStyle.left, 10) + 20 + "px";
	}
}
function locationOnUnHover() {
	idViewer.style.display = "none";
}
function locationOnClick(location) {
	location.classList.toggle("locationchecked");
	if (location.id.includes("EVENT_")) {
		updateLocations();
		updateGroups();
	}
	countchecks();
}
function setLogicClass(div, className) {
	div.classList.remove("locationevent", "locationpossible", "locationlogical", "locationeventpossible", "locationeventlogical");
	div.classList.remove("groupevent", "grouppossible", "grouplogical", "groupeventpossible", "groupeventlogical");
	div.classList.remove("subevent", "subpossible", "sublogical", "subeventpossible", "subeventlogical");
	if (className) {
		div.classList.add(className);
	}
}
function setHighClass(div, className) {
	div.classList.remove("possibleHighlight", "logicalHighlight");
	if (className !== "undefinedHighlight") {
		div.classList.add(className);
	}
}
function updateLocations() {
	if (currentGroup) {
		groupBreakDown.innerHTML = "";
	}
	for (const locationId in locationLogic) {
		updateLocation(locationId);
	}
	if (currentGroup) {
		groupFocus(document.getElementById(currentGroup));
	}
}
function updateLocation(locationId) {
	let div = document.getElementById(locationId);
	const isSub = div.classList.contains("sub");
	const isEvent = locationId.includes("EVENT_");
	const availablity = locationLogic[locationId]();
	let logicClass = "";
	if (isEvent || availablity) {
		if (isSub) {
			logicClass = "sub";
		}
		else {
			logicClass = "location";
		}
		if (isEvent) {
			logicClass = logicClass + "event";
		}
		if (availablity) {
			logicClass = logicClass + availablity;
		}
	}
	if (Object.hasOwn(locationHighlight, locationId)) {
		const highlight = locationHighlight[locationId]();
		setHighClass(div, highlight + "Highlight");
	}
	setLogicClass(div, logicClass);
}

// Items
function itemOnHover(item) {
	itemHoverDesc.innerHTML = conIdToString(item.id);
}
function itemOnUnHover() {
	if (currentGroup) {
		itemHoverDesc.innerHTML = conIdToString(currentGroup);
	}
	else {
		itemHoverDesc.innerHTML = "&nbsp";
	}
}
function itemOnClick(item) {
	item.classList.toggle("itemchecked");
	updateLocations();
	updateGroups();
	countchecks();
}

//Settings
//Settings - Helper
function getSettingState(div) {
	return parseInt(div.classList[div.classList.length - 1].substring(1), 10);
}
function settingIterate(setting, max) {
	let count = getSettingState(setting);
	setting.classList.remove(setting.classList[setting.classList.length - 1]);
	count = count + 1;
	if (count > max) {
		count = 0;
	}
	setting.classList.add("_" + count);
}
function setSettingClass(div, className) {
	div.classList.remove("_0", "_1", "_2", "_3", "_4", "_5", "_6", "_7", "_8");
	if (className) {
		div.classList.add(className);
	}
}

//Settings - items in logic
function hideToMatch() {
	let shouldHide = [];
	if (getSettingState(goal) === 0) {
		shouldHide = shouldHide.concat(postE4Locs);
		ccreqs = getSettingState(cerulean_cave_requirement);
		if (ccreqs === 0 || ccreqs === 1) {
			shouldHide = shouldHide.concat(ceruleanCaveLocs);
		}
	}
	if (getSettingState(kanto_only) === 1) {
		shouldHide = shouldHide.concat(sevii_locs);
	}
	if (getSettingState(shuffle_hidden) === 0) {
		shouldHide = shouldHide.concat(HIDDEN_ITEM_locs);
		shouldHide = shouldHide.concat(HIDDEN_ITEM_RECURRING_locs);
	}
	else if (getSettingState(shuffle_hidden) === 1) {
		shouldHide = shouldHide.concat(HIDDEN_ITEM_RECURRING_locs);
	}
	if (getSettingState(extra_key_items) === 0) {
		shouldHide = shouldHide.concat(EXTRA_KEY_ITEM_locs);
	}
	if (getSettingState(pokemon_request_locations) === 0) {
		shouldHide = shouldHide.concat(POKEMON_REQUEST_locs);
	}
	if (getSettingState(shuffle_berry_pouch) === 0) {
		shouldHide.push(STARTING_ITEM_BERRY_POUCH_loc);
	}
	if (getSettingState(shuffle_tm_case) === 0) {
		shouldHide.push(STARTING_ITEM_TM_CASE_loc);
	}
	if (getSettingState(card_key) === 0) {
		shouldHide = shouldHide.concat(SPLIT_CARD_KEY_locs);
	}
	if (getSettingState(island_passes) === 0) {
		shouldHide = shouldHide.concat(SPLIT_ISLAND_PASS_locs);
	}
	if (getSettingState(split_teas) === 0) {
		shouldHide = shouldHide.concat(SPLIT_TEA_locs);
	}
	if (getSettingState(gym_keys) === 0) {
		shouldHide = shouldHide.concat(GYM_KEY_locs);
	}
	for (let location of document.getElementsByClassName("location")) {
		location.classList.remove("hidden");
		if (shouldHide.includes(location.id)) {
			location.classList.add("hidden");
		}
	}
	for (let sub of document.getElementsByClassName("sub")) {
		sub.classList.remove("hidden");
		if (shouldHide.includes(sub.id)) {
			sub.classList.add("hidden");
		}
	}
	updateGroups();
	countchecks();
}
function settingHide(div, count) {
	settingIterate(div, count);
	groupBreakDown.innerHTML = "";
	hideToMatch();
	updateGroups();
	countchecks();
	if (currentGroup) {
		groupFocus(document.getElementById(currentGroup));
	}
}
function settingLogic(div, count) {
	settingIterate(div, count);
	groupBreakDown.innerHTML = "";
	updateLocations();
	updateGroups();
	countchecks();
	if (currentGroup) {
		groupFocus(document.getElementById(currentGroup));
	}
}
function settingLogicHide(div, count) {
	settingIterate(div, count);
	groupBreakDown.innerHTML = "";
	hideToMatch();
	updateLocations();
	updateGroups();
	countchecks();
	if (currentGroup) {
		groupFocus(document.getElementById(currentGroup));
	}
}

// Groups
let currentGroup = "";
function groupOnClick(group) {
	currentGroup = group.id;
	itemHoverDesc.innerHTML = conIdToString(group.id);
	groupFocus(group);
}
function groupFocus(group) {
	groupBreakDown.innerHTML = group.innerHTML;
	for (let sub of groupBreakDown.getElementsByTagName("div")) {
		sub.innerHTML = "&nbsp" + conIdToString(sub.id);
		sub.onclick = function() {subOnClick(sub)};
	}
}
function updateGroups() {
	for (let group of document.getElementsByClassName("group")) {
		updateGroup(group);
	}
}
function updateGroupById(id) {
	updateGroup(document.getElementById(id));
}
function updateGroup(group) {
	let hidden = true;
	let logical = false;
	let logicalevent = false;
	let possible = false;
	let possibleevent = false;
	let event = false;
	let checked = true;
	for (let sub of group.getElementsByClassName("sub")) {
		if (!sub.classList.contains("hidden")) {
			hidden = false;
			if (!sub.classList.contains("subchecked")) {
				checked = false;
				if (sub.classList.contains("sublogical")) {
					logical = true;
				}
				if (sub.classList.contains("subeventlogical")) {
					logicalevent = true;
				}
				if (sub.classList.contains("subpossible")) {
					possible = true;
				}
				if (sub.classList.contains("subeventpossible")) {
					possibleevent = true;
				}
				if (sub.classList.contains("subevent")) {
					event = true;
				}
			}
		}
	}
	if (hidden) {
		addClassName(group, "hidden");
	}
	else {
		group.classList.remove("hidden");
	}
	if (checked) {
		addClassName(group, "groupchecked");
	}
	else {
		group.classList.remove("groupchecked");
	}
	if (logicalevent) {
		setLogicClass(group, "groupeventlogical");
	}
	else if (logical) {
		setLogicClass(group, "grouplogical");
	}
	else if (possibleevent) {
		setLogicClass(group, "groupeventpossible");
	}
	else if (possible) {
		setLogicClass(group, "grouppossible");
	}
	else if (event) {
		setLogicClass(group, "groupevent")
	}
	else {
		setLogicClass(group, false);
	}
}

//subs
function subOnClick(sub) {
	groupBreakDown.innerHTML = "";
	let trueSub = document.getElementById(sub.id);
	trueSub.classList.toggle("subchecked");
	if (sub.id.includes("EVENT_")) {
		updateLocations();
	}
	updateGroups();
	countchecks();
	groupFocus(document.getElementById(currentGroup));
}

//Location Counts
function countchecks() {
	let total = 0;
	let checked = 0;
	let logical = 0;
	for (let child of map.children) {
		if (child.classList.contains("group")) {
			for (let sub of child.children) {
				if (!sub.id.includes("EVENT_") && !sub.classList.contains("hidden")) {
					total = total + 1;
					if (sub.classList.contains("subchecked")) {
						checked = checked + 1;
					}
					else if (sub.classList.contains("sublogical") || sub.classList.contains("subeventlogical")) {
						logical = logical + 1;
					}
				}
			}
		}
		else if (child.classList.contains("location")) {
			if (!child.id.includes("EVENT_") && !child.classList.contains("hidden")) {
				total = total + 1;
				if (child.classList.contains("locationchecked")) {
					checked = checked + 1;
				}
				else if (child.classList.contains("locationlogical") || child.classList.contains("locationeventlogical")) {
					logical = logical + 1;
				}
			}
		}
	}
	CHECK_CHECKED.innerHTML = checked;
	CHECK_LOGICAL.innerHTML = logical;
	CHECK_TOTAL.innerHTML = total;
}

//Parse URL inputs
function parseSettings() {
	const urlSearch = new URLSearchParams(window.location.search);
	for (const [key, value] of urlSearch) {
		let div = document.getElementById(key);
		if (div) {
			setSettingClass(div, "_" + value);
		}
	}

	if (urlSearch.get("name") && urlSearch.get("port")) {
		aname = urlSearch.get("name");
		aport = urlSearch.get("port");
		if (urlSearch.get("host")) {
			ahost = urlSearch.get("host");
		}
		if (urlSearch.get("pass")) {
			apass = urlSearch.get("pass");
		}
	}
}