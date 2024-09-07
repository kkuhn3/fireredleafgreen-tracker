function count_badges() {
	let count = 0;
	const badges = ["Boulder_Badge", "Cascade_Badge", "Thunder_Badge", "Rainbow_Badge", "Soul_Badge", "Marsh_Badge", "Volcano_Badge", "Earth_Badge"];
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
function count_fossils() {
	let count = 0;
	const badges = ["Dome_Fossil", "Helix_Fossil", "Old_Amber"];
	for (const badge of badges) {
		const badgeDiv = document.getElementById(badge);
		if (badgeDiv.classList.contains("itemchecked")) {
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
	if (has("Cascade_Badge") && has("HM01_Cut")) {
		return "logical";
	}
}
function can_flash() {
	if (has("Boulder_Badge") && has("HM05_Flash")) {
		return "logical";
	}
}
function can_strength() {
	if (has("Rainbow_Badge") && has("HM04_Strength")) {
		return "logical";
	}
}
function can_surf() {
	if (has("Soul_Badge") && has("HM03_Surf")) {
		return "logical";
	}
}
function can_rockSmash() {
	if (has("Marsh_Badge") && has("HM06_RockSmash")) {
		return "logical";
	}
}
function can_waterfall() {
	if (can_surf() && has("Volcano_Badge") && has("HM07_Waterfall")) {
		return "logical";
	}
}

function hidden_logic() {
	if (has("Item_Finder")) {
		return "logical";
	}
	return "possible";
}
// Logic Helpers
function can_fuchsia_from_seafoam() {
	return can_surf() && can_strength();
}
function can_route3_from_pewter() {
	const r3id = parseInt(ROUTE_3_CONDITION.classList[1].substring(1), 10);
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
		return has("Boulder_Badge");
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

// Town Logic
// Pallet - logical
// Viridian - logical
function can_viridianGym() {
	if (can_pewter()) {
		const badges = parseInt(VIRIDIAN_GYM_CONDITION.classList[1].substring(1), 10);
		if (count_badges() >= badges) {
			return "logical";
		}
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
	// From Pallet-Cinibar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion-Cerulean
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Lavender-Saffron-Cerulean
		if (has("Tea")) {
			return "logical";
		}
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
	// From Pallet-Cinibar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Lavender-Saffron
		if (has("Tea")) {
			return "logical";
		}
	}
}
function can_ceruleanCave() {
	const badges = parseInt(CERULEAN_CAVE_CONDITION.classList[1].substring(1), 10);
	if (can_cerulean() && can_surf() && count_badges() >= badges) {
		return "logical";
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
	// From Pallet-Cinibar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Lavender-Saffron
		if (has("Tea")) {
			return "logical";
		}
	}
}
function can_ssAnne() {
	if (can_vermilion() && has("SS_Ticket")) {
		return "logical";
	}
}
function can_lavender() {
	// From Pallet-Viridian-Pewter-Cerulean
	if (can_plot_to_vermilion()) {
		//-Saffron
		if (has("Tea")) {
			return "logical";
		}
		//-Vermilion
		if (has("Poke_Flute")) {
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
		if (has("Tea")) {
			return "logical";
		}
		if (has("Poke_Flute")) {
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
function can_celadonHidden() {
	const celadonable = can_celadon();
	if (celadonable === "logical") {
		return hidden_logic();
	}
	return celadonable;
}
function can_saffron() {
	// Always need tea
	if (has("Tea")) {
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
	}
}
function can_silph() {
	if (can_saffron() && has("EVENT_RESCUE_FUJI")) {
		return "logical";
	}
}
function can_silphCardKey() {
	if (can_silph() && has("Card_Key")) {
		return "logical";
	}
}
function can_saffronGym() {
	if (can_saffron() && has("EVENT_FREE_SILPH")) {
		return "logical";
	}
}
function can_fuchsia() {
	// From Pallet-Cinnabar
	if (can_fuchsia_from_seafoam()) {
		return "logical";
	}
	// From Pallet-Viridian-Pewter-Cerulean-Vermilion
	if (can_plot_to_vermilion()) {
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Saffron-Lavender
		if (can_surf() && has("Tea")) {
			return "logical";
		}
	}
	// From Pallet-Viridian-Vermilion
	if (can_cut()) {
		if (has("Poke_Flute")) {
			return "logical";
		}
		if (can_surf()) {
			// -Saffron-Lavender
			if (has("Tea")) {
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
function can_fuchsiaHidden() {
	const fuchsiaable = can_fuchsia();
	if (fuchsiaable === "logical") {
		return hidden_logic();
	}
	return fuchsiaable;
}
function can_cinnabar() {
	if (can_surf()) {
		return "logical";
	}
}
function can_fossils() {
	const fossils = parseInt(FOSSILS_CONDITION.classList[1].substring(1), 10);
	if (count_fossils() >= fossils) {
		return can_cinnabar();
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
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Lavender-Saffron-Cerulean
		if (has("Tea")) {
			return "logical";
		}
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
function can_route9Hidden() {
	const route9able = can_route9();
	if (route9able === "logical") {
		return hidden_logic();
	}
	return route9able;
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
function can_route23South() {
	const badges = parseInt(ROUTE_22_CONDITION.classList[1].substring(1), 10);
	if (count_badges() >= badges) {
		return "logical";
	}
}
function can_victoryRoad() {
	const badges = parseInt(VICTORY_ROAD_CONDITION.classList[1].substring(1), 10);
	if (can_route23South() && can_surf() && count_badges() >= badges) {
		return "logical";
	}
}
function can_vitoryRoadComplete() {
	if (can_victoryRoad() && can_strength()) {
		return "logical";
	}
}
function can_e4() {
	const badges = parseInt(ELITE_4_CONDITION.classList[1].substring(1), 10);
	if (can_vitoryRoadComplete() && count_badges() >= badges) {
		return "logical";
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
	
	// Viridian City
	
	// Viridian Gym
	
	// Pewter City
	
	// Pewter Gym
	
	// Cerulean City
	
	// Cerulean Gym
	
	// Cerulean Cave
	
	// Vermilion City
	
	// Vermilion Gym
	
	// SS Anne
	
	// Lavender Town

	// Pokemon Tower
	
	// Celadon City
	
	// Celadon Department Store
	
	// Celadon Gym
	
	// Celadon Game Corner
	
	// Rocket Hideout
	
	// Saffron
	// Silph Co

	// Copycat's House
	
	// Saffron Gym
	
	// Fuchsia City
	
	// Warden's House
	
	// Fuchsia Gym
	
	// Safari Zone
	
	// Cinnabar
	
	// Cinnabar Gym
	
	// Pokemon Mansion

	// ////////////////////
	// Routes
	// ////////////////////
	// 1
	
	// 2
	
	// Viridian Forest
	
	// 4
	// Mt. Moon
	
	// 5
	
	// 8
	
	// 9
	
	// 10
	// Power Plant
	
	// 11
	
	// 12
	
	// 13
	
	// 15
	
	// 16
	
	// 17
	
	// 20
	// Seafoam Islands
	
	// 23
	// Victory Road
	
	// 24
	
	// 25
	// Bill's House
}