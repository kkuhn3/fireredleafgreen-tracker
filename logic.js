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
	if (can_surf() && has("ITEM_BADGE_6") && has("ITEM_HM_ROCK_SMASH")) {
		return "logical";
	}
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
function can_fuchsia_from_seafoam() {
	return min(can_surf() && can_strength());
}
function can_route3_from_pewter() {
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
function can_plot_to_cerulean() {
	if (getSettingState(viridian_city_roadblock) === 1 || has("EVENT_RETURN_PARCEL")) {
		return can_route3_from_pewter();
	}
}
function can_plot_to_vermilion() {
	if (has("EVENT_ASSIST_BILL")) {
		return can_plot_to_cerulean();
	}
}
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

// Town Logic
// Pallet - logical
// Viridian - logical
function can_viridianGym() {
	if (can_pewter() && (getSettingState(gym_keys) === 0 || has("ITEM_VIRIDIAN_KEY"))) {
		return can_gym_badge_count(viridian_gym_requirement, viridian_gym_count);
	}
}
function can_pewter() {
	// From Pallet-Viridian
	if (can_cut()) {
		return "logical";
	}
	if (getSettingState(viridian_city_roadblock) === 1 || has("EVENT_RETURN_PARCEL")) {
		return "logical";
	}
	// From Pallet-Cinnabar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion-Cerulean
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		//-Lavender-Saffron-Cerulean
		if (can_tea_cerulean_vermilion() && can_tea_lavender_celadon()) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One-Vermillion-Cerulean
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		return "logical";
	}
}
function can_pewterGym() {
	if (getSettingState(gym_keys) === 0 || has("ITEM_PEWTER_KEY")) {
		return can_pewter();
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
		if (can_tea_cerulean_vermilion() && can_tea_lavender_celadon()) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One-Vermillion
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		return "logical";
	}
}
function can_ceruleanGym() {
	if (getSettingState(gym_keys) === 0 || has("ITEM_CERULEAN_KEY")) {
		return can_cerulean();
	}
}
function can_ceruleanCave() {
	if (can_cerulean() && can_surf()) {
		const requirement = getSettingState(cerulean_cave_requirement);
		if (requirement === 0) {
			if (has("EVENT_DEFEAT_BLUE") && can_restoreNetwork()) {
				return "logical";
			}
			return;
		}
		if (requirement === 1) {
			return has("EVENT_DEFEAT_BLUE");
		}
		if (requirement === 2) {
			return can_restoreNetwork();
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
		if (can_tea_cerulean_vermilion() && can_tea_lavender_celadon()) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		return "logical";
	}
}
function can_vermilionGym() {
	if (getSettingState(gym_keys) === 0 || has("ITEM_VERMILION_KEY")) {
		if (can_surf() || can_cut()) {
			return can_vermilion();
		}
	}
}
function can_lavender() {
	// From Pallet-Viridian-Pewter-Cerulean
	if (can_plot_to_cerulean()) {
		//-Saffron
		if (can_tea_cerulean_vermilion() && can_tea_lavender_celadon()) {
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
		if (can_tea_cerulean_vermilion() && can_tea_lavender_celadon()) {
			return "logical";
		}
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		//-Cerulean
		return can_flash();
	}
}
function can_celadon() {
	// No requirements between these two towns.
	return can_lavender();
}
function can_celadonGym() {
	if (getSettingState(gym_keys) === 0 || has("ITEM_CELADON_KEY")) {
		if (can_cut()) {
			return can_celadon();
		}
	}
}
function can_rocketHideout() {
	if (getSettingState(extra_key_items) === 0 || has("ITEM_HIDEOUT_KEY")) {
		return can_celadon();
	}
}
function can_saffron() {
	// Always need ITEM_TEA
	if (can_tea_cerulean_vermilion()) {
		// From Pallet-Viridian-Vermilion
		if (can_cut()) {
			return "logical";
		}
		// From Pallet-Viridian-Pewter-Cerulean
		if (can_plot_to_cerulean()) {
			return "logical";
		}
		// From Pallet-Cinnabar-Fuchsia-Vermilion
		if (can_fuchsia_from_seafoam() && has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		// From Pallet-Cinnabar-One-Vermilion
		if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
			return "logical";
		}
	}
	if (can_tea_lavender_celadon()) {
		// From Pallet-Viridian-Pewter-Cerulean
		if (can_plot_to_cerulean()) {
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
			if (has("ITEM_POKE_FLUTE")) {
				return "logical";
			}
			//-Cerulean
			return can_flash();
		}
	}
}
function can_saffronGym() {
	if (has("EVENT_FREE_SILPH")) {
		if (getSettingState(gym_keys) === 0 || has("ITEM_SAFFRON_KEY")) {
			return can_saffron();
		}
	}
}
function can_silph() {
	if (has("EVENT_RESCUE_FUJI")) {
		return can_saffron();
	}
}
function can_silph_floor(floor) {
	if (getSettingState(card_key) == 0) {
		return has("ITEM_CARD_KEY");
	}
	return has("ITEM_CARD_KEY_" + floor + "F");
}
function can_fuchsia() {
	// From Pallet-Cinnabar
	if (can_fuchsia_from_seafoam()) {
		return "logical";
	}
	// From Pallet-Viridian-Pewter-Cerulean-Vermilion
	if (can_plot_to_cerulean()) {
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		//-Saffron-Lavender
		if (can_tea_cerulean_vermilion() && can_tea_lavender_celadon() && can_surf()) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-One-Vermilion
	if (can_surf() && has("EVENT_DEFEAT_BLAINE")) {
		if (has("ITEM_POKE_FLUTE")) {
			return "logical";
		}
		// -Saffron-Lavender
		if (can_tea_cerulean_vermilion() && can_tea_lavender_celadon()) {
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
			if (can_tea_cerulean_vermilion() && can_tea_lavender_celadon()) {
				return "logical";
			}
			// -Cerulean-Lavender
			return can_flash();
		}
	}
}
function can_fuchsiaGym() {
	if (getSettingState(gym_keys) === 0 || has("ITEM_FUCHSIA_KEY")) {
		return can_fuchsia();
	}
}
function can_safariZone() {
	if (getSettingState(extra_key_items) === 0 || has("ITEM_SAFARI_PASS")) {
		return can_fuchsia();
	}
}
function can_cinnabar() {
	return can_surf();
}
function can_cinnabarGym() {
	if (getSettingState(gym_keys) === 0) {
		if (has("ITEM_SECRET_KEY")) {
			return can_cinnabar();
		}
	}
	else {
		if (has("ITEM_CINNABAR_KEY")) {
			return can_cinnabar();
		}
	}
}
function can_cinnabarMansion() {
	if (getSettingState(extra_key_items) === 0 || has("ITEM_LETTER")) {
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
		if (getSettingState(viridian_city_roadblock) === 1 || has("EVENT_RETURN_PARCEL")) {
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
		if (can_tea_cerulean_vermilion() && can_tea_lavender_celadon()) {
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
		return can_flash();
	}
}
// 10 North - can_route9()
function can_powerPlant() {
	if (can_surf()) {
		if (getSettingState(extra_key_items) === 0 || has("ITEM_MACHINE_PART")) {
			return can_route9();
		}
	}
}
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
// One
function can_one() {
	if (has("EVENT_DEFEAT_BLAINE") && can_cinnabar()) {
		return "logical";
	}
	const passType = getSettingState(island_passes);
	if (passType === 0) {
		if (has("ITEM_TRI_PASS") && can_vermilion()) {
			return "logical";
		}
	}
	if (has("ITEM_ONE_PASS") && can_vermilion()) {
		return "logical";
	}
}
function can_treasureBeach() {
	if (can_surf()) {
		return min(hidden_logic(), can_one());
	}
}
function can_restoreNetwork() {
	if (has("EVENT_DELIVER_METEORITE") && has("EVENT_RELEASE_POKEMON") && has("ITEM_RUBY") && has("ITEM_SAPPHIRE")) {
		return can_one();
	}
}
function can_two() {
	const passType = getSettingState(island_passes);
	if (passType === 0) {
		if (has("ITEM_TRI_PASS") && can_vermilion()) {
			return "logical";
		}
	}
	if (has("ITEM_TWO_PASS") && can_vermilion()) {
		return "logical";
	}
	if (has("EVENT_FIND_LOSTELLE")) {
		return can_one();
	}
}
function can_three() {
	const passType = getSettingState(island_passes);
	if (passType === 0) {
		if (has("ITEM_TRI_PASS") && can_vermilion()) {
			return "logical";
		}
	}
	if (has("ITEM_THREE_PASS") && can_vermilion()) {
		return "logical";
	}
}
function can_four() {
	const passType = getSettingState(island_passes);
	if (passType === 0) {
		if (has("ITEM_RAINBOW_PASS") && can_vermilion()) {
			return "logical";
		}
	}
	if (has("ITEM_FOUR_PASS") && can_vermilion()) {
		return "logical";
	}
}
function can_five() {
	const passType = getSettingState(island_passes);
	if (passType === 0) {
		if (has("ITEM_RAINBOW_PASS") && can_vermilion()) {
			return "logical";
		}
	}
	if (has("ITEM_FIVE_PASS") && can_vermilion()) {
		return "logical";
	}
}
function can_six() {
	const passType = getSettingState(island_passes);
	if (passType === 0) {
		if (has("ITEM_RAINBOW_PASS") && can_vermilion()) {
			return "logical";
		}
	}
	if (has("ITEM_SIX_PASS") && can_vermilion()) {
		return "logical";
	}
}
function can_seven() {
	const passType = getSettingState(island_passes);
	if (passType === 0) {
		if (has("ITEM_RAINBOW_PASS") && can_vermilion()) {
			return "logical";
		}
	}
	if (has("ITEM_SEVEN_PASS") && can_vermilion()) {
		return "logical";
	}
}
function can_rocketWarehouse() {
	// first can you get there
	if (can_five()) {
		// Then if you can get "goldeen_need_log"
		if (can_surf() && has("EVENT_DELIVER_METEORITE") && can_one()) {
			// and if you can get "yes_nah_chansey"
			if (can_six() && can_cut()) {
				return "logical";
			}
		}
	}
}


const locationHighlight = {
	"EVENT_DEFEAT_BLUE": function() {
		if (can_surf() && can_strength()) {
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
	},
	"EVENT_DEFEAT_BLUE_REMATCH": function() {
		if (can_surf() && can_strength()) {
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
						if (could_gym_badge_count(elite_four_requirement, elite_four_rematch_count, countBadges, logicalGyms)) {
							return "logical";
						}
					}
				}
			}
			if (could_gym_badge_count(route22_gate_requirement, route22_gate_count, countBadges, logicalGyms + possibleGyms)) {
				if (could_gym_badge_count(route23_guard_requirement, route23_guard_count, countBadges, logicalGyms + possibleGyms)) {
					if (could_gym_badge_count(elite_four_requirement, elite_four_count, countBadges, logicalGyms + possibleGyms)) {
						if (could_gym_badge_count(elite_four_requirement, elite_four_rematch_count, countBadges, logicalGyms + possibleGyms)) {
							return "possible";
						}
					}
				}
			}
		}
	}
}

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
	"STARTING_ITEM_BERRY_POUCH": function() {
		return "logical";
	},
	"STARTING_ITEM_TM_CASE": function() {
		return "logical";
	},
	"PC_ITEM_POTION": function() {
		return "logical";
	},
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
	"NPC_GIFT_GOT_VIRIDIAN_KEY": function() {
		return can_pewter();
	},
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
		return min(hidden_logic(), can_viridianGym());
	},
	// Pewter City
	"HIDDEN_ITEM_PEWTER_CITY_POKE_BALL": function() {
		return min(hidden_logic(), can_pewter());
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
	"NPC_GIFT_GOT_RUNNING_SHOES": function() {
		if (has("EVENT_DEFEAT_BROCK")) {
			return can_route3();
		}
	},
	"ITEM_PEWTER_MUSEUM_2F_PEWTER_KEY": function() {
		return can_pewter();
	},
	// Cerulean City
	"NPC_GIFT_GOT_FAME_CHECKER": function() {
		return can_cerulean();
	},
	"HIDDEN_ITEM_CERULEAN_CITY_RARE_CANDY": function() {
		return min(hidden_logic(), can_cerulean());
	},
	"NPC_GIFT_GOT_TM28_FROM_ROCKET": function() {
		if (has("EVENT_ASSIST_BILL")) {
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
	"HIDDEN_ITEM_CERULEAN_CITY_GYM_MACHINE_PART": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_ceruleanGym());
		}
	},
	"EVENT_DEFEAT_MISTY": function() {
		return can_ceruleanGym();
	},
	"BADGE_2": function() {
		return can_ceruleanGym();
	},
	"NPC_GIFT_GOT_TM03_FROM_MISTY": function() {
		return can_ceruleanGym();
	},
	// Cerulean Cave
	"HIDDEN_ITEM_CERULEAN_CAVE_1F_ULTRA_BALL": function() {
		return min(hidden_logic(), can_ceruleanCave());
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
		return min(hidden_logic(), can_vermilion());
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
		return can_vermilionGym();
	},
	"BADGE_3": function() {
		return can_vermilionGym();
	},
	"NPC_GIFT_GOT_TM34_FROM_SURGE": function() {
		return can_vermilionGym();
	},
	// SS Anne
	"HIDDEN_ITEM_SSANNE_EXTERIOR_LAVA_COOKIE": function() {
		if (has("ITEM_SS_TICKET")) {
			return min(hidden_logic(), can_vermilion());
		}
	},
	"ITEM_SSANNE_KITCHEN_GREAT_BALL": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	"HIDDEN_ITEM_SSANNE_KITCHEN_PECHA_BERRY": function() {
		if (has("ITEM_SS_TICKET")) {
			return min(hidden_logic(), can_vermilion());
		}
	},
	"HIDDEN_ITEM_SSANNE_KITCHEN_CHERI_BERRY": function() {
		if (has("ITEM_SS_TICKET")) {
			return min(hidden_logic(), can_vermilion());
		}
	},
	"HIDDEN_ITEM_SSANNE_KITCHEN_CHESTO_BERRY": function() {
		if (has("ITEM_SS_TICKET")) {
			return min(hidden_logic(), can_vermilion());
		}
	},
	"ITEM_SSANNE_1F_ROOM2_TM31": function() {
		if (has("ITEM_SS_TICKET")) {
			return can_vermilion();
		}
	},
	"HIDDEN_ITEM_SSANNE_B1F_CORRIDOR_HYPER_POTION": function() {
		if (has("ITEM_SS_TICKET")) {
			return min(hidden_logic(), can_vermilion());
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
		return min(hidden_logic(), can_lavender());
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
		return min(hidden_logic(), can_celadon());
	},
	"NPC_GIFT_GOT_TEA": function() {
		return can_celadon();
	},
	"NPC_GIFT_GOT_RED_TEA": function() {
		if (has("EVENT_DEFEAT_BROCK")) {
			return can_celadon();
		}
	},
	"NPC_GIFT_GOT_BLUE_TEA": function() {
		if (has("EVENT_DEFEAT_MISTY")) {
			return can_celadon();
		}
	},
	"NPC_GIFT_GOT_PURPLE_TEA": function() {
		if (has("EVENT_DEFEAT_ERIKA")) {
			return can_celadon();
		}
	},
	"NPC_GIFT_GOT_COIN_CASE": function() {
		return can_celadon();
	},
	"ITEM_CELADON_CITY_HOUSE_HIDEOUT_KEY": function() {
		return can_celadon();
	},
	"ITEM_CELADON_CITY_HOTEL_CELADON_KEY": function() {
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
		return can_celadonGym();
	},
	"BADGE_4": function() {
		return can_celadonGym();
	},
	"NPC_GIFT_GOT_TM19_FROM_ERIKA": function() {
		return can_celadonGym();
	},
	// Celadon Game Corner
	"NPC_GIFT_GOT_10_COINS_FROM_GAMBLER": function() {
		if (has("ITEM_COIN_CASE")) {
			return can_celadon();
		}
	},
	"NPC_GIFT_GOT_20_COINS_FROM_GAMBLER": function() {
		if (has("ITEM_COIN_CASE")) {
			return can_celadon();
		}
	},
	"NPC_GIFT_GOT_20_COINS_FROM_GAMBLER_2": function() {
		if (has("ITEM_COIN_CASE")) {
			return can_celadon();
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_2": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_3": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_4": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_5": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_6": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_7": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_8": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_9": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_10": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_11": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	"HIDDEN_ITEM_CELADON_CITY_GAME_CORNER_COINS_12": function() {
		if (has("ITEM_COIN_CASE")) {
			return min(hidden_logic(), can_celadon());
		}
	},
	// Rocket Hideout
	"ITEM_ROCKET_HIDEOUT_B1F_ESCAPE_ROPE": function() {
		return can_rocketHideout();
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B1F_PP_UP": function() {
		return min(hidden_logic(), can_rocketHideout());
	},
	"ITEM_ROCKET_HIDEOUT_B1F_HYPER_POTION": function() {
		return can_rocketHideout();
	},
	"ITEM_ROCKET_HIDEOUT_B2F_X_SPEED": function() {
		return can_rocketHideout();
	},
	"ITEM_ROCKET_HIDEOUT_B2F_MOON_STONE": function() {
		return can_rocketHideout();
	},
	"ITEM_ROCKET_HIDEOUT_B2F_TM12": function() {
		return can_rocketHideout();
	},
	"ITEM_ROCKET_HIDEOUT_B2F_SUPER_POTION": function() {
		return can_rocketHideout();
	},
	"ITEM_ROCKET_HIDEOUT_B3F_TM21": function() {
		return can_rocketHideout();
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B3F_NUGGET": function() {
		return min(hidden_logic(), can_rocketHideout());
	},
	"ITEM_ROCKET_HIDEOUT_B3F_RARE_CANDY": function() {
		return can_rocketHideout();
	},
	"ITEM_ROCKET_HIDEOUT_B3F_BLACK_GLASSES": function() {
		return can_rocketHideout();
	},
	"ITEM_ROCKET_HIDEOUT_B4F_MAX_ETHER": function() {
		return can_rocketHideout();
	},
	"ITEM_ROCKET_HIDEOUT_B4F_TM49": function() {
		return can_rocketHideout();
	},
	"NPC_GIFT_CAN_USE_ROCKET_HIDEOUT_LIFT": function() {
		return can_rocketHideout();
	},
	"ITEM_ROCKET_HIDEOUT_B4F_CALCIUM": function() {
		if (has("ITEM_LIFT_KEY")) {
			return can_rocketHideout();
		}
	},
	"NPC_GIFT_GOT_SILPH_SCOPE": function() {
		if (has("ITEM_LIFT_KEY")) {
			return can_rocketHideout();
		}
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B4F_NET_BALL": function() {
		if (has("ITEM_LIFT_KEY")) {
			return min(hidden_logic(), can_rocketHideout());
		}
	},
	"HIDDEN_ITEM_ROCKET_HIDEOUT_B4F_NEST_BALL": function() {
		if (has("ITEM_LIFT_KEY")) {
			return min(hidden_logic(), can_rocketHideout());
		}
	},
	// Saffron
	"HIDDEN_ITEM_SAFFRON_CITY_COPYCATS_HOUSE_2F_NUGGET": function() {
		return min(hidden_logic(), can_saffronGym());
	},
	"NPC_GIFT_GOT_TM29_FROM_MR_PSYCHIC": function() {
		return can_saffron();
	},
	"ITEM_SAFFRON_CITY_DOJO_SAFFRON_KEY": function() {
		return can_saffron();
	},
	// Silph Co
	"HIDDEN_ITEM_SILPH_CO_2F_ULTRA_BALL": function() {
		return min(hidden_logic(), can_silph());
	},
	"ITEM_SILPH_CO_2F_CARD_KEY_2F": function() {
		return can_silph();
	},
	"HIDDEN_ITEM_SILPH_CO_3F_PROTEIN": function() {
		return min(hidden_logic(), can_silph());
	},
	"ITEM_SILPH_CO_3F_HYPER_POTION": function() {
		if (can_silph_floor(3) || can_silph_floor(9)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_3F_CARD_KEY_5F": function() {
		return can_silph();
	},
	"ITEM_SILPH_CO_4F_TM41": function() {
		return can_silph();
	},
	"HIDDEN_ITEM_SILPH_CO_4F_IRON": function() {
		return min(hidden_logic(), can_silph());
	},
	"ITEM_SILPH_CO_4F_FULL_HEAL": function() {
		if (can_silph_floor(4)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_4F_ESCAPE_ROPE": function() {
		if (can_silph_floor(4)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_4F_MAX_REVIVE": function() {
		if (can_silph_floor(4)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_4F_CARD_KEY_4F": function() {
		return can_silph();
	},
	"HIDDEN_ITEM_SILPH_CO_5F_PP_UP": function() {
		return min(hidden_logic(), can_silph());
	},
	"ITEM_SILPH_CO_5F_CARD_KEY": function() {
		return can_silph();
	},
	"HIDDEN_ITEM_SILPH_CO_5F_ELIXIR": function() {
		if (can_silph_floor(5)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_5F_PROTEIN": function() {
		if (can_silph_floor(5)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_5F_TM01": function() {
		return can_silph();
	},
	"HIDDEN_ITEM_SILPH_CO_6F_CARBOS": function() {
		return min(hidden_logic(), can_silph());
	},
	"ITEM_SILPH_CO_6F_HP_UP": function() {
		if (can_silph_floor(6)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_6F_X_SPECIAL": function() {
		if (can_silph_floor(6)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_6F_CARD_KEY_6F": function() {
		return can_silph();
	},
	"ITEM_SILPH_CO_7F_CALCIUM": function() {
		return can_silph();
	},
	"ITEM_SILPH_CO_7F_TM08": function() {
		if (can_silph_floor(7)) {
			return can_silph();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_7F_ZINC": function() {
		if (can_silph_floor(7)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_7F_CARD_KEY_7F": function() {
		if (can_silph_floor(3)) {
			return can_silph();
		}
	},
	"NPC_GIFT_GOT_LINK_CABLE": function() {
		if (can_silph_floor(3)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_8F_IRON": function() {
		return can_silph();
	},
	"HIDDEN_ITEM_SILPH_CO_8F_NUGGET": function() {
		return min(hidden_logic(), can_silph());
	},
	"ITEM_SILPH_CO_8F_CARD_KEY_8F": function() {
		return can_silph();
	},
	"HIDDEN_ITEM_SILPH_CO_9F_MAX_POTION": function() {
		if (can_silph_floor(9)) {
			return can_silph();
		}
	},
	"HIDDEN_ITEM_SILPH_CO_9F_CALCIUM": function() {
		if (can_silph_floor(9)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_9F_CARD_KEY_9F": function() {
		if (can_silph_floor(3) || can_silph_floor(9)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_10F_ULTRA_BALL": function() {
		return can_silph();
	},
	"ITEM_SILPH_CO_10F_RARE_CANDY": function() {
		return can_silph();
	},
	"ITEM_SILPH_CO_10F_CARBOS": function() {
		return can_silph();
	},
	"HIDDEN_ITEM_SILPH_CO_10F_HP_UP": function() {
		return min(hidden_logic(), can_silph());
	},
	"ITEM_SILPH_CO_10F_CARD_KEY_10F": function() {
		return can_silph();
	},
	"ITEM_SILPH_CO_11F_ZINC": function() {
		return can_silph();
	},
	"HIDDEN_ITEM_SILPH_CO_11F_REVIVE": function() {
		if (can_silph_floor(3)) {
			return can_silph();
		}
	},
	"ITEM_SILPH_CO_11F_CARD_KEY_11F": function() {
		if (can_silph_floor(3)) {
			return can_silph();
		}
	},
	"NPC_GIFT_GOT_MASTER_BALL_FROM_SILPH": function() {
		if (can_silph_floor(11) && can_silph_floor(3)) {
			return can_silph();
		}
	},
	"EVENT_FREE_SILPH": function() {
		if (can_silph_floor(11) && can_silph_floor(3)) {
			return can_silph();
		}
	},
	// Saffron Gym
	"EVENT_DEFEAT_SABRINA": function() {
		return can_saffronGym();
	},
	"BADGE_6": function() {
		return can_saffronGym();
	},
	"NPC_GIFT_GOT_TM04_FROM_SABRINA": function() {
		return can_saffronGym();
	},
	// Fuchsia City
	"HIDDEN_ITEM_FUCHSIA_CITY_MAX_REVIVE": function() {
		return min(hidden_logic(), can_fuchsia());
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
		return can_fuchsiaGym();
	},
	"BADGE_5": function() {
		return can_fuchsiaGym();
	},
	"NPC_GIFT_GOT_TM06_FROM_KOGA": function() {
		return can_fuchsiaGym();
	},
	// Safari Zone
	"NPC_GIFT_GOT_SAFARI_PASS": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_CENTER_NUGGET": function() {
		if (can_surf()) {
			return can_safariZone();
		}
	},
	"HIDDEN_ITEM_SAFARI_ZONE_CENTER_LEAF_STONE": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_safariZone());
		}
	},
	"ITEM_SAFARI_ZONE_EAST_LEAF_STONE": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_EAST_MAX_POTION": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_EAST_TM11": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_EAST_FULL_RESTORE": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_EAST_RESTHOUSE_FUCHSIA_KEY": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_NORTH_QUICK_CLAW": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_NORTH_TM47": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_NORTH_PROTEIN": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_WEST_MAX_REVIVE": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_WEST_MAX_POTION": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_WEST_GOLD_TEETH": function() {
		return can_safariZone();
	},
	"ITEM_SAFARI_ZONE_WEST_TM32": function() {
		return can_safariZone();
	},
	"HIDDEN_ITEM_SAFARI_ZONE_WEST_REVIVE": function() {
		return min(hidden_logic(), can_safariZone());
	},
	"NPC_GIFT_GOT_HM03": function() {
		return can_safariZone();
	},
	// Cinnabar
	// Cinnabar Gym
	"EVENT_DEFEAT_BLAINE": function() {
		return can_cinnabarGym();
	},
	"BADGE_7": function() {
		return can_cinnabarGym();
	},
	"NPC_GIFT_GOT_TM38_FROM_BLAINE": function() {
		return can_cinnabarGym();
	},
	"NPC_GIFT_GOT_LETTER": function() {
		return can_cinnabar();
	},
	"NPC_GIFT_GOT_ONE_PASS": function() {
		if (has("EVENT_DEFEAT_BLAINE")) {
			return can_cinnabar();
		}
	},
	// Pokemon Mansion
	"HIDDEN_ITEM_POKEMON_MANSION_1F_MOON_STONE": function() {
		return min(hidden_logic(), can_cinnabarMansion());
	},
	"ITEM_POKEMON_MANSION_1F_ESCAPE_ROPE": function() {
		return can_cinnabarMansion();
	},
	"ITEM_POKEMON_MANSION_1F_PROTEIN": function() {
		return can_cinnabarMansion();
	},
	"ITEM_POKEMON_MANSION_1F_CARBOS": function() {
		return can_cinnabarMansion();
	},
	"ITEM_POKEMON_MANSION_2F_ZINC": function() {
		return can_cinnabarMansion();
	},
	"ITEM_POKEMON_MANSION_2F_CALCIUM": function() {
		return can_cinnabarMansion();
	},
	"ITEM_POKEMON_MANSION_2F_HP_UP": function() {
		return can_cinnabarMansion();
	},
	"ITEM_POKEMON_MANSION_3F_MAX_POTION": function() {
		return can_cinnabarMansion();
	},
	"ITEM_POKEMON_MANSION_3F_IRON": function() {
		return can_cinnabarMansion();
	},
	"HIDDEN_ITEM_POKEMON_MANSION_3F_RARE_CANDY": function() {
		return min(hidden_logic(), can_cinnabarMansion());
	},
	"ITEM_POKEMON_MANSION_B1F_FULL_RESTORE": function() {
		return can_cinnabarMansion();
	},
	"HIDDEN_ITEM_POKEMON_MANSION_B1F_ELIXIR": function() {
		return min(hidden_logic(), can_cinnabarMansion());
	},
	"ITEM_POKEMON_MANSION_B1F_TM14": function() {
		return can_cinnabarMansion();
	},
	"ITEM_POKEMON_MANSION_B1F_SECRET_KEY": function() {
		return can_cinnabarMansion();
	},
	"ITEM_POKEMON_MANSION_B1F_TM22": function() {
		return can_cinnabarMansion();
	},
	// Indigo Plateau
	"EVENT_DEFEAT_BLUE": function() {
		return can_e4();
	},
	"NPC_GIFT_RECEIVED_MYSTIC_TICKET": function() {
		if (has("EVENT_DEFEAT_BLUE")) {
			return can_e4();
		}
	},
	"NPC_GIFT_RECEIVED_AURORA_TICKET": function() {
		if (has("EVENT_DEFEAT_BLUE")) {
			return can_e4();
		}
	},
	"EVENT_DEFEAT_BLUE_REMATCH": function() {
		if (has("EVENT_DEFEAT_BLUE")) {
			return can_gym_badge_count(elite_four_requirement, elite_four_rematch_count);
		}
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
		return min(hidden_logic(), can_pewter());
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
		return min(hidden_logic(), can_pewter());
	},
	// 3
	"HIDDEN_ITEM_ROUTE3_ORAN_BERRY": function() {
		return min(hidden_logic(), can_route3());
	},
	// 4
	"HIDDEN_ITEM_ROUTE4_PERSIM_BERRY": function() {
		return min(hidden_logic(), can_route3());
	},
	"HIDDEN_ITEM_ROUTE4_GREAT_BALL": function() {
		return min(hidden_logic(), can_route3());
	},
	"HIDDEN_ITEM_ROUTE4_RAZZ_BERRY": function() {
		return min(hidden_logic(), can_route3());
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
		return min(hidden_logic(), can_route3());
	},
	"HIDDEN_ITEM_MT_MOON_B1F_BIG_MUSHROOM_3": function() {
		return min(hidden_logic(), can_route3());
	},
	"HIDDEN_ITEM_MT_MOON_B1F_BIG_MUSHROOM": function() {
		return min(hidden_logic(), can_route3());
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
		return min(hidden_logic(), can_route3());
	},
	"ITEM_MT_MOON_B2F_TM46": function() {
		return can_route3();
	},
	"HIDDEN_ITEM_MT_MOON_B2F_ETHER": function() {
		return min(hidden_logic(), can_route3());
	},
	"ITEM_MT_MOON_1F_MOON_STONE": function() {
		return can_route3();
	},
	"HIDDEN_ITEM_MT_MOON_B1F_BIG_MUSHROOM_2": function() {
		return min(hidden_logic(), can_route3());
	},
	"ITEM_MT_MOON_B2F_REVIVE": function() {
		return can_route3();
	},
	"HIDDEN_ITEM_MT_MOON_B2F_MOON_STONE": function() {
		return min(hidden_logic(), can_route3());
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
		return min(hidden_logic(), can_route3());
	},
	// 5
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ANTIDOTE": function() {
		return min(hidden_logic(), can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_PARALYZE_HEAL": function() {
		return min(hidden_logic(), can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_AWAKENING": function() {
		return min(hidden_logic(), can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_POTION": function() {
		return min(hidden_logic(), can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ETHER": function() {
		return min(hidden_logic(), can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_ICE_HEAL": function() {
		return min(hidden_logic(), can_vermilion());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_NORTH_SOUTH_TUNNEL_BURN_HEAL": function() {
		return min(hidden_logic(), can_vermilion());
	},
	// 6
	"HIDDEN_ITEM_ROUTE6_SITRUS_BERRY": function() {
		return min(hidden_logic(), can_vermilion());
	},
	"HIDDEN_ITEM_ROUTE6_RARE_CANDY": function() {
		return min(hidden_logic(), can_vermilion());
	},
	// 7
	"HIDDEN_ITEM_ROUTE7_WEPEAR_BERRY": function() {
		return min(hidden_logic(), can_celadon());
	},
	// 8
	"HIDDEN_ITEM_ROUTE8_LUM_BERRY": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_ROUTE8_RAWST_BERRY": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_ROUTE8_LEPPA_BERRY": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_ICE_HEAL": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_ANTIDOTE": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_ETHER": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_BURN_HEAL": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_AWAKENING": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_PARALYZE_HEAL": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_UNDERGROUND_PATH_EAST_WEST_TUNNEL_POTION": function() {
		return min(hidden_logic(), can_lavender());
	},
	// 9
	"ITEM_ROUTE9_TM40": function() {
		return can_route9();
	},
	"HIDDEN_ITEM_ROUTE9_ETHER": function() {
		return min(hidden_logic(), can_route9());
	},
	"ITEM_ROUTE9_BURN_HEAL": function() {
		return can_route9();
	},
	"HIDDEN_ITEM_ROUTE9_CHESTO_BERRY": function() {
		return min(hidden_logic(), can_route9());
	},
	"HIDDEN_ITEM_ROUTE9_RARE_CANDY": function() {
		return min(hidden_logic(), can_route9());
	},
	// 10
	"HIDDEN_ITEM_ROUTE10_PERSIM_BERRY": function() {
		return min(hidden_logic(), can_route9());
	},
	"HIDDEN_ITEM_ROUTE10_CHERI_BERRY": function() {
		return min(hidden_logic(), can_route9());
	},
	"HIDDEN_ITEM_ROUTE10_NANAB_BERRY": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_ROUTE10_MAX_ETHER": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_route9());
		}
	},
	// Rock Tunnel
	"ITEM_ROCK_TUNNEL_1F_REPEL": function() {
		if (can_lavender()) {
			return can_flash();
		}
	},
	"ITEM_ROCK_TUNNEL_1F_ESCAPE_ROPE": function() {
		if (can_lavender()) {
			return can_flash();
		}
	},
	"ITEM_ROCK_TUNNEL_1F_PEARL": function() {
		if (can_lavender()) {
			return can_flash();
		}
	},
	"ITEM_ROCK_TUNNEL_B1F_REVIVE": function() {
		if (can_lavender()) {
			return can_flash();
		}
	},
	"ITEM_ROCK_TUNNEL_B1F_MAX_ETHER": function() {
		if (can_lavender()) {
			return can_flash();
		}
	},
	// Power Plant
	"ITEM_POWER_PLANT_MAX_POTION": function() {
		return can_powerPlant();
	},
	"ITEM_POWER_PLANT_TM17": function() {
		return can_powerPlant();
	},
	"ITEM_POWER_PLANT_ELIXIR": function() {
		return can_powerPlant();
	},
	"ITEM_POWER_PLANT_TM25": function() {
		return can_powerPlant();
	},
	"ITEM_POWER_PLANT_THUNDER_STONE": function() {
		return can_powerPlant();
	},
	"HIDDEN_ITEM_POWER_PLANT_MAX_ELIXIR": function() {
		return min(hidden_logic(), can_powerPlant());
	},
	"HIDDEN_ITEM_POWER_PLANT_THUNDER_STONE": function() {
		return min(hidden_logic(), can_powerPlant());
	},
	"NPC_GIFT_GOT_EVERSTONE_FROM_OAKS_AIDE": function() {
		return can_route9();
	},
	"HIDDEN_ITEM_ROUTE10_SUPER_POTION": function() {
		return min(hidden_logic(), can_route9());
	},
	// 11
	"ITEM_ROUTE11_AWAKENING": function() {
		return can_vermilion();
	},
	"ITEM_ROUTE11_X_DEFEND": function() {
		return can_vermilion();
	},
	"HIDDEN_ITEM_ROUTE11_ESCAPE_ROPE": function() {
		return min(hidden_logic(), can_vermilion());
	},
	"ITEM_ROUTE11_GREAT_BALL": function() {
		return can_vermilion();
	},
	"NPC_GIFT_GOT_ITEMFINDER": function() {
		return can_vermilion();
	},
	"ITEM_DIGLETTS_CAVE_B1F_VERMILION_KEY": function() {
		return can_vermilion();
	},
	// 12
	"HIDDEN_ITEM_ROUTE12_HYPER_POTION": function() {
		return min(hidden_logic(), can_lavender());
	},
	"HIDDEN_ITEM_ROUTE12_LEFTOVERS": function() {
		if (has("ITEM_POKE_FLUTE")) {
			return min(hidden_logic(), can_vermilion());
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
			return min(hidden_logic(), can_fuchsia());
		}
	},
	"NPC_GIFT_GOT_SUPER_ROD": function() {
		return can_fuchsia();
	},
	"NPC_GIFT_GOT_NET_BALL_FROM_ROUTE12_FISHING_HOUSE": function() {
		return can_fuchsia();
	},
	"NPC_GIFT_GOT_TM27": function() {
		return can_lavender();
	},
	// 13
	"HIDDEN_ITEM_ROUTE13_PP_UP": function() {
		return min(hidden_logic(), can_fuchsia());
	},
	// 14
	"HIDDEN_ITEM_ROUTE14_PINAP_BERRY": function() {
		return min(hidden_logic(), can_fuchsia());
	},
	"HIDDEN_ITEM_ROUTE14_ZINC": function() {
		if (can_cut()) {
			return min(hidden_logic(), can_fuchsia());
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
			return min(hidden_logic(), can_celadon());
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
			return min(hidden_logic(), can_fuchsia());
		}
	},
	"HIDDEN_ITEM_ROUTE17_PP_UP": function() {
		if (has("ITEM_BICYCLE")) {
			return min(hidden_logic(), can_fuchsia());
		}
	},
	"HIDDEN_ITEM_ROUTE17_RARE_CANDY": function() {
		if (has("ITEM_BICYCLE")) {
			return min(hidden_logic(), can_fuchsia());
		}
	},
	"HIDDEN_ITEM_ROUTE17_MAX_REVIVE": function() {
		if (has("ITEM_BICYCLE")) {
			return min(hidden_logic(), can_fuchsia());
		}
	},
	"HIDDEN_ITEM_ROUTE17_MAX_ELIXIR": function() {
		if (has("ITEM_BICYCLE")) {
			return min(hidden_logic(), can_fuchsia());
		}
	},
	// 20
	"HIDDEN_ITEM_ROUTE20_STARDUST": function() {
		return min(hidden_logic(), can_cinnabar());
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
		return min(hidden_logic(), can_cinnabar());
	},
	"HIDDEN_ITEM_SEAFOAM_ISLANDS_B4F_WATER_STONE": function() {
		return min(hidden_logic(), can_cinnabar());
	},
	"ITEM_SEAFOAM_ISLANDS_B4F_ULTRA_BALL": function() {
		return can_cinnabar();
	},
	// 21
	"HIDDEN_ITEM_ROUTE21_NORTH_PEARL": function() {
		return min(hidden_logic(), can_cinnabar());
	},
	// 23
	"HIDDEN_ITEM_ROUTE23_LEPPA_BERRY": function() {
		return min(hidden_logic(), can_route22Gate());
	},
	"HIDDEN_ITEM_ROUTE23_MAX_ETHER": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_route22Gate());
		}
	},
	"HIDDEN_ITEM_ROUTE23_ULTRA_BALL": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_route22Gate());
		}
	},
	"HIDDEN_ITEM_ROUTE23_ASPEAR_BERRY": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_route22Gate());
		}
	},
	"HIDDEN_ITEM_ROUTE23_FULL_RESTORE": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_route22Gate());
		}
	},
	"HIDDEN_ITEM_ROUTE23_SITRUS_BERRY": function() {
		return min(hidden_logic(), can_victoryRoad());
	},
	"HIDDEN_ITEM_ROUTE23_LUM_BERRY": function() {
		return min(hidden_logic(), can_victoryRoad_complete());
	},
	"HIDDEN_ITEM_ROUTE23_MAX_ELIXIR": function() {
		return min(hidden_logic(), can_victoryRoad_complete());
	},
	// Victory Road
	"HIDDEN_ITEM_VICTORY_ROAD_1F_FULL_RESTORE": function() {
		return min(hidden_logic(), can_victoryRoad_complete());
	},
	"ITEM_VICTORY_ROAD_1F_TM02": function() {
		return can_victoryRoad_complete();
	},
	"ITEM_VICTORY_ROAD_1F_RARE_CANDY": function() {
		return can_victoryRoad_complete();
	},
	"HIDDEN_ITEM_VICTORY_ROAD_1F_ULTRA_BALL": function() {
		return min(hidden_logic(), can_victoryRoad_complete());
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
		return min(hidden_logic(), can_cerulean());
	},
	// 25
	"HIDDEN_ITEM_ROUTE25_ELIXIR": function() {
		return min(hidden_logic(), can_cerulean());
	},
	"ITEM_ROUTE25_TM43": function() {
		return can_cut();
	},
	"HIDDEN_ITEM_ROUTE25_ORAN_BERRY": function() {
		return min(hidden_logic(), can_cerulean());
	},
	"HIDDEN_ITEM_ROUTE25_BLUK_BERRY": function() {
		return min(hidden_logic(), can_cerulean());
	},
	"HIDDEN_ITEM_ROUTE25_ETHER": function() {
		return min(hidden_logic(), can_cerulean());
	},
	// Bill's House
	"EVENT_ASSIST_BILL": function() {
		return can_cerulean();
	},
	"NPC_GIFT_GOT_SS_TICKET": function() {
		return can_cerulean();
	},
	"NPC_GIFT_GOT_CERULEAN_KEY": function() {
		return can_cerulean();
	},
	// One 
	"HIDDEN_ITEM_MT_EMBER_EXTERIOR_ULTRA_BALL": function() {
		if (can_surf() && can_strength()) {
			return min(hidden_logic(), can_one());
		}
	},
	"ITEM_MT_EMBER_EXTERIOR_DIRE_HIT": function() {
		if (can_surf() && can_strength()) {
			return can_one();
		}
	},
	"ITEM_MT_EMBER_EXTERIOR_FIRE_STONE": function() {
		if (can_surf() && can_strength() && can_rockSmash()) {
			return can_one();
		}
	},
	"HIDDEN_ITEM_MT_EMBER_EXTERIOR_FIRE_STONE": function() {
		if (can_surf() && can_strength()) {
			return min(hidden_logic(), can_one());
		}
	},
	"ITEM_MT_EMBER_EXTERIOR_ULTRA_BALL": function() {
		if (can_surf() && can_strength()) {
			return can_one();
		}
	},
	"NPC_GIFT_GOT_RUBY": function() {
		if (can_surf() && can_strength() && has("EVENT_DELIVER_METEORITE")) {
			return can_one();
		}
	},
	"NPC_GIFT_GOT_METEORITE": function() {
		return can_one();
	},
	"NPC_GIFT_GOT_TRI_PASS": function() {
		return can_one();
	},
	"NPC_GIFT_GOT_RAINBOW_PASS": function() {
		if (has("ITEM_RUBY") && has("EVENT_DELIVER_METEORITE")) {
			return can_one();
		}
	},
	"NPC_GIFT_GOT_SEVEN_PASS": function() {
		return can_restoreNetwork();
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_STARDUST": function() {
		return can_treasureBeach();
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_ULTRA_BALL": function() {
		return can_treasureBeach();
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_BIG_PEARL": function() {
		return can_treasureBeach();
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_STARDUST_2": function() {
		return can_treasureBeach();
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_PEARL": function() {
		return can_treasureBeach();
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_STAR_PIECE": function() {
		return can_treasureBeach();
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_PEARL_2": function() {
		return can_treasureBeach();
	},
	"HIDDEN_ITEM_ONE_ISLAND_TREASURE_BEACH_ULTRA_BALL_2": function() {
		return can_treasureBeach();
	},
	"ITEM_ONE_ISLAND_KINDLE_ROAD_MAX_REPEL": function() {
		if (can_surf()) {
			return can_one();
		}
	},
	"ITEM_ONE_ISLAND_KINDLE_ROAD_CARBOS": function() {
		if (can_surf() && can_rockSmash()) {
			return can_one();
		}
	},
	"ITEM_ONE_ISLAND_KINDLE_ROAD_ETHER": function() {
		if (can_surf() && can_rockSmash()) {
			return can_one();
		}
	},
	"NPC_GIFT_GOT_HM06": function() {
		if (can_surf()) {
			return can_one();
		}
	},
	// Two
	"ITEM_TWO_ISLAND_REVIVE": function() {
		if (can_cut()) {
			return can_two();
		}
	},
	"NPC_GIFT_GOT_MOON_STONE_FROM_JOYFUL_GAME_CORNER": function() {
		if (has("EVENT_FIND_LOSTELLE") && has("ITEM_METEORITE")) {
			return can_two();
		}
	},
	"EVENT_DELIVER_METEORITE": function() {
		if (has("EVENT_FIND_LOSTELLE") && has("ITEM_METEORITE")) {
			return can_two();
		}
	},
	"HIDDEN_ITEM_TWO_ISLAND_CAPE_BRINK_RARE_CANDY": function() {
		return min(hidden_logic(), can_two());
	},
	"HIDDEN_ITEM_TWO_ISLAND_CAPE_BRINK_PP_MAX": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_two());
		}
	},
	// Three
	// Berry Forest
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_RAZZ_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_ORAN_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_PERSIM_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_PINAP_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_CHESTO_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"ITEM_THREE_ISLAND_BERRY_FOREST_FULL_HEAL": function() {
		return can_three();
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_NANAB_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_CHERI_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_WEPEAR_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_BLUK_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"ITEM_THREE_ISLAND_BERRY_FOREST_MAX_ETHER": function() {
		return can_three();
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_RAWST_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_ASPEAR_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_PECHA_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"EVENT_FIND_LOSTELLE": function() {
		return can_three();
	},
	"NPC_GIFT_RESCUED_LOSTELLE": function() {
		return can_three();
	},
	"HIDDEN_ITEM_THREE_ISLAND_BERRY_FOREST_LUM_BERRY": function() {
		return min(hidden_logic(), can_three());
	},
	"ITEM_THREE_ISLAND_BERRY_FOREST_MAX_ELIXIR": function() {
		if (can_cut() && can_surf()) {
			return can_three();
		}
	},
	// Dunsparce Tunnel
	"HIDDEN_ITEM_THREE_ISLAND_DUNSPARCE_TUNNEL_NUGGET": function() {
		return min(hidden_logic(), can_three());
	},
	"NPC_GIFT_GOT_NUGGET_FROM_DUNSPARCE_TUNNEL": function() {
		return can_three();
	},
	"NPC_GIFT_GOT_FULL_RESTORE_FROM_THREE_ISLAND_DEFENDER": function() {
		return can_three();
	},
	"ITEM_THREE_ISLAND_ZINC": function() {
		if (can_cut()) {
			return can_three();
		}
	},
	"HIDDEN_ITEM_THREE_ISLAND_PP_UP": function() {
		if (can_cut()) {
			return min(hidden_logic(), can_three());
		}
	},
	"HIDDEN_ITEM_THREE_ISLAND_BOND_BRIDGE_MAX_REPEL": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BOND_BRIDGE_PEARL": function() {
		return min(hidden_logic(), can_three());
	},
	"HIDDEN_ITEM_THREE_ISLAND_BOND_BRIDGE_STARDUST": function() {
		return min(hidden_logic(), can_three());
	},
	"NPC_GIFT_GOT_TWO_PASS": function() {
		if (has("EVENT_DELIVER_METEORITE")) {
			return can_three();
		}
	},
	// Four
	// Icefall Cave
	"ITEM_FOUR_ISLAND_ICEFALL_CAVE_1F_ULTRA_BALL": function() {
		if (can_surf()) {
			return can_four();
		}
	},
	"ITEM_FOUR_ISLAND_ICEFALL_CAVE_1F_HM07": function() {
		if (can_surf()) {
			return can_four();
		}
	},
	"ITEM_FOUR_ISLAND_ICEFALL_CAVE_B1F_NEVER_MELT_ICE": function() {
		if (can_surf()) {
			return can_four();
		}
	},
	"ITEM_FOUR_ISLAND_ICEFALL_CAVE_B1F_FULL_RESTORE": function() {
		if (can_surf()) {
			return can_four();
		}
	},
	"NPC_GIFT_GOT_SIX_PASS": function() {
		if (can_waterfall()) {
			return can_four();
		}
	},
	"HIDDEN_ITEM_FOUR_ISLAND_PEARL": function() {
		return min(hidden_logic(), can_four());
	},
	"HIDDEN_ITEM_FOUR_ISLAND_ULTRA_BALL": function() {
		return min(hidden_logic(), can_four());
	},
	"ITEM_FOUR_ISLAND_STAR_PIECE": function() {
		if (can_rockSmash()) {
			return can_four();
		}
	},
	"ITEM_FOUR_ISLAND_STARDUST": function() {
		if (can_surf()) {
			return can_four();
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
		if (can_surf() && has("EVENT_RESCUE_SELPHY")) {
			return can_five();
		}
	},
	// Lost Cave
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM10_SILK_SCARF": function() {
		if (can_surf()) {
			return can_five();
		}
	},
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM11_LAX_INCENSE": function() {
		if (can_surf()) {
			return can_five();
		}
	},
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM12_SEA_INCENSE": function() {
		if (can_surf()) {
			return can_five();
		}
	},
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM13_MAX_REVIVE": function() {
		if (can_surf()) {
			return can_five();
		}
	},
	"ITEM_FIVE_ISLAND_LOST_CAVE_ROOM14_RARE_CANDY": function() {
		if (can_surf()) {
			return can_five();
		}
	},
	"EVENT_RESCUE_SELPHY": function() {
		if (can_surf()) {
			return can_five();
		}
	},
	"ITEM_FIVE_ISLAND_MEADOW_MAX_POTION": function() {
		if (can_cut()) {
			return can_five();
		}
	},
	"ITEM_FIVE_ISLAND_MEADOW_PP_UP": function() {
		if (can_surf()) {
			return can_five();
		}
	},
	"HIDDEN_ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_RAZZ_BERRY": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_five());
		}
	},
	"HIDDEN_ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_BLUK_BERRY": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_five());
		}
	},
	"HIDDEN_ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_SITRUS_BERRY": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_five());
		}
	},
	"NPC_GIFT_GOT_TM42_AT_MEMORIAL_PILLAR": function() {
		if (can_surf() && can_five()) {
			if (has("EVENT_DEFEAT_BLUE") && can_two()) {
				return "logical";
			}
			return can_celadon();
		}
	},
	"ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_METAL_COAT": function() {
		if (can_surf()) {
			return can_five();
		}
	},
	"HIDDEN_ITEM_FIVE_ISLAND_MEMORIAL_PILLAR_BIG_PEARL": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_five());
		}
	},
	"HIDDEN_ITEM_FIVE_ISLAND_RESORT_GORGEOUS_NEST_BALL": function() {
		if (can_surf()) {
			return can_five();
		}
	},
	"HIDDEN_ITEM_FIVE_ISLAND_RESORT_GORGEOUS_STARDUST_2": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_five());
		}
	},
	"HIDDEN_ITEM_FIVE_ISLAND_RESORT_GORGEOUS_STARDUST": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_five());
		}
	},
	"HIDDEN_ITEM_FIVE_ISLAND_RESORT_GORGEOUS_STAR_PIECE": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_five());
		}
	},
	// Six
	"HIDDEN_ITEM_SIX_ISLAND_LEPPA_BERRY": function() {
		return min(hidden_logic(), can_six());
	},
	"HIDDEN_ITEM_SIX_ISLAND_WATER_PATH_PINAP_BERRY": function() {
		return min(hidden_logic(), can_six());
	},
	"HIDDEN_ITEM_SIX_ISLAND_WATER_PATH_ASPEAR_BERRY": function() {
		return min(hidden_logic(), can_six());
	},
	"ITEM_SIX_ISLAND_WATER_PATH_DRAGON_SCALE": function() {
		if (can_surf()) {
			return can_six();
		}
	},
	"HIDDEN_ITEM_SIX_ISLAND_WATER_PATH_ORAN_BERRY": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_six());
		}
	},
	"ITEM_SIX_ISLAND_WATER_PATH_ELIXIR": function() {
		if (can_surf()) {
			return can_six();
		}
	},
	"ITEM_SIX_ISLAND_RUIN_VALLEY_SUN_STONE": function() {
		if (can_strength()) {
			return can_six();
		}
	},
	"ITEM_SIX_ISLAND_RUIN_VALLEY_HP_UP": function() {
		if (can_strength()) {
			return can_six();
		}
	},
	"ITEM_SIX_ISLAND_RUIN_VALLEY_FULL_RESTORE": function() {
		if (can_strength()) {
			return can_six();
		}
	},
	"HIDDEN_ITEM_SIX_ISLAND_GREEN_PATH_ULTRA_BALL": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_six());
		}
	},
	"HIDDEN_ITEM_SIX_ISLAND_OUTCAST_ISLAND_STAR_PIECE": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_six());
		}
	},
	"ITEM_SIX_ISLAND_OUTCAST_ISLAND_PP_UP": function() {
		if (can_surf()) {
			return can_six();
		}
	},
	"HIDDEN_ITEM_SIX_ISLAND_OUTCAST_ISLAND_NET_BALL": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_six());
		}
	},
	"NPC_GIFT_GOT_FIVE_PASS": function() {
		if (can_cut()) {
			return can_six();
		}
	},
	"NPC_GIFT_GOT_NEST_BALL_FROM_WATER_PATH_HOUSE_1": function() {
		if (can_surf()) {
			return can_six();
		}
	},
	// Seven
	"HIDDEN_ITEM_SEVEN_ISLAND_SEVAULT_CANYON_ENTRANCE_RAWST_BERRY": function() {
		return min(hidden_logic(), can_seven());
	},
	"ITEM_SEVEN_ISLAND_SEVAULT_CANYON_NUGGET": function() {
		return can_seven();
	},
	"ITEM_SEVEN_ISLAND_SEVAULT_CANYON_MAX_ELIXIR": function() {
		return can_seven();
	},
	"ITEM_SEVEN_ISLAND_SEVAULT_CANYON_KINGS_ROCK": function() {
		if (can_strength() && can_rockSmash()) {
			return can_seven();
		}
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_SEVAULT_CANYON_CHERI_BERRY": function() {
		return min(hidden_logic(), can_seven());
	},
	"ITEM_SEVEN_ISLAND_SEVAULT_CANYON_HOUSE_LUCKY_PUNCH": function() {
		return can_seven();
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TANOBY_RUINS_HEART_SCALE_4": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_seven());
		}
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TANOBY_RUINS_HEART_SCALE": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_seven());
		}
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TANOBY_RUINS_HEART_SCALE_2": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_seven());
		}
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TANOBY_RUINS_HEART_SCALE_3": function() {
		if (can_surf()) {
			return min(hidden_logic(), can_seven());
		}
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TRAINER_TOWER_NANAB_BERRY": function() {
		return min(hidden_logic(), can_seven());
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TRAINER_TOWER_PEARL": function() {
		return min(hidden_logic(), can_seven());
	},
	"HIDDEN_ITEM_SEVEN_ISLAND_TRAINER_TOWER_BIG_PEARL": function() {
		return min(hidden_logic(), can_seven());
	},
	"NPC_GIFT_GOT_DEEP_SEA_SCALE": function() {
		if (has("ITEM_SCANNER")) {
			return can_seven();
		}
	},
	"NPC_GIFT_GOT_DEEP_SEA_TOOTH": function() {
		if (has("ITEM_SCANNER")) {
			return can_seven();
		}
	},
	"NPC_GIFT_GOT_SCANNER": function() {
		if (can_surf() && can_strength()) {
			return can_seven();
		}
	},
	// Navel
	"HIDDEN_ITEM_NAVEL_ROCK_SUMMIT_SACRED_ASH": function() {
		if (has("ITEM_MYSTIC_TICKET")) {
			return can_vermilion();
		}
	}
}