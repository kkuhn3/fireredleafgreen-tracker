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
	const badges = ["EVENT_DEFEAT_GIOVANNI", "EVENT_DEFEAT_BROCK", "EVENT_DEFEAT_MISTY", "EVENT_DEFEAT_SURGE", "EVENT_DEFEAT_ERIKA", "EVENT_DEFEAT_SABRINA", "EVENT_DEFEAT_KOGA", "EVENT_DEFEAT_BLAINE"];
	for (const badge of badges) {
		const badgeDiv = document.getElementById(badge);
		if (badgeDiv.classList.contains("subchecked")) {
			count = count + 1;
		}
	}
	return count;
}

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

function can_cut() {
	if (has("ITEM_BADGE_2") && has("ITEM_HM_CUT")) {
		return "logical";
	}
}
function can_flash() {
	if (has("ITEM_BADGE_1") && has("ITEM_HM_FLASH")) {
		return "logical";
	}
}
function can_strength() {
	if (has("ITEM_BADGE_4") && has("ITEM_HM_STRENGTH")) {
		return "logical";
	}
}
function can_surf() {
	if (has("ITEM_BADGE_5") && has("ITEM_HM_SURF")) {
		return "logical";
	}
}
function can_rockSmash() {
	if (has("ITEM_BADGE_6") && has("ITEM_HM_ROCK_SMASH")) {
		return "logical";
	}
}
function can_waterfall() {
	if (can_surf() && has("ITEM_BADGE_7") && has("ITEM_HM_WATERFALL")) {
		return "logical";
	}
}

function hidden_logic() {
	if (has("ITEM_ITEMFINDER")) {
		return "logical";
	}
	return "possible";
}
function can_areaHidden(areaLogic) {
	if (areaLogic === "logical") {
		return hidden_logic();
	}
	return areaLogic;
}
// Logic Helpers
function can_fuchsia_from_seafoam() {
	return can_surf() && can_strength();
}
function can_route3_from_pewter() {
	const r3id = parseInt(pewter_city_roadblock.classList[1].substring(1), 10);
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
function can_plot_to_cerulean() {
	return can_route3_from_pewter() && has("EVENT_RETURN_PARCEL");
}
function can_plot_to_vermilion() {
	return can_plot_to_cerulean() && has("EVENT_RESCUE_BILL");
}
function can_gym_badge_count(requirementDiv, countDiv) {
	const wantGyms = parseInt(requirementDiv.classList[1].substring(1), 10);
	const wantCount = parseInt(countDiv.classList[1].substring(1), 10);
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

// Town Logic
// Pallet - logical
// Viridian - logical
function can_viridianGym() {
	if (can_pewter()) {
		return can_gym_badge_count(viridian_gym_requirement, viridian_gym_count);
	}
}
function can_pewter() {
	// From Pallet-Viridian
	if (can_cut()) {
		return "logical";
	}
	if (has("EVENT_RETURN_PARCEL")) {
		return "logical";
	}
	// From Pallet-Cinnabar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion-Cerulean
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		//-Lavender-Saffron-Cerulean
		if (has("ITEM_TEA")) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One-Vermillion-Cerulean
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		return "logical";
	}
}
function can_cerulean() {
	// From Pallet-Viridian-Vermilion
	if (can_cut()) {
		return "logical";
	}
	// From Pallet-Viridian-Pewter
	if (can_plot_to_cerulean()) {
		return "logical";
	}
	// From Pallet-Cinnabar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		//-Lavender-Saffron
		if (has("ITEM_TEA")) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One-Vermillion
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		return "logical";
	}
}
function can_ceruleanCave() {
	if (can_cerulean() && can_surf()) {
		const requirement = parseInt(cerulean_cave_requirement.classList[1].substring(1), 10);
		if (requirement === 0) {
			if (has("EVENT_DEFEAT_BLUE") && has("EVENT_RESTORE_NETWORK")) {
				return "logical";
			}
			return;
		}
		if (requirement === 1) {
			return has("EVENT_DEFEAT_BLUE");
		}
		if (requirement === 2) {
			return has("EVENT_RESTORE_NETWORK");
		}
		const count = parseInt(cerulean_cave_count.classList[1].substring(1), 10);
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
function can_vermilion() {
	// From Pallet-Viridian
	if (can_cut()) {
		return "logical";
	}
	// From Pallet-Viridian-Pewter-Cerulean
	if (can_plot_to_vermilion()) {
		return "logical";
	}
	// From Pallet-Cinnabar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		//-Lavender-Saffron
		if (has("ITEM_TEA")) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		return "logical";
	}
}
function can_lavender() {
	// From Pallet-Viridian-Pewter-Cerulean
	if (can_plot_to_vermilion()) {
		//-Saffron
		if (has("ITEM_TEA")) {
			return "logical";
		}
		//-Vermilion
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One-Vermilion
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		return "logical";
	}
	// From Pallet-Viridian-Vermilion
	if (can_cut()) {
		//-Saffron
		if (has("ITEM_TEA")) {
			return "logical";
		}
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		//-Cerulean
		if (can_flash()) {
			return "logical";
		}
		return "possible";
	}
}
function can_celadon() {
	// No requirements between these two towns.
	return can_lavender();
}
function can_saffron() {
	// Always need ITEM_TEA
	if (has("ITEM_TEA")) {
		// From Pallet-Viridian-Vermilion
		if (can_cut()) {
			return "logical";
		}
		// From Pallet-Viridian-Pewter-Cerulean
		if (can_plot_to_vermilion()) {
			return "logical";
		}
		// From Pallet-Cinnabar-Fuchsia
		if (can_fuchsia_from_seafoam()) {
			return "logical";
		}
		// From Pallet-Cinnabar-One-Vermilion
		if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
			return "logical";
		}
	}
}
function can_fuchsia() {
	// From Pallet-Cinnabar
	if (can_fuchsia_from_seafoam()) {
		return "logical";
	}
	// From Pallet-Viridian-Pewter-Cerulean-Vermilion
	if (can_plot_to_vermilion()) {
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		//-Saffron-Lavender
		if (can_surf() && has("ITEM_TEA")) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One-Vermilion
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		// -Saffron-Lavender
		if (has("ITEM_TEA")) {
			return "logical";
		}
	}
	// From Pallet-Viridian-Vermilion
	if (can_cut()) {
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		if (can_surf()) {
			// -Saffron-Lavender
			if (has("ITEM_TEA")) {
				return "logical";
			}
			// -Cerulean-Lavender
			if (can_flash()) {
				return "logical";
			}
			return "possible";
		}
	}
}
function can_cinnabar() {
	if (can_surf()) {
		return "logical";
	}
}
// Route Logic
// 1 - logical
// 2 - can_pewter()
// 3 - 
function can_route3() {
	// From Pallet-Viridian-Pewter
	if (can_route3_from_pewter()) {
		if (can_cut()) {
			return "logical";
		}
		if (has("EVENT_RETURN_PARCEL")) {
			return "logical";
		}
	}
	// From Pallet-Viridian-Vermilion-Cerulean
	if (can_cut() && can_surf()) {
		return "logical";
	}
	// From Pallet-Cinibar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion-Cerulean
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		//-Lavender-Saffron-Cerulean
		if (has("ITEM_TEA")) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One-Vermilion-Cerulean
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		return "logical";
	}
}
// 4 - can_route3()
// 5 - can_vermilion()
// 6 - can_vermilion()
// 7 - can_celadon()
// 8 - can_lavender()
// 9 
function can_route9() {
	if (can_cut()) {
		return "logical";
	}
	if (can_lavender()) {
		if (can_flash()) {
			return "logical";
		}
		return "possible";
	}
}
// 10 North - can_route9()
// 10 South - can_lavender()
// 11 - can_vermillion()
// 12 North - can_lavender()
// 12 South - can_fuchsia()
// 13 - can_fuchsia()
// 14 - can_fuchsia()
// 15 - can_fuchsia()
// 16 East - can_celadon()
// 16 West - can_fuchsia()
// 17 - can_route16West()
// 18 West - can_route16West()
// 18 East - can_fuchsia()
// 19 - Barren
// 20 East - can_route19()
// 20 West - can_cinnabar()
// 21 - can_cinnabar()
// 22 - logical
// 23 
function can_route22Gate() {
	return can_gym_badge_count(route22_gate_requirement, route22_gate_count);
}
function can_victoryRoad() {
	if (can_route22Gate() && can_surf()) {
		return can_gym_badge_count(route23_guard_requirement, route23_guard_count);
	}
}
function can_victoryRoad_complete() {
	if (can_victoryRoad() && can_strength()) {
		return "logical";
	}
}
function can_e4() {
	if (can_victoryRoad_complete()) {
		return can_gym_badge_count(elite_four_requirement, elite_four_count);
	}
}
// 24 - can_cerulean()
// 25 - can_cerulean()

const locationHighlight = {}

const locationLogic = {
	// ////////////////////
	// Cities
	// ////////////////////
	// Pallet Town
	"NPC_GIFT_GOT_TOWN_MAP": function() {
		return has("EVENT_RETURN_PARCEL");
	},
	"NPC_GIFT_GOT_FIRST_POKEBALLS": function() {
		return has("ITEM_OAKS_PARCEL");
	},
	"EVENT_RETURN_PARCEL": function() {
		return has("ITEM_OAKS_PARCEL");
	},
	"NPC_GIFT_GOT_POKEBALLS_FROM_OAK_AFTER_22_RIVAL": function() {
		return has("EVENT_RETURN_PARCEL");
	},
	// "NPC_GIFT_RECEIVED_MYSTIC_TICKET": function() {
	// 	return has("EVENT_DEFEAT_BLUE");
	// },
	// "NPC_GIFT_RECEIVED_AURORA_TICKET": function() {
	// 	return has("EVENT_DEFEAT_BLUE");
	// },
	// Viridian City
	"NPC_GIFT_GOT_TEACHY_TV": function() {
		return has("EVENT_RETURN_PARCEL");
	},
	"ITEM_VIRIDIAN_CITY_POTION": function() {
		return "logical";
	},
	"NPC_GIFT_GOT_OAKS_PARCEL": function() {
		return "logical";
	},
	// Viridian Gym
	"EVENT_DEFEAT_GIOVANNI": function() {
		return can_viridianGym();
	},
	"BADGE_8": function() {
		return can_viridianGym();
	},
	"NPC_GIFT_GOT_TM26_FROM_GIOVANNI": function() {
		return can_viridianGym();
	},
	"HIDDEN_ITEM_VIRIDIAN_CITY_GYM_MACHO_BRACE": function() {
		return can_areaHidden(can_viridianGym());
	},
	// Pewter City
	"HIDDEN_ITEM_PEWTER_CITY_POKE_BALL": function() {
		return can_areaHidden(can_pewter());
	},
	"NPC_GIFT_GOT_OLD_AMBER": function() {
		if (can_cut()) {
			return can_pewter();
		}
	},
	// Pewter Gym
	"EVENT_DEFEAT_BROCK": function() {
		return can_pewter();
	},
	"BADGE_1": function() {
		return can_pewter();
	},
	"NPC_GIFT_GOT_TM39_FROM_BROCK": function() {
		return can_pewter();
	},
	// Cerulean City
	"NPC_GIFT_GOT_FAME_CHECKER": function() {
		return can_cerulean();
	},
	"HIDDEN_ITEM_CERULEAN_CITY_RARE_CANDY": function() {
		return can_areaHidden(can_cerulean());
	},
	"NPC_GIFT_GOT_TM28_FROM_ROCKET": function() {
		if (has("EVENT_RESCUE_BILL")) {
			return can_cerulean();
		}
	},
	"NPC_GIFT_GOT_BICYCLE": function() {
		if (has("ITEM_BIKE_VOUCHER")) {
			return can_cerulean();
		}
	},
	"NPC_GIFT_GOT_POWDER_JAR": function() {
		return can_cerulean();
	},
	// Cerulean Gym
	"EVENT_DEFEAT_MISTY": function() {
		return can_cerulean();
	},
	"BADGE_2": function() {
		return can_cerulean();
	},
	"NPC_GIFT_GOT_TM03_FROM_MISTY": function() {
		return can_cerulean();
	},
	// Cerulean Cave
	"HIDDEN_ITEM_CERULEAN_CAVE_1F_ULTRA_BALL": function() {
		return can_areaHidden(can_ceruleanCave());
	},
	"ITEM_CERULEAN_CAVE_1F_NUGGET": function() {
		return can_ceruleanCave();
	},
	"ITEM_CERULEAN_CAVE_1F_FULL_RESTORE": function() {
		return can_ceruleanCave();
	},
	"ITEM_CERULEAN_CAVE_1F_MAX_ELIXIR": function() {
		return can_ceruleanCave();
	},
	"ITEM_CERULEAN_CAVE_2F_FULL_RESTORE": function() {
		return can_ceruleanCave();
	},
	"ITEM_CERULEAN_CAVE_2F_PP_UP": function() {
		return can_ceruleanCave();
	},
	"ITEM_CERULEAN_CAVE_2F_ULTRA_BALL": function() {
		return can_ceruleanCave();
	},
	"ITEM_CERULEAN_CAVE_B1F_MAX_REVIVE": function() {
		return can_ceruleanCave();
	},
	"ITEM_CERULEAN_CAVE_B1F_ULTRA_BALL": function() {
		return can_ceruleanCave();
	},
	// Vermilion City
	"HIDDEN_ITEM_VERMILION_CITY_MAX_ETHER": function() {
		return can_areaHidden(can_vermilion());
	},
	"NPC_GIFT_GOT_OLD_ROD": function() {
		return can_vermilion();
	},
	"NPC_GIFT_GOT_VS_SEEKER": function() {
		return can_vermilion();
	},
	"NPC_GIFT_GOT_BIKE_VOUCHER": function() {
		return can_vermilion();
	},
	// Vermilion Gym
	"EVENT_DEFEAT_SURGE": function() {
		if (can_surf() || can_cut()) {
			return can_vermilion();
		}
	},
	"BADGE_3": function() {
		if (can_surf() || can_cut()) {
			return can_vermilion();
		}
	},
	"NPC_GIFT_GOT_TM34_FROM_SURGE": function() {
		if (can_surf() || can_cut()) {
			return can_vermilion();
		}
	},
	// SS Anne
	"HIDDEN_ITEM_SSANNE_EXTERIOR_LAVA_COOKIE": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_areaHidden(can_vermilion());
		}
	},
	"ITEM_SSANNE_KITCHEN_GREAT_BALL": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	"HIDDEN_ITEM_SSANNE_KITCHEN_PECHA_BERRY": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_areaHidden(can_vermilion());
		}
	},
	"HIDDEN_ITEM_SSANNE_KITCHEN_CHERI_BERRY": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_areaHidden(can_vermilion());
		}
	},
	"HIDDEN_ITEM_SSANNE_KITCHEN_CHESTO_BERRY": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_areaHidden(can_vermilion());
		}
	},
	"ITEM_SSANNE_1F_ROOM2_TM31": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	"HIDDEN_ITEM_SSANNE_B1F_CORRIDOR_HYPER_POTION": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_areaHidden(can_vermilion());
		}
	},
	"ITEM_SSANNE_B1F_ROOM2_TM44": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	"ITEM_SSANNE_B1F_ROOM3_ETHER": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	"ITEM_SSANNE_B1F_ROOM5_SUPER_POTION": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	"ITEM_SSANNE_2F_ROOM2_STARDUST": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	"ITEM_SSANNE_2F_ROOM4_X_ATTACK": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	"NPC_GIFT_GOT_HM01": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	// Lavender Town
	"NPC_GIFT_GOT_POKE_FLUTE": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_lavender();
		}
	},
	// Pokemon Tower
	"ITEM_POKEMON_TOWER_3F_ESCAPE_ROPE": function() {
		return can_lavender();
	},
	"ITEM_POKEMON_TOWER_4F_ELIXIR": function() {
		return can_lavender();
	},
	"ITEM_POKEMON_TOWER_4F_AWAKENING": function() {
		return can_lavender();
	},
	"ITEM_POKEMON_TOWER_4F_GREAT_BALL": function() {
		return can_lavender();
	},
	"HIDDEN_ITEM_POKEMON_TOWER_5F_BIG_MUSHROOM": function() {
		return can_areaHidden(can_lavender());
	},
	"ITEM_POKEMON_TOWER_5F_CLEANSE_TAG": function() {
		return can_lavender();
	},
	"ITEM_POKEMON_TOWER_5F_NUGGET": function() {
		return can_lavender();
	},
	"ITEM_POKEMON_TOWER_6F_X_ACCURACY": function() {
		return can_lavender();
	},
	"ITEM_POKEMON_TOWER_6F_RARE_CANDY": function() {
		return can_lavender();
	},
	"HIDDEN_ITEM_POKEMON_TOWER_7F_SOOTHE_BELL": function() {
		if (has("ITEM_SILPH_SCOPE")) {
			return can_lavender();
		}
	},
	"EVENT_RESCUE_FUJI": function() {
		if (has("ITEM_SILPH_SCOPE")) {
			return can_lavender();
		}
	},
	// Celadon City
	"ITEM_CELADON_CITY_ETHER": function() {
		return can_celadon();
	},
	"HIDDEN_ITEM_CELADON_CITY_PP_UP": function() {
		return can_areaHidden(can_celadon());
	},
	"NPC_GIFT_GOT_TEA": function() {
		return can_celadon();
	},
	"NPC_GIFT_GOT_COIN_CASE": function() {
		return can_celadon();
	},
	// Celadon Department Store
	"NPC_GIFT_GOT_TM16_FROM_THIRSTY_GIRL": function() {
		return can_celadon();
	},
	"NPC_GIFT_GOT_TM20_FROM_THIRSTY_GIRL": function() {
		return can_celadon();
	},
	"NPC_GIFT_GOT_TM33_FROM_THIRSTY_GIRL": function() {
		return can_celadon();
	},
	// Celadon Gym
	"EVENT_DEFEAT_ERIKA": function() {
		if (can_cut()) {
			return can_celadon();
		}
	},
	"BADGE_4": function() {
		if (can_cut()) {
			return can_celadon();
		}
	},
	"NPC_GIFT_GOT_TM19_FROM_ERIKA": function() {
		if (can_cut()) {
			return can_celadon();
		}
	},
	// Celadon Game Corner
	// Rocket Hideout
	"ITEM_ROCKET_HIDEOUT_B1F_ESCAPE_ROPE": function() {
		return can_celadon();
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B1F_PP_UP": function() {
		return can_areaHidden(can_celadon());
	},
	"ITEM_ROCKET_HIDEOUT_B1F_HYPER_POTION": function() {
		return can_celadon();
	},
	"ITEM_ROCKET_HIDEOUT_B2F_X_SPEED": function() {
		return can_celadon();
	},
	"ITEM_ROCKET_HIDEOUT_B2F_MOON_STONE": function() {
		return can_celadon();
	},
	"ITEM_ROCKET_HIDEOUT_B2F_TM12": function() {
		return can_celadon();
	},
	"ITEM_ROCKET_HIDEOUT_B2F_SUPER_POTION": function() {
		return can_celadon();
	},
	"ITEM_ROCKET_HIDEOUT_B3F_TM21": function() {
		return can_celadon();
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B3F_NUGGET": function() {
		return can_areaHidden(can_celadon());
	},
	"ITEM_ROCKET_HIDEOUT_B3F_RARE_CANDY": function() {
		return can_celadon();
	},
	"ITEM_ROCKET_HIDEOUT_B3F_BLACK_GLASSES": function() {
		return can_celadon();
	},
	"ITEM_ROCKET_HIDEOUT_B4F_MAX_ETHER": function() {
		return can_celadon();
	},
	"ITEM_ROCKET_HIDEOUT_B4F_TM49": function() {
		return can_celadon();
	},
	"NPC_GIFT_CAN_USE_ROCKET_HIDEOUT_LIFT": function() {
		return can_celadon();
	},
	"ITEM_ROCKET_HIDEOUT_B4F_CALCIUM": function() {
		if (has("ITEM_LIFT_KEY")) {
			return can_celadon();
		}
	},
	"NPC_GIFT_GOT_SILPH_SCOPE": function() {
		if (has("ITEM_LIFT_KEY")) {
			return can_celadon();
		}
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B4F_NET_BALL": function() {
		if (has("ITEM_LIFT_KEY")) {
			return can_areaHidden(can_celadon());
		}
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B4F_NEST_BALL": function() {
		if (has("ITEM_LIFT_KEY")) {
			return can_areaHidden(can_celadon());
		}
	},
	// Saffron
	"HIDDEN_ITEM_SAFFRON_CITY_COPYCATS_HOUSE_2F_NUGGET": function() {
		if (has("EVENT_FREE_SILPH")) {
			return can_areaHidden(can_saffron());
		}
	},
	"NPC_GIFT_GOT_TM29_FROM_MR_PSYCHIC": function() {
		return can_saffron();
	},
	// Silph Co
	"HIDDEN_ITEM_SILPH_CO_2F_ULTRA_BALL": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_areaHidden(can_saffron());
		}
	},
	"HIDDEN_ITEM_SILPH_CO_3F_PROTEIN": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_areaHidden(can_saffron());
		}
	},
	"ITEM_SILPH_CO_3F_HYPER_POTION": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	"ITEM_SILPH_CO_4F_TM41": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_saffron();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_4F_IRON": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_areaHidden(can_saffron());
		}
	},
	"ITEM_SILPH_CO_4F_FULL_HEAL": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	"ITEM_SILPH_CO_4F_ESCAPE_ROPE": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	"ITEM_SILPH_CO_4F_MAX_REVIVE": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_5F_PP_UP": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_areaHidden(can_saffron());
		}
	},
	"ITEM_SILPH_CO_5F_CARD_KEY": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_saffron();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_5F_ELIXIR": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_areaHidden(can_saffron());
		}
	},
	"ITEM_SILPH_CO_5F_PROTEIN": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	"ITEM_SILPH_CO_5F_TM01": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_saffron();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_6F_CARBOS": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_areaHidden(can_saffron());
		}
	},
	"ITEM_SILPH_CO_6F_HP_UP": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	"ITEM_SILPH_CO_6F_X_SPECIAL": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	"ITEM_SILPH_CO_7F_CALCIUM": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_saffron();
		}
	},
	"ITEM_SILPH_CO_7F_TM08": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_7F_ZINC": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_areaHidden(can_saffron());
		}
	},
	"ITEM_SILPH_CO_8F_IRON": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_saffron();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_8F_NUGGET": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_areaHidden(can_saffron());
		}
	},
	"HIDDEN_ITEM_SILPH_CO_9F_MAX_POTION": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_areaHidden(can_saffron());
		}
	},
	"HIDDEN_ITEM_SILPH_CO_9F_CALCIUM": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_areaHidden(can_saffron());
		}
	},
	"ITEM_SILPH_CO_10F_ULTRA_BALL": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_saffron();
		}
	},
	"ITEM_SILPH_CO_10F_RARE_CANDY": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_saffron();
		}
	},
	"ITEM_SILPH_CO_10F_CARBOS": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_saffron();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_10F_HP_UP": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_areaHidden(can_saffron());
		}
	},
	"ITEM_SILPH_CO_11F_ZINC": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_saffron();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_11F_REVIVE": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_areaHidden(can_saffron());
		}
	},
	"NPC_GIFT_GOT_MASTER_BALL_FROM_SILPH": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	"EVENT_FREE_SILPH": function() {
		if (has("EVENT_RESCUE_FUJI") && has("ITEM_CARD_KEY")) {
			return can_saffron();
		}
	},
	// Saffron Gym
	"EVENT_DEFEAT_SABRINA": function() {
		if (has("EVENT_FREE_SILPH")) {
			return can_saffron();
		}
	},
	"BADGE_6": function() {
		if (has("EVENT_FREE_SILPH")) {
			return can_saffron();
		}
	},
	"NPC_GIFT_GOT_TM04_FROM_SABRINA": function() {
		if (has("EVENT_FREE_SILPH")) {
			return can_saffron();
		}
	},
	// Fuchsia City
	"HIDDEN_ITEM_FUCHSIA_CITY_MAX_REVIVE": function() {
		return can_areaHidden(can_fuchsia());
	},
	"NPC_GIFT_GOT_GOOD_ROD": function() {
		return can_fuchsia();
	},
	// Warden's House
	"NPC_GIFT_GOT_HM04": function() {
		if (has("ITEM_GOLD_TEETH")) {
			return can_fuchsia();
		}
	},
	"ITEM_FUCHSIA_CITY_WARDENS_HOUSE_RARE_CANDY": function() {
		if (can_strength()) {
			return can_fuchsia();
		}
	},
	// Fuchsia Gym
	"EVENT_DEFEAT_KOGA": function() {
		return can_fuchsia();
	},
	"BADGE_5": function() {
		return can_fuchsia();
	},
	"NPC_GIFT_GOT_TM06_FROM_KOGA": function() {
		return can_fuchsia();
	},
	// Safari Zone
	"ITEM_SAFARI_ZONE_CENTER_NUGGET": function() {
		if (can_surf()) {
			return can_fuchsia();
		}
	},
	"HIDDEN_ITEM_SAFARI_ZONE_CENTER_LEAF_STONE": function() {
		if (can_surf()) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"ITEM_SAFARI_ZONE_EAST_LEAF_STONE": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_EAST_MAX_POTION": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_EAST_TM11": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_EAST_FULL_RESTORE": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_NORTH_QUICK_CLAW": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_NORTH_TM47": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_NORTH_PROTEIN": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_WEST_MAX_REVIVE": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_WEST_MAX_POTION": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_WEST_GOLD_TEETH": function() {
		return can_fuchsia();
	},
	"ITEM_SAFARI_ZONE_WEST_TM32": function() {
		return can_fuchsia();
	},
	"HIDDEN_ITEM_SAFARI_ZONE_WEST_REVIVE": function() {
		return can_areaHidden(can_fuchsia());
	},
	"NPC_GIFT_GOT_HM03": function() {
		return can_fuchsia();
	},
	// Cinnabar
	// Cinnabar Gym
	"EVENT_DEFEAT_BLAINE": function() {
		if (has("ITEM_SECRET_KEY")) {
			return can_cinnabar();
		}
	},
	"BADGE_7": function() {
		if (has("ITEM_SECRET_KEY")) {
			return can_cinnabar();
		}
	},
	"NPC_GIFT_GOT_TM38_FROM_BLAINE": function() {
		if (has("ITEM_SECRET_KEY")) {
			return can_cinnabar();
		}
	},
	// Pokemon Mansion
	"HIDDEN_ITEM_POKEMON_MANSION_1F_MOON_STONE": function() {
		return can_areaHidden(can_cinnabar());
	},
	"ITEM_POKEMON_MANSION_1F_ESCAPE_ROPE": function() {
		return can_cinnabar();
	},
	"ITEM_POKEMON_MANSION_1F_PROTEIN": function() {
		return can_cinnabar();
	},
	"ITEM_POKEMON_MANSION_1F_CARBOS": function() {
		return can_cinnabar();
	},
	"ITEM_POKEMON_MANSION_2F_ZINC": function() {
		return can_cinnabar();
	},
	"ITEM_POKEMON_MANSION_2F_CALCIUM": function() {
		return can_cinnabar();
	},
	"ITEM_POKEMON_MANSION_2F_HP_UP": function() {
		return can_cinnabar();
	},
	"ITEM_POKEMON_MANSION_3F_MAX_POTION": function() {
		return can_cinnabar();
	},
	"ITEM_POKEMON_MANSION_3F_IRON": function() {
		return can_cinnabar();
	},
	"HIDDEN_ITEM_POKEMON_MANSION_3F_RARE_CANDY": function() {
		return can_areaHidden(can_cinnabar());
	},
	"ITEM_POKEMON_MANSION_B1F_FULL_RESTORE": function() {
		return can_cinnabar();
	},
	"HIDDEN_ITEM_POKEMON_MANSION_B1F_ELIXIR": function() {
		return can_areaHidden(can_cinnabar());
	},
	"ITEM_POKEMON_MANSION_B1F_TM14": function() {
		return can_cinnabar();
	},
	"ITEM_POKEMON_MANSION_B1F_SECRET_KEY": function() {
		return can_cinnabar();
	},
	"ITEM_POKEMON_MANSION_B1F_TM22": function() {
		return can_cinnabar();
	},
	// Indigo Plateau
	"EVENT_DEFEAT_BLUE": function() {
		return can_e4();
	},
	// ////////////////////
	// Routes
	// ////////////////////
	// 1
	"NPC_GIFT_GOT_POTION_ON_ROUTE_1": function() {
		return "logical";
	},
	// 2
	"ITEM_ROUTE2_ETHER": function() {
		return can_cut();
	},
	"ITEM_ROUTE2_PARALYZE_HEAL": function() {
		return can_cut();
	},
	"NPC_GIFT_GOT_HM05": function() {
		return can_cut();
	},
	// Viridian Forest
	"HIDDEN_ITEM_VIRIDIAN_FOREST_ANTIDOTE": function() {
		return can_areaHidden(can_pewter());
	},
	"ITEM_VIRIDIAN_FOREST_POKE_BALL": function() {
		return can_pewter();
	},
	"ITEM_VIRIDIAN_FOREST_POTION_2": function() {
		return can_pewter();
	},
	"ITEM_VIRIDIAN_FOREST_ANTIDOTE": function() {
		return can_pewter();
	},
	"ITEM_VIRIDIAN_FOREST_POTION": function() {
		return can_pewter();
	},
	"HIDDEN_ITEM_VIRIDIAN_FOREST_POTION": function() {
		return can_areaHidden(can_pewter());
	},
	// 3
	"HIDDEN_ITEM_ROUTE3_ORAN_BERRY": function() {
		return can_areaHidden(can_route3());
	},
	// 4
	"HIDDEN_ITEM_ROUTE4_PERSIM_BERRY": function() {
		return can_areaHidden(can_route3());
	},
	"HIDDEN_ITEM_ROUTE4_GREAT_BALL": function() {
		return can_areaHidden(can_route3());
	},
	"HIDDEN_ITEM_ROUTE4_RAZZ_BERRY": function() {
		return can_areaHidden(can_route3());
	},
	"ITEM_ROUTE4_TM05": function() {
		return can_route3();
	},
	// Mt. Moon
	"ITEM_MT_MOON_1F_TM09": function() {
		return can_route3();
	},
	"ITEM_MT_MOON_1F_PARALYZE_HEAL": function() {
		return can_route3();
	},
	"HIDDEN_ITEM_MT_MOON_B1F_TINY_MUSHROOM_3": function() {
		return can_areaHidden(can_route3());
	},
	"HIDDEN_ITEM_MT_MOON_B1F_BIG_MUSHROOM_3": function() {
		return can_areaHidden(can_route3());
	},
	"HIDDEN_ITEM_MT_MOON_B1F_BIG_MUSHROOM": function() {
		return can_areaHidden(can_route3());
	},
	"ITEM_MT_MOON_B2F_STAR_PIECE": function() {
		return can_route3();
	},
	"ITEM_MT_MOON_1F_POTION": function() {
		return can_route3();
	},
	"ITEM_MT_MOON_1F_RARE_CANDY": function() {
		return can_route3();
	},
	"ITEM_MT_MOON_1F_ESCAPE_ROPE": function() {
		return can_route3();
	},
	"HIDDEN_ITEM_MT_MOON_B1F_TINY_MUSHROOM_2": function() {
		return can_areaHidden(can_route3());
	},
	"ITEM_MT_MOON_B2F_TM46": function() {
		return can_route3();
	},
	"HIDDEN_ITEM_MT_MOON_B2F_ETHER": function() {
		return can_areaHidden(can_route3());
	},
	"ITEM_MT_MOON_1F_MOON_STONE": function() {
		return can_route3();
	},
	"HIDDEN_ITEM_MT_MOON_B1F_BIG_MUSHROOM_2": function() {
		return can_areaHidden(can_route3());
	},
	"ITEM_MT_MOON_B2F_REVIVE": function() {
		return can_route3();
	},
	"HIDDEN_ITEM_MT_MOON_B2F_MOON_STONE": function() {
		return can_areaHidden(can_route3());
	},
	"NPC_GIFT_GOT_DOME_FOSSIL": function() {
		return can_route3();
	},
	"NPC_GIFT_GOT_HELIX_FOSSIL": function() {
		return can_route3();
	},
	"ITEM_MT_MOON_B2F_ANTIDOTE": function() {
		return can_route3();
	},
	"HIDDEN_ITEM_MT_MOON_B1F_TINY_MUSHROOM": function() {
		return can_areaHidden(can_route3());
	},
	// 5
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ANTIDOTE": function() {
		return can_areaHidden(can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_PARALYZE_HEAL": function() {
		return can_areaHidden(can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_AWAKENING": function() {
		return can_areaHidden(can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_POTION": function() {
		return can_areaHidden(can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ETHER": function() {
		return can_areaHidden(can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ICE_HEAL": function() {
		return can_areaHidden(can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_BURN_HEAL": function() {
		return can_areaHidden(can_vermilion());
	},
	// 6
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ICE_HEAL": function() {
		return can_areaHidden(can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_BURN_HEAL": function() {
		return can_areaHidden(can_vermilion());
	},
	// 7
	"HIDDEN_ITEM_ROUTE7_WEPEAR_BERRY": function() {
		return can_areaHidden(can_cerulean());
	},
	// 8
	"HIDDEN_ITEM_ROUTE8_LUM_BERRY": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_ROUTE8_RAWST_BERRY": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_ROUTE8_LEPPA_BERRY": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_ICE_HEAL": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_ANTIDOTE": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_ETHER": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_BURN_HEAL": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_AWAKENING": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_PARALYZE_HEAL": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_POTION": function() {
		return can_areaHidden(can_lavender());
	},
	// 9
	"ITEM_ROUTE9_TM40": function() {
		return can_route9();
	},
	"HIDDEN_ITEM_ROUTE9_ETHER": function() {
		return can_areaHidden(can_route9());
	},
	"ITEM_ROUTE9_BURN_HEAL": function() {
		return can_route9();
	},
	"HIDDEN_ITEM_ROUTE9_CHESTO_BERRY": function() {
		return can_areaHidden(can_route9());
	},
	"HIDDEN_ITEM_ROUTE9_RARE_CANDY": function() {
		return can_areaHidden(can_route9());
	},
	// 10
	"HIDDEN_ITEM_ROUTE10_PERSIM_BERRY": function() {
		return can_areaHidden(can_route9());
	},
	"HIDDEN_ITEM_ROUTE10_CHERI_BERRY": function() {
		return can_areaHidden(can_route9());
	},
	"HIDDEN_ITEM_ROUTE10_NANAB_BERRY": function() {
		return can_areaHidden(can_route9());
	},
	"HIDDEN_ITEM_ROUTE10_MAX_ETHER": function() {
		if (can_surf()) {
			return can_areaHidden(can_route9());
		}
	},
	// Rock Tunnel
	"ITEM_ROCK_TUNNEL_1F_REPEL": function() {
		if (can_lavender()) {
			if (can_flash()) {
				return "logical";
			}
			return "possible";
		}
	},
	"ITEM_ROCK_TUNNEL_1F_ESCAPE_ROPE": function() {
		if (can_lavender()) {
			if (can_flash()) {
				return "logical";
			}
			return "possible";
		}
	},
	"ITEM_ROCK_TUNNEL_1F_PEARL": function() {
		if (can_lavender()) {
			if (can_flash()) {
				return "logical";
			}
			return "possible";
		}
	},
	"ITEM_ROCK_TUNNEL_B1F_REVIVE": function() {
		if (can_lavender()) {
			if (can_flash()) {
				return "logical";
			}
			return "possible";
		}
	},
	"ITEM_ROCK_TUNNEL_B1F_MAX_ETHER": function() {
		if (can_lavender()) {
			if (can_flash()) {
				return "logical";
			}
			return "possible";
		}
	},
	// Power Plant
	"ITEM_POWER_PLANT_MAX_POTION": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"ITEM_POWER_PLANT_TM17": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"ITEM_POWER_PLANT_ELIXIR": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"ITEM_POWER_PLANT_TM25": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"ITEM_POWER_PLANT_THUNDER_STONE": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"HIDDEN_ITEM_POWER_PLANT_MAX_ELIXIR": function() {
		if (can_surf()) {
			return can_areaHidden(can_route9());
		}
	},
	"HIDDEN_ITEM_POWER_PLANT_THUNDER_STONE": function() {
		if (can_surf()) {
			return can_areaHidden(can_route9());
		}
	},
	"NPC_GIFT_GOT_EVERSTONE_FROM_OAKS_AIDE": function() {
		return can_route9();
	},
	"HIDDEN_ITEM_ROUTE10_SUPER_POTION": function() {
		return can_areaHidden(can_route9());
	},
	// 11
	"ITEM_ROUTE11_AWAKENING": function() {
		return can_vermilion();
	},
	"ITEM_ROUTE11_X_DEFEND": function() {
		return can_vermilion();
	},
	"HIDDEN_ITEM_ROUTE11_ESCAPE_ROPE": function() {
		return can_areaHidden(can_vermilion());
	},
	"ITEM_ROUTE11_GREAT_BALL": function() {
		return can_vermilion();
	},
	"NPC_GIFT_GOT_ITEMFINDER": function() {
		return can_vermilion();
	},
	// 12
	"HIDDEN_ITEM_ROUTE12_HYPER_POTION": function() {
		return can_areaHidden(can_lavender());
	},
	"HIDDEN_ITEM_ROUTE12_LEFTOVERS": function() {
		if (has("ITEM_POKE_FLUTE")) {
			return can_areaHidden(can_vermilion());
		}
	},
	"ITEM_ROUTE12_TM48": function() {
		if (can_surf()) {
			return can_lavender();
		}
	},
	"ITEM_ROUTE12_IRON": function() {
		if (can_cut()) {
			return can_fuchsia();
		}
	},
	"HIDDEN_ITEM_ROUTE12_RARE_CANDY": function() {
		if (can_cut()) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"NPC_GIFT_GOT_SUPER_ROD": function() {
		return can_fuchsia();
	},
	"NPC_GIFT_GOT_TM27": function() {
		return can_lavender();
	},
	// 13
	"HIDDEN_ITEM_ROUTE13_PP_UP": function() {
		return can_areaHidden(can_fuchsia());
	},
	// 14
	"HIDDEN_ITEM_ROUTE14_PINAP_BERRY": function() {
		return can_areaHidden(can_fuchsia());
	},
	"HIDDEN_ITEM_ROUTE14_ZINC": function() {
		if (can_cut()) {
			return can_areaHidden(can_fuchsia());
		}
	},
	// 15
	"ITEM_ROUTE15_TM18": function() {
		if (can_cut()) {
			return can_fuchsia();
		}
	},
	"NPC_GIFT_GOT_EXP_SHARE_FROM_OAKS_AIDE": function() {
		return can_fuchsia();
	},
	// 16
	"HIDDEN_ITEM_ROUTE16_LEFTOVERS": function() {
		if (has("ITEM_POKE_FLUTE")) {
			return can_areaHidden(can_celadon());
		}
	},
	"NPC_GIFT_GOT_HM02": function() {
		if (can_cut()) {
			return can_celadon();
		}
	},
	"NPC_GIFT_GOT_AMULET_COIN_FROM_OAKS_AIDE": function() {
		let fromCeladon;
		if (has("ITEM_POKE_FLUTE")) {
			fromCeladon = can_celadon();
			if (fromCeladon === "logical") {
				return "logical";
			}
		}
		if (has("ITEM_BICYCLE")) {
			let fromFuchsia = can_fuchsia();
			if (fromFuchsia) {
				return fromFuchsia;
			}
		}
		return fromCeladon;
	},
	// 17
	"HIDDEN_ITEM_ROUTE17_FULL_RESTORE": function() {
		if (has("ITEM_BICYCLE")) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"HIDDEN_ITEM_ROUTE17_PP_UP": function() {
		if (has("ITEM_BICYCLE")) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"HIDDEN_ITEM_ROUTE17_RARE_CANDY": function() {
		if (has("ITEM_BICYCLE")) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"HIDDEN_ITEM_ROUTE17_MAX_REVIVE": function() {
		if (has("ITEM_BICYCLE")) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"HIDDEN_ITEM_ROUTE17_MAX_ELIXIR": function() {
		if (has("ITEM_BICYCLE")) {
			return can_areaHidden(can_fuchsia());
		}
	},
	// 20
	"HIDDEN_ITEM_ROUTE20_STARDUST": function() {
		return can_areaHidden(can_cinnabar());
	},
	// Seafoam Islands
	"ITEM_SEAFOAM_ISLANDS_1F_ICE_HEAL": function() {
		return can_cinnabar();
	},
	"ITEM_SEAFOAM_ISLANDS_B1F_REVIVE": function() {
		return can_cinnabar();
	},
	"ITEM_SEAFOAM_ISLANDS_B1F_WATER_STONE": function() {
		return can_cinnabar();
	},
	"ITEM_SEAFOAM_ISLANDS_B2F_BIG_PEARL": function() {
		return can_cinnabar();
	},
	"HIDDEN_ITEM_SEAFOAM_ISLANDS_B3F_NUGGET": function() {
		return can_areaHidden(can_cinnabar());
	},
	"HIDDEN_ITEM_SEAFOAM_ISLANDS_B4F_WATER_STONE": function() {
		return can_areaHidden(can_cinnabar());
	},
	"ITEM_SEAFOAM_ISLANDS_B4F_ULTRA_BALL": function() {
		return can_cinnabar();
	},
	// 21
	"HIDDEN_ITEM_ROUTE21_NORTH_PEARL": function() {
		return can_areaHidden(can_cinnabar());
	},
	// 23
	"HIDDEN_ITEM_ROUTE23_LEPPA_BERRY": function() {
		if (can_surf()) {
			return can_areaHidden(can_route22Gate());
		}
	},
	"HIDDEN_ITEM_ROUTE23_MAX_ETHER": function() {
		if (can_surf()) {
			return can_areaHidden(can_route22Gate());
		}
	},
	"HIDDEN_ITEM_ROUTE23_ULTRA_BALL": function() {
		if (can_surf()) {
			return can_areaHidden(can_route22Gate());
		}
	},
	"HIDDEN_ITEM_ROUTE23_ASPEAR_BERRY": function() {
		if (can_surf()) {
			return can_areaHidden(can_route22Gate());
		}
	},
	"HIDDEN_ITEM_ROUTE23_FULL_RESTORE": function() {
		if (can_surf()) {
			return can_areaHidden(can_route22Gate());
		}
	},
	"HIDDEN_ITEM_ROUTE23_SITRUS_BERRY": function() {
		return can_areaHidden(can_victoryRoad());
	},
	"HIDDEN_ITEM_ROUTE23_LUM_BERRY": function() {
		return can_areaHidden(can_victoryRoad_complete());
	},
	"HIDDEN_ITEM_ROUTE23_MAX_ELIXIR": function() {
		return can_areaHidden(can_victoryRoad_complete());
	},
	// Victory Road
	"HIDDEN_ITEM_VICTORY_ROAD_1F_FULL_RESTORE": function() {
		return can_areaHidden(can_victoryRoad_complete());
	},
	"ITEM_VICTORY_ROAD_1F_TM02": function() {
		return can_victoryRoad_complete();
	},
	"ITEM_VICTORY_ROAD_1F_RARE_CANDY": function() {
		return can_victoryRoad_complete();
	},
	"HIDDEN_ITEM_VICTORY_ROAD_1F_ULTRA_BALL": function() {
		return can_areaHidden(can_victoryRoad_complete());
	},
	"ITEM_VICTORY_ROAD_2F_TM37": function() {
		return can_victoryRoad_complete();
	},
	"ITEM_VICTORY_ROAD_2F_FULL_HEAL": function() {
		return can_victoryRoad_complete();
	},
	"ITEM_VICTORY_ROAD_2F_TM07": function() {
		return can_victoryRoad_complete();
	},
	"ITEM_VICTORY_ROAD_2F_GUARD_SPEC": function() {
		return can_victoryRoad_complete();
	},
	"ITEM_VICTORY_ROAD_3F_MAX_REVIVE": function() {
		return can_victoryRoad_complete();
	},
	"ITEM_VICTORY_ROAD_3F_TM50": function() {
		return can_victoryRoad_complete();
	},
	// 24
	"NPC_GIFT_GOT_NUGGET_FROM_ROCKET_GRUNT": function() {
		return can_cerulean();
	},
	"ITEM_ROUTE24_TM45": function() {
		return can_cerulean();
	},
	"HIDDEN_ITEM_ROUTE24_PECHA_BERRY": function() {
		return can_areaHidden(can_cerulean());
	},
	// 25
	"HIDDEN_ITEM_ROUTE25_ELIXIR": function() {
		return can_areaHidden(can_cerulean());
	},
	"ITEM_ROUTE25_TM43": function() {
		if (can_cut()) {
			return "logical";
		}
		if (can_cerulean()) {
			return "possible";
		}
	},
	"HIDDEN_ITEM_ROUTE25_ORAN_BERRY": function() {
		return can_areaHidden(can_cerulean());
	},
	"HIDDEN_ITEM_ROUTE25_BLUK_BERRY": function() {
		return can_areaHidden(can_cerulean());
	},
	"HIDDEN_ITEM_ROUTE25_ETHER": function() {
		return can_areaHidden(can_cerulean());
	},
	// Bill's House
	"EVENT_ASSIST_BILL": function() {
		return can_cerulean();
	},
	"NPC_GIFT_GOT_SS_TICKET": function() {
		return can_cerulean();
	},
}