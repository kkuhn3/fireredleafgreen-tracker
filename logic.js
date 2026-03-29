function has(item) {
	const itemdiv = document.getElementById(item);
	if (!itemdiv) {
		return false;
	}
	if (itemdiv.classList.contains("locationchecked") || 
		   itemdiv.classList.contains("itemchecked") ||
		   itemdiv.classList.contains("subchecked")) {
		return "logical";
	}
}

function count_badges() {
	let count = 0;
	const badges = ["ITEM_BADGE_1", "ITEM_BADGE_2", "ITEM_BADGE_3", "ITEM_BADGE_4", "ITEM_BADGE_5", "ITEM_BADGE_6", "ITEM_BADGE_7", "ITEM_BADGE_8"];
	for (const badge of badges) {
		const badgeDiv = document.getElementById(badge);
		if (badgeDiv.classList.contains("itemchecked")) {
			count = count + 1;
		}
	}
	return count;
}
function count_gyms() {
	let count = 0;
	const gyms = ["EVENT_DEFEAT_GIOVANNI", "EVENT_DEFEAT_BROCK", "EVENT_DEFEAT_MISTY", "EVENT_DEFEAT_SURGE", "EVENT_DEFEAT_ERIKA", "EVENT_DEFEAT_SABRINA", "EVENT_DEFEAT_KOGA", "EVENT_DEFEAT_BLAINE"];
	for (const gym of gyms) {
		const gymDiv = document.getElementById(gym);
		if (gymDiv.classList.contains("subchecked")) {
			count = count + 1;
		}
	}
	return count;
}
function could_gyms() {
	let countLogical = 0;
	let countPossible = 0;
	const gyms = ["EVENT_DEFEAT_BROCK", "EVENT_DEFEAT_MISTY", "EVENT_DEFEAT_SURGE", "EVENT_DEFEAT_ERIKA", "EVENT_DEFEAT_SABRINA", "EVENT_DEFEAT_KOGA", "EVENT_DEFEAT_BLAINE"];
	for (const gym of gyms) {
		if (has(gym)) {
			countLogical = countLogical + 1;
		}
		else {
			const logicalness = locationLogic[gym]();
			if (logicalness === "logical") {
				countLogical = countLogical + 1;
			}
			else if (logicalness === "possible") {
				countPossible = countPossible + 1;
			}
		}
	}
	return [countLogical, countPossible];
}
function could_gym_badge_count(requirementDiv, countDiv, countBadges, couldGyms) {
	const wantGyms = getSettingState(requirementDiv);
	const wantCount = getSettingState(countDiv);
	if (wantGyms) {
		return couldGyms >= wantCount;
	}
	return countBadges >= wantCount;
}


function can_tm() {
	if (getSettingState(shuffle_tm_case) === 0) {
		return "logical";
	}
	return has("ITEM_TM_CASE");
}
function can_cut() {
	if (can_tm() && has("ITEM_BADGE_2") && has("ITEM_HM_CUT")) {
		return "logical";
	}
}
function can_flash() {
	const flashReq = getSettingState(flash_required);
	if (flashReq === 0) {
		return "logical";
	}
	let canFlash = false;
	if (can_tm() && has("ITEM_BADGE_1") && has("ITEM_HM_FLASH")) {
		canFlash = true;
	}
	if (canFlash) {
		return "logical";
	}
	if (flashReq === 1) {
		return "possible";
	}
	return false;
}
function can_strength() {
	if (can_tm() && has("ITEM_BADGE_4") && has("ITEM_HM_STRENGTH")) {
		return "logical";
	}
}
function can_surf() {
	if (can_tm() && has("ITEM_BADGE_5") && has("ITEM_HM_SURF")) {
		return "logical";
	}
}
function can_rockSmash() {
	if (can_tm() && has("ITEM_BADGE_6") && has("ITEM_HM_ROCK_SMASH")) {
		return "logical";
	}
}
function can_waterfall() {
	if (can_surf() && has("ITEM_BADGE_7") && has("ITEM_HM_WATERFALL")) {
		return "logical";
	}
}
function can_down_ledges() {
	if (getSettingState(shuffle_jumping_shoes) === 0) {
		return "logical";
	}
	if (has("ITEM_JUMPING_SHOES")) {
		return "logical";
	}
	if (getSettingState(bicycle_requires_jumping_shoes) === 0){
		return has("ITEM_BICYCLE");
	}
}
function can_up_ledges() {
	if (getSettingState(acrobatic_bicycle) && has("ITEM_BICYCLE")) {
		if (getSettingState(shuffle_jumping_shoes) === 0 || getSettingState(bicycle_requires_jumping_shoes) === 0) {
			return "logical";
		}
		return has("ITEM_JUMPING_SHOES");
	}
}
function can_pokedex() {
	if (getSettingState(shuffle_pokedex) === 0) {
		return "logical";
	}
	return has("ITEM_POKEDEX")
}
function hidden_logic() {
	const itemfinderReq = getSettingState(itemfinder_required);
	if (itemfinderReq === 0) {
		return "logical";
	}
	if (has("ITEM_ITEMFINDER")) {
		return "logical";
	}
	if (itemfinderReq === 1) {
		return "possible";
	}
	return false;
}
function min(logic1, logic2) {
	if (!logic1 || !logic2) {
		return false;
	}
	if (logic1 === "possible" || logic2 === "possible") {
		return "possible";
	}
	return "logical";
}
function max(logic1, logic2) {
	if (!logic1 && !logic2) {
		return false;
	}
	if (logic1 === "logical" || logic2 === "logical") {
		return "logical";
	}
	return "possible";
}

// Logic Helpers
function can_gym_badge_count(requirementDiv, countDiv) {
	const wantGyms = getSettingState(requirementDiv);
	const wantCount = getSettingState(countDiv);
	let count = 0;
	if (wantGyms) {
		count = count_gyms();
	}
	else {
		count = count_badges();
	}
	if (count >= wantCount) {
		return "logical";
	}
}
function can_viridian_city_roadblock() {
	if (getSettingState(viridian_city_roadblock) === 1 || has("EVENT_RETURN_PARCEL")) {
		return "logical";
	}
	return can_cut();
}
function can_gym(gymKey) {
	if (getSettingState(gym_keys) === 0 || has(gymKey)) {
		return "logical";
	}
}
function can_cinnabarGym() {
	if (getSettingState(gym_keys) === 0) {
		if (has("ITEM_SECRET_KEY")) {
			return "logical";
		}
	}
	else if (has("ITEM_CINNABAR_KEY")) {
		return "logical";
	}
}
function can_pewter_city_roadblock() {
	const r3id = getSettingState(pewter_city_roadblock);
	if (r3id === 0) {
		return true;
	}
	else if (r3id === 1) {
		return has("EVENT_DEFEAT_BROCK");
	}
	else if (r3id === 2) {
		return count_gyms() > 0;
	}
	else if (r3id === 3) {
		return has("ITEM_BADGE_1");
	}
	else if (r3id === 4) {
		return count_badges() > 0;
	}
}
function can_cerulean_to_one() {
	return min(can_island("ITEM_TRI_PASS", "ITEM_ONE_PASS"), max(has("EVENT_ASSIST_BILL"), can_cut()));
}
function can_restoreNetwork() {
	if (has("EVENT_DELIVER_METEORITE") && has("EVENT_RELEASE_POKEMON") && has("ITEM_RUBY") && has("ITEM_SAPPHIRE")) {
		return "logical";
	}
}
function can_ceruleanCave() {
	if (can_surf() || can_up_ledges()) {
		const requirement = getSettingState(cerulean_cave_requirement);
		if (requirement === 0) {
			if (has("EVENT_DEFEAT_BLUE") && min(can_restoreNetwork(), can_cerulean_to_one())) {
				return "logical";
			}
			return;
		}
		if (requirement === 1) {
			return has("EVENT_DEFEAT_BLUE");
		}
		if (requirement === 2) {
			return min(can_restoreNetwork(), can_cerulean_to_one());
		}
		const count = getSettingState(cerulean_cave_count);
		if (requirement === 3) {
			if (count_gyms() >= count) {
				return "logical";
			}
			return;
		}
		if (requirement === 4) {
			if (count_badges() >= count) {
				return "logical";
			}
			return;
		}
	}
}
function can_island(trirain, progressive) {
	const passType = getSettingState(island_passes);
	if (passType === 0) {
		return has(trirain);
	}
	return has(progressive);
}
function can_tea_cerulean_vermilion() {
	if (getSettingState(split_teas) === 0) {
		return has("ITEM_TEA");
	}
	return max(has("ITEM_BLUE_TEA"), has("ITEM_RED_TEA"));
}
function can_tea_lavender_celadon() {
	if (getSettingState(split_teas) === 0) {
		return has("ITEM_TEA");
	}
	return max(has("ITEM_GREEN_TEA"), has("ITEM_PURPLE_TEA"));
}
function can_extra_key(extraKey) {
	if (getSettingState(extra_key_items) === 0 || has(extraKey)) {
		return "logical";
	}
}
function can_silph(floor) {
	if (getSettingState(card_key) == 0) {
		return min(has("ITEM_CARD_KEY"), can_reach("Silph Co."));
	}
	return min(has("ITEM_CARD_KEY_" + floor + "F"), can_reach("Silph Co."));
}
function can_rocketWarehouse() {
	// first can you get there
	if (can_reach("Five Island")) {
		// Then if you can get "goldeen_need_log"
		if (can_surf() && has("EVENT_DELIVER_METEORITE") && can_reach("One Island")) {
			// and if you can get "yes_nah_chansey"
			if (can_reach("Six Island") && can_cut()) {
				return "logical";
			}
		}
	}
}
function could_e4() {
	const couldGyms = could_gyms();
	let logicalGyms = couldGyms[0];
	let possibleGyms = couldGyms[1];
	const countBadges = count_badges();
	if (has("EVENT_DEFEAT_GIOVANNI") || could_gym_badge_count(viridian_gym_requirement, viridian_gym_count, countBadges, logicalGyms)) {
		logicalGyms = logicalGyms + 1;
	}
	else if (could_gym_badge_count(viridian_gym_requirement, viridian_gym_count, countBadges, logicalGyms + possibleGyms)) {
		possibleGyms = possibleGyms + 1;
	}
	if (could_gym_badge_count(route22_gate_requirement, route22_gate_count, countBadges, logicalGyms)) {
		if (could_gym_badge_count(route23_guard_requirement, route23_guard_count, countBadges, logicalGyms)) {
			if (could_gym_badge_count(elite_four_requirement, elite_four_count, countBadges, logicalGyms)) {
				return "logical";
			}
		}
	}
	if (could_gym_badge_count(route22_gate_requirement, route22_gate_count, countBadges, logicalGyms + possibleGyms)) {
		if (could_gym_badge_count(route23_guard_requirement, route23_guard_count, countBadges, logicalGyms + possibleGyms)) {
			if (could_gym_badge_count(elite_four_requirement, elite_four_count, countBadges, logicalGyms + possibleGyms)) {
				return "possible";
			}
		}
	}
}


// The logic graph
const regions = {
	"Pallet Town": {
		"Route 23": function() {
			return can_gym_badge_count(route22_gate_requirement, route22_gate_count);
		},
		"Pewter City": function() {
			return can_viridian_city_roadblock();
		},
		"Cinnabar Island": function() {
			return can_surf();
		},
		"Viridian Gym": function() {
			return min(can_gym("ITEM_VIRIDIAN_KEY"), can_gym_badge_count(viridian_gym_requirement, viridian_gym_count));
		}
	},
	"Pewter City": {
		"Pallet Town": function() {
			return max(can_viridian_city_roadblock(), can_down_ledges());
		},
		"Mt. Moon": function() {
			return can_pewter_city_roadblock();
		},
		"Vermilion City": function() {
			return can_cut();
		},
		"Pewter Gym": function() {
			return can_gym("ITEM_PEWTER_KEY");
		}
	},
	"Mt. Moon": {
		"Pewter City": function() {
			return can_pewter_city_roadblock();
		},
		"Cerulean City": function() {
			return can_down_ledges();
		}
	},
	"Cerulean City": {
		"Mt. Moon": function() {
			return max(min(can_surf(), can_down_ledges()), can_up_ledges());
		},
		"Route 9": function() {
			return can_cut();
		},
		"Vermilion City": function() {
			return max(has("EVENT_ASSIST_BILL"), can_cut());
		},
		"Cerulean Gym": function() {
			return can_gym("ITEM_CERULEAN_KEY");
		},
		"Cerulean Cave": function() {
			return can_ceruleanCave();
		}
	},
	"Route 9": {
		"Cerulean City": function() {
			return can_cut();
		},
		"Rock Tunnel": function() {
			return can_flash();
		},
		"Power Plant": function() {
			return min(can_extra_key("ITEM_MACHINE_PART"), can_surf());
		}
	},
	"Rock Tunnel": {
		"Route 9": function() {
			return "logical";
		},
		"Lavender Town": function() {
			return "logical";
		}
	},
	"Vermilion City": {
		"Cerulean City": function() {
			return max(can_down_ledges(), can_cut());
		},
		"Lavender Town": function() {
			return has("ITEM_POKE_FLUTE");
		},
		"Pewter City": function() {
			return can_cut();
		},
		"Saffron City": function() {
			return can_tea_cerulean_vermilion();
		},
		"S.S. Anne": function() {
			return has("ITEM_SS_TICKET");
		},
		"One Island": function() {
			return can_island("ITEM_TRI_PASS", "ITEM_ONE_PASS");
		},
		"Two Island": function() {
			return can_island("ITEM_TRI_PASS", "ITEM_TWO_PASS");
		},
		"Three Island": function() {
			return can_island("ITEM_TRI_PASS", "ITEM_THREE_PASS");
		},
		"Four Island": function() {
			return can_island("ITEM_RAINBOW_PASS", "ITEM_FOUR_PASS");
		},
		"Five Island": function() {
			return can_island("ITEM_RAINBOW_PASS", "ITEM_FIVE_PASS");
		},
		"Six Island": function() {
			return can_island("ITEM_RAINBOW_PASS", "ITEM_SIX_PASS");
		},
		"Seven Island": function() {
			return can_island("ITEM_RAINBOW_PASS", "ITEM_SEVEN_PASS");
		},
		"Vermilion Gym": function() {
			return min(can_gym("ITEM_VERMILION_KEY"), max(can_surf(), can_cut()));
		}
	},
	"Lavender Town": {
		"Vermilion City": function() {
			return has("ITEM_POKE_FLUTE");
		},
		"Fuchsia City": function() {
			return max(has("ITEM_POKE_FLUTE"), can_surf());
		},
		"Saffron City": function() {
			return can_tea_lavender_celadon();
		},
		"Celadon Gym": function() {
			return min(can_gym("ITEM_CELADON_KEY"), can_cut());
		},
		"Coin Case": function() {
			return has("ITEM_COIN_CASE");
		},
		"Rocket Hideout": function() {
			return can_extra_key("ITEM_HIDEOUT_KEY");
		},
		"Rock Tunnel": function() {
			return can_flash();
		}
	},
	"Rocket Hideout": {
		"Giovanni's Room": function() {
			return has("ITEM_LIFT_KEY");
		}
	},
	"Saffron City": {
		"Vermilion City": function() {
			return can_tea_cerulean_vermilion();
		},
		"Lavender Town": function() {
			return can_tea_lavender_celadon();
		},
		"Saffron Gym": function() {
			return min(can_gym("ITEM_SAFFRON_KEY"), has("EVENT_FREE_SILPH"));
		},
		"Silph Co.": function() {
			return has("EVENT_RESCUE_FUJI");
		}
	},
	"Fuchsia City": {
		"Lavender Town": function() {
			return max(has("ITEM_POKE_FLUTE"), can_surf());
		},
		"Seafoam Islands": function() {
			return can_surf();
		},
		"Fuschia Gym": function() {
			return can_gym("ITEM_FUSCHIA_KEY");
		},
		"Safari Zone": function() {
			return can_extra_key("ITEM_SAFARI_PASS");
		}
	},
	"Seafoam Islands": {
		"Fuchsia City": function() {
			return can_surf();
		},
		"Cinnabar Island": function() {
			return min(can_strength(), can_surf());
		}
	},
	"Cinnabar Island": {
		"Seafoam Islands": function() {
			return can_waterfall();
		},
		"Pallet Town": function() {
			return can_surf();
		},
		"One Island": function() {
			return has("EVENT_DEFEAT_BLAINE");
		},
		"Cinnabar Gym": function() {
			return can_cinnabarGym();
		},
		"Pokemon Mansion": function() {
			return can_extra_key("ITEM_LETTER");
		}
	},
	"Route 23": {
		"Pallet Town": function() {
			return "logical";
		},
		"Victory Road Entrance": function() {
			return min(can_surf(), can_gym_badge_count(route23_guard_requirement, route23_guard_count));
		}
	},
	"Victory Road Entrance": {
		"Route 23": function() {
			return can_surf();
		},
		"Victory Road Exit": function() {
			return can_strength();
		}
	},
	"Victory Road Exit": {
		"Victory Road Entrance": function() {
			return can_strength();
		},
		"Elite Four": function() {
			return can_gym_badge_count(elite_four_requirement, elite_four_count);
		}
	},
	"One Island": {
		"Vermilion City": function() {
			return "logical";
		},
		"Mt. Ember": function() {
			return can_surf();
		},
		"Treasure Beach": function() {
			return min(can_surf(), hidden_logic());
		}
	},
	"Two Island": {
		"Vermilion City": function() {
			return "logical";
		}
	},
	"Three Island": {
		"Vermilion City": function() {
			return "logical";
		}
	},
	"Four Island": {
		"Vermilion City": function() {
			return "logical";
		},
		"Icefall Cave": function() {
			return can_surf();
		}
	},
	"Five Island": {
		"Vermilion City": function() {
			return "logical";
		},
		"Lost Cave": function() {
			return can_surf();
		}
	},
	"Six Island": {
		"Vermilion City": function() {
			return "logical";
		},
		"Water Path": function() {
			return can_surf();
		}
	},
	"Seven Island": {
		"Vermilion City": function() {
			return "logical";
		},
		"Tanoby Ruins": function() {
			return can_surf();
		}
	}
}

function evaluate_graph(reqs) {
	const startingRegion = "Pallet Town";
	let tobe = [startingRegion];
	let been = [startingRegion];
	while (tobe.length > 0) {
		const nextRegion = tobe.pop();
		if (regions[nextRegion]) {
			for (const [key, value] of Object.entries(regions[nextRegion])) {
				if (reqs.includes(value()) && !been.includes(key)) {
					tobe.push(key);
					been.push(key);
				}
			}
		}
	}
	return been;
}
let logicalRegions = [];
let possibleRegions = [];
function revaluate() {
	logicalRegions = evaluate_graph(["logical"]);
	possibleRegions = evaluate_graph(["logical", "possible"]);
}
function can_reach(region) {
	if (logicalRegions.includes(region)) {
		return "logical";
	}
	if (possibleRegions.includes(region)) {
		return "possible"
	}
}


const locationHighlight = {
	"EVENT_DEFEAT_BLUE": function() {
		return min(could_e4(), can_reach("Elite Four"));
	},
	"EVENT_DEFEAT_BLUE_REMATCH": function() {
		return min(could_e4(), can_reach("Elite Four"));
	}
}

const locationLogic = {
	// ////////////////////
	// Cities
	// ////////////////////
	// Pallet Town
	"NPC_GIFT_GOT_TOWN_MAP": function() {
		return min(has("EVENT_RETURN_PARCEL"), can_reach("Pallet Town"));
	},
	"NPC_GIFT_GOT_FIRST_POKEBALLS": function() {
		return min(has("ITEM_OAKS_PARCEL"), can_reach("Pallet Town"));
	},
	"EVENT_RETURN_PARCEL": function() {
		return min(has("ITEM_OAKS_PARCEL"), can_reach("Pallet Town"));
	},
	"NPC_GIFT_GOT_POKEDEX": function() {
		return can_reach("Pallet Town");
	},
	"NPC_GIFT_GOT_POKEBALLS_FROM_OAK_AFTER_22_RIVAL": function() {
		return min(has("EVENT_RETURN_PARCEL"), can_reach("Pallet Town"));
	},
	"PC_ITEM_POTION": function() {
		return can_reach("Pallet Town");
	},
	// Viridian City
	"NPC_GIFT_GOT_TEACHY_TV": function() {
		return min(has("EVENT_RETURN_PARCEL"), can_reach("Pallet Town"));
	},
	"ITEM_VIRIDIAN_CITY_POTION": function() {
		return can_reach("Pallet Town");
	},
	"NPC_GIFT_GOT_OAKS_PARCEL": function() {
		return can_reach("Pallet Town");
	},
	// Viridian Gym
	"NPC_GIFT_GOT_VIRIDIAN_KEY": function() {
		return can_reach("Pewter City");
	},
	"EVENT_DEFEAT_GIOVANNI": function() {
		return can_reach("Viridian Gym");
	},
	"BADGE_8": function() {
		return can_reach("Viridian Gym");
	},
	"NPC_GIFT_GOT_TM26_FROM_GIOVANNI": function() {
		return can_reach("Viridian Gym");
	},
	"HIDDEN_ITEM_VIRIDIAN_CITY_GYM_MACHO_BRACE": function() {
		return min(hidden_logic(), can_reach("Viridian Gym"));
	},
	// Pewter City
	"HIDDEN_ITEM_PEWTER_CITY_POKE_BALL": function() {
		return min(hidden_logic(), can_reach("Pewter City"));
	},
	"NPC_GIFT_GOT_OLD_AMBER": function() {
		return min(max(can_cut(), can_up_ledges()), can_reach("Pewter City"));
	},
	// Pewter Gym
	"EVENT_DEFEAT_BROCK": function() {
		return can_reach("Pewter Gym");
	},
	"BADGE_1": function() {
		return can_reach("Pewter Gym");
	},
	"NPC_GIFT_GOT_TM39_FROM_BROCK": function() {
		return can_reach("Pewter Gym");
	},
	"NPC_GIFT_GOT_RUNNING_SHOES": function() {
		return min(has("EVENT_DEFEAT_BROCK"), can_reach("Mt. Moon"));
	},
	"ITEM_PEWTER_MUSEUM_2F_PEWTER_KEY": function() {
		return can_reach("Pewter City");
	},
	// Cerulean City
	"NPC_GIFT_GOT_FAME_CHECKER": function() {
		return can_reach("Cerulean City");
	},
	"HIDDEN_ITEM_CERULEAN_CITY_RARE_CANDY": function() {
		return min(hidden_logic(), can_reach("Cerulean City"));
	},
	"NPC_GIFT_GOT_TM28_FROM_ROCKET": function() {
		return min(has("EVENT_ASSIST_BILL"), can_reach("Cerulean City"));
	},
	"NPC_GIFT_GOT_BICYCLE": function() {
		return min(has("ITEM_BIKE_VOUCHER"), can_reach("Cerulean City"));
	},
	"NPC_GIFT_GOT_POWDER_JAR": function() {
		return min(has("ITEM_BERRY_POUCH"), can_reach("Cerulean City"));
	},
	// Cerulean Gym
	"HIDDEN_ITEM_CERULEAN_CITY_GYM_MACHINE_PART": function() {
		return min(min(can_surf(), hidden_logic()), can_reach("Cerulean Gym"));
	},
	"EVENT_DEFEAT_MISTY": function() {
		return can_reach("Cerulean Gym");
	},
	"BADGE_2": function() {
		return can_reach("Cerulean Gym");
	},
	"NPC_GIFT_GOT_TM03_FROM_MISTY": function() {
		return can_reach("Cerulean Gym");
	},
	// Cerulean Cave
	"HIDDEN_ITEM_CERULEAN_CAVE_1F_ULTRA_BALL": function() {
		return min(hidden_logic(), can_reach("Cerulean Cave"));
	},
	"ITEM_CERULEAN_CAVE_1F_NUGGET": function() {
		return can_reach("Cerulean Cave");
	},
	"ITEM_CERULEAN_CAVE_1F_FULL_RESTORE": function() {
		return can_reach("Cerulean Cave");
	},
	"ITEM_CERULEAN_CAVE_1F_MAX_ELIXIR": function() {
		return can_reach("Cerulean Cave");
	},
	"ITEM_CERULEAN_CAVE_2F_FULL_RESTORE": function() {
		return can_reach("Cerulean Cave");
	},
	"ITEM_CERULEAN_CAVE_2F_PP_UP": function() {
		return can_reach("Cerulean Cave");
	},
	"ITEM_CERULEAN_CAVE_2F_ULTRA_BALL": function() {
		return can_reach("Cerulean Cave");
	},
	"ITEM_CERULEAN_CAVE_B1F_MAX_REVIVE": function() {
		return can_reach("Cerulean Cave");
	},
	"ITEM_CERULEAN_CAVE_B1F_ULTRA_BALL": function() {
		return can_reach("Cerulean Cave");
	},
	// Vermilion City
	"HIDDEN_ITEM_VERMILION_CITY_MAX_ETHER": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	"NPC_GIFT_GOT_OLD_ROD": function() {
		return can_reach("Vermilion City");
	},
	"NPC_GIFT_GOT_VS_SEEKER": function() {
		return can_reach("Vermilion City");
	},
	"NPC_GIFT_GOT_BIKE_VOUCHER": function() {
		return can_reach("Vermilion City");
	},
	// Vermilion Gym
	"EVENT_DEFEAT_SURGE": function() {
		return can_reach("Vermilion Gym");
	},
	"BADGE_3": function() {
		return can_reach("Vermilion Gym");
	},
	"NPC_GIFT_GOT_TM34_FROM_SURGE": function() {
		return can_reach("Vermilion Gym");
	},
	// SS Anne
	"HIDDEN_ITEM_SSANNE_EXTERIOR_LAVA_COOKIE": function() {
		return min(hidden_logic(), can_reach("S.S. Anne"));
	},
	"ITEM_SSANNE_KITCHEN_GREAT_BALL": function() {
		return can_reach("S.S. Anne");
	},
	"HIDDEN_ITEM_SSANNE_KITCHEN_PECHA_BERRY": function() {
		return min(hidden_logic(), can_reach("S.S. Anne"));
	},
	"HIDDEN_ITEM_SSANNE_KITCHEN_CHERI_BERRY": function() {
		return min(hidden_logic(), can_reach("S.S. Anne"));
	},
	"HIDDEN_ITEM_SSANNE_KITCHEN_CHESTO_BERRY": function() {
		return min(hidden_logic(), can_reach("S.S. Anne"));
	},
	"ITEM_SSANNE_1F_ROOM2_TM31": function() {
		return can_reach("S.S. Anne");
	},
	"HIDDEN_ITEM_SSANNE_B1F_CORRIDOR_HYPER_POTION": function() {
		return min(hidden_logic(), can_reach("S.S. Anne"));
	},
	"ITEM_SSANNE_B1F_ROOM2_TM44": function() {
		return can_reach("S.S. Anne");
	},
	"ITEM_SSANNE_B1F_ROOM3_ETHER": function() {
		return can_reach("S.S. Anne");
	},
	"ITEM_SSANNE_B1F_ROOM5_SUPER_POTION": function() {
		return can_reach("S.S. Anne");
	},
	"ITEM_SSANNE_2F_ROOM2_STARDUST": function() {
		return can_reach("S.S. Anne");
	},
	"ITEM_SSANNE_2F_ROOM4_X_ATTACK": function() {
		return can_reach("S.S. Anne");
	},
	"NPC_GIFT_GOT_HM01": function() {
		return can_reach("S.S. Anne");
	},
	// Lavender Town
	"NPC_GIFT_GOT_POKE_FLUTE": function() {
		return min(has("EVENT_RESCUE_FUJI"), can_reach("Lavender Town"));
	},
	// Pokemon Tower
	"ITEM_POKEMON_TOWER_3F_ESCAPE_ROPE": function() {
		return can_reach("Lavender Town");
	},
	"ITEM_POKEMON_TOWER_4F_ELIXIR": function() {
		return can_reach("Lavender Town");
	},
	"ITEM_POKEMON_TOWER_4F_AWAKENING": function() {
		return can_reach("Lavender Town");
	},
	"ITEM_POKEMON_TOWER_4F_GREAT_BALL": function() {
		return can_reach("Lavender Town");
	},
	"HIDDEN_ITEM_POKEMON_TOWER_5F_BIG_MUSHROOM": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"ITEM_POKEMON_TOWER_5F_CLEANSE_TAG": function() {
		return can_reach("Lavender Town");
	},
	"ITEM_POKEMON_TOWER_5F_NUGGET": function() {
		return can_reach("Lavender Town");
	},
	"ITEM_POKEMON_TOWER_6F_X_ACCURACY": function() {
		return can_reach("Lavender Town");
	},
	"ITEM_POKEMON_TOWER_6F_RARE_CANDY": function() {
		return can_reach("Lavender Town");
	},
	"HIDDEN_ITEM_POKEMON_TOWER_7F_SOOTHE_BELL": function() {
		if (has("ITEM_SILPH_SCOPE")) {
			return min(hidden_logic(), can_reach("Lavender Town"));
		}
	},
	"EVENT_RESCUE_FUJI": function() {
		if (has("ITEM_SILPH_SCOPE")) {
			return can_reach("Lavender Town");
		}
	},
	// Celadon City
	"ITEM_CELADON_CITY_ETHER": function() {
		return can_reach("Lavender Town");
	},
	"HIDDEN_ITEM_CELADON_CITY_PP_UP": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"NPC_GIFT_GOT_TEA": function() {
		return can_reach("Lavender Town");
	},
	"NPC_GIFT_GOT_RED_TEA": function() {
		return min(has("EVENT_DEFEAT_BROCK"), can_reach("Lavender Town"));
	},
	"NPC_GIFT_GOT_BLUE_TEA": function() {
		return min(has("EVENT_DEFEAT_MISTY"), can_reach("Lavender Town"));
	},
	"NPC_GIFT_GOT_PURPLE_TEA": function() {
		return min(has("EVENT_DEFEAT_ERIKA"), can_reach("Lavender Town"));
	},
	"NPC_GIFT_GOT_COIN_CASE": function() {
		return can_reach("Lavender Town");
	},
	"ITEM_CELADON_CITY_HOUSE_HIDEOUT_KEY": function() {
		return can_reach("Lavender Town");
	},
	"ITEM_CELADON_CITY_HOTEL_CELADON_KEY": function() {
		return can_reach("Lavender Town");
	},
	// Celadon Department Store
	"NPC_GIFT_GOT_TM16_FROM_THIRSTY_GIRL": function() {
		return can_reach("Lavender Town");
	},
	"NPC_GIFT_GOT_TM20_FROM_THIRSTY_GIRL": function() {
		return can_reach("Lavender Town");
	},
	"NPC_GIFT_GOT_TM33_FROM_THIRSTY_GIRL": function() {
		return can_reach("Lavender Town");
	},
	// Celadon Gym
	"EVENT_DEFEAT_ERIKA": function() {
		return can_reach("Celadon Gym");
	},
	"BADGE_4": function() {
		return can_reach("Celadon Gym");
	},
	"NPC_GIFT_GOT_TM19_FROM_ERIKA": function() {
		return can_reach("Celadon Gym");
	},
	// Celadon Game Corner
	"NPC_GIFT_GOT_10_COINS_FROM_GAMBLER": function() {
		return can_reach("Coin Case");
	},
	"NPC_GIFT_GOT_20_COINS_FROM_GAMBLER": function() {
		return can_reach("Coin Case");
	},
	"NPC_GIFT_GOT_20_COINS_FROM_GAMBLER_2": function() {
		return can_reach("Coin Case");
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_2": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_3": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_4": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_5": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_6": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_7": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_8": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_9": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_10": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_11": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_12": function() {
		return min(hidden_logic(), can_reach("Coin Case"));
	},
	// Rocket Hideout
	"ITEM_ROCKET_HIDEOUT_B1F_ESCAPE_ROPE": function() {
		return can_reach("Rocket Hideout");
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B1F_PP_UP": function() {
		return min(hidden_logic(), can_reach("Rocket Hideout"));
	},
	"ITEM_ROCKET_HIDEOUT_B1F_HYPER_POTION": function() {
		return can_reach("Rocket Hideout");
	},
	"ITEM_ROCKET_HIDEOUT_B2F_X_SPEED": function() {
		return can_reach("Rocket Hideout");
	},
	"ITEM_ROCKET_HIDEOUT_B2F_MOON_STONE": function() {
		return can_reach("Rocket Hideout");
	},
	"ITEM_ROCKET_HIDEOUT_B2F_TM12": function() {
		return can_reach("Rocket Hideout");
	},
	"ITEM_ROCKET_HIDEOUT_B2F_SUPER_POTION": function() {
		return can_reach("Rocket Hideout");
	},
	"ITEM_ROCKET_HIDEOUT_B3F_TM21": function() {
		return can_reach("Rocket Hideout");
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B3F_NUGGET": function() {
		return min(hidden_logic(), can_reach("Rocket Hideout"));
	},
	"ITEM_ROCKET_HIDEOUT_B3F_RARE_CANDY": function() {
		return can_reach("Rocket Hideout");
	},
	"ITEM_ROCKET_HIDEOUT_B3F_BLACK_GLASSES": function() {
		return can_reach("Rocket Hideout");
	},
	"ITEM_ROCKET_HIDEOUT_B4F_MAX_ETHER": function() {
		return can_reach("Rocket Hideout");
	},
	"ITEM_ROCKET_HIDEOUT_B4F_TM49": function() {
		return can_reach("Rocket Hideout");
	},
	"NPC_GIFT_CAN_USE_ROCKET_HIDEOUT_LIFT": function() {
		return can_reach("Rocket Hideout");
	},
	"ITEM_ROCKET_HIDEOUT_B4F_CALCIUM": function() {
		return can_reach("Giovanni's Room");
	},
	"NPC_GIFT_GOT_SILPH_SCOPE": function() {
		return can_reach("Giovanni's Room");
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B4F_NET_BALL": function() {
		return min(hidden_logic(), can_reach("Giovanni's Room"));
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B4F_NEST_BALL": function() {
		return min(hidden_logic(), can_reach("Giovanni's Room"));
	},
	// Saffron
	"HIDDEN_ITEM_SAFFRON_CITY_COPYCATS_HOUSE_2F_NUGGET": function() {
		return min(hidden_logic(), can_reach("Saffron Gym"));
	},
	"NPC_GIFT_GOT_TM29_FROM_MR_PSYCHIC": function() {
		return can_reach("Saffron City");
	},
	"ITEM_SAFFRON_CITY_DOJO_SAFFRON_KEY": function() {
		return can_reach("Saffron City");
	},
	// Silph Co
	"HIDDEN_ITEM_SILPH_CO_2F_ULTRA_BALL": function() {
		return min(hidden_logic(), can_reach("Silph Co."));
	},
	"ITEM_SILPH_CO_2F_CARD_KEY_2F": function() {
		return can_reach("Silph Co.");
	},
	"HIDDEN_ITEM_SILPH_CO_3F_PROTEIN": function() {
		return min(hidden_logic(), can_reach("Silph Co."));
	},
	"ITEM_SILPH_CO_3F_HYPER_POTION": function() {
		return max(can_silph(3), can_silph(9));
	},
	"ITEM_SILPH_CO_3F_CARD_KEY_5F": function() {
		return can_reach("Silph Co.");
	},
	"ITEM_SILPH_CO_4F_TM41": function() {
		return can_reach("Silph Co.");
	},
	"HIDDEN_ITEM_SILPH_CO_4F_IRON": function() {
		return min(hidden_logic(), can_reach("Silph Co."));
	},
	"ITEM_SILPH_CO_4F_FULL_HEAL": function() {
		return can_silph(4);
	},
	"ITEM_SILPH_CO_4F_ESCAPE_ROPE": function() {
		return can_silph(4);
	},
	"ITEM_SILPH_CO_4F_MAX_REVIVE": function() {
		return can_silph(4);
	},
	"ITEM_SILPH_CO_4F_CARD_KEY_4F": function() {
		return can_reach("Silph Co.");
	},
	"HIDDEN_ITEM_SILPH_CO_5F_PP_UP": function() {
		return min(hidden_logic(), can_reach("Silph Co."));
	},
	"ITEM_SILPH_CO_5F_CARD_KEY": function() {
		return can_reach("Silph Co.");
	},
	"HIDDEN_ITEM_SILPH_CO_5F_ELIXIR": function() {
		return min(hidden_logic(), can_silph(5));
	},
	"ITEM_SILPH_CO_5F_PROTEIN": function() {
		return can_silph(5);
	},
	"ITEM_SILPH_CO_5F_TM01": function() {
		return can_reach("Silph Co.");
	},
	"HIDDEN_ITEM_SILPH_CO_6F_CARBOS": function() {
		return min(hidden_logic(), can_reach("Silph Co."));
	},
	"ITEM_SILPH_CO_6F_HP_UP": function() {
		return can_silph(6);
	},
	"ITEM_SILPH_CO_6F_X_SPECIAL": function() {
		return can_silph(6);
	},
	"ITEM_SILPH_CO_6F_CARD_KEY_6F": function() {
		return can_reach("Silph Co.");
	},
	"ITEM_SILPH_CO_7F_CALCIUM": function() {
		return can_reach("Silph Co.");
	},
	"ITEM_SILPH_CO_7F_TM08": function() {
		return can_silph(7);
	},
	"HIDDEN_ITEM_SILPH_CO_7F_ZINC": function() {
		return can_silph(7);
	},
	"ITEM_SILPH_CO_7F_CARD_KEY_7F": function() {
		return can_silph(3);
	},
	"NPC_GIFT_GOT_LINK_CABLE": function() {
		return can_silph(3);
	},
	"ITEM_SILPH_CO_8F_IRON": function() {
		return can_reach("Silph Co.");
	},
	"HIDDEN_ITEM_SILPH_CO_8F_NUGGET": function() {
		return min(hidden_logic(), can_reach("Silph Co."));
	},
	"ITEM_SILPH_CO_8F_CARD_KEY_8F": function() {
		return can_reach("Silph Co.");
	},
	"HIDDEN_ITEM_SILPH_CO_9F_MAX_POTION": function() {
		return can_silph(9);
	},
	"HIDDEN_ITEM_SILPH_CO_9F_CALCIUM": function() {
		return can_silph(9);
	},
	"ITEM_SILPH_CO_9F_CARD_KEY_9F": function() {
		return max(can_silph(3), can_silph(9));
	},
	"ITEM_SILPH_CO_10F_ULTRA_BALL": function() {
		return can_reach("Silph Co.");
	},
	"ITEM_SILPH_CO_10F_RARE_CANDY": function() {
		return can_reach("Silph Co.");
	},
	"ITEM_SILPH_CO_10F_CARBOS": function() {
		return can_reach("Silph Co.");
	},
	"HIDDEN_ITEM_SILPH_CO_10F_HP_UP": function() {
		return min(hidden_logic(), can_reach("Silph Co."));
	},
	"ITEM_SILPH_CO_10F_CARD_KEY_10F": function() {
		return can_reach("Silph Co.");
	},
	"ITEM_SILPH_CO_11F_ZINC": function() {
		return can_reach("Silph Co.");
	},
	"HIDDEN_ITEM_SILPH_CO_11F_REVIVE": function() {
		return min(hidden_logic(), can_silph(3));
	},
	"ITEM_SILPH_CO_11F_CARD_KEY_11F": function() {
		return can_silph(3);
	},
	"NPC_GIFT_GOT_MASTER_BALL_FROM_SILPH": function() {
		return min(can_silph(11), can_silph(3))
	},
	"EVENT_FREE_SILPH": function() {
		return min(can_silph(11), can_silph(3))
	},
	// Saffron Gym
	"EVENT_DEFEAT_SABRINA": function() {
		return can_reach("Saffron Gym");
	},
	"BADGE_6": function() {
		return can_reach("Saffron Gym");
	},
	"NPC_GIFT_GOT_TM04_FROM_SABRINA": function() {
		return can_reach("Saffron Gym");
	},
	// Fuchsia City
	"HIDDEN_ITEM_FUCHSIA_CITY_MAX_REVIVE": function() {
		return min(hidden_logic(), can_reach("Fuchsia City"));
	},
	"NPC_GIFT_GOT_GOOD_ROD": function() {
		return can_reach("Fuchsia City");
	},
	// Warden's House
	"NPC_GIFT_GOT_HM04": function() {
		return min(has("ITEM_GOLD_TEETH"), can_reach("Fuchsia City"));
	},
	"ITEM_FUCHSIA_CITY_WARDENS_HOUSE_RARE_CANDY": function() {
		return min(can_strength(), can_reach("Fuchsia City"));
	},
	// Fuchsia Gym
	"EVENT_DEFEAT_KOGA": function() {
		return can_reach("Fuchsia Gym");
	},
	"BADGE_5": function() {
		return can_reach("Fuchsia Gym");
	},
	"NPC_GIFT_GOT_TM06_FROM_KOGA": function() {
		return can_reach("Fuchsia Gym");
	},
	// Safari Zone
	"NPC_GIFT_GOT_SAFARI_PASS": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_CENTER_NUGGET": function() {
		return min(can_surf(), can_reach("Safari Zone"));
	},
	"HIDDEN_ITEM_SAFARI_ZONE_CENTER_LEAF_STONE": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_reach("Safari Zone"));
		}
	},
	"ITEM_SAFARI_ZONE_EAST_LEAF_STONE": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_EAST_MAX_POTION": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_EAST_TM11": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_EAST_FULL_RESTORE": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_EAST_RESTHOUSE_FUCHSIA_KEY": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_NORTH_QUICK_CLAW": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_NORTH_TM47": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_NORTH_PROTEIN": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_WEST_MAX_REVIVE": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_WEST_MAX_POTION": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_WEST_GOLD_TEETH": function() {
		return can_reach("Safari Zone");
	},
	"ITEM_SAFARI_ZONE_WEST_TM32": function() {
		return can_reach("Safari Zone");
	},
	"HIDDEN_ITEM_SAFARI_ZONE_WEST_REVIVE": function() {
		return min(hidden_logic(), can_reach("Safari Zone"));
	},
	"NPC_GIFT_GOT_HM03": function() {
		return can_reach("Safari Zone");
	},
	// Cinnabar
	// Cinnabar Gym
	"EVENT_DEFEAT_BLAINE": function() {
		return can_reach("Cinnabar Gym");
	},
	"BADGE_7": function() {
		return can_reach("Cinnabar Gym");
	},
	"NPC_GIFT_GOT_TM38_FROM_BLAINE": function() {
		return can_reach("Cinnabar Gym");
	},
	// Pokemon Lab
	"NPC_GIFT_GOT_LETTER": function() {
		return can_reach("Cinnabar Island");
	},
	"NPC_GIFT_GOT_FOSSIL_FROM_CINNABAR": function() {
		if (has("ITEM_HELIX_FOSSIL") && has("ITEM_DOME_FOSSIL") && has("ITEM_OLD_AMBER")) {
			return can_reach("Cinnabar Island");
		}
	},
	"NPC_GIFT_GOT_ONE_PASS": function() {
		if (has("EVENT_DEFEAT_BLAINE")) {
			return can_reach("Cinnabar Island");
		}
	},
	// Pokemon Mansion
	"HIDDEN_ITEM_POKEMON_MANSION_1F_MOON_STONE": function() {
		return min(hidden_logic(), can_reach("Cinnabar Mansion"));
	},
	"ITEM_POKEMON_MANSION_1F_ESCAPE_ROPE": function() {
		return can_reach("Cinnabar Mansion");
	},
	"ITEM_POKEMON_MANSION_1F_PROTEIN": function() {
		return can_reach("Cinnabar Mansion");
	},
	"ITEM_POKEMON_MANSION_1F_CARBOS": function() {
		return can_reach("Cinnabar Mansion");
	},
	"ITEM_POKEMON_MANSION_2F_ZINC": function() {
		return can_reach("Cinnabar Mansion");
	},
	"ITEM_POKEMON_MANSION_2F_CALCIUM": function() {
		return can_reach("Cinnabar Mansion");
	},
	"ITEM_POKEMON_MANSION_2F_HP_UP": function() {
		return can_reach("Cinnabar Mansion");
	},
	"ITEM_POKEMON_MANSION_3F_MAX_POTION": function() {
		return can_reach("Cinnabar Mansion");
	},
	"ITEM_POKEMON_MANSION_3F_IRON": function() {
		return can_reach("Cinnabar Mansion");
	},
	"HIDDEN_ITEM_POKEMON_MANSION_3F_RARE_CANDY": function() {
		return min(hidden_logic(), can_reach("Cinnabar Mansion"));
	},
	"ITEM_POKEMON_MANSION_B1F_FULL_RESTORE": function() {
		return can_reach("Cinnabar Mansion");
	},
	"HIDDEN_ITEM_POKEMON_MANSION_B1F_ELIXIR": function() {
		return min(hidden_logic(), can_reach("Cinnabar Mansion"));
	},
	"ITEM_POKEMON_MANSION_B1F_TM14": function() {
		return can_reach("Cinnabar Mansion");
	},
	"ITEM_POKEMON_MANSION_B1F_SECRET_KEY": function() {
		return can_reach("Cinnabar Mansion");
	},
	"ITEM_POKEMON_MANSION_B1F_TM22": function() {
		return can_reach("Cinnabar Mansion");
	},
	// Indigo Plateau
	"EVENT_DEFEAT_BLUE": function() {
		return can_reach("Elite Four");
	},
	"NPC_GIFT_RECEIVED_MYSTIC_TICKET": function() {
		return min(has("EVENT_DEFEAT_BLUE"), can_reach("Elite Four"));
	},
	"NPC_GIFT_RECEIVED_AURORA_TICKET": function() {
		return min(has("EVENT_DEFEAT_BLUE"), can_reach("Elite Four"));
	},
	"EVENT_DEFEAT_BLUE_REMATCH": function() {
		if (has("EVENT_DEFEAT_BLUE")) {
			return min(can_reach("Elite Four"), can_gym_badge_count(elite_four_requirement, elite_four_rematch_count));
		}
	},
	// ////////////////////
	// Routes
	// ////////////////////
	// 1
	"NPC_GIFT_GOT_POTION_ON_ROUTE_1": function() {
		return can_reach("Pallet Town");
	},
	// 2
	"ITEM_ROUTE2_ETHER": function() {
		return min(can_cut(), can_reach("Pallet Town"));
	},
	"ITEM_ROUTE2_PARALYZE_HEAL": function() {
		return min(can_cut(), can_reach("Pallet Town"));
	},
	"NPC_GIFT_GOT_HM05": function() {
		if(can_pokedex()) {
			return min(can_cut(), can_reach("Pallet Town"));
		}
	},
	// Viridian Forest
	"HIDDEN_ITEM_VIRIDIAN_FOREST_ANTIDOTE": function() {
		return min(hidden_logic(), can_reach("Pewter City"));
	},
	"ITEM_VIRIDIAN_FOREST_POKE_BALL": function() {
		return can_reach("Pewter City");
	},
	"ITEM_VIRIDIAN_FOREST_POTION_2": function() {
		return can_reach("Pewter City");
	},
	"ITEM_VIRIDIAN_FOREST_ANTIDOTE": function() {
		return can_reach("Pewter City");
	},
	"ITEM_VIRIDIAN_FOREST_POTION": function() {
		return can_reach("Pewter City");
	},
	"HIDDEN_ITEM_VIRIDIAN_FOREST_POTION": function() {
		return min(hidden_logic(), can_reach("Pewter City"));
	},
	// 3
	"HIDDEN_ITEM_ROUTE3_ORAN_BERRY": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	// 4
	"HIDDEN_ITEM_ROUTE4_PERSIM_BERRY": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"HIDDEN_ITEM_ROUTE4_GREAT_BALL": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"HIDDEN_ITEM_ROUTE4_RAZZ_BERRY": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"ITEM_ROUTE4_TM05": function() {
		return can_reach("Mt. Moon");
	},
	// Mt. Moon
	"ITEM_MT_MOON_1F_TM09": function() {
		return can_reach("Mt. Moon");
	},
	"ITEM_MT_MOON_1F_PARALYZE_HEAL": function() {
		return can_reach("Mt. Moon");
	},
	"HIDDEN_ITEM_MT_MOON_B1F_TINY_MUSHROOM_3": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"HIDDEN_ITEM_MT_MOON_B1F_BIG_MUSHROOM_3": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"HIDDEN_ITEM_MT_MOON_B1F_BIG_MUSHROOM": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"ITEM_MT_MOON_B2F_STAR_PIECE": function() {
		return can_reach("Mt. Moon");
	},
	"ITEM_MT_MOON_1F_POTION": function() {
		return can_reach("Mt. Moon");
	},
	"ITEM_MT_MOON_1F_RARE_CANDY": function() {
		return can_reach("Mt. Moon");
	},
	"ITEM_MT_MOON_1F_ESCAPE_ROPE": function() {
		return can_reach("Mt. Moon");
	},
	"HIDDEN_ITEM_MT_MOON_B1F_TINY_MUSHROOM_2": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"ITEM_MT_MOON_B2F_TM46": function() {
		return can_reach("Mt. Moon");
	},
	"HIDDEN_ITEM_MT_MOON_B2F_ETHER": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"ITEM_MT_MOON_1F_MOON_STONE": function() {
		return can_reach("Mt. Moon");
	},
	"HIDDEN_ITEM_MT_MOON_B1F_BIG_MUSHROOM_2": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"ITEM_MT_MOON_B2F_REVIVE": function() {
		return can_reach("Mt. Moon");
	},
	"HIDDEN_ITEM_MT_MOON_B2F_MOON_STONE": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	"NPC_GIFT_GOT_FOSSIL_FROM_MT_MOON": function() {
		return can_reach("Mt. Moon");
	},
	"ITEM_MT_MOON_B2F_ANTIDOTE": function() {
		return can_reach("Mt. Moon");
	},
	"HIDDEN_ITEM_MT_MOON_B1F_TINY_MUSHROOM": function() {
		return min(hidden_logic(), can_reach("Mt. Moon"));
	},
	// 5
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ANTIDOTE": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_PARALYZE_HEAL": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_AWAKENING": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_POTION": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ETHER": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ICE_HEAL": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_BURN_HEAL": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	// 6
	"HIDDEN_ITEM_ROUTE6_SITRUS_BERRY": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	"HIDDEN_ITEM_ROUTE6_RARE_CANDY": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	// 7
	"HIDDEN_ITEM_ROUTE7_WEPEAR_BERRY": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	// 8
	"HIDDEN_ITEM_ROUTE8_LUM_BERRY": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_ROUTE8_RAWST_BERRY": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_ROUTE8_LEPPA_BERRY": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_ICE_HEAL": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_ANTIDOTE": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_ETHER": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_BURN_HEAL": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_AWAKENING": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_PARALYZE_HEAL": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_POTION": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	// 9
	"ITEM_ROUTE9_TM40": function() {
		return can_reach("Route 9");
	},
	"HIDDEN_ITEM_ROUTE9_ETHER": function() {
		return min(hidden_logic(), can_reach("Route 9"));
	},
	"ITEM_ROUTE9_BURN_HEAL": function() {
		return can_reach("Route 9");
	},
	"HIDDEN_ITEM_ROUTE9_CHESTO_BERRY": function() {
		return min(hidden_logic(), can_reach("Route 9"));
	},
	"HIDDEN_ITEM_ROUTE9_RARE_CANDY": function() {
		return min(hidden_logic(), can_reach("Route 9"));
	},
	// 10
	"HIDDEN_ITEM_ROUTE10_PERSIM_BERRY": function() {
		return min(hidden_logic(), can_reach("Route 9"));
	},
	"HIDDEN_ITEM_ROUTE10_CHERI_BERRY": function() {
		return min(hidden_logic(), can_reach("Route 9"));
	},
	"HIDDEN_ITEM_ROUTE10_NANAB_BERRY": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_ROUTE10_MAX_ETHER": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_reach("Route 9"));
		}
	},
	// Rock Tunnel
	"ITEM_ROCK_TUNNEL_1F_REPEL": function() {
		return can_reach("Rock Tunnel");
	},
	"ITEM_ROCK_TUNNEL_1F_ESCAPE_ROPE": function() {
		return can_reach("Rock Tunnel");
	},
	"ITEM_ROCK_TUNNEL_1F_PEARL": function() {
		return can_reach("Rock Tunnel");
	},
	"ITEM_ROCK_TUNNEL_B1F_REVIVE": function() {
		return can_reach("Rock Tunnel");
	},
	"ITEM_ROCK_TUNNEL_B1F_MAX_ETHER": function() {
		return can_reach("Rock Tunnel");
	},
	// Power Plant
	"ITEM_POWER_PLANT_MAX_POTION": function() {
		return can_reach("Power Plant");
	},
	"ITEM_POWER_PLANT_TM17": function() {
		return can_reach("Power Plant");
	},
	"ITEM_POWER_PLANT_ELIXIR": function() {
		return can_reach("Power Plant");
	},
	"ITEM_POWER_PLANT_TM25": function() {
		return can_reach("Power Plant");
	},
	"ITEM_POWER_PLANT_THUNDER_STONE": function() {
		return can_reach("Power Plant");
	},
	"HIDDEN_ITEM_POWER_PLANT_MAX_ELIXIR": function() {
		return min(hidden_logic(), can_reach("Power Plant"));
	},
	"HIDDEN_ITEM_POWER_PLANT_THUNDER_STONE": function() {
		return min(hidden_logic(), can_reach("Power Plant"));
	},
	"NPC_GIFT_GOT_EVERSTONE_FROM_OAKS_AIDE": function() {
		return min(can_pokedex(), can_reach("Route 9"));
	},
	"HIDDEN_ITEM_ROUTE10_SUPER_POTION": function() {
		return min(hidden_logic(), can_reach("Route 9"));
	},
	// 11
	"ITEM_ROUTE11_AWAKENING": function() {
		return can_reach("Vermilion City");
	},
	"ITEM_ROUTE11_X_DEFEND": function() {
		return can_reach("Vermilion City");
	},
	"HIDDEN_ITEM_ROUTE11_ESCAPE_ROPE": function() {
		return min(hidden_logic(), can_reach("Vermilion City"));
	},
	"ITEM_ROUTE11_GREAT_BALL": function() {
		return can_reach("Vermilion City");
	},
	"NPC_GIFT_GOT_ITEMFINDER": function() {
		return min(can_pokedex(), can_reach("Vermilion City"));
	},
	"ITEM_DIGLETTS_CAVE_B1F_VERMILION_KEY": function() {
		return can_reach("Vermilion City");
	},
	// 12
	"HIDDEN_ITEM_ROUTE12_HYPER_POTION": function() {
		return min(hidden_logic(), can_reach("Lavender Town"));
	},
	"HIDDEN_ITEM_ROUTE12_LEFTOVERS": function() {
		if (has("ITEM_POKE_FLUTE")) {
			return min(hidden_logic(), can_reach("Vermilion City"));
		}
	},
	"ITEM_ROUTE12_TM48": function() {
		if (can_surf()) {
			return can_reach("Lavender Town");
		}
	},
	"ITEM_ROUTE12_IRON": function() {
		if (can_cut()) {
			return can_reach("Fuchsia City");
		}
	},
	"HIDDEN_ITEM_ROUTE12_RARE_CANDY": function() {
		if (can_cut()) {
			return min(hidden_logic(), can_reach("Fuchsia City"));
		}
	},
	"NPC_GIFT_GOT_SUPER_ROD": function() {
		return can_reach("Fuchsia City");
	},
	"NPC_GIFT_GOT_NET_BALL_FROM_ROUTE12_FISHING_HOUSE": function() {
		return min(can_pokedex(), can_reach("Fuchsia City"));
	},
	"NPC_GIFT_GOT_TM27": function() {
		return can_reach("Lavender Town");
	},
	// 13
	"HIDDEN_ITEM_ROUTE13_PP_UP": function() {
		return min(hidden_logic(), can_reach("Fuchsia City"));
	},
	// 14
	"HIDDEN_ITEM_ROUTE14_PINAP_BERRY": function() {
		return min(hidden_logic(), can_reach("Fuchsia City"));
	},
	"HIDDEN_ITEM_ROUTE14_ZINC": function() {
		if (can_cut() || can_up_ledges()) {
			return min(hidden_logic(), can_reach("Fuchsia City"));
		}
	},
	// 15
	"ITEM_ROUTE15_TM18": function() {
		if (can_cut() || can_up_ledges()) {
			return can_reach("Fuchsia City");
		}
	},
	"NPC_GIFT_GOT_EXP_SHARE_FROM_OAKS_AIDE": function() {
		return min(can_pokedex(), can_reach("Fuchsia City"));
	},
	// 16
	"HIDDEN_ITEM_ROUTE16_LEFTOVERS": function() {
		if (has("ITEM_POKE_FLUTE")) {
			return min(hidden_logic(), can_reach("Lavender Town"));
		}
	},
	"NPC_GIFT_GOT_HM02": function() {
		if (can_cut()) {
			return can_reach("Lavender Town");
		}
	},
	"NPC_GIFT_GOT_AMULET_COIN_FROM_OAKS_AIDE": function() {
		if (can_pokedex()) {
			let fromCeladon;
			if (has("ITEM_POKE_FLUTE")) {
				fromCeladon = can_reach("Lavender Town");
				if (fromCeladon === "logical") {
					return "logical";
				}
			}
			if (has("ITEM_BICYCLE")) {
				let fromFuchsia = can_reach("Fuchsia City");
				if (fromFuchsia) {
					return fromFuchsia;
				}
			}
			return fromCeladon;
		}
	},
	// 17
	"HIDDEN_ITEM_ROUTE17_FULL_RESTORE": function() {
		if (has("ITEM_BICYCLE")) {
			return min(hidden_logic(), can_reach("Fuchsia City"));
		}
	},
	"HIDDEN_ITEM_ROUTE17_PP_UP": function() {
		if (has("ITEM_BICYCLE")) {
			return min(hidden_logic(), can_reach("Fuchsia City"));
		}
	},
	"HIDDEN_ITEM_ROUTE17_RARE_CANDY": function() {
		if (has("ITEM_BICYCLE")) {
			return min(hidden_logic(), can_reach("Fuchsia City"));
		}
	},
	"HIDDEN_ITEM_ROUTE17_MAX_REVIVE": function() {
		if (has("ITEM_BICYCLE")) {
			return min(hidden_logic(), can_reach("Fuchsia City"));
		}
	},
	"HIDDEN_ITEM_ROUTE17_MAX_ELIXIR": function() {
		if (has("ITEM_BICYCLE")) {
			return min(hidden_logic(), can_reach("Fuchsia City"));
		}
	},
	// 20
	"HIDDEN_ITEM_ROUTE20_STARDUST": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_reach("Cinnabar Island"));
		}
	},
	// Seafoam Islands
	"ITEM_SEAFOAM_ISLANDS_1F_ICE_HEAL": function() {
		return can_reach("Seafoam Islands");
	},
	"ITEM_SEAFOAM_ISLANDS_B1F_REVIVE": function() {
		return can_reach("Seafoam Islands");
	},
	"ITEM_SEAFOAM_ISLANDS_B1F_WATER_STONE": function() {
		return can_reach("Seafoam Islands");
	},
	"ITEM_SEAFOAM_ISLANDS_B2F_BIG_PEARL": function() {
		return can_reach("Seafoam Islands");
	},
	"HIDDEN_ITEM_SEAFOAM_ISLANDS_B3F_NUGGET": function() {
		return min(hidden_logic(), can_reach("Seafoam Islands"));
	},
	"HIDDEN_ITEM_SEAFOAM_ISLANDS_B4F_WATER_STONE": function() {
		return min(hidden_logic(), can_reach("Seafoam Islands"));
	},
	"ITEM_SEAFOAM_ISLANDS_B4F_ULTRA_BALL": function() {
		return can_reach("Seafoam Islands");
	},
	// 21
	"HIDDEN_ITEM_ROUTE21_NORTH_PEARL": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_reach("Pallet Town"));
		}
	},
	// 23
	"HIDDEN_ITEM_ROUTE23_LEPPA_BERRY": function() {
		return min(hidden_logic(), can_reach("Route 23"));
	},
	"HIDDEN_ITEM_ROUTE23_MAX_ETHER": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_reach("Route 23"));
		}
	},
	"HIDDEN_ITEM_ROUTE23_ULTRA_BALL": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_reach("Route 23"));
		}
	},
	"HIDDEN_ITEM_ROUTE23_ASPEAR_BERRY": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_reach("Route 23"));
		}
	},
	"HIDDEN_ITEM_ROUTE23_FULL_RESTORE": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_reach("Route 23"));
		}
	},
	"HIDDEN_ITEM_ROUTE23_SITRUS_BERRY": function() {
		return min(hidden_logic(), can_reach("Victory Road Entrance"));
	},
	"HIDDEN_ITEM_ROUTE23_LUM_BERRY": function() {
		return min(hidden_logic(), can_reach("Victory Road Exit"));
	},
	"HIDDEN_ITEM_ROUTE23_MAX_ELIXIR": function() {
		return min(hidden_logic(), can_reach("Victory Road Exit"));
	},
	// Victory Road
	"HIDDEN_ITEM_VICTORY_ROAD_1F_FULL_RESTORE": function() {
		return min(hidden_logic(), can_reach("Victory Road Exit"));
	},
	"ITEM_VICTORY_ROAD_1F_TM02": function() {
		return can_reach("Victory Road Exit");
	},
	"ITEM_VICTORY_ROAD_1F_RARE_CANDY": function() {
		return can_reach("Victory Road Exit");
	},
	"HIDDEN_ITEM_VICTORY_ROAD_1F_ULTRA_BALL": function() {
		return min(hidden_logic(), can_reach("Victory Road Exit"));
	},
	"ITEM_VICTORY_ROAD_2F_TM37": function() {
		return can_reach("Victory Road Exit");
	},
	"ITEM_VICTORY_ROAD_2F_FULL_HEAL": function() {
		return can_reach("Victory Road Exit");
	},
	"ITEM_VICTORY_ROAD_2F_TM07": function() {
		return can_reach("Victory Road Exit");
	},
	"ITEM_VICTORY_ROAD_2F_GUARD_SPEC": function() {
		return can_reach("Victory Road Exit");
	},
	"ITEM_VICTORY_ROAD_3F_MAX_REVIVE": function() {
		return can_reach("Victory Road Exit");
	},
	"ITEM_VICTORY_ROAD_3F_TM50": function() {
		return can_reach("Victory Road Exit");
	},
	// 24
	"NPC_GIFT_GOT_NUGGET_FROM_ROCKET_GRUNT": function() {
		return can_reach("Cerulean City");
	},
	"ITEM_ROUTE24_TM45": function() {
		return can_reach("Cerulean City");
	},
	"HIDDEN_ITEM_ROUTE24_PECHA_BERRY": function() {
		return min(hidden_logic(), can_reach("Cerulean City"));
	},
	// 25
	"HIDDEN_ITEM_ROUTE25_ELIXIR": function() {
		return min(hidden_logic(), can_reach("Cerulean City"));
	},
	"ITEM_ROUTE25_TM43": function() {
		return min(can_cut(), can_reach("Cerulean City"));
	},
	"HIDDEN_ITEM_ROUTE25_ORAN_BERRY": function() {
		return min(hidden_logic(), can_reach("Cerulean City"));
	},
	"HIDDEN_ITEM_ROUTE25_BLUK_BERRY": function() {
		return min(hidden_logic(), can_reach("Cerulean City"));
	},
	"HIDDEN_ITEM_ROUTE25_ETHER": function() {
		return min(hidden_logic(), can_reach("Cerulean City"));
	},
	// Bill's House
	"EVENT_ASSIST_BILL": function() {
		return can_reach("Cerulean City");
	},
	"NPC_GIFT_GOT_SS_TICKET": function() {
		return can_reach("Cerulean City");
	},
	"NPC_GIFT_GOT_CERULEAN_KEY": function() {
		return can_reach("Cerulean City");
	},
	// One 
	"HIDDEN_ITEM_MT_EMBER_EXTERIOR_ULTRA_BALL": function() {
		if (can_strength() || can_up_ledges()) {
			return min(hidden_logic(), can_reach("Mt. Ember"));
		}
	},
	"ITEM_MT_EMBER_EXTERIOR_DIRE_HIT": function() {
		if (can_strength() || can_up_ledges()) {
			return can_reach("Mt. Ember");
		}
	},
	"ITEM_MT_EMBER_EXTERIOR_FIRE_STONE": function() {
		if (can_strength() && (can_rockSmash() || can_up_ledges())) {
			return can_reach("Mt. Ember");
		}
	},
	"HIDDEN_ITEM_MT_EMBER_EXTERIOR_FIRE_STONE": function() {
		if (can_strength() || can_up_ledges()) {
			return min(hidden_logic(), can_reach("Mt. Ember"));
		}
	},
	"ITEM_MT_EMBER_EXTERIOR_ULTRA_BALL": function() {
		if (can_strength() || can_up_ledges()) {
			return can_reach("Mt. Ember");
		}
	},
	"NPC_GIFT_GOT_RUBY": function() {
		if (can_strength() && has("EVENT_DELIVER_METEORITE")) {
			return can_reach("Mt. Ember");
		}
	},
	"NPC_GIFT_GOT_METEORITE": function() {
		return can_reach("One Island");
	},
	"NPC_GIFT_GOT_TRI_PASS": function() {
		return can_reach("One Island");
	},
	"NPC_GIFT_GOT_RAINBOW_PASS": function() {
		if (has("ITEM_RUBY") && has("EVENT_DELIVER_METEORITE")) {
			return can_reach("One Island");
		}
	},
	"NPC_GIFT_GOT_SEVEN_PASS": function() {
		if (can_restoreNetwork()) {
			return can_reach("One Island");
		}
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_STARDUST": function() {
		return can_reach("Treasure Beach");
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_ULTRA_BALL": function() {
		return can_reach("Treasure Beach");
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_BIG_PEARL": function() {
		return can_reach("Treasure Beach");
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_STARDUST_2": function() {
		return can_reach("Treasure Beach");
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_PEARL": function() {
		return can_reach("Treasure Beach");
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_STAR_PIECE": function() {
		return can_reach("Treasure Beach");
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_PEARL_2": function() {
		return can_reach("Treasure Beach");
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_ULTRA_BALL_2": function() {
		return can_reach("Treasure Beach");
	},
	"ITEM_ONE_ISLAND_KINDLE_ROAD_MAX_REPEL": function() {
		return can_reach("Mt. Ember")
	},
	"ITEM_ONE_ISLAND_KINDLE_ROAD_CARBOS": function() {
		return min(can_rockSmash(), can_reach("Mt. Ember"));
	},
	"ITEM_ONE_ISLAND_KINDLE_ROAD_ETHER": function() {
		return min(can_rockSmash(), can_reach("Mt. Ember"));
	},
	"NPC_GIFT_GOT_HM06": function() {
		return can_reach("Mt. Ember");
	},
	// Two
	"ITEM_TWO_ISLAND_REVIVE": function() {
		return min(can_cut(), can_reach("Two Island"));
	},
	"NPC_GIFT_GOT_MOON_STONE_FROM_JOYFUL_GAME_CORNER": function() {
		if (has("EVENT_FIND_LOSTELLE") && has("ITEM_METEORITE")) {
			return can_reach("Two Island");
		}
	},
	"EVENT_DELIVER_METEORITE": function() {
		if (has("EVENT_FIND_LOSTELLE") && has("ITEM_METEORITE")) {
			return can_reach("Two Island");
		}
	},
	"HIDDEN_ITEM_TWO_ISLAND_CAPE_BRINK_RARE_CANDY": function() {
		return min(hidden_logic(), can_reach("Two Island"));
	},
	"HIDDEN_ITEM_TWO_ISLAND_CAPE_BRINK_PP_MAX": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_reach("Two Island"));
		}
	},
	// Three
	// Berry Forest
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_RAZZ_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_ORAN_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_PERSIM_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_PINAP_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_CHESTO_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"ITEM_THREE_ISLAND_BERRY_FOREST_FULL_HEAL": function() {
		return can_reach("Three Island");
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_NANAB_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_CHERI_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_WEPEAR_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_BLUK_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"ITEM_THREE_ISLAND_BERRY_FOREST_MAX_ETHER": function() {
		return can_reach("Three Island");
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_RAWST_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_ASPEAR_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_PECHA_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"EVENT_FIND_LOSTELLE": function() {
		return can_reach("Three Island");
	},
	"NPC_GIFT_RESCUED_LOSTELLE": function() {
		return can_reach("Three Island");
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_LUM_BERRY": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"ITEM_THREE_ISLAND_BERRY_FOREST_MAX_ELIXIR": function() {
		if (can_cut() && can_surf()) {
			return can_reach("Three Island");
		}
	},
	// Dunsparce Tunnel
	"HIDDEN_ITEM_THREE_ISLAND_DUNSPARCE_TUNNEL_NUGGET": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"NPC_GIFT_GOT_NUGGET_FROM_DUNSPARCE_TUNNEL": function() {
		return can_reach("Three Island");
	},
	"NPC_GIFT_GOT_FULL_RESTORE_FROM_THREE_ISLAND_DEFENDER": function() {
		return can_reach("Three Island");
	},
	"ITEM_THREE_ISLAND_ZINC": function() {
		if (can_cut()) {
			return can_reach("Three Island");
		}
	},
	"HIDDEN_ITEM_THREE_ISLAND_PP_UP": function() {
		if (can_cut()) {
			return min(hidden_logic(), can_reach("Three Island"));
		}
	},
	"HIDDEN_ITEM_THREE_ISLAND_BOND_BRIDGE_MAX_REPEL": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BOND_BRIDGE_PEARL": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"HIDDEN_ITEM_THREE_ISLAND_BOND_BRIDGE_STARDUST": function() {
		return min(hidden_logic(), can_reach("Three Island"));
	},
	"NPC_GIFT_GOT_TWO_PASS": function() {
		if (has("EVENT_DELIVER_METEORITE")) {
			return can_reach("Three Island");
		}
	},
	// Four
	// Icefall Cave
	"ITEM_FOUR_ISLAND_ICEFALL_CAVE_1F_ULTRA_BALL": function() {
		return can_reach("Icefall Cave");
	},
	"ITEM_FOUR_ISLAND_ICEFALL_CAVE_1F_HM07": function() {
		return can_reach("Icefall Cave");
	},
	"ITEM_FOUR_ISLAND_ICEFALL_CAVE_B1F_NEVER_MELT_ICE": function() {
		return can_reach("Icefall Cave");
	},
	"ITEM_FOUR_ISLAND_ICEFALL_CAVE_B1F_FULL_RESTORE": function() {
		return can_reach("Icefall Cave");
	},
	"NPC_GIFT_GOT_SIX_PASS": function() {
		if (can_waterfall() || can_up_ledges()) {
			return can_reach("Four Island");
		}
	},
	"HIDDEN_ITEM_FOUR_ISLAND_PEARL": function() {
		return min(hidden_logic(), can_reach("Four Island"));
	},
	"HIDDEN_ITEM_FOUR_ISLAND_ULTRA_BALL": function() {
		return min(hidden_logic(), can_reach("Four Island"));
	},
	"ITEM_FOUR_ISLAND_STAR_PIECE": function() {
		if (can_rockSmash()) {
			return can_reach("Four Island");
		}
	},
	"ITEM_FOUR_ISLAND_STARDUST": function() {
		if (can_surf()) {
			return can_reach("Four Island");
		}
	},
	// Five
	// Rocket Warehouse
	"ITEM_FIVE_ISLAND_ROCKET_WAREHOUSE_BIG_PEARL": function() {
		return can_rocketWarehouse();
	},
	"ITEM_FIVE_ISLAND_ROCKET_WAREHOUSE_PEARL": function() {
		return can_rocketWarehouse();
	},
	"ITEM_FIVE_ISLAND_ROCKET_WAREHOUSE_UP_GRADE": function() {
		return can_rocketWarehouse();
	},
	"HIDDEN_ITEM_FIVE_ISLAND_ROCKET_WAREHOUSE_NET_BALL": function() {
		return min(hidden_logic(), can_rocketWarehouse());
	},
	"ITEM_FIVE_ISLAND_ROCKET_WAREHOUSE_TM36": function() {
		return can_rocketWarehouse();
	},
	"NPC_GIFT_RECOVERED_SAPPHIRE": function() {
		return can_rocketWarehouse();
	},
	"EVENT_RELEASE_POKEMON": function() {
		return can_rocketWarehouse();
	},
	"HIDDEN_ITEM_FIVE_ISLAND_ROCKET_WAREHOUSE_NEST_BALL": function() {
		return min(hidden_logic(), can_rocketWarehouse());
	},
	"NPC_GIFT_GOT_LUXURY_BALL_FROM_RESORT_GORGEOUS_HOUSE": function() {
		if (can_pokedex()) {
			return min(has("EVENT_RESCUE_SELPHY"), can_reach("Lost Cave"));
		}
	},
	// Lost Cave
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM10_SILK_SCARF": function() {
		return can_reach("Lost Cave");
	},
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM11_LAX_INCENSE": function() {
		return can_reach("Lost Cave");
	},
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM12_SEA_INCENSE": function() {
		return can_reach("Lost Cave");
	},
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM13_MAX_REVIVE": function() {
		return can_reach("Lost Cave");
	},
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM14_RARE_CANDY": function() {
		return can_reach("Lost Cave");
	},
	"EVENT_RESCUE_SELPHY": function() {
		return can_reach("Lost Cave");
	},
	"ITEM_FIVE_ISLAND_MEADOW_MAX_POTION": function() {
		return min(can_cut(), can_reach("Five Island"));
	},
	"ITEM_FIVE_ISLAND_MEADOW_PP_UP": function() {
		return can_reach("Lost Cave");
	},
	"HIDDEN_ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_RAZZ_BERRY": function() {
		return min(hidden_logic(), can_reach("Lost Cave"));
	},
	"HIDDEN_ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_BLUK_BERRY": function() {
		return min(hidden_logic(), can_reach("Lost Cave"));
	},
	"HIDDEN_ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_SITRUS_BERRY": function() {
		return min(hidden_logic(), can_reach("Lost Cave"));
	},
	"NPC_GIFT_GOT_TM42_AT_MEMORIAL_PILLAR": function() {
		if (can_reach("Lost Cave")) {
			if (has("EVENT_DEFEAT_BLUE") && can_reach("Two Island")) {
				return "logical";
			}
			return can_reach("Lavender Town");
		}
	},
	"ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_METAL_COAT": function() {
		return can_reach("Lost Cave");
	},
	"HIDDEN_ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_BIG_PEARL": function() {
		return min(hidden_logic(), can_reach("Lost Cave"));
	},
	"HIDDEN_ITEM_FIVE_ISLAND_RESORT_GORGEOUS_NEST_BALL": function() {
		return can_reach("Lost Cave");
	},
	"HIDDEN_ITEM_FIVE_ISLAND_RESORT_GORGEOUS_STARDUST_2": function() {
		return min(hidden_logic(), can_reach("Lost Cave"));
	},
	"HIDDEN_ITEM_FIVE_ISLAND_RESORT_GORGEOUS_STARDUST": function() {
		return min(hidden_logic(), can_reach("Lost Cave"));
	},
	"HIDDEN_ITEM_FIVE_ISLAND_RESORT_GORGEOUS_STAR_PIECE": function() {
		return min(hidden_logic(), can_reach("Lost Cave"));
	},
	// Six
	"HIDDEN_ITEM_SIX_ISLAND_LEPPA_BERRY": function() {
		return min(hidden_logic(), can_reach("Six Island"));
	},
	"HIDDEN_ITEM_SIX_ISLAND_WATER_PATH_PINAP_BERRY": function() {
		return min(hidden_logic(), can_reach("Six Island"));
	},
	"HIDDEN_ITEM_SIX_ISLAND_WATER_PATH_ASPEAR_BERRY": function() {
		return min(hidden_logic(), can_reach("Six Island"));
	},
	"ITEM_SIX_ISLAND_WATER_PATH_DRAGON_SCALE": function() {
		return can_reach("Water Path");
	},
	"HIDDEN_ITEM_SIX_ISLAND_WATER_PATH_ORAN_BERRY": function() {
		return min(hidden_logic(), can_reach("Water Path"));
	},
	"ITEM_SIX_ISLAND_WATER_PATH_ELIXIR": function() {
		return can_reach("Water Path");
	},
	"ITEM_SIX_ISLAND_RUIN_VALLEY_SUN_STONE": function() {
		if (can_strength()) {
			return can_reach("Six Island");
		}
	},
	"ITEM_SIX_ISLAND_RUIN_VALLEY_HP_UP": function() {
		if (can_strength()) {
			return can_reach("Six Island");
		}
	},
	"ITEM_SIX_ISLAND_RUIN_VALLEY_FULL_RESTORE": function() {
		if (can_strength()) {
			return can_reach("Six Island");
		}
	},
	"HIDDEN_ITEM_SIX_ISLAND_GREEN_PATH_ULTRA_BALL": function() {
		return min(hidden_logic(), can_reach("Water Path"));
	},
	"HIDDEN_ITEM_SIX_ISLAND_OUTCAST_ISLAND_STAR_PIECE": function() {
		return min(hidden_logic(), can_reach("Water Path"));
	},
	"ITEM_SIX_ISLAND_OUTCAST_ISLAND_PP_UP": function() {
		return can_reach("Water Path");
	},
	"HIDDEN_ITEM_SIX_ISLAND_OUTCAST_ISLAND_NET_BALL": function() {
		return min(hidden_logic(), can_reach("Water Path"));
	},
	"NPC_GIFT_GOT_FIVE_PASS": function() {
		if (can_cut()) {
			return can_reach("Six Island");
		}
	},
	"NPC_GIFT_GOT_NEST_BALL_FROM_WATER_PATH_HOUSE_1": function() {
		return min(can_pokedex(), can_reach("Water Path"));
	},
	// Seven
	"HIDDEN_ITEM_SEVEN_ISLAND_SEVAULT_CANYON_ENTRANCE_RAWST_BERRY": function() {
		return min(hidden_logic(), can_reach("Seven Island"));
	},
	"ITEM_SEVEN_ISLAND_SEVAULT_CANYON_NUGGET": function() {
		return can_reach("Seven Island");
	},
	"ITEM_SEVEN_ISLAND_SEVAULT_CANYON_MAX_ELIXIR": function() {
		return can_reach("Seven Island");
	},
	"ITEM_SEVEN_ISLAND_SEVAULT_CANYON_KINGS_ROCK": function() {
		if (can_strength() && can_rockSmash()) {
			return can_reach("Seven Island");
		}
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_SEVAULT_CANYON_CHERI_BERRY": function() {
		return min(hidden_logic(), can_reach("Seven Island"));
	},
	"ITEM_SEVEN_ISLAND_SEVAULT_CANYON_HOUSE_LUCKY_PUNCH": function() {
		return can_reach("Seven Island");
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TANOBY_RUINS_HEART_SCALE_4": function() {
		return min(hidden_logic(), can_reach("Tanoby Ruins"));
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TANOBY_RUINS_HEART_SCALE": function() {
		return min(hidden_logic(), can_reach("Tanoby Ruins"));
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TANOBY_RUINS_HEART_SCALE_2": function() {
		return min(hidden_logic(), can_reach("Tanoby Ruins"));
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TANOBY_RUINS_HEART_SCALE_3": function() {
		return min(hidden_logic(), can_reach("Tanoby Ruins"));
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TRAINER_TOWER_NANAB_BERRY": function() {
		return min(hidden_logic(), can_reach("Seven Island"));
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TRAINER_TOWER_PEARL": function() {
		return min(hidden_logic(), can_reach("Seven Island"));
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TRAINER_TOWER_BIG_PEARL": function() {
		return min(hidden_logic(), can_reach("Seven Island"));
	},
	"NPC_GIFT_GOT_DEEP_SEA_SCALE": function() {
		if (has("ITEM_SCANNER")) {
			return can_reach("Seven Island");
		}
	},
	"NPC_GIFT_GOT_DEEP_SEA_TOOTH": function() {
		if (has("ITEM_SCANNER")) {
			return can_reach("Seven Island");
		}
	},
	"NPC_GIFT_GOT_SCANNER": function() {
		return min(can_strength(), can_reach("Seven Island"));
	},
	// Navel
	"HIDDEN_ITEM_NAVEL_ROCK_SUMMIT_SACRED_ASH": function() {
		if (has("ITEM_MYSTIC_TICKET")) {
			return can_reach("Vermilion City");
		}
	}
}