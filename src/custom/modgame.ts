import { unpack_address } from '../visi/gametypes';
import { ZState, ZStatePlus, GnustoEngine } from '../visi/zstate';
import { gamedat_routine_names, gamedat_global_names, gamedat_string_map } from '../visi/gamedat';

export type SpecificDeadline = {
    goaltables: number[][],
    attntable: number[],
    movegoals: number[],
    movetimes: number[][],
};

// Initial values and lengths of the MOVEMENT-GOALS table.
export const initialmovegoals = [
    { initial: 10548, len: 0 },
    { initial: 10554, len: 3 },
    { initial: 10576, len: 0 },
    { initial: 10582, len: 0 },
    { initial: 10588, len: 5 },
    { initial: 10622, len: 0 },
];

/* Pull out the GOAL-TABLES and other movement data. */
export function get_goal_tables(engine: GnustoEngine, state: ZState): SpecificDeadline
{
    // GOAL-TABLES
    let goaltables = [];
    for (let char=0; char<6; char++) {
        let goaltable = [];
        for (let ix=0; ix<20; ix += 2) {
            goaltable.push(engine.getUnsignedWord(10400 + 20*char + ix));
        }
        goaltables.push(goaltable);
    }

    // ATTENTION-TABLE
    let attntable = [];
    for (let char=0; char<6; char++) {
        attntable.push(engine.getUnsignedWord(10532+2*char));
    }

    let movegoals = [];
    let movetimes = [];
    // MOVEMENT-GOALS
    // Here, we need the top-level pointer and the first value (only) from
    // each row. (The other two values are static.)
    for (let char=0; char<6; char++) {
        movegoals.push(engine.getUnsignedWord(10628+2*char));
        let times = [];
        for (let ix=0; ix<initialmovegoals[char].len; ix++) {
            times.push(engine.getUnsignedWord(initialmovegoals[char].initial+ix*6+2));
        }
        movetimes.push(times);
    }
    
    return {
        goaltables: goaltables,
        attntable: attntable,
        movegoals: movegoals,
        movetimes: movetimes,
    }
}

export type LegalState = {
    present_time: number;
    corpse_invisible: number,
    met_duffy: number,
    monica_limbo: boolean;
    monica_admitted_helping: number;
    phong_admitted_helping: number;
    player_pushed_button: number;
    powder_analyzed: number;
    inside_gun: number;
    gun_receipt: number;
    monica_has_motive: number;
    seen_monica_at_clock: number;
    seen_monica_at_j_box: number;
    used_clock_key: number;
    medical_report: number;
    side_footprints_matched: number;
}

export function get_legal_state(zstate: ZStatePlus)
{
    let present_time = zstate.globals[49];
    let corpse_invisible = zstate.objects[12-1].attrs & 0x80000; // CORPSE & INVISIBLE
    let met_duffy = zstate.globals[41];
    let monica_limbo = (zstate.objects[68-1].parent == 221); // MONICA.parent == LIMBO
    let monica_admitted_helping = zstate.globals[138];
    let phong_admitted_helping = zstate.globals[148];
    let player_pushed_button = zstate.globals[160];
    let powder_analyzed = zstate.globals[9];
    let inside_gun = zstate.objects[40-1].attrs & 0x8000000; // INSIDE-GUN & TOUCHBIT
    let gun_receipt = zstate.objects[55-1].attrs & 0x8000000; // GUN-RECEIPT & TOUCHBIT
    let monica_has_motive = zstate.globals[142];
    let seen_monica_at_clock = zstate.globals[6];
    let seen_monica_at_j_box = zstate.globals[5];
    let used_clock_key = zstate.globals[4];
    let medical_report = zstate.objects[36-1].attrs & 0x8000000; // MEDICAL-REPORT & TOUCHBIT
    let side_footprints_matched = zstate.globals[8];
    
    return {
        present_time,
        corpse_invisible,
        met_duffy,
        monica_limbo,
        monica_admitted_helping,
        phong_admitted_helping,
        player_pushed_button,
        powder_analyzed,
        inside_gun,
        gun_receipt,
        monica_has_motive,
        seen_monica_at_clock,
        seen_monica_at_j_box,
        used_clock_key,
        medical_report,
        side_footprints_matched,
    };
}

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    if (topic == 'SHOW-SOLUTION-TAB') {
        window.dispatchEvent(new Event('show-solution-tab'));
        return null;
    }
    
    return null;
}

