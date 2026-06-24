import { unpack_address } from '../visi/gametypes';
import { ZState, GnustoEngine } from '../visi/zstate';
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

export function show_commentary_hook(topic: string, engine: GnustoEngine): string|null
{
    return null;
}

