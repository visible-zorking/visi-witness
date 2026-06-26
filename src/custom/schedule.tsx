import React from 'react';
import { useState, useContext } from 'react';

import { ZilSourceLoc } from '../visi/main';
import { ReactCtx } from '../visi/context';

import { signed_zvalue, unpack_address } from '../visi/gametypes';
import { gamedat_object_ids, gamedat_routine_addrs, gamedat_property_nums } from '../visi/gamedat';

import { SpecificDeadline, initialmovegoals } from './modgame';
import { ArgShowTime } from './cwidgets';

type CharTableType = {
    name: string,
    id: number,
}

// This duplicates gameids, sorry.
const charnames: CharTableType[] = [
    { name: 'Player', id: 79 },
    { name: 'Phong', id: 77 },
    { name: 'Linder', id: 74 },
    { name: 'Stiles', id: 71 },
    { name: 'Monica', id: 68 },
    { name: 'Cat', id: 65 },
];

// And this duplicates properties.
const dirabbrevs: { [key: number]: string } = {
    31: 'N',
    30: 'S',
    29: 'E',
    28: 'W',
    27: 'NE',
    26: 'NW',
    25: 'SE',
    24: 'SW',
    23: 'U',
    22: 'D',
    21: 'IN',
    20: 'OUT',
    0: '\u2014',
}

// And the MOVEMENT-GOALS contents. These are static, so there's no need
// to pull them from the game state each turn.

type MovementRow = [ number, number, string, string ];

const movementgoals: MovementRow[][] = [
    // "PLAYER"
    [],
    // "PHONG"
    [
        [ 50,   1, "OFFICE-PATH", "8:50-9 PM" ],
        [ 70,  10, "KITCHEN",     "10-12 PM" ],
        [ 120, 10, "BUTLER-ROOM", "12 PM ON" ],
    ],
    // "LINDER"
    [],
    // "STILES"
    [],
    // "MONICA"
    [
        [ 30,  2, "OFFICE",      "8:30" ],
        [ 161, 1, "OFFICE",      "? not used!" ],
        [ 15,  5, "MONICA-ROOM", "to rest" ],
        [ 30, 10, "OFFICE",      "12:00 to hide evidence" ],
        [ 60, 10, "MONICA-ROOM", "1:00 retires" ],
    ],
    // "CAT"
    [],
];

// This doesn't require a context, turns out.
function evhan_click_id(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) {
    ev.preventDefault();
    let dat: ZilSourceLoc = { id: id, commentary: true };
    window.dispatchEvent(new CustomEvent('zil-source-location', { detail:dat }));
}

export function SchedulePage()
{
    let rctx = useContext(ReactCtx);
    let zstate = rctx.zstate;
    
    let present = zstate.globals[49]; // PRESENT-TIME
    
    return (
        <div className="ScrollContent">
            <p>
                <em>The Witness</em> uses the same NPC scheduling system
                as <em>Deadline</em>, but to a lesser degree. Only
                two characters, Phong and Monica, have a full twelve-hour
                schedule. Everybody else is controlled by simple
                timers.
            </p>
            <p>
                Each character&#x2019;s movement is managed by the{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:GOAL-TABLES') }><code>GOAL-TABLES</code></a>
                {' '}and{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:MOVEMENT-GOALS') }><code>MOVEMENT-GOALS</code></a>
                {' '}tables. These are quite complicated, so I have broken
                them down into smaller tables for display in this tab.
            </p>
            <p>
                Let&#x2019;s start with the characters&#x2019; current
                locations, and the timer routines that control each of them:
            </p>
            <CharacterTable />
            <p>
                (Note that the{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:GOAL-TABLES') }><code>GOAL-TABLES</code></a>{' '}
                in the source code lists routines called{' '}
                <code>I-LINDER</code> and <code>I-CAT</code>,
                but no such routines exist!)
            </p>
            <p>
                To manage NPC movement, the game defines four
                &#x201C;<a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:OUTSIDE-LINE') }>transit lines</a>&#x201D;
                that run through the map.
                Every room is either a &#x201C;station&#x201D;
                on one of these lines, or adjacent to a station room.
                Thus, to reach a goal, an NPC just needs to
                (1) move to the local station if needed;
                (2) move one step along the current line to the next
                interchange;
                (3) if on the goal line, move one step towards the
                goal station;
                (4) move to the final room (if that&#x2019;s not the station).
                The{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'RTN:IMOVEMENT') }><code>IMOVEMENT</code></a>{' '}
                routine handles this.
            </p>
            <p>
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:GOAL-TABLES') }><code>GOAL-TABLES</code></a>{' '}
                shows each character&#x2019;s current movement goal.
                &#x201C;Final&#x201D; is where they are heading;
                &#x201C;station&#x201D; is that room&#x2019;s{' '}
                <code>STATION</code>;
                &#x201C;inter&#x201D; is the interchange
                room that will get them onto the desired line.
                The &#x201C;dir&#x201D; is the direction they just moved
                (not used in practice).
                The &#x201C;run&#x201D; column is whether the
                character&#x2019;s movement is enabled.
            </p>
            <p>
                The last two columns allow the character to put their
                normal schedule on hold and respond to an urgent imperative.
                If &#x201C;pri&#x201D; is set, they are on a priority mission.
                They will get back to the &#x201C;queued&#x201D; destination
                once{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'RTN:UNPRIORITIZE') }><code>UNPRIORITIZE</code></a>{' '}
                is called.
            </p>
            <GoalTable />
            <p>
                If you call a character&#x2019;s name, or otherwise attract
                their attention,{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'RTN:GRAB-ATTENTION') }><code>GRAB-ATTENTION</code></a>
                {' '}temporarily disables their movement.
                (See &#x201C;run&#x201D; above.) It then sets their
                entry in the{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:ATTENTION-TABLE') }><code>ATTENTION-TABLE</code></a>,
                which then decreases each turn
                (<a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'RTN:I-ATTENTION') }><code>I-ATTENTION</code></a>)
                until it reaches zero.
                Different characters have different attention spans.
            </p>
            <AttentionTable />
            <p>
                And finally, the overall plan for the day.
                (I&#x2019;ve saved it for last because it&#x2019;s the longest!)
            </p>
            <p>
                Phong and Monica each have a list of places to be and how
                long they will spend there. The character has a
                different description for each location, which gives
                a sense of what they&#x2019;re doing. (This has no game effect;
                it&#x2019;s purely descriptive.)
            </p>
            <p>
                The{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:MOVEMENT-GOALS') }><code>MOVEMENT-GOALS</code></a>
                {' '}table is a bit confusing. Each line gives the time
                the character waits <em>before</em> moving to a given
                location. So the time they spend there is actually on the
                {' '}<em>next</em> line.
            </p>
            { (present == 480) ?
              <p>
                  The schedule is not active on the first turn.
                  Starting at 8:01 pm, it will highlight Monica&#x2019;s
                  next destination and the time at which she will depart
                  for it.
                  Phong has a similar schedule, but his timer does not
                  start until he leads you to the dining room.
              </p>
              :
              <p>
                  To clarify this (maybe), I&#x2019;ve highlighted each character&#x2019;s
                  next destination and the time at which they will depart
                  for it.
              </p>
            }
            <p>
                Times are slightly variable. When a line is highlighted,
                the game applies a random adjustment. (E.g., Phong&#x2019;s
                first move is at 8:50 plus or minus one minute.)
                The next row (how long they spend) is adjusted the other
                way to avoid schedule drift.
            </p>
            <p>
                After the table runs out for a character (midnight to 1:00),
                they just stay put for the rest of the game.
            </p>
            <p>
                The right-hand column is a source-code comment. They
                have no effect in the game; they&#x2019;re just the developer&#x2019;s
                notes to himself.
            </p>
            <MovementTable />
            <p>
                Of course this table doesn&#x2019;t cover every character
                action in the game. Many are triggered by your
                actions, such as Linder following you around
                after you arrive.
                Others are on their own timers, such as{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'RTN:I-LINDER-TO-OFFICE') }><code>I-LINDER-TO-OFFICE</code></a>,
                or managed through the (overstuffed){' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'RTN:I-PHONG') }><code>I-PHONG</code></a>
                {' '}and{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'RTN:I-MONICA') }><code>I-MONICA</code></a>
                {' '}routines.
            </p>
            <p>
                (Comments in the{' '}
                <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, 'GLOB:MOVEMENT-GOALS') }><code>MOVEMENT-GOALS</code></a>
                {' '}source code indicate several of these events were
                originally handled via the schedule, and later changed to
                custom code.)
            </p>
        </div>
    );
}

function CharacterTable()
{
    let rctx = useContext(ReactCtx);
    let zstate = rctx.zstate;

    let specifics = zstate.specifics as SpecificDeadline;
    
    let rowls = [];
    for (let char=0; char<6; char++) {
        let charid = charnames[char].id;
        // We rely on the fact that the zstate reports objects in order (1-based).
        let loc = zstate.objects[charid-1].parent;
        let timertn = specifics.goaltables[char][7];
        rowls.push(
            <CharacterTableRow key={ char } char={ char } loc={ loc } timertn={ timertn } />
        );
    }
    
    return (
        <table className="GoalTable">
            <tbody>
                <tr>
                    <th>person</th>
                    <th>location</th>
                    <th>timer</th>
                </tr>
                { rowls }
            </tbody>
        </table>
    );
}

function CharacterTableRow({ char, loc, timertn }: { char:number, loc:number, timertn:number })
{
    let locobj = gamedat_object_ids.get(loc);
    let func7 = gamedat_routine_addrs.get(unpack_address(timertn));
    
    return (
        <tr>
            <td>{ charnames[char].name }</td>
            <td>
                {
                    locobj ?
                    <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:'+locobj.name) }>{ locobj.name }</a>
                    : '\u2014'
                }
            </td>
            <td>
                { func7 ?
                  <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'RTN:'+func7.name) }>{ func7.name }</a>
                  : '\u2014'
                }
            </td>
        </tr>
    );
}

function GoalTable()
{
    let rctx = useContext(ReactCtx);
    let zstate = rctx.zstate;
    
    let specifics = zstate.specifics as SpecificDeadline;
    
    let rowls = [];
    for (let char=0; char<6; char++) {
        rowls.push(
            <GoalTableRow key={ char } char={ char } row={ specifics.goaltables[char] } />
        );
    }
    
    return (
        <table className="GoalTable">
            <tbody>
                <tr>
                    <th>person</th>
                    <th>final</th>
                    <th>station</th>
                    <th>inter</th>
                    <th>dir</th>
                    <th>run</th>
                    <th>pri</th>
                    <th>queued</th>
                </tr>
                { rowls }
            </tbody>
        </table>
    );
}

function GoalTableRow({ char,  row }: { char:number, row:number[] })
{
    let rctx = useContext(ReactCtx);

    let obj0 = gamedat_object_ids.get(row[0]);
    let obj1 = gamedat_object_ids.get(row[1]);
    let obj2 = gamedat_object_ids.get(row[2]);
    let obj6 = gamedat_object_ids.get(row[6]);
    let prop3 = dirabbrevs[row[3]];
    
    return (
        <tr>
            <td>{ charnames[char].name }</td>
            <td>
                {
                    obj0 ?
                    <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:'+obj0.name) }>{ obj0.name }</a>
                    : '\u2014'
                }
            </td>
            <td>
                {
                    obj1 ?
                    <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:'+obj1.name) }>{ obj1.name }</a>
                    : '\u2014'
                }
            </td>
            <td>
                {
                    obj2 ?
                    <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:'+obj2.name) }>{ obj2.name }</a>
                    : '\u2014'
                }
            </td>
            <td>
                {
                    prop3 ? prop3 : row[3]
                }
            </td>
            <td>
                { (row[4] ?
                   <span className="TimerActive">&#x2611;</span> :
                   <span className="TimerInactive">&#x2610;</span>) }
            </td>
            <td>
                { (row[5] ?
                   <span className="TimerActive">&#x2611;</span> :
                   <span className="TimerInactive">&#x2610;</span>) }
            </td>
            <td>
                {
                    obj6 ?
                    <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:'+obj6.name) }>{ obj6.name }</a>
                    : '\u2014'
                }
            </td>
        </tr>
    )
}

function AttentionTable()
{
    let rctx = useContext(ReactCtx);
    let zstate = rctx.zstate;

    let specifics = zstate.specifics as SpecificDeadline;
    
    let rowls = [];
    for (let char=0; char<6; char++) {
        rowls.push(
            <AttentionTableRow key={ char } char={ char } attn={ specifics.attntable[char] } span={ specifics.goaltables[char][8] } />
        );
    }
    
    return (
        <table className="GoalTable">
            <tbody>
                <tr>
                    <th>person</th>
                    <th>attn</th>
                    <th>span</th>
                </tr>
                { rowls }
            </tbody>
        </table>
    );
}

function AttentionTableRow({ char, attn, span }: { char:number, attn:number, span:number })
{
    attn = signed_zvalue(attn);
    if (attn < 0)
        attn = 0;
    
    return (
        <tr>
            <td>{ charnames[char].name }</td>
            <td>{ attn }</td>
            <td>{ span }</td>
        </tr>
    )
}

function MovementTable()
{
    let rctx = useContext(ReactCtx);
    let zstate = rctx.zstate;

    let specifics = zstate.specifics as SpecificDeadline;
    let movetimes = specifics.movetimes;
    let movegoals = specifics.movegoals;

    /* We must now do some fairly dreadful, which is to yank the character
       timers out of the timer table. This gives us the (true) time until
       that character's next move. */
    let timers:(number|null)[] = [ null, null, null, null, null, null, null, null ];

    let present = zstate.globals[49]; // PRESENT-TIME

    // Loop cloned from timers.tsx.
    let timerpos = zstate.globals[126]; // C-INTS
    while (timerpos+5 < zstate.timertable.length) {
        let pos = timerpos;
        let flag = zstate.timertable[pos] * 0x100 + zstate.timertable[pos+1];
        let count = zstate.timertable[pos+2] * 0x100 + zstate.timertable[pos+3];
        let addr = zstate.timertable[pos+4] * 0x100 + zstate.timertable[pos+5];
        if (flag) {
            switch (addr) {
            case 43813: // I-MONICA
                timers[4] = count;
                break;
            case 43157: // I-STILES
                timers[3] = count;
                break;
            case 42826: // I-PHONG
                timers[1] = count;
                break;
            }
        }
        timerpos += 6;
    }
    
    let rowls = [];
    for (let char=1; char<6; char += 3) {
        rowls.push(
            <tr key={ rowls.length } className="RowLabel" >
                <td />
                <td colSpan={ 4 } >{ charnames[char].name }</td>
            </tr>
        );
        let current = Math.floor((movegoals[char] - initialmovegoals[char].initial) / 6) - 1;
        let curnexttime: number|null = null;
        let timerschar = timers[char];
        if (timerschar !== null) {
            curnexttime = present + timerschar;
        }
        let sumtime = 480;
        for (let ix=0; ix<movementgoals[char].length; ix++) {
            let row = movementgoals[char][ix];
            sumtime += row[0];
            let nexttime: number|null = null;
            if (ix == current)
                nexttime = curnexttime;
            else if (ix > current)
                nexttime = sumtime;
            rowls.push(
                <MovementTableRow key={ rowls.length } char={ char } current={ ix==current } row={ row } time={ movetimes[char][ix] } nexttime={ nexttime } />
            );
        }
    }
    
    
    return (
        <table className="GoalTable">
            <tbody>
                <tr>
                    <th>when</th>
                    <th>time</th>
                    <th>var</th>
                    <th>leave for</th>
                    <th>comment</th>
                </tr>
                { rowls }
            </tbody>
        </table>
    );
}

function MovementTableRow({ char, row, current, time, nexttime }: { char:number, row:MovementRow, current:boolean, time:number, nexttime:number|null })
{
    return (
        <tr className={ current ? 'CurrentRow' : '' }>
            <td>
                {
                    (nexttime !== null) ?
                    <ArgShowTime value={ nexttime } />
                    : <span>&#x2014;</span>
                }
            </td>
            <td>{ time }</td>
            <td>&#xB1;{ row[1] }</td>
            <td>
                {
                    <a className="Src_Id" href="#" onClick={ (ev) => evhan_click_id(ev, 'OBJ:'+row[2]) }>{ row[2] }</a>
                }
            </td>
            <td><i>{ row[3] }</i></td>
        </tr>
    )
}

