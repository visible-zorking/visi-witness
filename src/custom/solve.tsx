import React from 'react';
import { useContext } from 'react';

import { ZilSourceLoc } from '../visi/main';
import { ReactCtx } from '../visi/context';
import { Commentary } from '../visi/widgets';

import { get_legal_state, LegalState } from './modgame';

export function SolvePage()
{
    let rctx = useContext(ReactCtx);
    let legal = get_legal_state(rctx.zstate);
    console.log('### legal', legal); //###

    return (
        <div className="ScrollContent">
            <div className="SolutionPage">
                <p>
                    This tab shows every possible outcome of arresting each
                    character (or combination of characters).
                </p>
                <p>
                    Beware <i>SPOILERS!</i> Even more spoilery than usual
                    for the Visible Zorker.
                </p>
                <p>
                    .<br/>.<br/>.<br/>.
                </p>
                <BeforeArrest legal={ legal } />
                <ArrestPhong legal={ legal } />
            </div>
        </div>
    );
}

function BeforeArrest({ legal }: { legal:LegalState })
{
    let outcome;
    if (legal.corpse_invisible) {
        outcome = 0;
    }
    else if (!legal.met_duffy) {
        outcome = 1;
    }
    else {
        outcome = 2;
    }
    
    return (
        <div>
            <h3 className="Arrest">(Pre-crime)</h3>
            <div className="Cond">
                You haven't seen Linder die:
            </div>
            <div className={ check(outcome, 0) }>
                You have no evidence of a crime yet.
            </div>
            
            <div className="Cond">
                You haven't met Sergeant Duffy yet tonight (<IdRef val="GLOB:MET-DUFFY?" />):
            </div>
            <div className={ check(outcome, 1) }>
                 You'll have to wait for him to help you make the arrest.
            </div>
        </div>
    );
}

function ArrestPhong({ legal }: { legal:LegalState })
{
    let outcome;
    if (legal.corpse_invisible || !legal.met_duffy) {
        outcome = -1;
    }
    else if (legal.mechanism_proved) {
        if (!legal.gun_receipt) 
            outcome = 0;
        else
            outcome = 1;
    }
    else {
        if (legal.side_footprints_matched)
            outcome = 2;
        else
            outcome = 3;
    }
    
    return (
        <div>
            <h3 className="Arrest">ARREST PHONG</h3>
            <div className="Cond">
                Mechanism discovered:
            </div>
            
            <div className="CondGroup">
                <div className="Cond">
                    <IdRef val="OBJ:GUN-RECEIPT" /> found:
                </div>
                <div className={ check(outcome, 1) }>
                    Not indicted; no mechanical skills.
                </div>
                <div className="Cond">
                    Otherwise:
                </div>
                <div className={ check(outcome, 0) }>
                    Not indicted; no link to murder weapon and no mechanical skills.
                </div>
            </div>
            
            <div className="Cond">
                Mechanism not discovered:
            </div>

            <div className="CondGroup">
                <div className="Cond">
                    Matched footprints in side yard (<IdRef val="GLOB:SIDE-FOOTPRINTS-MATCHED" />):
                </div>
                <div className={ check(outcome, 2) }>
                    Not indicted; footprints not incriminating.
                </div>
                <div className="Cond">
                    Otherwise:
                </div>
                <div className={ check(outcome, 3) }>
                    Not indicted; not at scene.
                </div>
            </div>
        </div>
    );
}

function check(outcome:number, val:number): string
{
    if (outcome == val)
        return "Outcome Current";
    else
        return "Outcome";
}

// This doesn't require a context, turns out.
function evhan_click_id(ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) {
    ev.preventDefault();
    let dat: ZilSourceLoc = { id: id, commentary: true };
    window.dispatchEvent(new CustomEvent('zil-source-location', { detail:dat }));
}

function IdRef({ val }: { val:string })
{
    let valname = val;
    let pos = val.indexOf(':');
    if (pos >= 0) {
        valname = val.slice(pos+1);
    }
    
    return (
        <a href="#" className="Src_Id" onClick={ (ev) => evhan_click_id(ev, val) }><code>{ valname }</code></a>
    )
}
