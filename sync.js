let ahost = "archipelago.gg";
let aport = false;
let aname = false;
let apass = "";

let prog_card_key_count = 1;
let prog_pass_count = 0;

function connect() {
	if (!aport || !aname) {
		return;
	}
	socket = new WebSocket("wss://archipelago.gg:" + aport);

	socket.addEventListener('open', function (event) {
		socket.send(`[{
			"cmd" : "Connect",
			"password" : "` + apass + `",
			"game" : "Pokemon FireRed and LeafGreen",
			"name" : "` + aname + `",
			"tags" : ["Tracker"],
			"version" : {
				"major": 0,
				"minor": 6,
				"build": 6,
				"class": "Version"
			},
			"items_handling" : 7,
			"uuid" : "a1c0aac5-01e5-4957-99fe-6ae9edeafa78"
		}]`);
	});

	let slot = -1;
	socket.addEventListener('message', function (event) {
		const message = JSON.parse(event.data);
		console.log(message);
		let commands = [];
		for (let command of message) {
			commands.push(command.cmd);
		}

		// seems to be an initial connect response
		if (commands.includes("Connected")) {
			for (let command of message) {
				if (command.cmd === "Connected") {
					slot = command.slot;
					// for each "checked_location"
					if (currentGroup) {
						groupBreakDown.innerHTML = "";
					}
					settingsFromSlotData(command.slot_data);
					for (let location of command.checked_locations) {
						gotLocation(location);
					}
					if (currentGroup) {
						groupFocus(document.getElementById(currentGroup));
					}
					updateLocations();
					updateGroups();
					countchecks();
				}
				// for each "ReceivedItems"
				else if (command.cmd === "ReceivedItems") {
					if (currentGroup) {
						groupBreakDown.innerHTML = "";
					}
					for (let item of command.items) {
						gotItem(item.item);
					}
					if (currentGroup) {
						groupFocus(document.getElementById(currentGroup));
					}
					updateLocations();
					updateGroups();
					countchecks();
				}
			}
		}
		// on the fly
		else if (commands.includes("PrintJSON")) {
			for (let command of message) {
				if (command.cmd === "PrintJSON" && command.type === "ItemSend") {
					if (currentGroup) {
						groupBreakDown.innerHTML = "";
					}
					//I checked the location
					if (command.item.player === slot) {
						gotLocation(command.item.location);
					}
					//I recieved the item
					if (command.receiving === slot) {
						gotItem(command.item.item);
					}
					if (currentGroup) {
						groupFocus(document.getElementById(currentGroup));
					}
					updateLocations();
					updateGroups();
					countchecks();
				}
			}
		}
	});
}

function gotItem(id) {
	let itemName = idToItem[id];
	if (itemName) {
		if (itemName === "ITEM_PROG_CARD_KEY") {
			prog_card_key_count += 1;
			itemName = "ITEM_CARD_KEY_" + prog_card_key_count + "F";
		}
		else if (itemName === "ITEM_PROG_PASS") {
			if (getSettingState(island_passes) === 0) {
				if (prog_pass_count) {
					itemName = "ITEM_RAINBOW_PASS";
				}
				else {
					prog_pass_count += 1;
					itemName = "ITEM_TRI_PASS";
				}
			}
			else {
				prog_pass_count += 1;
				if (prog_pass_count === 1) {
					itemName = "ITEM_ONE_PASS";
				}
				else if (prog_pass_count === 2) {
					itemName = "ITEM_TWO_PASS";
				}
				else if (prog_pass_count === 3) {
					itemName = "ITEM_THREE_PASS";
				}
				else if (prog_pass_count === 4) {
					itemName = "ITEM_FOUR_PASS";
				}
				else if (prog_pass_count === 5) {
					itemName = "ITEM_FIVE_PASS";
				}
				else if (prog_pass_count === 6) {
					itemName = "ITEM_SIX_PASS";
				}
				else {
					itemName = "ITEM_SEVEN_PASS";
				}
			}
		}
		let div = document.getElementById(itemName);
		if (!div) {
			console.log("couldn't find div for: " + itemName);
		}
		else {
			addClassName(document.getElementById(itemName), "itemchecked");
		}
	}
}

function gotLocation(id) {
	let locationName = idToLocation[id];
	if (locationName) {
		let div = document.getElementById(locationName);
		if (div.classList.contains("sub")) {
			addClassName(document.getElementById(locationName), "subchecked");
		}
		else {
			addClassName(document.getElementById(locationName), "locationchecked");
		}
	}
	let eventName = idToEvent[id];
	if (eventName) {
		let div = document.getElementById(eventName);
		if (div.classList.contains("sub")) {
			addClassName(document.getElementById(eventName), "subchecked");
		}
		else {
			addClassName(document.getElementById(eventName), "locationchecked");
		}

	}
}

function settingsFromSlotData(slotData) {
	for (const setting of document.getElementsByClassName("setting")) {
		if (slotData[setting.id] != null) {
			setSettingClass(setting, "_" + slotData[setting.id]);
		}
	}
	// Special Cases
	if (getSettingState(card_key) === 2) {
		setSettingClass(card_key, "_1");
	}
	if (getSettingState(island_passes) === 1) {
		setSettingClass(island_passes, "_0");
	}
	else if (getSettingState(island_passes) === 2) {
		setSettingClass(island_passes, "_1");
	}
	else if (getSettingState(island_passes) === 3) {
		setSettingClass(island_passes, "_1");
	}
	if (getSettingState(viridian_city_roadblock) === 1) {
		setSettingClass(viridian_city_roadblock, "_0");
	}
	else if (getSettingState(viridian_city_roadblock) === 2) {
		setSettingClass(viridian_city_roadblock, "_1");
	}
	hideToMatch();
}